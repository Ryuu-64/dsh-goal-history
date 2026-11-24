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

    const zh = {
      'tab.title': '目标',
      'tab.loading': '正在读取目标…',
      'tab.empty': '这个对话还没有目标。',
      'tab.summary.one': '共 {total} 个目标',
      'tab.summary.other': '共 {total} 个目标',
      'section.current': '当前目标',
      'section.past': '历史目标',
      'status.active': '进行中',
      'status.paused': '已暂停',
      'status.blocked': '受阻',
      'status.complete': '已完成',
      'status.cleared': '已清除',
      'card.completed': '目标已完成',
      'card.completedAt': '{time} 完成',
      'rounds.used': '执行轮次 {rounds}/{max}',
      'rounds.title': '执行轮次：已开始的 Goal Round 数 / Round 上限。Goal Round 由自动续行准入；已完成不代表用满上限。',
      'usage.total': '用量 {tokens} tok',
      'usage.breakdown': '未缓存输入 {input} tok · 输出 {output} tok · 缓存读取 {cacheRead} tok · 缓存写入 {cacheWrite} tok',
      'tab.usageTotal': 'Token 用量 {tokens} tok',
      'action.expand': '展开全文',
      'action.collapse': '收起',
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
      'reason': '受阻原因：{message}',
    }

    const en = {
      'tab.title': 'Goals',
      'tab.loading': 'Loading goals…',
      'tab.empty': 'No goals in this conversation yet.',
      'tab.summary.one': '1 goal',
      'tab.summary.other': '{total} goals',
      'section.current': 'Current goal',
      'section.past': 'Past goals',
      'status.active': 'Active',
      'status.paused': 'Paused',
      'status.blocked': 'Blocked',
      'status.complete': 'Completed',
      'status.cleared': 'Cleared',
      'card.completed': 'Goal completed',
      'card.completedAt': 'completed {time}',
      'rounds.used': 'Rounds {rounds}/{max}',
      'rounds.title': 'Rounds: Goal Rounds started / round cap. Goal Rounds are admitted by automatic continuation; a completed goal need not use the cap.',
      'usage.total': 'Usage {tokens} tok',
      'usage.breakdown': 'Uncached input {input} tok · Output {output} tok · Cached input {cacheRead} tok · Cache write {cacheWrite} tok',
      'tab.usageTotal': 'Token usage {tokens} tok',
      'action.expand': 'Show all',
      'action.collapse': 'Show less',
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
      'reason': 'Blocker: {message}',
    }

    const CSS = `
.dgh-hbtn{position:relative;display:inline-flex;flex:none;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:28px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dgh-hbtn:focus-visible{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:1px}
@media(hover:hover){.dgh-hbtn:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}}
.dgh-hbtn svg{flex:none}
.dgh-hcount{position:absolute;top:0;right:-1px;box-sizing:border-box;min-width:13px;height:13px;padding:0 3px;border-radius:7px;background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-bg-base);font-size:9px;font-weight:500;line-height:13px;text-align:center}
.dgh-cards{display:flex;flex-direction:column;gap:10px;margin:12px 0 14px}
.dgh-card{box-sizing:border-box;display:flex;flex-direction:column;gap:6px;width:100%;padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-card-fill);color:var(--dsw-alias-label-primary)}
.dgh-card-head{display:flex;align-items:center;gap:8px;min-width:0}
.dgh-glyph{display:inline-flex;flex:none;color:var(--dsw-alias-label-tertiary)}
.dgh-card-title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500;line-height:20px}
.dgh-card-time{flex:none;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:16px}
.dgh-obj{margin:0;color:var(--dsw-alias-label-primary-dimmed);font-size:13px;line-height:20px;white-space:pre-wrap;overflow-wrap:anywhere}
.dgh-clamp-3{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.dgh-clamp-4{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}
.dgh-card-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:16px}
.dgh-card-meta{flex:none}
.dgh-textbtn{flex:none;padding:0;border:0;background:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}
.dgh-textbtn:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
@media(hover:hover){.dgh-textbtn:hover{color:var(--dsw-alias-label-primary)}}
.dgh-view{margin-left:auto;color:var(--dsw-alias-state-business-primary);font-weight:500}
@media(hover:hover){.dgh-view:hover{color:var(--dsw-alias-label-primary)}}
.dgh-row-head:hover .dgh-chev{color:var(--dsw-alias-label-secondary)}
.dgh-tab{box-sizing:border-box;height:100%;overflow:auto;padding:14px 14px 32px}
.dgh-summary{margin:0 0 12px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
.dgh-section{display:flex;flex-direction:column;gap:8px;margin:0 0 16px}
.dgh-section-title{margin:0;color:var(--dsw-alias-label-tertiary);font-size:11px;font-weight:500;line-height:16px}
.dgh-row{box-sizing:border-box;display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:0.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-card-fill);color:var(--dsw-alias-label-primary)}
.dgh-row[data-focus]{border-color:var(--dsw-alias-state-business-primary)}
.dgh-row-head{display:flex;align-items:center;gap:8px;width:100%;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dgh-row-head:focus-visible{outline:2px solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}
.dgh-status{display:inline-flex;flex:none;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.dgh-dot{display:inline-block;flex:none;width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-tertiary)}
.dgh-dot-complete{background:var(--dsw-alias-state-success-primary)}
.dgh-status-active .dgh-dot{background:var(--dsw-alias-state-business-primary)}
.dgh-status-paused .dgh-dot{background:var(--dsw-alias-label-tertiary)}
.dgh-status-blocked .dgh-dot{background:var(--dsw-alias-state-warn-primary,var(--dsw-alias-state-warn-label))}
.dgh-status-complete .dgh-dot{background:var(--dsw-alias-state-success-primary)}
.dgh-status-cleared .dgh-dot{background:var(--dsw-alias-border-l3)}
.dgh-rounds{flex:none;margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:16px}
.dgh-chev{flex:none;width:12px;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:16px;text-align:center}
.dgh-meta{margin:0;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:16px}
.dgh-detail{margin-top:2px;padding-top:8px;border-top:0.5px solid var(--dsw-alias-border-l1)}
.dgh-changes{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.dgh-change{display:flex;align-items:baseline;gap:8px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}
.dgh-change-op{flex:none}
.dgh-change-time{flex:none;margin-left:auto;color:var(--dsw-alias-label-tertiary)}
.dgh-reason{margin:8px 0 0;color:var(--dsw-alias-state-warn-label,var(--dsw-alias-label-secondary));font-size:11px;line-height:16px}
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
     * @returns display text, or an empty string for a missing value.
     */
    function formatTime(ms) {
      if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return ''
      try {
        return new Intl.DateTimeFormat(undefined, {
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
     * @returns clock text, or an empty string for a missing value.
     */
    function formatClock(ms) {
      if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) return ''
      try {
        return new Intl.DateTimeFormat(undefined, {
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

    /**
     * Hover breakdown for a goal's token total.
     * @param usage - recorded usage buckets.
     * @param t - active locale.
     * @returns localized breakdown, or undefined when there are no samples.
     */
    function usageTitle(usage, t) {
      if (usage === null || typeof usage !== 'object' || !(usage.samples > 0)) return undefined
      return t('usage.breakdown', {
        input: formatTokens(usage.inputTokens),
        output: formatTokens(usage.outputTokens),
        cacheRead: formatTokens(usage.cacheReadTokens),
        cacheWrite: formatTokens(usage.cacheWriteTokens),
      })
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
     * @param props.change - completion change.
     * @param props.openHistory - opens the history page focused on one goal.
     * @param props.t - active locale.
     * @returns the card.
     */
    function GoalCard({ goal, change, openHistory, t }) {
      const [open, setOpen] = useState(false)
      const [clipped, setClipped] = useState(false)
      const bodyRef = useRef(null)
      useEffect(() => {
        if (open) return
        const body = bodyRef.current
        if (body !== null && body.scrollHeight > body.clientHeight + 1) setClipped(true)
      }, [change.objective, open])
      const tokens = goalTokens(goal)
      const tokensTitle = usageTitle(goal.usage, t)
      return h('article', { className: 'dgh-card', 'data-goal-history-card': goal.id },
        h('div', { className: 'dgh-card-head' },
          h('span', { className: 'dgh-glyph' }, h(GoalGlyph, { size: 16 })),
          h('span', { className: 'dgh-dot dgh-dot-complete', 'aria-hidden': 'true' }),
          h('span', { className: 'dgh-card-title' }, t('card.completed'))
        ),
        h('p', { ref: bodyRef, className: 'dgh-obj' + (!open ? ' dgh-clamp-3' : '') }, change.objective),
        h('div', { className: 'dgh-card-foot' },
          h('span', { className: 'dgh-card-meta', title: t('rounds.title') }, t('rounds.used', { rounds: change.roundsStarted, max: change.maxGoalRounds })),
          tokens > 0
            ? h('span', { className: 'dgh-card-meta', title: tokensTitle }, t('usage.total', { tokens: formatTokens(tokens) }))
            : null,
          h('span', { className: 'dgh-card-meta' }, t('card.completedAt', { time: formatTime(change.time) })),
          open || clipped
            ? h('button', {
              type: 'button',
              className: 'dgh-textbtn',
              onClick: () => { setOpen(!open) },
            }, open ? t('action.collapse') : t('action.expand'))
            : null,
          h('button', {
            type: 'button',
            className: 'dgh-textbtn dgh-view',
            onClick: () => { openHistory(goal.id) },
          }, t('action.view'), h('span', { 'aria-hidden': 'true' }, ' ›'))
        )
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
          change,
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

    /**
     * One goal row of the history page.
     * @param props.goal - recorded goal.
     * @param props.focus - whether the opener addressed this goal.
     * @param props.t - active locale.
     * @returns the row.
     */
    function GoalRow({ goal, focus, t }) {
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
      const changedAt = status === 'cleared'
        ? (goal.clearedAt !== undefined ? goal.clearedAt : goal.updatedAt)
        : goal.updatedAt
      const changedTime = sameDay(goal.createdAt, changedAt) ? formatClock(changedAt) : formatTime(changedAt)
      const meta = [t('row.created', { time: formatTime(goal.createdAt) })]
      if (status === 'complete') meta.push(t('row.completed', { time: changedTime }))
      else if (status === 'cleared') meta.push(t('row.cleared', { time: changedTime }))
      else if (changedAt !== goal.createdAt) meta.push(t('row.updated', { time: changedTime }))
      const tokens = goalTokens(goal)
      if (tokens > 0) meta.push(t('usage.total', { tokens: formatTokens(tokens) }))
      return h('article', { className: 'dgh-row', 'data-focus': focus === true ? '' : undefined, ref },
        h('button', {
          type: 'button',
          className: 'dgh-row-head',
          'aria-expanded': open,
          title: t('row.toggle'),
          onClick: () => { setOpen(!open) },
        },
        h('span', { className: 'dgh-status dgh-status-' + status },
          h('span', { className: 'dgh-dot', 'aria-hidden': 'true' }),
          t('status.' + status)),
        h('span', { className: 'dgh-rounds', title: t('rounds.title') }, t('rounds.used', { rounds: goal.roundsStarted, max: goal.maxGoalRounds })),
        h('span', { className: 'dgh-chev', 'aria-hidden': 'true' }, open ? '▾' : '▸')),
        h('p', { className: 'dgh-obj' + (!open && long ? ' dgh-clamp-4' : '') }, goal.objective),
        h('p', { className: 'dgh-meta', title: usageTitle(goal.usage, t) }, meta.filter(Boolean).join(' · ')),
        open
          ? h('div', { className: 'dgh-detail' },
            h('ul', { className: 'dgh-changes' },
              goal.changes.map((change, index) => h('li', { key: index, className: 'dgh-change' },
                h('span', { className: 'dgh-change-op' }, t('op.' + change.operation)),
                h('time', { className: 'dgh-change-time' }, formatTime(change.time))))),
            goal.blockedReason !== undefined && goal.blockedReason !== null
              ? h('p', { className: 'dgh-reason' }, t('reason', { message: goal.blockedReason.message }))
              : null)
          : null)
    }

    /**
     * Read-only right-Sidebar page listing every goal of the conversation.
     * @param props.useProjection - session projection reader.
     * @param props.useTabInfo - tab identity and navigation parameters.
     * @param props.refresh - reads the Host projections again when this key is absent.
     * @param props.t - active locale.
     * @returns the history page.
     */
    function GoalHistoryTab({ useProjection, useTabInfo, refresh, t }) {
      const history = useProjection(HISTORY_KEY)
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
      const summary = t(goals.length === 1 ? 'tab.summary.one' : 'tab.summary.other', { total: goals.length })
      return h('div', { className: 'dgh-tab', 'data-goal-history-tab': '' },
        h('p', { className: 'dgh-summary' }, totalUsage > 0
          ? summary + ' · ' + t('tab.usageTotal', { tokens: formatTokens(totalUsage) })
          : summary),
        current.length > 0
          ? h('section', { className: 'dgh-section' },
            h('h2', { className: 'dgh-section-title' }, t('section.current')),
            current.map(goal => h(GoalRow, { key: goal.id, goal, focus: goal.id === focusId, t })))
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
        inject: (sessionId) => ({ refresh: () => { refreshProjection(sessionId) } }),
      }, GoalHistoryTab))
    }

    return {
      name: 'dsh-goal-history',
      inject: ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs', 'sessions'],
      apply,
    }
  },
})


