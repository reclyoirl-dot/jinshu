# 素材手册

<!-- 本文件由 `pnpm catalog`（scripts/gen-catalog.mjs）根据 src/blocks 自动生成，请勿手动修改 -->

「锦书 JinShu」共有 **205 个素材**，全部可以直接写进 Markdown。这份手册既给人查，也可以整份发给 AI，让它写文章时直接用素材排版。

## 语法规则

素材用 `:::` 容器包裹，开头一行写素材 id 和参数，结尾单独一行 `:::`：

```markdown
:::素材id{参数1="值" 参数2=值}
素材内容（普通 Markdown）
:::
```

- **开头行**：`:::` 后紧跟素材 id，参数写在同一行的 `{}` 里；整行不能有其他文字。
- **参数**：`key="value"`，值里有空格时必须加引号，单引号也可以；不带值的 `key` 等于 `key="true"`。参数可以省略，省略时使用素材自带的默认文字。
- **结尾行**：单独一行 `:::`，前后不要有其他字符。
- **内容**：容器里写普通 Markdown，支持加粗、行内代码、链接、图片 `![说明](https://图片地址)`。多数素材约定「第一行是标题、其余是正文」，问答类素材约定「第一行是问题、其余是回答」（`Q:` / `问：` / `A:` / `答：` 前缀会被自动去掉）。没有内容的素材（如动图、分割线）直接写 `:::id` 加一行 `:::`。
- **嵌套**：素材里可以再放素材，每个容器都用自己的 `:::` 结尾，按出现顺序配对：

```markdown
:::card-border
:::title-pill
卡片里的标题
:::
卡片正文
:::
```

- **未知 id** 会在预览里显示红色的「未知组件」提示，请只使用本手册列出的 id。

## 颜色参数

- 所有素材都跟随编辑器里设置的**主色**，不写颜色时自动协调。
- 任意素材都可以加 `color=#ff6600`（3 位或 6 位十六进制）单独指定这一处的颜色，例如 `:::card-border{color=#e85d75}`。
- 动图（`gif-*`）的 `color` 是**配色名**而不是色值：`blue` / `green` / `red` / `orange` / `purple`，只有标注了「配色」的动图支持；动图还支持 `width="60%"` 或 `width="240px"` 调整显示宽度。

## 使用提示

- **动图**粘贴到公众号时，公众号会从网络抓取 GIF，所以编辑器必须部署在公网（或在「主题 → 动图素材地址」填写公网 CDN）；本地 `localhost` 预览时复制过去会显示不出来。
- **SVG 素材**是公众号支持的原生动画，其中带「互动」标签的素材读者点一下才会触发（揭晓答案、翻面、拆礼物等），适合做互动和悬念，一篇文章 1–3 个即可。
- 公众号正文不能放外链：普通链接会被自动转成文末「参考链接」，只有 `mp.weixin.qq.com` 的公众号文章链接会保留。
- 预览区顶部的「兼容检测」会提示渐变文字背景、行高过小、本地图片地址等问题。

## 全局主题

主题决定 Markdown 原生元素（标题、引用、列表、代码块、表格）的样式，在编辑器「样式中心 → 主题」里切换。

| id | 名称 | 说明 |
| --- | --- | --- |
| `simple` | 简约 | 克制留白，适合任何内容的默认主题 |
| `tech-blue` | 科技蓝 | 深色代码块 + 胶囊标题，适合技术文章 |
| `fresh-green` | 清新绿 | 柔和绿色与圆角，适合生活、教程类内容 |
| `literary` | 文艺 | 衬线字体、宽松行距，适合随笔、书评与散文 |
| `business` | 商务 | 深蓝稳重、色块标题，适合企业新闻、政务通报 |
| `sweet-pink` | 少女粉 | 粉色圆角与可爱装饰，适合美妆、生活分享 |
| `chinese-ancient` | 古风 | 朱砂红配宋体，适合传统节日、诗词与国风内容 |
| `geek-dark` | 极客暗黑 | 深色背景与终端风格，适合开发者内容 |

## 素材目录

