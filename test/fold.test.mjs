import test from 'node:test'
import assert from 'node:assert/strict'
import { applyGoalHistory, createGoalHistoryState, viewGoalHistory } from '../lib/fold.js'

/**
 * Build one durable goal/change event.
 * @param seq - session sequence.
 * @param data - recorded change payload.
 * @returns a session event-shaped fixture.
 */
function change(seq, data) {
  return { type: 'goal/change', seq, time: seq * 1000, data }
}

/**
 * Build one final assistant settlement with provider-reported usage.
 * @param seq - session sequence.
 * @param usage - recorded usage fields.
 * @returns an `assistant/message` fixture.
 */
function message(seq, usage) {
  return {
    type: 'assistant/message',
    seq,
    time: seq * 1000,
    data: { turn: 1, step: 1, usage },
  }
}

/**
 * Build one full-snapshot change payload.
 * @param operation - lifecycle verb.
 * @param overrides - fields replaced on the default snapshot.
 * @returns the recorded payload.
 */
function snapshot(operation, overrides = {}) {
  const base = {
    id: 'goal-1',
    revision: operation === 'create' ? 1 : 2,
    objective: 'Ship the thing',
    phase: 'active',
    maxGoalRounds: 3,
    ...overrides,
  }
  return {
    kind: 'goal/change',
    version: 1,
    operation,
    goal: base,
    roundsStarted: 0,
    createdAt: 1000,
    updatedAt: 2000,
  }
}

test('unrelated events keep the same state reference', () => {
  const state = createGoalHistoryState()
  assert.equal(applyGoalHistory(state, { type: 'user/message', seq: 1, time: 1, data: {} }), state)
  assert.equal(applyGoalHistory(state, change(2, { kind: 'goal/change', version: 2 })), state)
})

test('create and complete leave one goal with a revision trail', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, change(20, snapshot('complete', { phase: 'complete', revision: 2 })))
  assert.equal(state.goals.length, 1)
  assert.equal(state.goals[0].status, 'complete')
  assert.deepEqual(state.goals[0].changes.map(item => item.operation), ['create', 'complete'])
  assert.equal(state.goals[0].createdAt, 1000)
  assert.equal(state.goals[0].updatedAt, 2000)
})

test('a completed goal may be replaced by a new goal', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, change(20, snapshot('complete', { phase: 'complete', revision: 2 })))
  state = applyGoalHistory(state, change(30, snapshot('create', { id: 'goal-2', revision: 1 })))
  assert.deepEqual(state.goals.map(goal => goal.id), ['goal-1', 'goal-2'])
  assert.equal(state.goals[1].status, 'active')
})

test('clear keeps the last objective as a cleared record', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, change(20, {
    kind: 'goal/change',
    version: 1,
    operation: 'clear',
    cleared: { id: 'goal-1', revision: 2 },
    clearedAt: 2500,
  }))
  assert.equal(state.goals.length, 1)
  assert.equal(state.goals[0].status, 'cleared')
  assert.equal(state.goals[0].objective, 'Ship the thing')
  assert.equal(state.goals[0].clearedAt, 2500)
  assert.equal(state.goals[0].changes.at(-1).operation, 'clear')
})

test('resume drops a previous blocker reason', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, change(20, snapshot('block', {
    phase: 'blocked',
    blockedReason: { code: 'round-limit', message: 'rounds exhausted' },
  })))
  assert.equal(state.goals[0].blockedReason.message, 'rounds exhausted')
  state = applyGoalHistory(state, change(30, snapshot('resume', { phase: 'active', revision: 3 })))
  assert.equal(state.goals[0].blockedReason, undefined)
})

test('usage between create and complete belongs to the goal', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, message(11, { inputTokens: 100, outputTokens: 10, cacheReadTokens: 200, cacheWriteTokens: 0, totalTokens: 310 }))
  state = applyGoalHistory(state, message(12, { inputTokens: 50, outputTokens: 5, cacheReadTokens: 100, cacheWriteTokens: 0, totalTokens: 155 }))
  state = applyGoalHistory(state, change(13, snapshot('complete', { phase: 'complete', revision: 2 })))
  state = applyGoalHistory(state, message(14, { inputTokens: 999, outputTokens: 999, cacheReadTokens: 999, cacheWriteTokens: 0, totalTokens: 2997 }))
  assert.equal(state.goals[0].usage.totalTokens, 465)
  assert.equal(state.goals[0].usage.samples, 2)
  assert.equal(state.goals[0].usage.inputTokens, 150)
  assert.equal(state.goals[0].usage.outputTokens, 15)
  assert.equal(state.goals[0].usage.cacheReadTokens, 300)
})

test('usage before a create and after a clear is ignored', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, message(5, { inputTokens: 10, outputTokens: 1, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 11 }))
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, message(11, { inputTokens: 10, outputTokens: 1, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 11 }))
  state = applyGoalHistory(state, change(12, {
    kind: 'goal/change',
    version: 1,
    operation: 'clear',
    cleared: { id: 'goal-1', revision: 2 },
    clearedAt: 2000,
  }))
  state = applyGoalHistory(state, message(13, { inputTokens: 100, outputTokens: 10, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 110 }))
  assert.equal(state.goals[0].usage.totalTokens, 11)
  assert.equal(state.goals[0].usage.samples, 1)
})

test('usage without a reported total falls back to the four buckets', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, message(11, { inputTokens: 10, outputTokens: 5, cacheReadTokens: 2, cacheWriteTokens: 1 }))
  assert.equal(state.goals[0].usage.totalTokens, 18)
})

test('an active goal keeps accumulating usage across turns', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, message(11, { inputTokens: 1, outputTokens: 1, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 2 }))
  state = applyGoalHistory(state, change(15, snapshot('pause', { phase: 'paused', revision: 2 })))
  state = applyGoalHistory(state, message(16, { inputTokens: 2, outputTokens: 2, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 4 }))
  assert.equal(state.goals[0].usage.totalTokens, 6)
  assert.equal(state.goals[0].usage.samples, 2)
})

test('the state survives a lossless JSON round trip', () => {
  let state = createGoalHistoryState()
  assert.deepEqual(JSON.parse(JSON.stringify(state)), state)
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, message(11, { inputTokens: 1, outputTokens: 1, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 2 }))
  state = applyGoalHistory(state, change(12, snapshot('complete', { phase: 'complete', revision: 2 })))
  assert.deepEqual(JSON.parse(JSON.stringify(state)), state)
})

test('the client view exposes usage and stays reference-stable per state', () => {
  let state = createGoalHistoryState()
  state = applyGoalHistory(state, change(10, snapshot('create')))
  state = applyGoalHistory(state, message(11, { inputTokens: 1, outputTokens: 1, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 2 }))
  assert.equal(viewGoalHistory(state).goals[0].usage.totalTokens, 2)
  assert.equal(viewGoalHistory(state), viewGoalHistory(state))
  const next = applyGoalHistory(state, message(12, { inputTokens: 1, outputTokens: 1, cacheReadTokens: 0, cacheWriteTokens: 0, totalTokens: 2 }))
  assert.notEqual(viewGoalHistory(next), viewGoalHistory(state))
})
