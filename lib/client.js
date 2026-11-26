// Browser half of @ryuu-64/dsh-goal-history. Hand-authored lazy-CJS bundle:
// the module loader only registers this factory; nothing runs until first use.
window.__ModuleLoader__.load({
  id: '@ryuu-64/dsh-goal-history',
  factory: (require) => {
    const React = require('react')
    const { createElement: h, useEffect, useRef, useState } = React

    const NS = 'goalHistory'
    const HISTORY_KEY = 'goalHistory'
    const TAB_ID = '@ryuu-64/dsh-goal-history/tab'
    const TAB_KIND = 'goalHistory'
    const ACTIVE_STATUS = { armed: 'active', disarmed: 'inactive' }

    const zh = {
      'time.locale': 'zh-CN',
      'tab.title': '目标',
      'tab.loading': '正在读取目标…',
      'tab.empty': '这个对话还没有目标。',
      'tab.summary.one': '共 {total} 个目标',
      'tab.summary.other': '共 {total} 个目标',
      'section.current': '当前目标',
      'section.past': '历史目标',
      'status.active': '进行中',
      'status.inactive': '待继续',
      'status.unknown': '状态未确认',
      'status.paused': '已暂停',
      'status.blocked': '受阻',
      'status.complete': '已完成',
      'status.cleared': '已清除',
      'card.completed': '目标已完成',
      'card.completedWithUsage': '目标已完成 · {tokens} tok',
      'rounds.used': '执行轮次 {rounds}/{max}',
      'rounds.title': '执行轮次：已开始的 Goal Round 数 / Round 上限。Goal Round 由自动续行准入；已完成不代表用满上限。',
      'usage.total': '目标期间用量 {tokens} tok',
      'usage.breakdown': '未缓存输入 {input} tok · 输出 {output} tok · 缓存读取 {cacheRead} tok · 缓存写入 {cacheWrite} tok',
      'usage.scope': '统计目标创建后、完成或清除前的助手回复用量，暂停或受阻期间的其他回复也会计入。完成后的收尾回复、单独记录的失败尝试和没有用量记录的回复不计入。',
      'tab.usageTotal': '各目标期间用量合计 {tokens} tok',
      'action.view': '查看目标',
      'header.label': '查看目标（{count}）',
      'row.created': '{time} 创建',
      'row.updated': '{time} 更新',
      'row.completed': '{time} 完成',
      'row.cleared': '{time} 清除',
      'row.toggle': '展开目标变更',
      'op.create': '创建',
      'op.edit': '编辑',
      'op.pause': '暂停',
      'op.resume': '恢复',
      'op.complete': '完成',
      'op.block': '受阻',
      'op.clear': '清除',
      'edit.before': '修改前',
      'edit.after': '修改后',
      'edit.roundCap': '轮次上限从 {before} 改为 {after}',
      'reason': '受阻原因：{message}',
    }

    const en = {
      'time.locale': 'en',
      'tab.title': 'Goals',
      'tab.loading': 'Loading goals…',
      'tab.empty': 'No goals in this conversation yet.',
      'tab.summary.one': '1 goal',
      'tab.summary.other': '{total} goals',
      'section.current': 'Current goal',
      'section.past': 'Past goals',
      'status.active': 'Ongoing',
      'status.inactive': 'Inactive',
      'status.unknown': 'Status unconfirmed',
      'status.paused': 'Paused',
      'status.blocked': 'Blocked',
      'status.complete': 'Completed',
      'status.cleared': 'Cleared',
      'card.completed': 'Goal completed',
      'card.completedWithUsage': 'Goal completed · {tokens} tok',
      'rounds.used': 'Rounds {rounds}/{max}',
      'rounds.title': 'Rounds: Goal Rounds started / round cap. Goal Rounds are admitted by automatic continuation; a completed goal need not use the cap.',
      'usage.total': 'Usage during goal {tokens} tok',
      'usage.breakdown': 'Uncached input {input} tok · Output {output} tok · Cached input {cacheRead} tok · Cache write {cacheWrite} tok',
      'usage.scope': 'Counts recorded usage from assistant replies after the goal is created and before it is completed or cleared. Other replies during pauses or blockers also count. Closing replies after completion, separately recorded failed attempts, and replies without usage records are excluded.',
      'tab.usageTotal': 'Total usage across goal periods {tokens} tok',
      'action.view': 'View goal',
      'header.label': 'Goals ({count})',
      'row.created': 'created {time}',
      'row.updated': 'updated {time}',
      'row.completed': 'completed {time}',
      'row.cleared': 'cleared {time}',
      'row.toggle': 'Expand goal changes',
      'op.create': 'Created',
      'op.edit': 'Edited',
      'op.pause': 'Paused',
      'op.resume': 'Resumed',
      'op.complete': 'Completed',
      'op.block': 'Blocked',
      'op.clear': 'Cleared',
      'edit.before': 'Before',
      'edit.after': 'After',
      'edit.roundCap': 'Round cap changed from {before} to {after}',
      'reason': 'Blocker: {message}',
    }

    const CSS = `
.dgh-hbtn{position:relative;display:inline-flex;flex:none;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:28px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dgh-hbtn:focus-visible{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:1px}
@media(hover:hover){.dgh-hbtn:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}}
.dgh-hbtn svg{flex:none}
.dgh-hcount{position:absolute;top:0;right:-1px;box-sizing:border-box;min-width:13px;height:13px;padding:0 3px;border-radius:7px;background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-bg-base);font-size:9px;font-weight:500;line-height:13px;text-align:center}
.dgh-cards{display:flex;flex-direction:column;gap:10px;margin:12px 0 14px}
.dgh-card{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;width:100%;padding:6px 12px;border:0.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-card-fill);color:var(--dsw-alias-label-primary)}
.dgh-card-summary{display:flex;align-items:center;gap:6px;min-width:0;font-size:13px;font-weight:500;line-height:20px}
.dgh-card-summary svg{flex:none;color:var(--dsw-alias-state-success-primary)}
.dgh-obj{margin:0;color:var(--dsw-alias-label-primary-dimmed);font-size:13px;line-height:20px;white-space:pre-wrap;overflow-wrap:anywhere}
.dgh-clamp-4{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}
.dgh-rounds,.dgh-meta,.dgh-change-time{color:var(--dsw-alias-label-secondary);font-size:calc(var(--dsh-content-font-size-secondary,13px) - 1px);line-height:calc(18px + var(--dsh-content-font-delta,0px))}
.dgh-view{flex:none;min-height:24px;margin-inline-start:auto;padding:0;border:0;background:none;color:var(--dsw-alias-state-business-primary);font:inherit;font-size:12px;font-weight:500;line-height:18px;cursor:pointer}
.dgh-view:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
@media(hover:hover){.dgh-view:hover{color:var(--dsw-alias-label-primary)}}
.dgh-row-head:hover .dgh-chev{color:var(--dsw-alias-label-secondary)}
.dgh-tab{box-sizing:border-box;height:100%;overflow:auto;padding:14px 14px 32px}
.dgh-summary{display:grid;gap:4px;margin:0 0 12px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
.dgh-section{display:flex;flex-direction:column;gap:8px;margin:0 0 16px}
.dgh-section-title{margin:0;color:var(--dsw-alias-label-tertiary);font-size:11px;font-weight:500;line-height:16px}
.dgh-row{box-sizing:border-box;display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-card-fill);color:var(--dsw-alias-label-primary)}
.dgh-row[data-focus]{border-color:var(--dsw-alias-state-business-primary)}
.dgh-row-head{display:flex;align-items:center;gap:8px;width:100%;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dgh-row-head:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.dgh-status{display:inline-flex;flex:none;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.dgh-dot{display:inline-block;flex:none;width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-tertiary)}
.dgh-status-active .dgh-dot{background:var(--dsw-alias-state-business-primary)}
.dgh-status-paused .dgh-dot{background:var(--dsw-alias-label-tertiary)}
.dgh-status-blocked .dgh-dot{background:var(--dsw-alias-state-warn-primary,var(--dsw-alias-state-warn-label))}
.dgh-status-complete .dgh-dot{background:var(--dsw-alias-state-success-primary)}
.dgh-status-cleared .dgh-dot{background:var(--dsw-alias-border-l3)}
.dgh-rounds{flex:none;margin-left:auto}
.dgh-chev{flex:none;width:12px;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:16px;text-align:center}
.dgh-meta{margin:0}
.dgh-usage{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.dgh-usage summary,.dgh-change summary{cursor:pointer}
.dgh-usage summary:focus-visible,.dgh-change summary:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.dgh-usage p{margin:4px 0 0;overflow-wrap:anywhere}
.dgh-detail{margin-top:2px;padding-top:8px;border-top:0.5px solid var(--dsw-alias-border-l1)}
.dgh-changes{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.dgh-change{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.dgh-change-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0 8px}
summary.dgh-change-head{display:list-item}
summary.dgh-change-head time{float:right;margin-left:8px}
.dgh-change-time{overflow-wrap:anywhere;text-align:end}
.dgh-edit-values{display:grid;gap:2px;margin:6px 0 0}
.dgh-edit-values dd{margin:0 0 4px}
.dgh-edit-cap,.dgh-reason{margin:6px 0 0}
.dgh-reason{color:var(--dsw-alias-state-warn-label,var(--dsw-alias-label-secondary));white-space:pre-wrap;overflow-wrap:anywhere}
.dgh-empty{margin:0;padding:24px 0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;text-align:center}
`

    /**
     * Product goal glyph copied from the shared artwork so the card matches GoalBar.
     * @param props.size - rendered square size in pixels.
     * @returns the outline goal icon.
     */
    function GoalGlyph({ size = 16 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1,
        'aria-hidden': 'true',
      },
      h('path', { d: 'M14.5001 8C14.5 9.28552 14.1188 10.5422 13.4045 11.611C12.6903 12.6799 11.6752 13.5129 10.4875 14.0049C9.29982 14.4968 7.99295 14.6255 6.73212 14.3747C5.4713 14.124 4.31314 13.505 3.4041 12.596C2.49514 11.687 1.87614 10.5288 1.62537 9.26798C1.37459 8.00716 1.50331 6.70028 1.99525 5.51261C2.48719 4.32494 3.32025 3.30981 4.3891 2.59557C5.45795 1.88134 6.71458 1.50008 8.0001 1.5' }),
      h('path', { d: 'M11.5 8C11.5001 8.69227 11.2948 9.36901 10.9102 9.94463C10.5257 10.5202 9.97901 10.9689 9.33944 11.2338C8.69986 11.4987 7.99609 11.5681 7.31712 11.433C6.63816 11.2979 6.01449 10.9645 5.52501 10.475C5.03548 9.98552 4.70209 9.36185 4.56702 8.68289C4.43195 8.00392 4.50127 7.30015 4.76619 6.66057C5.03112 6.021 5.47976 5.47436 6.05538 5.08978C6.631 4.70519 7.30774 4.49995 8.00001 4.5' }),
      h('path', { d: 'M8.00024 7.99976L11.2 4.80005' }),
      h('path', { d: 'M12.4719 5.62245C12.4246 5.66972 12.3569 5.69025 12.2913 5.67715L10.7814 5.37555C10.7022 5.35972 10.6402 5.29781 10.6244 5.2186L10.3228 3.70866C10.3097 3.6431 10.3302 3.57533 10.3775 3.52806L12.1826 1.723C12.2863 1.61929 12.4627 1.65879 12.5122 1.79684L12.9271 2.95225C12.9472 3.00847 12.9915 3.05272 13.0477 3.07291L14.2031 3.48774C14.3412 3.5373 14.3807 3.71368 14.277 3.81739L12.4719 5.62245Z' }))
    }

    /**
     * Localized short date and time for one recorded millisecond timestamp.
     * @param ms - recorded timestamp.
     * @param locale - active UI language tag.
     * @returns display text, or an empty string for a missing value.
     */
    function formatTime(ms, locale) {
      if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return ''
      try {
        return new Intl.DateTimeFormat(locale, {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(ms))
      } catch {
        return ''
      }
    }

    /**
     * Localized clock time for the second timestamp of one day.
     * @param ms - recorded timestamp.
     * @param locale - active UI language tag.
     * @returns clock text, or an empty string for a missing value.
     */
    function formatClock(ms, locale) {
      if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return ''
      try {
        return new Intl.DateTimeFormat(locale, {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(ms))
      } catch {
        return ''
      }
    }

    /**
     * Whether two timestamps fall on the same local calendar day.
     * @param left - first timestamp.
     * @param right - second timestamp.
     * @returns true when both exist on one day.
     */
    function sameDay(left, right) {
      if (typeof left !== 'number' || typeof right !== 'number') return false
      if (!Number.isFinite(left) || !Number.isFinite(right)) return false
      const first = new Date(left)
      const second = new Date(right)
      return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate()
    }

    /**
     * Compact token count matching the chat footer: 517 / 12.2K / 517K / 1.2M.
     * @param value - non-negative token count.
     * @returns compact display text.
     */
    function formatTokens(value) {
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return '0'
      const scaled = candidate => candidate >= 100
        ? String(Math.round(candidate))
        : String(Math.round(candidate * 10) / 10)
      if (value < 1000) return String(Math.round(value))
      if (value < 1_000_000) return scaled(value / 1_000) + 'K'
      return scaled(value / 1_000_000) + 'M'
    }

    /**
     * Total tokens a goal accumulated while it was current.
     * @param goal - recorded goal entry.
     * @returns total tokens, or zero when the entry carries no usage.
     */
    function goalTokens(goal) {
      const usage = goal !== null && typeof goal === 'object' ? goal.usage : undefined
      return usage !== null && typeof usage === 'object' && typeof usage.totalTokens === 'number'
        ? usage.totalTokens
        : 0
    }

    function UsageDetails({ tokens, usage, label = 'usage.total', t }) {
      return h('details', { className: 'dgh-usage' },
        h('summary', null, t(label, { tokens: formatTokens(tokens) })),
        h('p', null, t('usage.scope')),
        usage !== undefined
          ? h('p', null, t('usage.breakdown', {
            input: formatTokens(usage.inputTokens),
            output: formatTokens(usage.outputTokens),
            cacheRead: formatTokens(usage.cacheReadTokens),
            cacheWrite: formatTokens(usage.cacheWriteTokens),
          }))
          : null)
    }

    /**
     * Goals carried by one projected history value.
     * @param history - projection value.
     * @returns the goals array, or an empty array before the first value.
     */
    function goalsOf(history) {
      return history !== null && typeof history === 'object' && Array.isArray(history.goals) ? history.goals : []
    }

    /**
     * Whether one objective needs an explicit expand control.
     * @param text - recorded objective.
     * @returns true when clamping would hide meaningful text.
     */
    function isLong(text) {
      return typeof text === 'string' && (text.length > 120 || text.includes('\n'))
    }

    /**
     * Ask the Session controller for one fresh projection read when a surface mounts.
     * A plugin enabled while a Session is already open can otherwise keep the
     * projection values from before its Host unit was (re)registered.
     * @param refresh - reads the Host's current projection values again.
     */
    function useProjectionRefresh(refresh) {
      const requested = useRef(false)
      useEffect(() => {
        if (requested.current) return
        requested.current = true
        refresh()
      }, [refresh])
    }

    /** Follow the native goal strip's live state for the current active revision. */
    function useGoalActivation(goal, running, source) {
      const [snapshot, setSnapshot] = useState()
      const id = goal?.phase === 'active' ? goal.id : undefined
      const revision = goal?.revision
      useEffect(() => {
        if (id === undefined) return
        let request = 0
        const publish = (value) => { setSnapshot({ source, goal: value }) }
        const refresh = () => {
          const started = ++request
          void source.read().then(result => {
            if (started === request && result?.ok) publish(result.value)
          }, () => {})
        }
        const offActivation = source.subscribe(value => {
          request++
          publish(value)
        })
        const offReset = source.onReset(() => {
          setSnapshot(undefined)
          refresh()
        })
        refresh()
        return () => {
          request++
          offActivation()
          offReset()
        }
      }, [source, id, revision, running])
      const live = snapshot?.source === source ? snapshot.goal : undefined
      return id !== undefined && live?.id === id && live.revision === revision ? live : undefined
    }

    /**
     * Completed-goal facts for one closing Turn.
     * @param history - projected history value.
     * @param turn - closing Turn location.
     * @param seq - closing sequence fallback.
     * @returns completion changes inside the Turn, in log order.
     */
    function completedChanges(history, turn, seq) {
      const start = turn !== null && typeof turn === 'object' && turn.start !== undefined && turn.start !== null
        ? turn.start.seq
        : undefined
      if (typeof start !== 'number') return []
      const end = turn !== null && typeof turn === 'object' && turn.end !== undefined && turn.end !== null
        ? turn.end.seq
        : seq
      if (typeof end !== 'number') return []
      const found = []
      for (const goal of goalsOf(history)) {
        for (const change of goal.changes) {
          if (change.operation === 'complete' && change.seq > start && change.seq <= end) {
            found.push({ goal, change })
          }
        }
      }
      found.sort((left, right) => left.change.seq - right.change.seq)
      return found
    }

    /**
     * One completed-goal card shown beneath the closing Turn prose.
     * @param props.goal - goal carrying the completion.
     * @param props.openHistory - opens the history page focused on one goal.
     * @param props.t - active locale.
     * @returns the card.
     */
    function GoalCard({ goal, openHistory, t }) {
      const summary = goal.usage?.samples > 0
        ? t('card.completedWithUsage', { tokens: formatTokens(goalTokens(goal)) })
        : t('card.completed')
      return h('article', { className: 'dgh-card', 'data-goal-history-card': goal.id },
        h('span', { className: 'dgh-card-summary' }, h(GoalGlyph), h('span', null, summary)),
        h('button', {
          type: 'button',
          className: 'dgh-view',
          onClick: () => { openHistory(goal.id) },
        }, t('action.view'), h('span', { 'aria-hidden': 'true' }, ' ›'))
      )
    }

    /**
     * Turn-tail entry rendering every goal completed in this Turn.
     * @param props.turn - closing Turn.
     * @param props.seq - closing sequence.
     * @param props.useProjection - session projection reader.
     * @param props.openHistory - history navigation.
     * @param props.refresh - reads the Host projections again when this key is absent.
     * @param props.t - active locale.
     * @returns the cards, or null when this Turn completed no goal.
     */
    function GoalCompletedCard({ turn, seq, useProjection, openHistory, refresh, t }) {
      const history = useProjection(HISTORY_KEY)
      useProjectionRefresh(refresh)
      const found = completedChanges(history, turn, seq)
      if (found.length === 0) return null
      return h('div', { className: 'dgh-cards', 'data-goal-history-cards': '' },
        found.map(({ goal, change }) => h(GoalCard, {
          key: goal.id + ':' + change.seq,
          goal,
          openHistory,
          t,
        })))
    }

    /**
     * Session-header entry showing how many goals this conversation records.
     * @param props.useProjection - session projection reader.
     * @param props.openHistory - history navigation.
     * @param props.refresh - reads the Host projections again when this key is absent.
     * @param props.t - active locale.
     * @returns the icon button, or null when the session records no goal.
     */
    function GoalHistoryHeader({ useProjection, openHistory, refresh, t }) {
      const history = useProjection(HISTORY_KEY)
      useProjectionRefresh(refresh)
      const goals = goalsOf(history)
      if (goals.length === 0) return null
      const label = t('header.label', { count: goals.length })
      return h('button', {
        type: 'button',
        className: 'dgh-hbtn',
        'data-goal-history-entry': '',
        'aria-label': label,
        title: label,
        onClick: () => { openHistory() },
      },
      h(GoalGlyph, { size: 16 }),
      h('span', { className: 'dgh-hcount', 'aria-hidden': 'true' }, goals.length > 99 ? '99+' : String(goals.length)))
    }

    function GoalChange({ change, previous, t }) {
      const label = h('span', null, t('op.' + change.operation))
      const time = h('time', { className: 'dgh-change-time' }, formatTime(change.time, t('time.locale')))
      const edited = change.operation === 'edit'
      const objectiveChanged = edited && change.objective !== previous?.objective
      const capChanged = edited && previous !== undefined && change.maxGoalRounds !== previous.maxGoalRounds
      const blocker = change.operation === 'block' ? change.blockedReason?.message : undefined
      if (!objectiveChanged && !capChanged && blocker === undefined) {
        return h('li', { className: 'dgh-change' }, h('div', { className: 'dgh-change-head' }, label, time))
      }
      return h('li', { className: 'dgh-change' },
        h('details', null,
          h('summary', { className: 'dgh-change-head' }, label, time),
          objectiveChanged
            ? h('dl', { className: 'dgh-edit-values' },
              previous === undefined ? null : h('dt', null, t('edit.before')),
              previous === undefined ? null : h('dd', { className: 'dgh-obj' }, previous.objective),
              h('dt', null, t('edit.after')),
              h('dd', { className: 'dgh-obj' }, change.objective))
            : null,
          capChanged
            ? h('p', { className: 'dgh-edit-cap' }, t('edit.roundCap', { before: previous.maxGoalRounds, after: change.maxGoalRounds }))
            : null,
          blocker === undefined ? null : h('p', { className: 'dgh-reason' }, t('reason', { message: blocker }))))
    }

    /**
     * One goal row of the history page.
     * @param props.goal - recorded goal.
     * @param props.activation - live continuation state of the current revision.
     * @param props.focus - whether the opener addressed this goal.
     * @param props.t - active locale.
     * @returns the row.
     */
    function GoalRow({ goal, activation, focus, t }) {
      const [open, setOpen] = useState(focus === true)
      const ref = useRef(null)
      useEffect(() => {
        if (focus !== true) return
        setOpen(true)
        if (ref.current !== null && typeof ref.current.scrollIntoView === 'function') {
          ref.current.scrollIntoView({ block: 'nearest' })
        }
      }, [focus])
      const long = isLong(goal.objective)
      const status = typeof goal.status === 'string' ? goal.status : 'active'
      const label = status === 'active' ? ACTIVE_STATUS[activation] ?? 'unknown' : status
      const changedAt = status === 'cleared'
        ? (goal.clearedAt !== undefined ? goal.clearedAt : goal.updatedAt)
        : goal.updatedAt
      const locale = t('time.locale')
      const changedTime = sameDay(goal.createdAt, changedAt) ? formatClock(changedAt, locale) : formatTime(changedAt, locale)
      const meta = [t('row.created', { time: formatTime(goal.createdAt, locale) })]
      if (status === 'complete') meta.push(t('row.completed', { time: changedTime }))
      else if (status === 'cleared') meta.push(t('row.cleared', { time: changedTime }))
      else if (changedAt !== goal.createdAt) meta.push(t('row.updated', { time: changedTime }))
      return h('article', { className: 'dgh-row', 'data-focus': focus === true ? '' : undefined, ref },
        h('button', {
          type: 'button',
          className: 'dgh-row-head',
          'aria-expanded': open,
          title: t('row.toggle'),
          onClick: () => { setOpen(!open) },
        },
        h('span', { className: 'dgh-status dgh-status-' + label },
          h('span', { className: 'dgh-dot', 'aria-hidden': 'true' }),
          t('status.' + label)),
        h('span', { className: 'dgh-rounds', title: t('rounds.title') }, t('rounds.used', { rounds: goal.roundsStarted, max: goal.maxGoalRounds })),
        h('span', { className: 'dgh-chev', 'aria-hidden': 'true' }, open ? '▾' : '▸')),
        h('p', { className: 'dgh-obj' + (!open && long ? ' dgh-clamp-4' : '') }, goal.objective),
        h('p', { className: 'dgh-meta' }, meta.filter(Boolean).join(' · ')),
        goal.usage?.samples > 0 ? h(UsageDetails, { tokens: goalTokens(goal), usage: goal.usage, t }) : null,
        open
          ? h('div', { className: 'dgh-detail' },
            h('ul', { className: 'dgh-changes' },
              goal.changes.map((change, index) => h(GoalChange, {
                key: change.seq ?? index,
                change,
                previous: goal.changes[index - 1],
                t,
              }))))
          : null)
    }

    /**
     * Read-only right-Sidebar page listing every goal of the conversation.
     * @param props.useProjection - session projection reader.
     * @param props.useSession - current session snapshot selector.
     * @param props.useTabInfo - tab identity and navigation parameters.
     * @param props.activationSource - read and subscribe to the session's live goal state.
     * @param props.refresh - reads the Host projections again when this key is absent.
     * @param props.t - active locale.
     * @returns the history page.
     */
    function GoalHistoryTab({ useProjection, useSession, useTabInfo, activationSource, refresh, t }) {
      const history = useProjection(HISTORY_KEY)
      const currentGoal = useProjection('goal')?.goal
      const running = useSession(snapshot => snapshot.running)
      const liveGoal = useGoalActivation(currentGoal, running, activationSource)
      useProjectionRefresh(refresh)
      const info = useTabInfo()
      const params = info !== undefined && info !== null && info.tab !== undefined
        && info.tab.navigation !== undefined ? info.tab.navigation.params : undefined
      const focusId = params !== undefined && params !== null && typeof params.goalId === 'string'
        ? params.goalId
        : undefined
      if (history === undefined) {
        return h('div', { className: 'dgh-tab' }, h('p', { className: 'dgh-empty' }, t('tab.loading')))
      }
      const goals = goalsOf(history)
      if (goals.length === 0) {
        return h('div', { className: 'dgh-tab' }, h('p', { className: 'dgh-empty' }, t('tab.empty')))
      }
      const current = goals
        .filter(goal => goal.status !== 'complete' && goal.status !== 'cleared')
        .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))
      const past = goals
        .filter(goal => goal.status === 'complete' || goal.status === 'cleared')
        .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))
      const totalUsage = goals.reduce((sum, goal) => sum + goalTokens(goal), 0)
      const hasUsage = goals.some(goal => goal.usage?.samples > 0)
      const summary = t(goals.length === 1 ? 'tab.summary.one' : 'tab.summary.other', { total: goals.length })
      return h('div', { className: 'dgh-tab', 'data-goal-history-tab': '' },
        h('div', { className: 'dgh-summary' },
          h('span', null, summary),
          hasUsage ? h(UsageDetails, { tokens: totalUsage, label: 'tab.usageTotal', t }) : null),
        current.length > 0
          ? h('section', { className: 'dgh-section' },
            h('h2', { className: 'dgh-section-title' }, t('section.current')),
            current.map(goal => h(GoalRow, {
              key: goal.id,
              goal,
              activation: liveGoal?.id === goal.id && liveGoal.revision === goal.revision ? liveGoal.activation : undefined,
              focus: goal.id === focusId,
              t,
            })))
          : null,
        past.length > 0
          ? h('section', { className: 'dgh-section' },
            h('h2', { className: 'dgh-section-title' }, t('section.past')),
            past.map(goal => h(GoalRow, { key: goal.id, goal, focus: goal.id === focusId, t })))
          : null)
    }

    /**
     * Register the locale, the history tab type, and the three surfaces.
     * @param ctx - client root context.
     */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'goal-history: locale')
      const t = ctx.locale.bind(NS)

      ctx.effect(() => ctx.sidebarRightTabs.register({
        id: TAB_ID,
        kind: TAB_KIND,
        priority: 'extension',
        title: () => t('tab.title'),
      }), 'goal-history: tab type')

      ctx.effect(() => {
        const style = document.createElement('style')
        style.setAttribute('data-dsh-goal-history', '')
        style.textContent = CSS
        document.head.appendChild(style)
        return () => { style.remove() }
      }, 'goal-history: styles')

      const openHistory = (goalId) => {
        ctx.sidebarRight.openTab(TAB_KIND, goalId === undefined ? {} : { params: { goalId } })
      }
      const refreshProjection = (sessionId) => {
        if (sessionId === undefined) return
        try {
          const task = ctx.sessions.refreshProjections(sessionId)
          if (task !== null && typeof task === 'object' && typeof task.catch === 'function') task.catch(() => {})
        } catch {
          // An older controller without the read model leaves the page at its empty state.
        }
      }

      const goalActivationSource = (sessionId) => {
        const binding = ctx.sessions.binding(sessionId)
        return {
          read: async () => {
            if (binding === undefined || ctx.sessions.binding(sessionId) !== binding) return undefined
            return ctx.sessions.using(sessionId, { source: 'goalActivation' }, reference => {
              if (reference.binding !== binding || reference.binding.session.getSnapshot().openState !== 'open') return undefined
              return ctx.remote.goals.get(sessionId)
            })
          },
          subscribe: listener => ctx.remote.$on('goal/activation-changed', event => {
            if (event.sessionId === sessionId) listener(event.goal)
          }),
          onReset: listener => ctx.on('connection/reset', listener),
        }
      }

      ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
        name: 'conversation.session.header.utilities',
        id: 'goal-history',
        order: -4,
        locale: NS,
        inject: (sessionId) => ({ openHistory, refresh: () => { refreshProjection(sessionId) } }),
      }, GoalHistoryHeader))

      ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register({
        name: 'conversation.chat.turnTail',
        id: 'goal-completed',
        order: 10,
        locale: NS,
        inject: (sessionId) => ({ openHistory, refresh: () => { refreshProjection(sessionId) } }),
      }, GoalCompletedCard))

      ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
        name: 'sidebar.right.pane.tab',
        key: TAB_ID,
        locale: NS,
        inject: (sessionId) => ({
          activationSource: goalActivationSource(sessionId),
          refresh: () => { refreshProjection(sessionId) },
        }),
      }, GoalHistoryTab))

      ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
        name: 'sidebar.right.pane.tab.title',
        key: TAB_ID,
        locale: NS,
      }, ({ t }) => t('tab.title')))
    }

    return {
      name: 'dsh-goal-history',
      inject: ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs', 'sessions', 'remote', 'remote.goals'],
      apply,
    }
  },
})