- [标题](#标题title)：37 个
- [正文](#正文body)：37 个
- [问答](#问答qa)：11 个
- [图文](#图文imagetext)：13 个
- [分割](#分割divider)：16 个
- [引导](#引导guide)：13 个
- [结尾](#结尾ending)：11 个
- [动图](#动图gif)：37 个
- [SVG](#svgsvg)：30 个

## 标题（title）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `t-art-number` | 切片艺术数字 | 编号、文艺、潮流 | `no` `en` `sub` |
| `t-bilingual-index` | 双语索引栏 | 简约、商务、文艺 | `en` `sub` |
| `t-editorial` | 杂志刊头 | 文艺、怀旧、通用 | `no` `en` `sub` |
| `t-gradient-frame` | 流光渐变描边 | 科技、色彩、潮流 | `en` `sub` |
| `t-ticket-tab` | 灵感入场票 | 旅游、文艺、编号 | `no` `en` `sub` |
| `t-washi-note` | 纸胶带手记 | 清新、可爱、校园 | `sub` |
| `t-rail-caption` | 双轨英文侧标 | 商务、科技、简约 | `en` `sub` |
| `t-literati-seal` | 雅集方印 | 古风、文艺 | `seal` `sub` |
| `t-folded-corner` | 折角收藏页 | 简约、教育、教程 | `en` `sub` |
| `t-offset-panels` | 叠色章节板 | 潮流、色彩、编号 | `no` `en` `sub` |
| `t-dot-number` | 圆点目录序 | 编号、简约、通用 | `no` `sub` |
| `t-step-track` | 行动步骤轨道 | 教程、编号、教育 | `no` `sub` |
| `t-kicker` | 眉题留白 | 简约、文艺、通用 | `sub` `en` |
| `t-floral-center` | 花笺小序 | 清新、文艺、少女 | `sub` |
| `t-dashed-wave` | 点划手写线 | 清新、可爱、校园 | `sub` |
| `t-quotation` | 引语视窗 | 引用、文艺、简约 | `sub` |
| `t-card-header` | 档案卡片头 | 商务、企业、通用 | `no` `en` `sub` |
| `t-checklist` | 心愿清单勾选 | 教程、教育、简约 | `no` `sub` |
| `title-numbered` | 序号居中标题 | 简约、通用、编号 | `no` `sub` |
| `title-leftbar` | 左竖条标题 | 简约、商务、通用 | `sub` |
| `title-pill` | 胶囊标题 | 可爱、清新、通用 | — |
| `title-highlight` | 马克笔标题 | 简约、文艺、通用 | — |
| `title-part` | PART 章节标题 | 简约、商务、科技、编号 | `no` |
| `title-badge` | 方块序号标题 | 商务、科技、编号 | `no` |
| `title-brackets` | 书名号标题 | 古风、文艺 | — |
| `title-lines` | 渐变双线标题 | 简约、清新、通用 | — |
| `title-chapter` | 圆环章节标题 | 文艺、古风、编号 | `no` `sub` |
| `title-shadow` | 错位投影标题 | 潮流、色彩 | — |
| `title-bgword` | 英文衬底标题 | 简约、商务、科技 | `en` |
| `title-spring` | 春节红金标题 | 节日、春节、喜庆、红色 | — |
| `title-moon` | 中秋明月标题 | 节日、中秋、古风 | — |
| `fest-new-year` | 元旦 · 翻开新历 | 节日、元旦、简约 | `sub` |
| `fest-spring-couplet` | 春节 · 春联横批 | 节日、春节、古风 | `left` `right` `sub` |
| `fest-lantern` | 元宵 · 灯火团圆 | 节日、元宵、古风 | `sub` |
| `fest-womens-day` | 妇女节 · 自在盛放 | 节日、妇女节、文艺 | `sub` |
| `fest-childrens-day` | 儿童节 · 云端气球 | 节日、儿童节、可爱、色彩 | `sub` |
| `fest-national-day` | 国庆 · 山河华章 | 节日、国庆、企业 | `sub` |

### `t-art-number` 切片艺术数字

标签：编号、文艺、潮流 · 参数：`no`（如 `01`）、`en`（如 `CITY WALK`）、`sub`（如 `用脚步，重新认识一座城`）

```markdown
:::t-art-number{no="01" en="CITY WALK" sub="用脚步，重新认识一座城"}
走进街巷的日常
:::
```

### `t-bilingual-index` 双语索引栏

标签：简约、商务、文艺 · 参数：`en`（如 `SLOW LIVING`）、`sub`（如 `生活观察 / 第十二期`）

```markdown
:::t-bilingual-index{en="SLOW LIVING" sub="生活观察 / 第十二期"}
把时间留给喜欢的事
:::
```

### `t-editorial` 杂志刊头

标签：文艺、怀旧、通用 · 参数：`no`（如 `08`）、`en`（如 `WEEKEND JOURNAL`）、`sub`（如 `一份关于城市与人的周末手记`）

```markdown
:::t-editorial{no="08" en="WEEKEND JOURNAL" sub="一份关于城市与人的周末手记"}
在菜市场，遇见生活
:::
```

### `t-gradient-frame` 流光渐变描边

标签：科技、色彩、潮流 · 参数：`en`（如 `NEW POSSIBILITIES`）、`sub`（如 `让每一个好想法，走向真实世界`）

```markdown
:::t-gradient-frame{en="NEW POSSIBILITIES" sub="让每一个好想法，走向真实世界"}
灵感，在此刻发生
:::
```

### `t-ticket-tab` 灵感入场票

标签：旅游、文艺、编号 · 参数：`no`（如 `026`）、`en`（如 `ADMIT ONE`）、`sub`（如 `下一站，去海边`）

```markdown
:::t-ticket-tab{no="026" en="ADMIT ONE" sub="下一站，去海边"}
给自己一张出发的票
:::
```

### `t-washi-note` 纸胶带手记

标签：清新、可爱、校园 · 参数：`sub`（如 `写在新学期的第一页`）

```markdown
:::t-washi-note{sub="写在新学期的第一页"}
愿热爱，陪你慢慢长大
:::
```

### `t-rail-caption` 双轨英文侧标

标签：商务、科技、简约 · 参数：`en`（如 `INSIGHT / 2026`）、`sub`（如 `从一个小变化，看见行业新方向`）

```markdown
:::t-rail-caption{en="INSIGHT / 2026" sub="从一个小变化，看见行业新方向"}
读懂增长背后的信号
:::
```

### `t-literati-seal` 雅集方印

标签：古风、文艺 · 参数：`seal`（如 `秋记`）、`sub`（如 `山川有信，草木知时`）

```markdown
:::t-literati-seal{seal="秋记" sub="山川有信，草木知时"}
一盏清茶，半日闲
:::
```

### `t-folded-corner` 折角收藏页

标签：简约、教育、教程 · 参数：`en`（如 `KEEP THIS PAGE`）、`sub`（如 `把复杂的事，拆成小小的一步`）

```markdown
:::t-folded-corner{en="KEEP THIS PAGE" sub="把复杂的事，拆成小小的一步"}
这份方法，值得收藏
:::
```

### `t-offset-panels` 叠色章节板

标签：潮流、色彩、编号 · 参数：`no`（如 `02`）、`en`（如 `MAKE IT HAPPEN`）、`sub`（如 `有想法，就让它发生`）

```markdown
:::t-offset-panels{no="02" en="MAKE IT HAPPEN" sub="有想法，就让它发生"}
把灵感变成行动
:::
```

### `t-dot-number` 圆点目录序

标签：编号、简约、通用 · 参数：`no`（如 `03`）、`sub`（如 `让微小的坚持，慢慢生根`）

```markdown
:::t-dot-number{no="03" sub="让微小的坚持，慢慢生根"}
从今天的一件小事开始
:::
```

### `t-step-track` 行动步骤轨道

标签：教程、编号、教育 · 参数：`no`（如 `02`）、`sub`（如 `先找到问题，再寻找答案`）

```markdown
:::t-step-track{no="02" sub="先找到问题，再寻找答案"}
画出你的第一张思维地图
:::
```

### `t-kicker` 眉题留白

标签：简约、文艺、通用 · 参数：`sub`（如 `关于成长的另一种答案`）、`en`（如 `ON GROWING`）

```markdown
:::t-kicker{sub="关于成长的另一种答案" en="ON GROWING"}
慢一点，也能走得很远
:::
```

### `t-floral-center` 花笺小序

标签：清新、文艺、少女 · 参数：`sub`（如 `收集日常里，小小的欢喜`）

```markdown
:::t-floral-center{sub="收集日常里，小小的欢喜"}
春风捎来一封信
:::
```

### `t-dashed-wave` 点划手写线

标签：清新、可爱、校园 · 参数：`sub`（如 `和朋友一起，把周末过得有趣`）

```markdown
:::t-dashed-wave{sub="和朋友一起，把周末过得有趣"}
今天，去发现一点新鲜
:::
```

### `t-quotation` 引语视窗

标签：引用、文艺、简约 · 参数：`sub`（如 `留给每一个正在努力的你`）

```markdown
:::t-quotation{sub="留给每一个正在努力的你"}
你走过的路，都算数
:::
```

### `t-card-header` 档案卡片头

标签：商务、企业、通用 · 参数：`no`（如 `06`）、`en`（如 `TEAM STORIES`）、`sub`（如 `记录那些认真做事的人`）

```markdown
:::t-card-header{no="06" en="TEAM STORIES" sub="记录那些认真做事的人"}
每一份用心，都值得被看见
:::
```

### `t-checklist` 心愿清单勾选

标签：教程、教育、简约 · 参数：`no`（如 `01`）、`sub`（如 `今天的小目标：认真吃饭，好好睡觉`）

```markdown
:::t-checklist{no="01" sub="今天的小目标：认真吃饭，好好睡觉"}
把照顾自己，写进计划里
:::
```

### `title-numbered` 序号居中标题

标签：简约、通用、编号 · 参数：`no`（如 `01`）、`sub`（如 `SIMPLE TITLE`）

```markdown
:::title-numbered{no="01" sub="SIMPLE TITLE"}
简单通用标题
:::
```

### `title-leftbar` 左竖条标题

标签：简约、商务、通用 · 参数：`sub`（如 `SUBTITLE`）

```markdown
:::title-leftbar{sub="SUBTITLE"}
左侧竖条标题
:::
```

### `title-pill` 胶囊标题

标签：可爱、清新、通用

```markdown
:::title-pill
胶囊底色标题
:::
```

### `title-highlight` 马克笔标题

标签：简约、文艺、通用

```markdown
:::title-highlight
马克笔高亮标题
:::
```

### `title-part` PART 章节标题

标签：简约、商务、科技、编号 · 参数：`no`（如 `01`）

```markdown
:::title-part{no="01"}
简约而不简单
:::
```

### `title-badge` 方块序号标题

标签：商务、科技、编号 · 参数：`no`（如 `1`）

```markdown
:::title-badge{no="1"}
攻坚核心技术，突破发展壁垒
:::
```

### `title-brackets` 书名号标题

标签：古风、文艺

```markdown
:::title-brackets
心随秋静，守岁月安然
:::
```

### `title-lines` 渐变双线标题

标签：简约、清新、通用

```markdown
:::title-lines
专注本身，褪去冗余
:::
```

### `title-chapter` 圆环章节标题

标签：文艺、古风、编号 · 参数：`no`（如 `第一章`）、`sub`（如 `CHAPTER ONE`）

```markdown
:::title-chapter{no="第一章" sub="CHAPTER ONE"}
初见
:::
```

### `title-shadow` 错位投影标题

标签：潮流、色彩

```markdown
:::title-shadow
错位投影标题
:::
```

### `title-bgword` 英文衬底标题

标签：简约、商务、科技 · 参数：`en`（如 `INNOVATION`）

```markdown
:::title-bgword{en="INNOVATION"}
创新破局 科技致远
:::
```

### `title-spring` 春节红金标题

标签：节日、春节、喜庆、红色

```markdown
:::title-spring
新春快乐 万事如意
:::
```

### `title-moon` 中秋明月标题

标签：节日、中秋、古风

```markdown
:::title-moon
但愿人长久
:::
```

### `fest-new-year` 元旦 · 翻开新历

标签：节日、元旦、简约 · 参数：`sub`（如 `新的一页，写给热爱的生活`）

```markdown
:::fest-new-year{sub="新的一页，写给热爱的生活"}
把第一缕光，写进新年
:::
```

### `fest-spring-couplet` 春节 · 春联横批

标签：节日、春节、古风 · 参数：`left`（如 `春来万物生`）、`right`（如 `岁暖千家福`）、`sub`（如 `灯火可亲，归家有期`）

```markdown
:::fest-spring-couplet{left="春来万物生" right="岁暖千家福" sub="灯火可亲，归家有期"}
人间好时节
:::
```

### `fest-lantern` 元宵 · 灯火团圆

标签：节日、元宵、古风 · 参数：`sub`（如 `一碗汤圆，盛满人间的圆满`）

```markdown
:::fest-lantern{sub="一碗汤圆，盛满人间的圆满"}
灯火映万家，今宵共团圆
:::
```

### `fest-womens-day` 妇女节 · 自在盛放

标签：节日、妇女节、文艺 · 参数：`sub`（如 `不被定义，自有光芒`）

```markdown
:::fest-womens-day{sub="不被定义，自有光芒"}
她的每一种选择，都值得盛放
:::
```

### `fest-childrens-day` 儿童节 · 云端气球

标签：节日、儿童节、可爱、色彩 · 参数：`sub`（如 `愿好奇心永远有一片自由的天空`）

```markdown
:::fest-childrens-day{sub="愿好奇心永远有一片自由的天空"}
把快乐，放飞到云朵上
:::
```

### `fest-national-day` 国庆 · 山河华章

标签：节日、国庆、企业 · 参数：`sub`（如 `山河锦绣，万家同庆`）

```markdown
:::fest-national-day{sub="山河锦绣，万家同庆"}
把心中的热爱，写给中国
:::
```

## 正文（body）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `b-tape-note` | 胶带手记 | 清新、文艺、可爱 | `label` |
| `b-folded-card` | 折角收藏卡 | 简约、文艺、通用 | `label` |
| `b-ticket-stub` | 周末入场票根 | 怀旧、旅游、文艺 | `label` `serial` `note` |
| `b-stat-ledger` | 大字数据账本 | 商务、企业、科技 | `title` |
| `b-checklist` | 今日完成清单 | 简约、教程、教育 | `title` |
| `b-pros-cons` | 两面观察对比 | 简约、教程、商务 | `pros` `cons` |
| `b-step-cards` | 行动步骤卡组 | 教程、编号、教育 | `title` |
| `b-centered-quote` | 留白金句 | 文艺、引用、简约 | `author` |
| `b-magazine-dropcap` | 杂志开篇首字 | 文艺、简约、通用 | `label` |
| `b-vertical-poem` | 竖笺诗词 | 古风、文艺 | `title` `author` `seal` |
| `b-gradient-frame` | 流光渐变描边 | 色彩、科技、清新 | `label` |
| `b-offset-stack` | 叠页档案卡 | 怀旧、文艺、编号 | `no` `label` |
| `b-sidebar-label` | 侧签重点批注 | 商务、简约、教程 | `label` `sub` |
| `b-personal-letter` | 寄给你的短信 | 文艺、怀旧、对话 | `to` `from` `date` |
| `b-marker-paragraph` | 荧光阅读划线 | 简约、教育、通用 | `label` |
| `b-info-summary` | 一页信息摘要 | 简约、商务、通用 | `label` |
| `b-price-offer` | 好物专享价签 | 电商、色彩、简约 | `price` `original` `unit` `badge` `note` |
| `b-author-bio` | 作者小名片 | 文艺、简约、通用 | `name` `role` |
| `card-border` | 浅色边框卡片 | 简约、通用 | — |
| `card-topbar` | 顶部色条卡片 | 商务、科技、通用 | `title` |
| `quote-big` | 大引号引用 | 文艺、引用、通用 | `author` |
| `note-tip` | 提示框 | 通用、科技、教程 | `label` `icon` |
| `card-dashed` | 虚线框重点 | 简约、教程 | — |
| `card-paper` | 信纸横线 | 文艺、怀旧、清新 | — |
| `card-gradient` | 渐变顶条卡片 | 清新、色彩、通用 | `title` |
| `timeline` | 时间轴 | 商务、企业、通用 | — |
| `fest-spring-fu` | 春节 · 福满家书 | 节日、春节、古风 | `title` |
| `fest-valentine` | 情人节 · 心动邮笺 | 节日、情人节、文艺 | `to` `sign` |
| `fest-qingming` | 清明 · 青山寄思 | 节日、清明、古风 | `title` |
| `fest-labor` | 劳动节 · 致敬每一双手 | 节日、劳动节、企业 | `title` `sub` |
| `fest-dragon-boat` | 端午 · 粽叶裹安康 | 节日、端午、古风 | `title` |
| `fest-qixi` | 七夕 · 鹊桥星河 | 节日、七夕、文艺 | `title` `sub` |
| `fest-mid-autumn-moon` | 中秋 · 月下团圆笺 | 节日、中秋、古风 | `title` `sub` |
| `fest-teachers-day` | 教师节 · 一页师恩 | 节日、教师节、教育 | `title` `sign` |
| `fest-double-ninth` | 重阳 · 菊香登高 | 节日、重阳、古风 | `title` |
| `fest-double-eleven` | 双十一 · 好物心愿票 | 节日、双十一、电商、潮流 | `title` `offer` `note` |
| `fest-christmas` | 圣诞 · 冬日雪松 | 节日、圣诞、清新 | `title` `sub` |

### `b-tape-note` 胶带手记

标签：清新、文艺、可爱 · 参数：`label`（如 `给周末留白`）

```markdown
:::b-tape-note{label="给周末留白"}
把手机调成静音，去附近的花店走走。

不必安排满满当当，**发呆也是一件正经事**。
:::
```

### `b-folded-card` 折角收藏卡

标签：简约、文艺、通用 · 参数：`label`（如 `值得收藏`）

```markdown
:::b-folded-card{label="值得收藏"}
慢慢建立自己的生活秩序：读几页书，做一顿饭，把重要的人放在心上。

那些不起眼的小事，最终会组成你喜欢的日子。
:::
```

### `b-ticket-stub` 周末入场票根

标签：怀旧、旅游、文艺 · 参数：`label`（如 `生活入场券`）、`serial`（如 `NO. 0618`）、`note`（如 `凭好心情入场`）

```markdown
:::b-ticket-stub{label="生活入场券" serial="NO. 0618" note="凭好心情入场"}
一场不用赶路的旅行
沿着河岸散步，在老街买一杯热茶。

目的地不必很远，能听见自己的心就好。
:::
```

### `b-stat-ledger` 大字数据账本

标签：商务、企业、科技 · 参数：`title`（如 `把改变写成数字`）

```markdown
:::b-stat-ledger{title="把改变写成数字"}
98%：试读者完成了本期阅读计划
3 倍：共读小组的月均交流次数增长
21 天：从第一本书开始，养成阅读习惯
:::
```

### `b-checklist` 今日完成清单

标签：简约、教程、教育 · 参数：`title`（如 `出发前，检查这三件事`）

```markdown
:::b-checklist{title="出发前，检查这三件事"}
带上水杯，把轻装出行留给自己
确认车次与集合地点，提前十分钟到达
下载离线地图，为山里的弱信号留个后手
:::
```

### `b-pros-cons` 两面观察对比

标签：简约、教程、商务 · 参数：`pros`（如 `值得选择`）、`cons`（如 `需要考虑`）

```markdown
:::b-pros-cons{pros="值得选择" cons="需要考虑"}
轻便易携带，适合每天通勤
纸张平整，钢笔书写也不易洇墨

内页不可替换，需要整本归档
封面较软，建议搭配保护套使用
:::
```

### `b-step-cards` 行动步骤卡组

标签：教程、编号、教育 · 参数：`title`（如 `三步整理阅读笔记`）

```markdown
:::b-step-cards{title="三步整理阅读笔记"}
先写下最触动你的那句话，不急着摘录整页。
用自己的话解释它，再补上一个生活中的例子。
把笔记放回主题目录，让下次的自己更容易找到。
:::
```

### `b-centered-quote` 留白金句

标签：文艺、引用、简约 · 参数：`author`（如 `林间手记`）

```markdown
:::b-centered-quote{author="林间手记"}
把日子过慢一点，
让喜欢的事物有时间发生。
:::
```

### `b-magazine-dropcap` 杂志开篇首字

标签：文艺、简约、通用 · 参数：`label`（如 `城市慢读 · 卷首`）

```markdown
:::b-magazine-dropcap{label="城市慢读 · 卷首"}
**晨光**沿着窗沿缓缓移动，街角的面包店刚刚开门。我们沿河走了一小段路，才发现这座熟悉的城市，仍藏着许多未曾留意的风景。

有时候，重新认识生活，只需要比平时走慢一点。
:::
```

### `b-vertical-poem` 竖笺诗词

标签：古风、文艺 · 参数：`title`（如 `山居小记`）、`author`（如 `山月`）、`seal`（如 `闲`）

```markdown
:::b-vertical-poem{title="山居小记" author="山月" seal="闲"}
竹影轻摇窗下月
茶烟微拢案头书
半山风过无人语
一盏清欢便是家
:::
```

### `b-gradient-frame` 流光渐变描边

标签：色彩、科技、清新 · 参数：`label`（如 `灵感正在发生`）

```markdown
:::b-gradient-frame{label="灵感正在发生"}
好点子往往来自一次偶然的停顿。为尚未成形的想法留一点空间，让它慢慢长成自己的模样。

今天，先把那个念头写下来。
:::
```

### `b-offset-stack` 叠页档案卡

标签：怀旧、文艺、编号 · 参数：`no`（如 `07`）、`label`（如 `散步档案`）

```markdown
:::b-offset-stack{no="07" label="散步档案"}
今天的发现
老街尽头多了一家二手书店，老板把新到的诗集摆在窗边。

离开时买了一张明信片，准备寄给很久没见的朋友。
:::
```

### `b-sidebar-label` 侧签重点批注

标签：商务、简约、教程 · 参数：`label`（如 `编辑观察`）、`sub`（如 `关于长期主义`）

```markdown
:::b-sidebar-label{label="编辑观察" sub="关于长期主义"}
持续记录，比一次写得完美更重要。

把目标拆成每天能做的一件小事，进步才会从口号变成日常。
:::
```

### `b-personal-letter` 寄给你的短信

标签：文艺、怀旧、对话 · 参数：`to`（如 `亲爱的老朋友`）、`from`（如 `阿禾`）、`date`（如 `十月的一个傍晚`）

```markdown
:::b-personal-letter{to="亲爱的老朋友" from="阿禾" date="十月的一个傍晚"}
最近好吗？路过我们常去的咖啡馆，发现门口的桂花又开了。

等你有空，我们再坐一下午。不赶时间，也不急着说再见。
:::
```

### `b-marker-paragraph` 荧光阅读划线

标签：简约、教育、通用 · 参数：`label`（如 `这段话，记下来`）

```markdown
:::b-marker-paragraph{label="这段话，记下来"}
不必等到准备万全才开始。每一次认真尝试，都在为下一次积攒勇气。

把注意力放在今天能完成的小事上，你就已经走在路上了。
:::
```

### `b-info-summary` 一页信息摘要

标签：简约、商务、通用 · 参数：`label`（如 `活动速览`）

```markdown
:::b-info-summary{label="活动速览"}
周六的湖边读书会
时间：周六 14:00—16:00
地点：湖畔书屋 · 二楼露台
携带：一本最近在读的书，以及想分享的一句话
报名：在本文留言区写下「一起读书」
:::
```

### `b-price-offer` 好物专享价签

标签：电商、色彩、简约 · 参数：`price`（如 `69`）、`original`（如 `89`）、`unit`（如 `元 / 本`）、`badge`（如 `读者专享`）、`note`（如 `优惠至本周日，数量有限`）

```markdown
:::b-price-offer{price="69" original="89" unit="元 / 本" badge="读者专享" note="优惠至本周日，数量有限"}
把四季装进口袋
轻巧随身的周计划手账，附赠四枚季节书签。

从这一页开始，记录属于自己的日常。
:::
```

### `b-author-bio` 作者小名片

标签：文艺、简约、通用 · 参数：`name`（如 `阿禾`）、`role`（如 `城市漫游者 · 生活记录者`）

```markdown
:::b-author-bio{name="阿禾" role="城市漫游者 · 生活记录者"}
![阿禾的头像](https://picsum.photos/seed/b-author-bio-ahe/800/500)
在街巷里寻找故事，在一餐一饭里收集灵感。

写作，也散步。愿每次见面，都能带给你一点生活的亮光。
:::
```

### `card-border` 浅色边框卡片

标签：简约、通用

```markdown
:::card-border
简约是一种生活态度，也是一种设计智慧。通过精简元素、优化结构，让每一个细节都拥有存在的意义。
:::
```

### `card-topbar` 顶部色条卡片

标签：商务、科技、通用 · 参数：`title`（如 `核心观点`）

```markdown
:::card-topbar{title="核心观点"}
品质是企业的立身之本，诚信是长远发展的核心底气。
:::
```

### `quote-big` 大引号引用

标签：文艺、引用、通用 · 参数：`author`（如 `佚名`）

```markdown
:::quote-big{author="佚名"}
当我们学会为一片落叶驻足，为一缕阳光感动，心灵便能在简单日常中，获得真正的富足与自由。
:::
```

### `note-tip` 提示框

标签：通用、科技、教程 · 参数：`label`（如 `小贴士`）、`icon`（如 `💡`）

```markdown
:::note-tip{label="小贴士" icon="💡"}
随意连接公共免费 WiFi、弱密码长期不更换，都是网络安全的漏洞。
:::
```

### `card-dashed` 虚线框重点

标签：简约、教程

```markdown
:::card-dashed
**划重点**：不用过度恐慌，但需时刻警惕，主动学习网络安全知识。
:::
```

### `card-paper` 信纸横线

标签：文艺、怀旧、清新

```markdown
:::card-paper
展信佳。
秋天从不是落幕的萧瑟，而是一场松弛的治愈。
:::
```

### `card-gradient` 渐变顶条卡片

标签：清新、色彩、通用 · 参数：`title`（如 `写在前面`）

```markdown
:::card-gradient{title="写在前面"}
温柔的秋风漫遍人间，我们捡拾散落的秋光，收藏日常的温柔。
:::
```

### `timeline` 时间轴

标签：商务、企业、通用

```markdown
:::timeline
2024：品牌创立，完成天使轮融资
2025：用户突破 100 万
2026：发布全新 2.0 版本
:::
```

### `fest-spring-fu` 春节 · 福满家书

标签：节日、春节、古风 · 参数：`title`（如 `把福气，带回家`）

```markdown
:::fest-spring-fu{title="把福气，带回家"}
年味是灶台上的热气，也是门口那一声等了许久的「回来啦」。

愿新岁三餐有暖，四季有伴，所念之人都在身旁。
:::
```

### `fest-valentine` 情人节 · 心动邮笺

标签：节日、情人节、文艺 · 参数：`to`（如 `致最特别的你`）、`sign`（如 `爱在每一个平凡日子`）

```markdown
:::fest-valentine{to="致最特别的你" sign="爱在每一个平凡日子"}
喜欢是与你分享一朵云、一杯热茶，以及生活里每一件不起眼的小事。

愿往后的晨昏，都能和你慢慢走。
:::
```

### `fest-qingming` 清明 · 青山寄思

标签：节日、清明、古风 · 参数：`title`（如 `风过青山，念念清明`）

```markdown
:::fest-qingming{title="风过青山，念念清明"}
细雨落在新绿的枝头，思念也有了温柔的回声。

把牵挂寄给春风，把日子过得清明。那些被爱照亮的时光，始终在心里生长。
:::
```

### `fest-labor` 劳动节 · 致敬每一双手

标签：节日、劳动节、企业 · 参数：`title`（如 `把平凡，做成不凡`）、`sub`（如 `致敬每一位认真生活的劳动者`）

```markdown
:::fest-labor{title="把平凡，做成不凡" sub="致敬每一位认真生活的劳动者"}
从清晨的第一班车，到深夜仍亮着的窗口，每一份默默付出，都让城市向前一步。

谢谢你，用双手把日子建成了更好的模样。
:::
```

### `fest-dragon-boat` 端午 · 粽叶裹安康

标签：节日、端午、古风 · 参数：`title`（如 `一叶一粽，都是牵挂`）

```markdown
:::fest-dragon-boat{title="一叶一粽，都是牵挂"}
粽叶裹住糯米，也裹住了家里的好时光。艾草清香过门，牵挂便有了熟悉的味道。

愿你端午安康，顺遂如常。
:::
```

### `fest-qixi` 七夕 · 鹊桥星河

标签：节日、七夕、文艺 · 参数：`title`（如 `星河有渡，相逢有期`）、`sub`（如 `迢迢银河，藏着一句想你`）

```markdown
:::fest-qixi{title="星河有渡，相逢有期" sub="迢迢银河，藏着一句想你"}
越过日常的忙碌，仍想把今晚最亮的一颗星指给你看。

人间烟火很长，幸好身旁是你。
:::
```

### `fest-mid-autumn-moon` 中秋 · 月下团圆笺

标签：节日、中秋、古风 · 参数：`title`（如 `今夜，月与人团圆`）、`sub`（如 `一轮明月，照见万家牵挂`）

```markdown
:::fest-mid-autumn-moon{title="今夜，月与人团圆" sub="一轮明月，照见万家牵挂"}
桂香落进茶盏，月光铺满庭院。走过再远的路，总有一盏灯为你留着。

愿此刻的圆满，也照亮往后的每一天。
:::
```

### `fest-teachers-day` 教师节 · 一页师恩

标签：节日、教师节、教育 · 参数：`title`（如 `您教过的，后来都成了光`）、`sign`（如 `九月十日 · 致敬师者`）

```markdown
:::fest-teachers-day{title="您教过的，后来都成了光" sign="九月十日 · 致敬师者"}
曾以为您讲的是一道题，后来才懂，那也是面对世界的方法。

感谢每一次耐心的等待，让懵懂的我们，慢慢长成自己的答案。
:::
```

### `fest-double-ninth` 重阳 · 菊香登高

标签：节日、重阳、古风 · 参数：`title`（如 `岁岁重阳，久久相伴`）

```markdown
:::fest-double-ninth{title="岁岁重阳，久久相伴"}
陪您再走一段山路，听您再讲一遍往事。菊花开得正好，今天的风也不急。

愿岁月慢一点，让陪伴长一点。
:::
```

### `fest-double-eleven` 双十一 · 好物心愿票

标签：节日、双十一、电商、潮流 · 参数：`title`（如 `心愿清单，今天兑现`）、`offer`（如 `每满300减50`）、`note`（如 `11月11日 00:00—23:59 · 指定商品参与`）

```markdown
:::fest-double-eleven{title="心愿清单，今天兑现" offer="每满300减50" note="11月11日 00:00—23:59 · 指定商品参与"}
给书桌添一盏暖灯，给冬天备一条软围巾。把预算留给真正喜欢、也真正需要的好物。

**慢慢挑，认真选，让每一份喜欢都物有所值。**
:::
```

### `fest-christmas` 圣诞 · 冬日雪松

标签：节日、圣诞、清新 · 参数：`title`（如 `愿你的冬天，有光有暖`）、`sub`（如 `MERRY CHRISTMAS`）

```markdown
:::fest-christmas{title="愿你的冬天，有光有暖" sub="MERRY CHRISTMAS"}
把小小的心愿挂上树梢，把热可可捧在手心。窗外有雪，心里有惦念的人。

愿每一份善意，都在这个冬天收到温柔的回音。
:::
```

## 问答（qa）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `qx-avatar-interview` | 双人头像访谈 | 对话、文艺、通用 | `ask` `reply` `asker` `guest` |
| `qx-knowledge-card` | 字母衬底知识卡 | 教育、科技、简约 | `label` |
| `qx-expanded-answer` | 展开式问题条 | 简约、教程、通用 | `label` |
| `qx-faq-list` | 多组编号 FAQ | 编号、教程、通用 | `title` |
| `qx-choice-quiz` | 随堂四选一 | 教育、校园、教程 | `no` `answer` `explain` |
| `qx-true-false` | 对错判断实验室 | 教育、教程、简约 | `answer` |
| `qa-classic` | Q/A 圆标问答 | 通用、简约 | — |
| `qa-chat` | 聊天气泡问答 | 可爱、清新、对话 | — |
| `qa-card` | 卡片问答 | 商务、科技 | — |
| `qa-interview` | 访谈问答 | 访谈、文艺 | — |
| `qa-faq` | FAQ 序号问答 | 教程、编号 | `no` |

### `qx-avatar-interview` 双人头像访谈

标签：对话、文艺、通用 · 参数：`ask`（如 `编`）、`reply`（如 `林`）、`asker`（如 `编辑`）、`guest`（如 `林小满 · 花店主理人`）

```markdown
:::qx-avatar-interview{ask="编" reply="林" asker="编辑" guest="林小满 · 花店主理人"}
Q: 为什么想在小街上开一家花店？
A: 想给匆忙的人留一个停顿。哪怕只是进来闻一闻花香，也算给今天放了一个小假。
:::
```

### `qx-knowledge-card` 字母衬底知识卡

标签：教育、科技、简约 · 参数：`label`（如 `一分钟知识`）

```markdown
:::qx-knowledge-card{label="一分钟知识"}
Q: 为什么树荫下会出现圆形光斑？
A: 叶片间的小孔就像天然的小孔成像装置，把太阳的形状投到地面上。下次散步时，试着找一找这些微小的太阳。
:::
```

### `qx-expanded-answer` 展开式问题条

标签：简约、教程、通用 · 参数：`label`（如 `使用指南`）

```markdown
:::qx-expanded-answer{label="使用指南"}
Q: 如何把一篇长文排得更好读？
A: 先按内容转折拆分章节，每段只讲一个重点。再留出段间空白，让小标题像路标一样，引导读者轻松往下读。
:::
```

### `qx-faq-list` 多组编号 FAQ

标签：编号、教程、通用 · 参数：`title`（如 `出发前，你可能想问`）

```markdown
:::qx-faq-list{title="出发前，你可能想问"}
Q: 城市漫步需要提前预约吗？
A: 本次路线为自由步行，无需预约，选一个晴朗的周末即可出发。

Q: 建议预留多长时间？
A: 约两小时。给沿途的小店和风景留一点停下来的时间。

Q: 下雨天可以去吗？
A: 可以把路线缩短为书店与展馆两站，带伞慢行，也有另一番趣味。
:::
```

### `qx-choice-quiz` 随堂四选一

标签：教育、校园、教程 · 参数：`no`（如 `01`）、`answer`（如 `B`）、`explain`（如 `先明确想表达什么，再决定如何呈现，能让每一张图片都服务于内容。`）

```markdown
:::qx-choice-quiz{no="01" answer="B" explain="先明确想表达什么，再决定如何呈现，能让每一张图片都服务于内容。"}
制作一篇图文推送，最适合先做哪一步？
A: 给所有图片加滤镜
B: 明确主题与阅读顺序
C: 选尽可能多的字体
D: 把每句话都加粗
:::
```

### `qx-true-false` 对错判断实验室

标签：教育、教程、简约 · 参数：`answer`（如 `false`）

```markdown
:::qx-true-false{answer="false"}
Q: 排版时，强调的文字越多，重点就越清楚。
A: 强调需要有取舍。只突出关键词，并通过留白与层级建立节奏，读者才更容易找到真正的重点。
:::
```

### `qa-classic` Q/A 圆标问答

标签：通用、简约

```markdown
:::qa-classic
公众号为什么不能直接贴外链？

公众号正文只允许跳转到公众号文章，本编辑器会自动把外链转成文末的「参考链接」。
:::
```

### `qa-chat` 聊天气泡问答

标签：可爱、清新、对话

```markdown
:::qa-chat
公众号为什么不能直接贴外链？

公众号正文只允许跳转到公众号文章，本编辑器会自动把外链转成文末的「参考链接」。
:::
```

### `qa-card` 卡片问答

标签：商务、科技

```markdown
:::qa-card
公众号为什么不能直接贴外链？

公众号正文只允许跳转到公众号文章，本编辑器会自动把外链转成文末的「参考链接」。
:::
```

### `qa-interview` 访谈问答

标签：访谈、文艺

```markdown
:::qa-interview
问：公众号为什么不能直接贴外链？

答：公众号正文只允许跳转到公众号文章，本编辑器会自动把外链转成文末的「参考链接」。
:::
```

### `qa-faq` FAQ 序号问答

标签：教程、编号 · 参数：`no`（如 `01`）

```markdown
:::qa-faq{no="01"}
公众号为什么不能直接贴外链？

公众号正文只允许跳转到公众号文章，本编辑器会自动把外链转成文末的「参考链接」。
:::
```

## 图文（imagetext）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `it-magazine-cover` | 留白杂志封面 | 文艺、旅游、潮流 | `issue` `label` |
| `it-trio-collage` | 一日三景拼贴 | 清新、旅游、文艺 | `label` |
| `it-numbered-caption` | 编号观察札记 | 编号、教程、简约 | `no` `label` |
| `it-portrait-quote` | 圆像人物引言 | 文艺、引用、对话 | `author` `role` |
| `it-date-journal` | 日历角标图记 | 清新、旅游、文艺 | `day` `month` |
| `it-side-story` | 右图城市侧记 | 简约、旅游、美食 | `label` `foot` |
| `it-gallery-frame` | 双线艺廊画框 | 文艺、简约、怀旧 | `label` |
| `it-album-duo` | 图集双页序章 | 文艺、旅游、简约 | `no` `label` |
| `img-card` | 图片说明卡片 | 通用、简约 | — |
| `img-side` | 左图右文 | 商务、电商、通用 | `title` |
| `img-polaroid` | 拍立得相框 | 文艺、清新、旅游 | — |
| `img-offset` | 错位色块图 | 潮流、色彩 | — |
| `img-double` | 双图并排 | 通用、多图 | — |

### `it-magazine-cover` 留白杂志封面

标签：文艺、旅游、潮流 · 参数：`issue`（如 `VOL. 07`）、`label`（如 `慢游手记`）

```markdown
:::it-magazine-cover{issue="VOL. 07" label="慢游手记"}
![山间晨雾与远处的村落](https://picsum.photos/seed/it-magazine-morning/800/500)
把周末，交给山野
沿着溪流走进村庄，让风声代替闹钟，收集一个不用赶路的清晨。
:::
```

### `it-trio-collage` 一日三景拼贴

标签：清新、旅游、文艺 · 参数：`label`（如 `WEEKEND WALK`）

```markdown
:::it-trio-collage{label="WEEKEND WALK"}
![树影下的街角](https://picsum.photos/seed/it-trio-street/800/500)
![转角花店](https://picsum.photos/seed/it-trio-flower/800/500)
![午后的窗边](https://picsum.photos/seed/it-trio-window/800/500)
一条小街，三次心动
从花店走到咖啡馆，最好的路线，是允许自己随时停下。
:::
```

### `it-numbered-caption` 编号观察札记

标签：编号、教程、简约 · 参数：`no`（如 `03`）、`label`（如 `光线观察`）

```markdown
:::it-numbered-caption{no="03" label="光线观察"}
![窗前的一束自然光](https://picsum.photos/seed/it-numbered-light/800/500)
让光，成为画面的主角
将主体放在窗边，关掉顶灯。柔和的侧光能保留纹理，也让日常物件有了故事。
:::
```

### `it-portrait-quote` 圆像人物引言

标签：文艺、引用、对话 · 参数：`author`（如 `林小满`）、`role`（如 `植物观察者`）

```markdown
:::it-portrait-quote{author="林小满" role="植物观察者"}
![林小满的日常肖像](https://picsum.photos/seed/it-portrait-lin/800/500)
照顾一盆植物，也是练习照顾自己的生活。慢一点，才听得见新叶舒展的声音。
:::
```

### `it-date-journal` 日历角标图记

标签：清新、旅游、文艺 · 参数：`day`（如 `16`）、`month`（如 `十月 · OCT`）

```markdown
:::it-date-journal{day="16" month="十月 · OCT"}
![公园里渐黄的树叶](https://picsum.photos/seed/it-journal-october/800/500)
今天，去公园读一会儿书
带一本薄书，找一张长椅。读累了就抬头，树叶正替秋天写下一封长信。
:::
```

### `it-side-story` 右图城市侧记

标签：简约、旅游、美食 · 参数：`label`（如 `街角发现`）、`foot`（如 `步行十分钟的快乐`）

```markdown
:::it-side-story{label="街角发现" foot="步行十分钟的快乐"}
![街角面包店的橱窗](https://picsum.photos/seed/it-side-bakery/800/500)
刚出炉的早晨
推开街角的木门，麦香和阳光一起涌来。买一只可颂，把今天过得蓬松一点。
:::
```

### `it-gallery-frame` 双线艺廊画框

标签：文艺、简约、怀旧 · 参数：`label`（如 `日常收藏 · 008`）

```markdown
:::it-gallery-frame{label="日常收藏 · 008"}
![窗外光影映在白墙上](https://picsum.photos/seed/it-frame-shadow/800/500)
光在墙上，画了一扇窗
午后三点，一场只展出二十分钟的光影展。
:::
```

### `it-album-duo` 图集双页序章

标签：文艺、旅游、简约 · 参数：`no`（如 `02`）、`label`（如 `城市漫游图集`）

```markdown
:::it-album-duo{no="02" label="城市漫游图集"}
![河岸的清晨](https://picsum.photos/seed/it-album-river/800/500)
![夜幕里的桥](https://picsum.photos/seed/it-album-bridge/800/500)
沿河而行，遇见城市的两面
一面是晨风，一面是灯火；同一条河，藏着不同的温柔。
:::
```

### `img-card` 图片说明卡片

标签：通用、简约

```markdown
:::img-card
![](https://picsum.photos/seed/wxmd-a/800/500)
别致的设计，赋予这款产品无可比拟的美感，每一个细节都彰显出精致与品质。
:::
```

### `img-side` 左图右文

标签：商务、电商、通用 · 参数：`title`（如 `产品亮点`）

```markdown
:::img-side{title="产品亮点"}
![](https://picsum.photos/seed/wxmd-b/800/500)
依托前沿算法，兼顾性能与便捷，高效响应多元需求。
:::
```

### `img-polaroid` 拍立得相框

标签：文艺、清新、旅游

```markdown
:::img-polaroid
![](https://picsum.photos/seed/wxmd-c/800/500)
邂逅秋光，留存温柔
:::
```

### `img-offset` 错位色块图

标签：潮流、色彩

```markdown
:::img-offset
![](https://picsum.photos/seed/wxmd-d/800/500)
:::
```

### `img-double` 双图并排

标签：通用、多图

```markdown
:::img-double
![](https://picsum.photos/seed/wxmd-e/800/500)
![](https://picsum.photos/seed/wxmd-f/800/500)
左：清晨的街道 · 右：午后的咖啡
:::
```

## 分割（divider）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `d-wave-path` | 潮汐波浪线 | 清新、旅游、文艺 | — |
| `d-scissor-dash` | 剪一段时光 | 怀旧、文艺、通用 | — |
| `d-flower-center` | 花开一隙 | 清新、少女、文艺 | — |
| `d-dot-chain` | 光谱圆点链 | 色彩、简约、通用 | — |
| `d-diagonal-stripe` | 双色斜纹纸边 | 潮流、色彩、校园 | — |
| `d-bookmark-tab` | 页间书签 | 文艺、教育、简约 | `label` |
| `d-continue-reading` | 继续阅读页标 | 简约、商务、文艺 | — |
| `d-star-constellation` | 星轨连线 | 可爱、科技、清新 | — |
| `divider-dots` | 三点分割 | 简约、通用 | — |
| `divider-diamond` | 菱形分割 | 简约、商务 | — |
| `divider-gradient` | 渐隐细线 | 简约、清新 | — |
| `divider-text` | 文字分割线 | 简约、通用 | `text` |
| `divider-stars` | 星星分割 | 可爱、清新 | — |
| `divider-double` | 粗细双线 | 商务、怀旧 | — |
| `divider-bars` | 渐变色块 | 色彩、潮流 | — |
| `fest-mid-autumn-cake` | 中秋 · 月饼花纹分割线 | 节日、中秋、美食 | — |

### `d-wave-path` 潮汐波浪线

标签：清新、旅游、文艺

```markdown
:::d-wave-path
把脚步放慢，听海风经过
:::
```

### `d-scissor-dash` 剪一段时光

标签：怀旧、文艺、通用

```markdown
:::d-scissor-dash
剪下这一刻，留给以后的自己
:::
```

### `d-flower-center` 花开一隙

标签：清新、少女、文艺

```markdown
:::d-flower-center
日子缓缓，花也慢慢开
:::
```

### `d-dot-chain` 光谱圆点链

标签：色彩、简约、通用

```markdown
:::d-dot-chain
让灵感一颗一颗亮起来
:::
```

### `d-diagonal-stripe` 双色斜纹纸边

标签：潮流、色彩、校园

```markdown
:::d-diagonal-stripe
下一站，去发现生活的新鲜感
:::
```

### `d-bookmark-tab` 页间书签

标签：文艺、教育、简约 · 参数：`label`（如 `读到这里`）

```markdown
:::d-bookmark-tab{label="读到这里"}
合上这一页，把答案留给下一章
:::
```

### `d-continue-reading` 继续阅读页标

标签：简约、商务、文艺

```markdown
:::d-continue-reading
故事还在继续
:::
```

### `d-star-constellation` 星轨连线

标签：可爱、科技、清新

```markdown
:::d-star-constellation
微小的光，也能连成星河
:::
```

### `divider-dots` 三点分割

标签：简约、通用

```markdown
:::divider-dots
:::
```

### `divider-diamond` 菱形分割

标签：简约、商务

```markdown
:::divider-diamond
:::
```

### `divider-gradient` 渐隐细线

标签：简约、清新

```markdown
:::divider-gradient
:::
```

### `divider-text` 文字分割线

标签：简约、通用 · 参数：`text`（如 `未完待续`）

```markdown
:::divider-text{text="未完待续"}
:::
```

### `divider-stars` 星星分割

标签：可爱、清新

```markdown
:::divider-stars
:::
```

### `divider-double` 粗细双线

标签：商务、怀旧

```markdown
:::divider-double
:::
```

### `divider-bars` 渐变色块

标签：色彩、潮流

```markdown
:::divider-bars
:::
```

### `fest-mid-autumn-cake` 中秋 · 月饼花纹分割线

标签：节日、中秋、美食

```markdown
:::fest-mid-autumn-cake
一口月饼，一份团圆
:::
```

## 引导（guide）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `g-follow-capsule` | 遇见你关注胶囊 | 通用、清新、简约 | `avatar` `name` |
| `g-original-note` | 阅读原文票签 | 通用、教程、简约 | `label` |
| `g-qr-station` | 扫码关注小站 | 清新、通用、文艺 | `qr` `label` |
| `g-star-three-steps` | 星标三步小教程 | 教程、通用、编号 | `title` |
| `g-comment-invitation` | 留言交换心事 | 对话、文艺、通用 | `label` |
| `g-topic-ballot` | 今日话题投票签 | 对话、校园、通用 | `topic` `hint` |
| `g-reading-cards` | 延伸阅读卡片集 | 文艺、通用、编号 | `title` |
| `follow-top` | 顶部关注引导 | 通用、引导 | `name` |
| `follow-card` | 关注我们卡片 | 通用、引导、企业 | `qr` |
| `guide-actions` | 分享点赞在看 | 通用、引导、结尾 | — |
| `read-more` | 往期推荐 | 通用、引导 | `title` |
| `scroll-down` | 向下滑动提示 | 简约、引导 | — |
| `contact-card` | 联系方式 | 企业、商务 | `title` |

### `g-follow-capsule` 遇见你关注胶囊

标签：通用、清新、简约 · 参数：`avatar`（如 `慢`）、`name`（如 `慢慢生活研究所`）

```markdown
:::g-follow-capsule{avatar="慢" name="慢慢生活研究所"}
点击文章顶部名称，关注每一种小美好
:::
```

### `g-original-note` 阅读原文票签

标签：通用、教程、简约 · 参数：`label`（如 `阅读原文`）

```markdown
:::g-original-note{label="阅读原文"}
周末散步地图已备好
点击文章底部「阅读原文」，收藏这份城市漫游路线。
:::
```

### `g-qr-station` 扫码关注小站

标签：清新、通用、文艺 · 参数：`qr`（如 ``）、`label`（如 `长按识别二维码`）

```markdown
:::g-qr-station{qr="" label="长按识别二维码"}
在这里，遇见同频的你
每周一封生活来信，陪你把平凡日子过成喜欢的样子。
:::
```

### `g-star-three-steps` 星标三步小教程

标签：教程、通用、编号 · 参数：`title`（如 `把我们放进你的星标里`）

```markdown
:::g-star-three-steps{title="把我们放进你的星标里"}
点击文章顶部的公众号名称
进入主页，点击右上角「…」
选择「设为星标」，下次更容易找到
:::
```

### `g-comment-invitation` 留言交换心事

标签：对话、文艺、通用 · 参数：`label`（如 `留言区见`）

```markdown
:::g-comment-invitation{label="留言区见"}
最近，有什么小事让你开心？
也许是一顿热饭，也许是久违的问候。欢迎在留言区，分享你的那一刻。
:::
```

### `g-topic-ballot` 今日话题投票签

标签：对话、校园、通用 · 参数：`topic`（如 `周末，你更想怎样充电？`）、`hint`（如 `在留言区写下选项，也欢迎补充你的答案。`）

```markdown
:::g-topic-ballot{topic="周末，你更想怎样充电？" hint="在留言区写下选项，也欢迎补充你的答案。"}
去山野走一走
窝在家读一本书
约朋友吃顿好饭
:::
```

### `g-reading-cards` 延伸阅读卡片集

标签：文艺、通用、编号 · 参数：`title`（如 `还想和你分享`）

```markdown
:::g-reading-cards{title="还想和你分享"}
[城市散步计划](https://mp.weixin.qq.com/)｜沿着河岸走，收集一座城的温柔
把书桌留给自己｜用一个下午，整理出喜欢的生活角落
一人食的四季菜单｜认真吃饭，是照顾自己的第一件小事
:::
```

### `follow-top` 顶部关注引导

标签：通用、引导 · 参数：`name`（如 `蓝字`）

```markdown
:::follow-top{name="蓝字"}
:::
```

### `follow-card` 关注我们卡片

标签：通用、引导、企业 · 参数：`qr`（如 ``）

```markdown
:::follow-card{qr=""}
关注我们
每周分享干货内容，与你一起成长
:::
```

### `guide-actions` 分享点赞在看

标签：通用、引导、结尾

```markdown
:::guide-actions
喜欢这篇文章，就分享给更多朋友吧
:::
```

### `read-more` 往期推荐

标签：通用、引导 · 参数：`title`（如 `往期推荐`）

```markdown
:::read-more{title="往期推荐"}
- [如何写出一篇爆款文章](https://mp.weixin.qq.com/)
- [公众号排版的 10 个小技巧](https://mp.weixin.qq.com/)
- [我们的 2026 年度回顾](https://mp.weixin.qq.com/)
:::
```

### `scroll-down` 向下滑动提示

标签：简约、引导

```markdown
:::scroll-down
向下滑动阅读
:::
```

### `contact-card` 联系方式

标签：企业、商务 · 参数：`title`（如 `联系我们`）

```markdown
:::contact-card{title="联系我们"}
电话：400-000-0000
邮箱：hello@example.com
地址：上海市浦东新区某某路 88 号
:::
```

## 结尾（ending）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `e-handwritten-signature` | 手写信末落款 | 文艺、怀旧、通用 | `author` `date` |
| `e-outline-the-end` | 留白描边 THE END | 简约、潮流、文艺 | — |
| `e-sharing-bubble` | 今日分享收工气泡 | 可爱、对话、清新 | `sub` |
| `e-qr-business-card` | 纸感二维码名片 | 商务、企业、简约 | `name` `account` `qr` |
| `e-copyright-rule` | 刊物版权尾注 | 简约、企业、通用 | `owner` `year` |
| `e-like-watch-save` | 点赞在看收藏三连 | 通用、简约、清新 | — |
| `end-lines` | END 结束线 | 简约、通用 | — |
| `end-circle` | 圆形完结 | 文艺、古风 | `text` |
| `end-thanks` | 感谢阅读 | 通用、清新 | `sub` |
| `end-credits` | 作者署名 | 通用、企业 | — |
| `end-copyright` | 版权声明 | 通用、简约 | — |

### `e-handwritten-signature` 手写信末落款

标签：文艺、怀旧、通用 · 参数：`author`（如 `林间小满`）、`date`（如 `2026.10.16`）

```markdown
:::e-handwritten-signature{author="林间小满" date="2026.10.16"}
愿你心里有光，脚下有路。
:::
```

### `e-outline-the-end` 留白描边 THE END

标签：简约、潮流、文艺

```markdown
:::e-outline-the-end
故事暂歇，热爱继续
:::
```

### `e-sharing-bubble` 今日分享收工气泡

标签：可爱、对话、清新 · 参数：`sub`（如 `谢谢你，把时间留给这段文字`）

```markdown
:::e-sharing-bubble{sub="谢谢你，把时间留给这段文字"}
今天的分享就到这里
:::
```

### `e-qr-business-card` 纸感二维码名片

标签：商务、企业、简约 · 参数：`name`（如 `山间设计手记`）、`account`（如 `shanjian-notes`）、`qr`（如 ``）

```markdown
:::e-qr-business-card{name="山间设计手记" account="shanjian-notes" qr=""}
记录设计，也记录生活
长按识别二维码，和我们保持联系。
:::
```

### `e-copyright-rule` 刊物版权尾注

标签：简约、企业、通用 · 参数：`owner`（如 `慢慢生活研究所`）、`year`（如 `2026`）

```markdown
:::e-copyright-rule{owner="慢慢生活研究所" year="2026"}
本文文字与配图均为原创。转载请联系授权，并注明作者及来源。
:::
```

### `e-like-watch-save` 点赞在看收藏三连

标签：通用、简约、清新

```markdown
:::e-like-watch-save
喜欢这篇分享，就留下一点鼓励吧
:::
```

### `end-lines` END 结束线

标签：简约、通用

```markdown
:::end-lines
:::
```

### `end-circle` 圆形完结

标签：文艺、古风 · 参数：`text`（如 `完`）

```markdown
:::end-circle{text="完"}
:::
```

### `end-thanks` 感谢阅读

标签：通用、清新 · 参数：`sub`（如 `THANKS FOR READING`）

```markdown
:::end-thanks{sub="THANKS FOR READING"}
感谢阅读
:::
```

### `end-credits` 作者署名

标签：通用、企业

```markdown
:::end-credits
文字 | 张三
排版 | 李四
审核 | 王五
:::
```

### `end-copyright` 版权声明

标签：通用、简约

```markdown
:::end-copyright
本文为原创内容，转载请联系后台授权，并注明出处。部分图片来源于网络，如有侵权请联系删除。
:::
```

## 动图（gif）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `gif-sakura-breeze` | 春日樱花飘落 | 动图、标题、春天、樱花、清新 | — |
| `gif-sunny-rays` | 夏日旋转小太阳 | 动图、贴纸、夏天、阳光、可爱 | — |
| `gif-autumn-postcard` | 秋日落叶来信 | 动图、标题、秋天、落叶、文艺 | — |
| `gif-rainy-umbrella` | 雨天的小伞 | 动图、贴纸、下雨、天气、治愈 | — |
| `gif-birthday-balloons` | 彩色气球上升 | 动图、标题、生日、儿童节、庆祝 | — |
| `gif-candle-wishes` | 生日蛋糕与烛光 | 动图、贴纸、生日、蛋糕、祝福 | — |
| `gif-coffee-pause` | 热咖啡休息时间 | 动图、贴纸、咖啡、生活、治愈 | — |
| `gif-countdown-three` | 倒计时 3 2 1 | 动图、标题、倒计时、活动、开场 | `color` |
| `gif-notice-speaker` | 喇叭最新公告 | 动图、标题、公告、企业、通知 | `color` |
| `gif-task-complete` | 对勾描绘已完成 | 动图、结尾、完成、对勾、简约 | `color` |
| `gif-loading-hundred` | 进度加载到百分百 | 动图、引导、加载、进度、科技 | `color` |
| `gif-swipe-gallery` | 左右滑动查看更多 | 动图、引导、滑动、相册 | `color` |
| `gif-lucky-envelope` | 红包摇晃来啦 | 动图、贴纸、红包、春节、活动 | — |
| `gif-christmas-lights` | 圣诞树彩灯闪烁 | 动图、贴纸、圣诞、节日、祝福 | — |
| `gif-health-pulse` | 健康心电图 | 动图、分割、健康、医疗、心电图 | `color` |
| `gif-book-turning` | 书本轻轻翻页 | 动图、贴纸、教育、阅读、书本 | `color` |
| `gif-follow` | 点击蓝字关注 | 动图、引导、通用 | `color` |
| `gif-actions` | 分享收藏点赞在看 | 动图、引导、结尾、通用 | `color` |
| `gif-scroll` | 向下滑动 | 动图、引导、简约 | `color` |
| `gif-readmore` | 阅读原文按钮 | 动图、引导、通用 | `color` |
| `gif-star` | 设为星标 | 动图、引导、通用 | `color` |
| `gif-wave` | 流动波浪线 | 动图、分割、简约、清新 | `color` |
| `gif-dots` | 跃动圆点 | 动图、分割、简约、可爱 | `color` |
| `gif-plane` | 纸飞机分割线 | 动图、分割、清新、可爱 | `color` |
| `gif-sparkle` | 星光细线 | 动图、分割、简约、文艺 | `color` |
| `gif-new` | NEW 爆炸贴 | 动图、标题、潮流、电商 | `color` |
| `gif-hot` | HOT 火焰 | 动图、标题、潮流、电商 | — |
| `gif-end` | END 动态结尾 | 动图、结尾、简约、通用 | `color` |
| `gif-thanks` | 感谢阅读 · 爱心 | 动图、结尾、可爱、通用 | `color` |
| `gif-typing` | 打字机开场 | 动图、标题、简约、科技 | `color` |
| `gif-hearts` | 心动贴纸 | 动图、贴纸、可爱、少女 | `color` |
| `gif-confetti` | 彩纸庆祝 | 动图、标题、节日、色彩、企业 | — |
| `gif-lantern` | 新春灯笼 | 动图、标题、节日、春节、古风 | — |
| `gif-snow` | 初雪横幅 | 动图、标题、节日、清新、圣诞 | — |
| `gif-fireworks` | 新年烟花 | 动图、标题、节日、春节、元旦 | — |
| `gif-moon` | 中秋明月 | 动图、标题、节日、中秋、古风 | — |
| `gif-gift` | 礼物惊喜 | 动图、贴纸、节日、电商、可爱 | — |

### `gif-sakura-breeze` 春日樱花飘落

标签：动图、标题、春天、樱花、清新

```markdown
:::gif-sakura-breeze
:::
```

### `gif-sunny-rays` 夏日旋转小太阳

标签：动图、贴纸、夏天、阳光、可爱

```markdown
:::gif-sunny-rays
:::
```

### `gif-autumn-postcard` 秋日落叶来信

标签：动图、标题、秋天、落叶、文艺

```markdown
:::gif-autumn-postcard
:::
```

### `gif-rainy-umbrella` 雨天的小伞

标签：动图、贴纸、下雨、天气、治愈

```markdown
:::gif-rainy-umbrella
:::
```

### `gif-birthday-balloons` 彩色气球上升

标签：动图、标题、生日、儿童节、庆祝

```markdown
:::gif-birthday-balloons
:::
```

### `gif-candle-wishes` 生日蛋糕与烛光

标签：动图、贴纸、生日、蛋糕、祝福

```markdown
:::gif-candle-wishes
:::
```

### `gif-coffee-pause` 热咖啡休息时间

标签：动图、贴纸、咖啡、生活、治愈

```markdown
:::gif-coffee-pause
:::
```

### `gif-countdown-three` 倒计时 3 2 1

标签：动图、标题、倒计时、活动、开场 · 参数：`color`（如 `purple`） · 配色：`purple` 紫、`blue` 蓝、`green` 绿、`red` 红、`orange` 橙

```markdown
:::gif-countdown-three{color=purple}
:::
```

### `gif-notice-speaker` 喇叭最新公告

标签：动图、标题、公告、企业、通知 · 参数：`color`（如 `orange`） · 配色：`orange` 橙、`blue` 蓝、`green` 绿、`red` 红、`purple` 紫

```markdown
:::gif-notice-speaker{color=orange}
:::
```

### `gif-task-complete` 对勾描绘已完成

标签：动图、结尾、完成、对勾、简约 · 参数：`color`（如 `green`） · 配色：`green` 绿、`blue` 蓝、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-task-complete{color=green}
:::
```

### `gif-loading-hundred` 进度加载到百分百

标签：动图、引导、加载、进度、科技 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-loading-hundred{color=blue}
:::
```

### `gif-swipe-gallery` 左右滑动查看更多

标签：动图、引导、滑动、相册 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-swipe-gallery{color=blue}
:::
```

### `gif-lucky-envelope` 红包摇晃来啦

标签：动图、贴纸、红包、春节、活动

```markdown
:::gif-lucky-envelope
:::
```

### `gif-christmas-lights` 圣诞树彩灯闪烁

标签：动图、贴纸、圣诞、节日、祝福

```markdown
:::gif-christmas-lights
:::
```

### `gif-health-pulse` 健康心电图

标签：动图、分割、健康、医疗、心电图 · 参数：`color`（如 `green`） · 配色：`green` 绿、`blue` 蓝、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-health-pulse{color=green}
:::
```

### `gif-book-turning` 书本轻轻翻页

标签：动图、贴纸、教育、阅读、书本 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-book-turning{color=blue}
:::
```

### `gif-follow` 点击蓝字关注

标签：动图、引导、通用 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-follow{color=blue}
:::
```

### `gif-actions` 分享收藏点赞在看

标签：动图、引导、结尾、通用 · 参数：`color`（如 `red`） · 配色：`red` 红、`blue` 蓝、`green` 绿、`orange` 橙、`purple` 紫

```markdown
:::gif-actions{color=red}
:::
```

### `gif-scroll` 向下滑动

标签：动图、引导、简约 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-scroll{color=blue}
:::
```

### `gif-readmore` 阅读原文按钮

标签：动图、引导、通用 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-readmore{color=blue}
:::
```

### `gif-star` 设为星标

标签：动图、引导、通用 · 参数：`color`（如 `orange`） · 配色：`orange` 橙、`blue` 蓝、`green` 绿、`red` 红、`purple` 紫

```markdown
:::gif-star{color=orange}
:::
```

### `gif-wave` 流动波浪线

标签：动图、分割、简约、清新 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-wave{color=blue}
:::
```

### `gif-dots` 跃动圆点

标签：动图、分割、简约、可爱 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-dots{color=blue}
:::
```

### `gif-plane` 纸飞机分割线

标签：动图、分割、清新、可爱 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-plane{color=blue}
:::
```

### `gif-sparkle` 星光细线

标签：动图、分割、简约、文艺 · 参数：`color`（如 `purple`） · 配色：`purple` 紫、`blue` 蓝、`green` 绿、`red` 红、`orange` 橙

```markdown
:::gif-sparkle{color=purple}
:::
```

### `gif-new` NEW 爆炸贴

标签：动图、标题、潮流、电商 · 参数：`color`（如 `red`） · 配色：`red` 红、`blue` 蓝、`green` 绿、`orange` 橙、`purple` 紫

```markdown
:::gif-new{color=red}
:::
```

### `gif-hot` HOT 火焰

标签：动图、标题、潮流、电商

```markdown
:::gif-hot
:::
```

### `gif-end` END 动态结尾

标签：动图、结尾、简约、通用 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-end{color=blue}
:::
```

### `gif-thanks` 感谢阅读 · 爱心

标签：动图、结尾、可爱、通用 · 参数：`color`（如 `red`） · 配色：`red` 红、`blue` 蓝、`green` 绿、`orange` 橙、`purple` 紫

```markdown
:::gif-thanks{color=red}
:::
```

### `gif-typing` 打字机开场

标签：动图、标题、简约、科技 · 参数：`color`（如 `blue`） · 配色：`blue` 蓝、`green` 绿、`red` 红、`orange` 橙、`purple` 紫

```markdown
:::gif-typing{color=blue}
:::
```

### `gif-hearts` 心动贴纸

标签：动图、贴纸、可爱、少女 · 参数：`color`（如 `red`） · 配色：`red` 红、`blue` 蓝、`green` 绿、`orange` 橙、`purple` 紫

```markdown
:::gif-hearts{color=red}
:::
```

### `gif-confetti` 彩纸庆祝

标签：动图、标题、节日、色彩、企业

```markdown
:::gif-confetti
:::
```

### `gif-lantern` 新春灯笼

标签：动图、标题、节日、春节、古风

```markdown
:::gif-lantern
:::
```

### `gif-snow` 初雪横幅

标签：动图、标题、节日、清新、圣诞

```markdown
:::gif-snow
:::
```

### `gif-fireworks` 新年烟花

标签：动图、标题、节日、春节、元旦

```markdown
:::gif-fireworks
:::
```

### `gif-moon` 中秋明月

标签：动图、标题、节日、中秋、古风

```markdown
:::gif-moon
:::
```

### `gif-gift` 礼物惊喜

标签：动图、贴纸、节日、电商、可爱

```markdown
:::gif-gift
:::
```

## SVG（svg）

| id | 名称 | 标签 | 参数 |
| --- | --- | --- | --- |
| `sv-fold-letter` | 点击展开长信 | 文艺、通用、动态、互动 | — |
| `sv-before-after` | 点击查看前后对比 | 教程、简约、动态、互动 | — |
| `sv-photo-carousel` | 自动横移旅行胶片 | 旅游、文艺、动态 | — |
| `sv-number-counter` | 增长数字滚动计数 | 商务、企业、动态 | `value` `unit` |
| `sv-orbit-progress` | 环形目标进度 | 简约、教育、动态 | `value` `label` |
| `sv-rising-bars` | 阶梯升起柱状图 | 商务、科技、动态 | `title` |
| `sv-seven-day-checkin` | 七日签到点亮日历 | 校园、教育、动态 | `title` |
| `sv-poem-stanzas` | 一行一行读给你听 | 文艺、古风、动态 | `title` `author` |
| `sv-glow-claim` | 呼吸光晕点击领取 | 电商、通用、动态、互动 | `button` `done` |
| `sv-star-rating` | 逐颗点亮五星口碑 | 电商、简约、动态 | `score` |
| `sv-heart-like` | 点击爱心加一 | 可爱、通用、动态、互动 | `count` |
| `sv-petal-letterhead` | 花瓣飘落信笺标题 | 清新、文艺、动态 | `sub` |
| `sv-timeline-stops` | 沿途逐点出现时间轴 | 旅游、企业、动态 | `title` |
| `sv-breathing-clock` | 给自己一分钟时钟 | 简约、通用、动态 | `title` |
| `svg-wave` | 流动波浪分割 | 分割、清新、动态 | — |
| `svg-pulse-dots` | 呼吸三点 | 分割、简约、动态 | — |
| `svg-spin-flower` | 旋转花心分割 | 分割、文艺、动态 | — |
| `svg-arrow-down` | 跳动下滑箭头 | 引导、简约、动态 | — |
| `svg-underline-title` | 描线下划线标题 | 标题、简约、动态 | `sub` |
| `svg-sparkle-title` | 闪烁星光标题 | 标题、可爱、动态 | — |
| `svg-badge-title` | 旋转环序号标题 | 标题、编号、科技、动态 | `no` |
| `svg-typing-title` | 光标闪烁标题 | 标题、科技、简约、动态 | — |
| `svg-progress` | 数据进度条 | 正文、商务、科技、动态 | — |
| `svg-marquee` | 滚动公告栏 | 引导、电商、企业、动态 | `label` |
| `svg-swing-tag` | 摇摆吊牌 | 标题、可爱、电商、动态 | — |
| `svg-ripple-follow` | 波纹关注引导 | 引导、通用、动态 | `name` |
| `svg-heart-end` | 心跳感谢结尾 | 结尾、可爱、动态 | — |
| `svg-tap-reveal` | 点击揭晓答案 | 问答、互动、教育、动态 | — |
| `svg-gift-open` | 点击拆礼物 | 互动、节日、电商、动态 | — |
| `svg-flip-card` | 点击翻面卡片 | 互动、正文、教育、动态 | — |

### `sv-fold-letter` 点击展开长信

标签：文艺、通用、动态、互动

```markdown
:::sv-fold-letter
写给正在赶路的你
今天也许没有惊天动地的进展，但你认真做好的每一件小事，都在悄悄铺向远方。
累了就停一停，给自己泡杯热茶。花有花期，你也有自己的时区。
:::
```

### `sv-before-after` 点击查看前后对比

标签：教程、简约、动态、互动

```markdown
:::sv-before-after
从前：把每天的空闲塞满，忙了一整天，依然不知道自己完成了什么。
现在：只写下三件重要的事，留一段空白给散步，也留一点心力给生活。
:::
```

### `sv-photo-carousel` 自动横移旅行胶片

标签：旅游、文艺、动态

```markdown
:::sv-photo-carousel
把周末交给山海
![海边等一场日落](https://picsum.photos/seed/sv-coast-evening/800/500)
![山间听一夜松风](https://picsum.photos/seed/sv-pine-weekend/800/500)
![小城喝一杯慢咖啡](https://picsum.photos/seed/sv-town-coffee/800/500)
:::
```

### `sv-number-counter` 增长数字滚动计数

标签：商务、企业、动态 · 参数：`value`（如 `1286`）、`unit`（如 `位同行者`）

```markdown
:::sv-number-counter{value="1286" unit="位同行者"}
从第一位读者，到一座温暖的小城
:::
```

### `sv-orbit-progress` 环形目标进度

标签：简约、教育、动态 · 参数：`value`（如 `76`）、`label`（如 `阅读计划`）

```markdown
:::sv-orbit-progress{value="76" label="阅读计划"}
已经读完 19 本书，下一本的世界正在等你。
:::
```

### `sv-rising-bars` 阶梯升起柱状图

标签：商务、科技、动态 · 参数：`title`（如 `把日子过成向上的曲线`）

```markdown
:::sv-rising-bars{title="把日子过成向上的曲线"}
春季：128
夏季：196
秋季：285
冬季：360
:::
```

### `sv-seven-day-checkin` 七日签到点亮日历

标签：校园、教育、动态 · 参数：`title`（如 `七天，把早起变成习惯`）

```markdown
:::sv-seven-day-checkin{title="七天，把早起变成习惯"}
拉开窗帘
喝杯温水
伸个懒腰
读两页书
认真早餐
散步十分钟
对自己说早安
:::
```

### `sv-poem-stanzas` 一行一行读给你听

标签：文艺、古风、动态 · 参数：`title`（如 `把秋天写进信里`）、`author`（如 `山间来信`）

```markdown
:::sv-poem-stanzas{title="把秋天写进信里" author="山间来信"}
风把树影叠成一页薄笺
我在黄昏处，写下一点想念
等桂花香走过长街
这封信，就抵达你的窗前
:::
```

### `sv-glow-claim` 呼吸光晕点击领取

标签：电商、通用、动态、互动 · 参数：`button`（如 `点我领取`）、`done`（如 `已领取 ✓`）

```markdown
:::sv-glow-claim{button="点我领取" done="已领取 ✓"}
送你一份周末松弛指南
五个不赶时间的小提案，让心情轻盈一点。
:::
```

### `sv-star-rating` 逐颗点亮五星口碑

标签：电商、简约、动态 · 参数：`score`（如 `4.9`）

```markdown
:::sv-star-rating{score="4.9"}
一碗热汤的认真，吃过的人都记得。
:::
```

### `sv-heart-like` 点击爱心加一

标签：可爱、通用、动态、互动 · 参数：`count`（如 `128`）

```markdown
:::sv-heart-like{count="128"}
如果这段文字刚好温暖了你，留一颗心再走吧。
:::
```

### `sv-petal-letterhead` 花瓣飘落信笺标题

标签：清新、文艺、动态 · 参数：`sub`（如 `愿每一次出发，都遇见好风景`）

```markdown
:::sv-petal-letterhead{sub="愿每一次出发，都遇见好风景"}
风起时，花也在赶路
:::
```

### `sv-timeline-stops` 沿途逐点出现时间轴

标签：旅游、企业、动态 · 参数：`title`（如 `一日小城漫游`）

```markdown
:::sv-timeline-stops{title="一日小城漫游"}
09:30：在街角吃一碗热腾腾的面
11:00：走进老书店，翻一封旧时光
15:00：沿着河岸散步，等风吹过树梢
18:30：把落日装进相册，慢慢回家
:::
```

### `sv-breathing-clock` 给自己一分钟时钟

标签：简约、通用、动态 · 参数：`title`（如 `给自己一分钟`）

```markdown
:::sv-breathing-clock{title="给自己一分钟"}
放下手机，松开肩膀。
吸一口气，再慢慢呼出。
不必急着回答世界，先听见自己。
:::
```

### `svg-wave` 流动波浪分割

标签：分割、清新、动态

```markdown
:::svg-wave
:::
```

### `svg-pulse-dots` 呼吸三点

标签：分割、简约、动态

```markdown
:::svg-pulse-dots
:::
```

### `svg-spin-flower` 旋转花心分割

标签：分割、文艺、动态

```markdown
:::svg-spin-flower
:::
```

### `svg-arrow-down` 跳动下滑箭头

标签：引导、简约、动态

```markdown
:::svg-arrow-down
继续往下看
:::
```

### `svg-underline-title` 描线下划线标题

标签：标题、简约、动态 · 参数：`sub`（如 `DRAW THE LINE`）

```markdown
:::svg-underline-title{sub="DRAW THE LINE"}
好的设计会说话
:::
```

### `svg-sparkle-title` 闪烁星光标题

标签：标题、可爱、动态

```markdown
:::svg-sparkle-title
今日份小确幸
:::
```

### `svg-badge-title` 旋转环序号标题

标签：标题、编号、科技、动态 · 参数：`no`（如 `01`）

```markdown
:::svg-badge-title{no="01"}
用数据驱动增长
:::
```

### `svg-typing-title` 光标闪烁标题

标签：标题、科技、简约、动态

```markdown
:::svg-typing-title
Hello，新朋友
:::
```

### `svg-progress` 数据进度条

标签：正文、商务、科技、动态

```markdown
:::svg-progress
用户满意度：96
复购率：78
推荐意愿：88
:::
```

### `svg-marquee` 滚动公告栏

标签：引导、电商、企业、动态 · 参数：`label`（如 `公告`）

```markdown
:::svg-marquee{label="公告"}
本周六晚 8 点直播抽奖，全场好物限时 8 折，记得设好闹钟哦！
:::
```

### `svg-swing-tag` 摇摆吊牌

标签：标题、可爱、电商、动态

```markdown
:::svg-swing-tag
今日上新
:::
```

### `svg-ripple-follow` 波纹关注引导

标签：引导、通用、动态 · 参数：`name`（如 `排版研究所`）

```markdown
:::svg-ripple-follow{name="排版研究所"}
每天一个排版小技巧
:::
```

### `svg-heart-end` 心跳感谢结尾

标签：结尾、可爱、动态

```markdown
:::svg-heart-end
感谢你读到这里
:::
```

### `svg-tap-reveal` 点击揭晓答案

标签：问答、互动、教育、动态

```markdown
:::svg-tap-reveal
猜一猜：公众号文章里能放外链吗？

不能哦。除了公众号文章链接外，正文里的外链都无法点击，所以本编辑器会自动把它们转成文末的参考链接。
:::
```

### `svg-gift-open` 点击拆礼物

标签：互动、节日、电商、动态

```markdown
:::svg-gift-open
恭喜你获得「早鸟 8 折券」，评论区回复「早鸟」领取！
:::
```

### `svg-flip-card` 点击翻面卡片

标签：互动、正文、教育、动态

```markdown
:::svg-flip-card
「乘风破浪」出自哪里？

出自《宋书·宗悫传》：“愿乘长风破万里浪。”比喻志向远大、奋勇前进。
:::
```
