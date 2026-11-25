/**
 * Host half: one session projection carrying every goal of the conversation.
 * @module @ryuu-64/dsh-goal-history
 */
import {
  applyGoalHistory,
  createGoalHistoryState,
  GOAL_HISTORY_KEY,
  viewGoalHistory,
} from './fold.js'

/** Minimal parser accepted by the projection registry's `parse` calls. */
function parseState(value) {
  if (value === null || typeof value !== 'object' || !Array.isArray(value.goals)) {
    throw new TypeError('goal history state must carry a goals array')
  }
  return value
}

/** Validate the wire value the same way as the retained state. */
function parseView(value) {
  if (value === null || typeof value !== 'object' || !Array.isArray(value.goals)) {
    throw new TypeError('goal history view must carry a goals array')
  }
  return value
}

/** The projection registry is the only required service. */
export const inject = ['sessionProjections']

/** Stable Loader identity. */
export const name = 'dsh-goal-history'

/**
 * Register the goal-history projection for this Host generation.
 * @param ctx - Host context carrying the session projection registry.
 * @returns nothing; the owning fiber releases the registration.
 */
export async function apply(ctx) {
  await ctx.sessionProjections.register({
    key: GOAL_HISTORY_KEY,
    stateSchema: { parse: parseState },
    stateVersion: 3,
    init: () => createGoalHistoryState(),
    apply: applyGoalHistory,
    wire: {
      viewSchema: { parse: parseView },
      view: viewGoalHistory,
      summary: false,
    },
  })
}
