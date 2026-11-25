/** Pure fold from durable session events to one goal-history value. */

/** Projection key carrying the history to the browser. */
export const GOAL_HISTORY_KEY = 'goalHistory'

const SNAPSHOT_OPERATIONS = new Set(['create', 'edit', 'pause', 'resume', 'complete', 'block'])
const PHASES = new Set(['active', 'paused', 'blocked', 'complete'])

/**
 * Read a positive event-time fallback without inventing a timestamp.
 * @param value - recorded number.
 * @param fallback - event time used when the field is absent.
 * @returns the recorded number or the fallback.
 */
function numberOr(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/**
 * Whether a recorded phase is one of the four durable lifecycle phases.
 * @param value - recorded phase.
 * @returns true for a known phase.
 */
function isPhase(value) {
  return typeof value === 'string' && PHASES.has(value)
}

/**
 * Count one non-negative token quantity.
 * @param value - provider-reported field.
 * @returns the count, or zero for a missing or invalid value.
 */
function tokenCount(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.round(value) : 0
}

/**
 * Empty token accounting for one newly created goal.
 * @returns zero buckets and no samples.
 */
function zeroUsage() {
  return {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    totalTokens: 0,
    samples: 0,
  }
}

/**
 * Read the usage one durable assistant settlement reports.
 * @param event - committed session event.
 * @returns one usage sample, or undefined when the event carries none.
 */
function usageFrom(event) {
  const usage = event.data === null || typeof event.data !== 'object' ? undefined : event.data.usage
  if (usage === null || typeof usage !== 'object') return undefined
  const inputTokens = tokenCount(usage.inputTokens)
  const outputTokens = tokenCount(usage.outputTokens)
  const cacheReadTokens = tokenCount(usage.cacheReadTokens)
  const cacheWriteTokens = tokenCount(usage.cacheWriteTokens)
  const totalTokens = typeof usage.totalTokens === 'number' && Number.isFinite(usage.totalTokens) && usage.totalTokens >= 0
    ? Math.round(usage.totalTokens)
    : inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens
  return { inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens, totalTokens }
}

/**
 * Add one sample to a goal's running token accounting.
 * @param current - current accounting, possibly absent on an old entry.
 * @param sample - one assistant settlement's usage.
 * @returns the next accounting.
 */
function addUsage(current, sample) {
  const base = current === null || typeof current !== 'object' ? zeroUsage() : current
  return {
    inputTokens: (base.inputTokens || 0) + sample.inputTokens,
    outputTokens: (base.outputTokens || 0) + sample.outputTokens,
    cacheReadTokens: (base.cacheReadTokens || 0) + sample.cacheReadTokens,
    cacheWriteTokens: (base.cacheWriteTokens || 0) + sample.cacheWriteTokens,
    totalTokens: (base.totalTokens || 0) + sample.totalTokens,
    samples: (base.samples || 0) + 1,
  }
}

/**
 * Attribute one assistant settlement's usage to the goal that was current when it settled.
 * @param state - current history state.
 * @param event - committed `assistant/message` event.
 * @returns the next state, or the same state when no goal is current.
 */
function applyUsage(state, event) {
  const sample = usageFrom(event)
  if (sample === undefined || state.activeGoalId === null || state.activeGoalId === undefined) return state
  const index = state.goals.findIndex(goal => goal.id === state.activeGoalId)
  if (index < 0) return state
  const goals = state.goals.slice()
  goals[index] = { ...goals[index], usage: addUsage(goals[index].usage, sample) }
  return { ...state, goals }
}

/**
 * Advance the current goal on the next admitted continuation message.
 * @param state - current history state.
 * @param source - attribution on a committed user message.
 * @returns the next state, or the same state for an unrelated or stale message.
 */
function applyRound(state, source) {
  if (source?.kind !== 'goal' || source.goalId !== state.activeGoalId) return state
  const index = state.goals.findIndex(goal => goal.id === source.goalId)
  if (index < 0) return state
  const goal = state.goals[index]
  if (goal.status !== 'active' || !Number.isSafeInteger(source.revision) || source.revision < 1
    || source.revision !== goal.revision || !Number.isSafeInteger(source.round) || source.round < 1
    || source.round !== goal.roundsStarted + 1 || source.round > goal.maxGoalRounds) return state
  const goals = state.goals.slice()
  goals[index] = { ...goal, roundsStarted: source.round }
  return { ...state, goals }
}

/**
 * Initial empty history for a session without goal changes.
 * @returns a fresh state.
 */
export function createGoalHistoryState() {
  return { goals: [], activeGoalId: null }
}

/**
 * Apply one committed session event, returning the same state for unrelated input.
 * @param state - current history state.
 * @param event - committed session event.
 * @returns the next state, or the same state when the event is unrelated or malformed.
 */
export function applyGoalHistory(state, event) {
  if (!event) return state
  if (event.type === 'assistant/message') return applyUsage(state, event)
  if (event.type === 'user/message') return applyRound(state, event.data?.source)
  if (event.type !== 'goal/change') return state
  const data = event.data
  if (!data || data.kind !== 'goal/change' || data.version !== 1) return state
  const operation = data.operation
  const seq = event.seq
  const time = event.time

  if (operation === 'clear') {
    const cleared = data.cleared
    if (!cleared || typeof cleared.id !== 'string') return state
    const index = state.goals.findIndex(goal => goal.id === cleared.id)
    if (index < 0) return state
    const goal = state.goals[index]
    const clearedAt = numberOr(data.clearedAt, time)
    const changes = [...goal.changes, {
      seq,
      time,
      operation: 'clear',
      objective: goal.objective,
      phase: goal.status,
      roundsStarted: goal.roundsStarted,
      maxGoalRounds: goal.maxGoalRounds,
    }]
    const goals = state.goals.slice()
    goals[index] = { ...goal, status: 'cleared', updatedAt: clearedAt, clearedAt, changes }
    return { goals, activeGoalId: null }
  }

  if (!SNAPSHOT_OPERATIONS.has(operation)) return state
  const snapshot = data.goal
  if (!snapshot || typeof snapshot.id !== 'string' || typeof snapshot.objective !== 'string'
    || !isPhase(snapshot.phase)) return state

  const record = {
    seq,
    time,
    operation,
    objective: snapshot.objective,
    phase: snapshot.phase,
    roundsStarted: numberOr(data.roundsStarted, 0),
    maxGoalRounds: numberOr(snapshot.maxGoalRounds, 0),
  }
  if (snapshot.blockedReason && typeof snapshot.blockedReason.message === 'string') {
    record.blockedReason = {
      code: typeof snapshot.blockedReason.code === 'string' ? snapshot.blockedReason.code : '',
      message: snapshot.blockedReason.message,
    }
  }

  const index = state.goals.findIndex(goal => goal.id === snapshot.id)
  const createdAt = index < 0 ? numberOr(data.createdAt, time) : state.goals[index].createdAt
  const base = {
    id: snapshot.id,
    revision: numberOr(snapshot.revision, null),
    objective: snapshot.objective,
    status: snapshot.phase,
    roundsStarted: record.roundsStarted,
    maxGoalRounds: record.maxGoalRounds,
    createdAt,
    updatedAt: numberOr(data.updatedAt, time),
  }
  if (record.blockedReason !== undefined) base.blockedReason = record.blockedReason
  const next = index < 0
    ? { ...base, usage: zeroUsage(), changes: [record] }
    : { ...state.goals[index], ...base, changes: [...state.goals[index].changes, record] }
  if (record.blockedReason === undefined && 'blockedReason' in next) delete next.blockedReason
  const activeGoalId = operation === 'complete' || snapshot.phase === 'complete' ? null : snapshot.id
  if (index < 0) return { goals: [...state.goals, next], activeGoalId }
  const goals = state.goals.slice()
  goals[index] = next
  return { goals, activeGoalId }
}

const views = new WeakMap()

/**
 * Reference-stable client view of one history state.
 * @param state - current history state.
 * @returns the view value, reused while the state object is unchanged.
 */
export function viewGoalHistory(state) {
  let view = views.get(state)
  if (view === undefined) {
    view = { goals: state.goals }
    views.set(state, view)
  }
  return view
}


