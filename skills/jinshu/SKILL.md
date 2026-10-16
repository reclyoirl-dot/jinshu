---
name: jinshu
description: 用「锦书 JinShu」的 `:::素材id{参数}` 语法写出带排版的微信公众号文章。当用户要写公众号推文、把文章排成公众号样式、给 Markdown 加标题/卡片/问答/分割线/关注引导/GIF 动图/SVG 点击互动，或提到锦书、秀米式排版时使用。
---

# 锦书 JinShu · 公众号排版

「锦书 JinShu」是一个公众号 Markdown 排版编辑器。文章就是普通 Markdown，再用 `:::素材id{参数}` 插入 205 个排版素材（标题、卡片、问答、图文、分割线、引导、结尾、GIF 动图、SVG 动画与点击互动）。你写出的 Markdown 粘贴进锦书编辑器，就能看到排好版的效果，再一键复制到公众号后台。

**完整素材清单**：仓库里的 [`docs/MATERIALS.md`](../../docs/MATERIALS.md)（由 `pnpm catalog` 自动生成，含每个素材的参数和示例）。不在仓库里时，从 `https://raw.githubusercontent.com/reclyoirl-dot/jinshu/main/docs/MATERIALS.md` 获取。下文的「常用素材速查」覆盖了大多数场景；需要更特别的样式（节日、电商价签、拼图等）时再查完整手册，**只使用手册里存在的 id**。

## 工作流程

1. **先读懂文章**：确定主题、读者、语气（干货/文艺/商务/活泼/节日），以及文章由哪几部分组成。用户只给了主题时，先把正文写好，再排版。
2. **定一个风格基调**，整篇统一：同一篇文章的章节标题只用**一种**素材（编号递增），卡片类素材最多 2–3 种，颜色跟随主色，不要每段换一个花样。
3. **按位置挑素材**（见下一节），把正文里真正值得强调的内容放进素材；普通段落保持普通 Markdown。经验比例：素材包裹的内容不超过全文的一半。
4. **检查语法**：每个 `:::id` 都有对应的单独一行 `:::` 结尾；参数值有空格就加引号；图片用公网地址。
5. **交付**：输出完整的 Markdown（放在一个代码块里方便复制），并告诉用户粘贴到锦书编辑器，在预览区「兼容检测」确认没有问题后，点「复制到公众号」。

## 按位置挑素材

| 位置 | 推荐素材 | 说明 |
| --- | --- | --- |
| 开头引导关注 | `gif-follow{color=blue}`、`follow-top{name="公众号名"}`、`g-follow-capsule` | 放在文章最前面，一篇只用一个 |
| 开篇导语 | `b-magazine-dropcap{label="..."}`、`b-centered-quote`、`card-gradient{title="写在前面"}` | 第一段用首字下沉或金句，奠定气质 |
| 章节标题 | 干货/教程：`t-art-number`、`title-numbered`、`t-step-track`、`title-part`；商务：`title-leftbar`、`t-card-header`、`title-badge`；文艺：`t-kicker`、`t-editorial`、`title-chapter`；可爱：`title-pill`、`t-washi-note` | 整篇统一用一种，`no` 依次 01、02、03 |
| 重点 / 提示 | `note-tip{label="小贴士" icon="💡"}`、`card-border`、`card-dashed`、`b-sidebar-label`、`b-marker-paragraph` | 一节最多一个 |
| 数据 | `b-stat-ledger`（每行「数字：说明」）、`sv-number-counter{value="1286" unit="位读者"}`、`sv-rising-bars`、`svg-progress` | 有具体数字时才用 |
| 步骤 / 清单 | `b-step-cards{title="..."}`（每行一步）、`b-checklist`、`timeline` | 3–5 条最好看 |
| 对比 | `b-pros-cons{pros="优点" cons="缺点"}` | 优点和缺点之间**空一行**分隔 |
| 引用 / 金句 | `quote-big{author="..."}`、`b-centered-quote{author="..."}`、`t-quotation` | 全文 1–2 处 |
| 问答 | `qa-classic`、`qa-chat`（口语）、`qa-card`（商务）、`qa-interview`（访谈）、`qx-faq-list`（多组 FAQ） | 第一行问题，其余是回答 |
| 测验 / 互动 | `qx-choice-quiz{answer="B" explain="..."}`、`qx-true-false{answer="对"}`、`svg-tap-reveal`、`svg-flip-card` | 适合知识类、教程类 |
| 图片 | `img-card`、`img-polaroid`、`img-double`（两张图）、`img-side{title="..."}`、`it-trio-collage`（三张图） | 图片必须是公网 https 地址 |
| 分割 | `divider-dots`、`divider-text{text="..."}`、`d-wave-path`、`gif-wave`、`svg-wave` | 只在大段落之间用，别每节都放 |
| 结尾互动 | `g-comment-invitation{label="留言区见"}`、`g-topic-ballot{topic="..."}`、`read-more{title="往期推荐"}` | 引导留言、投票、看往期 |
| 结尾收束 | `gif-actions{color=red}`（分享点赞在看）、`end-thanks`、`e-handwritten-signature{author="..." date="..."}`、`end-lines` | 一个引导 + 一个收尾即可 |

