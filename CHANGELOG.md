# Changelog

## 0.1.5

- Remove the README screenshot and restrict packaged documentation to the two Markdown files.

## 0.1.4

- Match the current goal's status to DSH's native goal bar after reopening a conversation, resuming, or pausing. Show an unconfirmed status while live continuation state is unavailable.
- Make round counts and timestamps easier to read with DSH's secondary text color and a default size of 12 px that follows the host's font setting.

## 0.1.3

- Update execution rounds as DSH admits them and preserve the last count when a goal is cleared. Existing sessions rebuild the count from their saved events after restarting DSH with the update.
- Show expandable explanations for token usage during a goal on the completion card and Goals page.
- Show the previous and revised objective, changes to the round cap, and each recorded blocker reason in the goal timeline.

## 0.1.2

- Use DSH's own wording for rounds and token usage: 执行轮次 / Rounds, Goal
  Round, Round 上限, 自动续行, and 用量.
- Remove the per-change round snapshot from the goal change list; a goal row
  shows one execution-rounds value, as the goal detail card does.
- Explain rounds started versus the round cap in the README and compatibility
  notes, including the zero-round completed case.

## 0.1.1

- Show a goal's token usage on the completion card and on each Goals page row.
  Usage is the sum of final assistant-settlement usage recorded while the goal
  was current, from its create event to its complete or clear event.
- Show a total across the goals of one conversation in the Goals page summary.
- Align distribution metadata with the other Ryuu-64 DSH plugins: repository,
  npm publishing fields, peer ranges, license, notice, Chinese README, and
  compatibility notes.

## 0.1.0

- Initial release: completion card under the completing turn, Goals page in the
  right sidebar, and goal entry in the session header.
