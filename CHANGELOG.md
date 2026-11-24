# Changelog

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