### 什么时候用 SVG 互动和 GIF

- **SVG 点击互动**（带「互动」标签，如 `svg-tap-reveal` 点击揭晓答案、`svg-flip-card` 点击翻面、`svg-gift-open` 点击拆礼物、`sv-fold-letter` 点击展开长信、`sv-before-after` 前后对比、`sv-heart-like` 点赞 +1）：用在**有悬念、有答案、值得读者动手**的地方，比如「猜一猜」「冷知识」「改造前后」「福利领取」。一篇 1–3 个，太多会显得花哨。
- **SVG 自动动画**（`sv-number-counter`、`sv-rising-bars`、`sv-timeline-stops`、`svg-typing-title` 等）：给数据、时间线、标题加一点动感，公众号原生支持。
- **GIF 动图**（`gif-*`）：关注引导、分享点赞、分割线、节日氛围（`gif-lantern`、`gif-moon`、`gif-fireworks`、`gif-snow`）。很多动图支持 `color=blue|green|red|orange|purple` 配色，挑一个与主色接近的。GIF 一篇 2–4 个就够。
- GIF 需要编辑器部署在公网才能被公众号抓取；如果用户在本地 `localhost` 使用，提醒他们在「主题 → 动图素材地址」里填写公网地址，或少用 GIF。

## 语法规则

```markdown
:::素材id{参数1="值" 参数2=值}
内容（普通 Markdown）
:::
```

- 开头一行只能有 `:::id{参数}`；结尾**单独一行** `:::`。
- 参数值有空格、标点时用双引号：`sub="用脚步，重新认识一座城"`。参数都可以省略。
- 内容约定：标题类第一行是标题；卡片类直接写正文；问答类第一行是问题、其余是回答；步骤 / 数据 / 清单类**每行一条**；`b-pros-cons` 等分栏素材用**空行**分隔两栏。
- 没有内容的素材（GIF、多数分割线）也要写结尾：

  ```markdown
  :::gif-follow{color=green}
  :::
  ```

- **嵌套**：素材里可以放素材，各自用 `:::` 结尾，按顺序配对。
- **颜色**：所有素材自动跟随主色；单个素材可以用 `color=#e85d75` 覆盖（十六进制）。GIF 的 `color` 是配色名（`blue` 等），不是色值。
- 普通 Markdown 照常用：`##` 标题、`**加粗**`、列表、引用、表格、代码块都会按主题排版。不想用素材的章节，直接用 `##` 也完全可以。

## 公众号限制（写作时就要避开）

- **外链不能点击**：普通链接会被自动转成文末「参考链接」，只有 `mp.weixin.qq.com` 文章链接保留。需要读者访问的网址，直接写成文字。
- **图片要公网地址**：本地路径、`localhost`、内网地址公众号抓取不到。没有真实图片时，宁可不放，也不要编造图片链接；需要占位时明确告诉用户替换。
- **二维码**：`follow-card{qr="..."}`、`g-qr-station{qr="..."}`、`e-qr-business-card{qr="..."}` 的 `qr` 填用户提供的二维码图片地址，没有就留空 `qr=""`。
- 不要自己写 HTML / `<style>` / class，排版只靠素材和 Markdown。

## 常见组合范例

**干货教程**：`gif-follow` → `b-magazine-dropcap` 导语 → 每节 `t-art-number{no="01"}` 标题 + 正文 + 偶尔 `note-tip` / `b-step-cards` → `svg-tap-reveal` 小测验 → `g-comment-invitation` → `gif-actions` → `end-thanks`

**品牌 / 企业新闻**：`follow-top` → `t-card-header{no="01" en="NEWS"}` 标题 → `sv-number-counter` 或 `b-stat-ledger` 数据 → `timeline` 里程碑 → `img-card` 现场图 → `contact-card` → `end-copyright`

**文艺随笔 / 读书笔记**：`t-kicker` 或 `t-editorial` 标题 → `b-magazine-dropcap` → 正文 + `quote-big` / `b-centered-quote` 金句 → `d-wave-path` 分割 → `b-personal-letter` 或 `card-paper` → `e-handwritten-signature`

**节日推文**：节日 GIF（`gif-lantern` / `gif-moon` / `gif-fireworks` / `gif-snow`）→ 对应 `fest-*` 卡片（在手册里搜节日名，如 `fest-mid-autumn-moon`、`fest-spring-fu`）→ `svg-gift-open` 拆礼物 → `gif-actions`

**电商 / 活动**：`gif-new` 或 `gif-countdown-three` → `b-price-offer{price="..." original="..."}` → `b-info-summary{label="活动速览"}` → `sv-glow-claim` 点击领取 → `svg-marquee` 公告

## 完整示例

[`example.md`](example.md) 是一篇按上述规则排版的完整文章（干货类），可以直接粘贴到锦书里查看效果，也可以作为输出格式的参考。
