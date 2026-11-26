# 兼容说明

## 接入方式

插件由 Host 半和浏览器半组成，不注册工具、命令或远程 RPC。

- **Host 半**：`ctx.sessionProjections.register()` 注册会话级只读单元 `goalHistory`，读取 `goal/change`（版本 1）、已获准的目标来源 `user/message` 和最终的 `assistant/message` 用量。浏览器通过会话投影读取这些数据。
- **浏览器半**：
  - `conversation.chat.turnTail`：完成那一轮末尾的完成卡。
  - `conversation.session.header.utilities`：会话标题栏的目标按钮。
  - `sidebar.right.pane.tab`：右侧栏“目标”页；tab 类型由 `ctx.sidebarRightTabs.register()` 声明。
- 客户端从 `goalHistory` 读取历史。当前目标使用 DSH 的 `goals.get` 和 `goal/activation-changed` 读取自动续行状态，按目标 ID 和修订号与历史对齐。编辑、暂停、恢复、清除由 DSH 的目标条和 `/goal` 命令负责。

## 版本

- 构建与实测：DeepSeek Harness `0.2.2-rc.3`，Desktop `2.0.23-next`，Windows，Electron 44 / Node 24。
- 插件声明的 peer 范围与此一致；`0.2.2-rc.3` 之外的版本没有实测，不推断兼容。
- 会话事件使用 `goal/change` v1、`user/message.data.source` 的 `goal` 来源和 `assistant/message.data.usage`。客户端使用上文列出的三个公开插槽。

## 更新或启用时机

Host 在启动时注册只读投影。投影状态版本 3 会重放会话记录，补回旧版本漏记的自动续行轮次。浏览器刷新只会重载客户端。

更新已安装的插件后请**重启 DSH**，让 Host 半重新加载并让会话重新折叠目标历史。这一点不是 Token 用量功能特有的；首次启用插件后打开一个已有会话也可能需要同样的重启或重新打开。

## 执行轮次

goal 记录两个值：

- **已开始的 Round 数**：`roundsStarted`。
- **Round 上限**：`maxGoalRounds`，在创建 goal 时设定；未指定时用部署的默认值。

一个 **Goal Round** 是一次自动续行：agent 空闲、goal 为 active 且续行已启用、上限还有余额时，goal round driver 准入一条 goal 来源的消息，让模型再跑一轮。只有已准入、真正进入模型历史的 goal 消息才推进 Round；到达上限会记录 `round-limit` 受阻。Human 消息、陈旧的预留和被取消的轮次不推进 Round。

目标页按 `已开始 / 上限` 显示**执行轮次**。已获准的目标消息提交后，计数立即更新。清除事件只带目标引用和清除时间，因此历史记录保留清除前最后一次计数。目标如果在用户发起的那一轮直接完成，自动续行的轮次为 0。 [DSH 0.2.2-rc.3 目标事件契约](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.3/docs/subsystems/goal.md#durable-changes)

## 目标期间用量

完成卡显示已记录的用量总计。在「目标」页点开单个目标的用量或页面合计，可以查看统计口径。单个目标还会显示用量明细。

### 数据来源

最终的 `assistant/message` 可以携带 `data.usage`，例如下面这条记录。

```json
{ "inputTokens": 245, "outputTokens": 92, "cacheReadTokens": 12928, "cacheWriteTokens": 0, "totalTokens": 13265 }
```

`totalTokens` 是四个用量桶之和（未缓存输入 + 输出 + 缓存读取 + 缓存写入）；字段缺失时插件按四个桶相加。

### 归属规则

- goal 从 `create` 事件开始成为当前 goal，到 `complete` 或 `clear` 事件结束。
- 这个区间内落下的 `assistant/message` 用量，累加到该 goal。
- 创建前的消息、完成/清除后的消息不计入；因此完成事件之后的收尾回复不在数字里。
- goal 跨多个 Goal Round 持续存在时，区间内的所有助手消息用量都会累计；暂停/受阻期间也包含在区间内。
- 没有 `usage` 的消息不计入；重试产生的 `assistant/attempt` 不作为独立样本，只取最终 `assistant/message`。
- 多个 goal 分别统计；目标页顶部是这些 goal 统计值的合计，不是整个会话的总用量。

### 为什么不是“账单”

这个数字用来回答“这个 goal 的用量大概是多少”，不是计费凭证：

- goal 期间可能夹着与 goal 无关的人类轮次，这些轮次也会被算进去（goal 仍是当前 goal）。
- 完成事件后的收尾回复不计入。
- 供应商的计费口径、缓存折扣、重试和上下文压缩可能与 `totalTokens` 不完全一致。
- 旧会话里没有 `usage` 的消息无法补造。

## 已知边界

- 一次只看一个会话；goal 不跨会话。
- 在一个对话轮次内完成的目标才有聊天卡；否则只在“目标”页出现。
- 已清除的目标仍在「目标」页保留最后的目标原文、执行轮次、期间用量和变更记录。
- 页面只读；不提供第二个修改入口。
- 旧记录按纯文本展示，不执行 Markdown；缺失字段不补造。
- 「进行中」表示原生自动续行已启用。「待继续」表示需要用户从原生目标条恢复。实时状态暂时读不到时，侧栏显示「状态未确认」。

## 验证

- `npm run check` 覆盖语法检查和投影回归测试，包括准入自动续行、直接清除后保留轮次、恢复后保留历史受阻原因、用量归属和 JSON 往返。
- 隔离的 DSH `0.2.2-rc.3` Web 会话验证了重开、原生恢复和暂停时的状态同步，以及浅色、深色和 900 px 窗口下的轮次和时间显示。
- 实机：2026-11-20 的会话里有两个已完成目标；插件显示目标按钮计数 2、完成卡和“目标”页。把插件停用后，同一对话的卡、按钮和页面内容消失。
- Token 实测：同一会话回放得到两个 goal 的统计值 `29,653` 和 `190,407`，分别对应完成卡和页面行；会话总用量约 `1.51M`，与 DSH footer 的 `1.5M` 一致。
