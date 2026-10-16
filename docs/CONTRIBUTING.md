# 贡献指南

欢迎贡献主题、组件和模板！这三类内容都是**自动注册**的：新增一个文件、跑通测试、提 PR 即可，不需要改任何注册代码。

```bash
pnpm install
pnpm dev        # 本地开发 http://localhost:5173
pnpm test       # 所有主题/组件/模板都会被自动检查
pnpm catalog    # 新增或修改素材后，重新生成素材手册 docs/MATERIALS.md
```

## 公众号兼容性约束（务必遵守）

公众号编辑器会清洗粘贴进来的 HTML，因此最终产物必须满足：

- 只用**内联样式**：不能依赖 `class`、`id`、`<style>`（渲染管线会自动删除）
- 不能用 **CSS 变量** `var(--x)`，颜色要写字面值
- 不要用 `position: absolute/fixed`、外部字体、`background-image: url(外链)`
- 布局优先用 `display: flex` / `inline-block` / 负 margin；`box-shadow`、`border-radius` 都可以用
- **文字下面不要用渐变背景**（`linear-gradient` / `radial-gradient`）：公众号深色模式无法转换，粘贴时会提示 `darkmode-no-gradient`。渐变只用在不含文字的装饰线、色条上；马克笔高亮可以用 `box-shadow: inset 0 -0.5em 0 颜色` 代替
- **含文字的元素行高不低于 1.3**，多行文字建议 1.5 以上，否则公众号会提示「行高异常」；只包 SVG / 图片的外层可以用 `line-height: 0`
- 标签优先用 `section`、`span`、`p`、`img`

`pnpm test` 会对每个主题、组件、模板检查前三条，以及渐变文字背景和行高（规则见 [`src/core/lint.ts`](../src/core/lint.ts)，编辑器预览区的「兼容检测」用的是同一套规则）。

## 新增主题

在 `src/themes/` 下新建 `my-theme.ts`：

```ts
import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'my-theme',
  name: '我的主题',
  description: '一句话介绍',
  tags: ['简约'],
  defaults: { primary: '#ff6600', fontSize: 15 },
  codeTheme: 'light', // 或 'dark'
  css: `
.wx-h2 { text-align: center; color: {{primary}}; }
.wx-blockquote { background: {{primary~0.9}}; }
`,
}

export default theme
```

- 主题 CSS 叠加在 [`src/core/render/baseCss.ts`](../src/core/render/baseCss.ts) 的基础样式之上，只写差异即可。
- 可用选择器：`.wx-root`、`.wx-p`、`.wx-h1`~`.wx-h6`（以及 `-prefix` / `-content` / `-suffix` 三个子 span，用来做标题装饰）、`.wx-blockquote`、`.wx-ul`、`.wx-ol`、`.wx-li`、`.wx-pre`、`.wx-code`、`.wx-codespan`、`.wx-strong`、`.wx-em`、`.wx-del`、`.wx-a`、`.wx-hr`、`.wx-img`、`.wx-figcaption`、`.wx-table`、`.wx-th`、`.wx-td`、`.wx-footnotes` 等；支持后代选择器和 `:first-child` 这类伪类，不支持 `::before`。
- 占位符：

| 写法 | 含义 |
| --- | --- |
| `{{primary}}` | 主色 |
| `{{primary/0.1}}` | 主色 10% 透明度 |
| `{{primary~0.9}}` | 主色向白色混合 90%（浅色背景） |
| `{{primary^0.2}}` | 主色向黑色混合 20%（深一点） |
| `{{fs}}` / `{{fs*1.2}}` | 正文字号 / 字号倍数 |

## 新增组件

组件按分类放在 `src/blocks/<分类>.ts`（`title` 标题、`body` 正文、`qa` 问答、`imagetext` 图文、`divider` 分割、`guide` 引导、`ending` 结尾）。在对应数组里追加，或新建一个文件 default 导出 `BlockDef` / `BlockDef[]`：

```ts
{
  id: 'title-my',                 // 全局唯一，也是 Markdown 里的组件名
  name: '我的标题',
  category: 'title',
  tags: ['简约', '通用'],          // 样式中心按标签筛选
  example: ':::title-my{sub="SUB"}\n标题文字\n:::',
  render: ({ params, raw, ctx }) => html`
    <section style="text-align: center; color: ${ctx.color.main};">
      ${ctx.renderInline(raw.trim())}
      ${params.sub && html`<section style="font-size: 12px;">${esc(params.sub)}</section>`}
    </section>`,
}
```

- `raw`：容器内的原始 Markdown；`params`：`{...}` 里的参数（用户传入的值请用 `esc()` 转义）。
- `ctx.color`：`main` / `alpha(a)` / `tint(t)` / `shade(t)`，组件会自动跟随主色，用户也可以用 `color=#xxxxxx` 单独覆盖。
- `ctx.renderInline()` / `ctx.render()`：渲染行内 / 块级 Markdown；`compact()` 可以收紧内部段落间距。
- 常用工具都在 [`src/blocks/_utils.ts`](../src/blocks/_utils.ts)：`html`、`esc`、`splitFirst`、`splitQA`、`extractImages`、`lines`。

## 新增 SVG 动效素材

SVG 素材放在 `src/blocks/svg*.ts`（category `'svg'`），直接输出内联 `<svg>`，用 SMIL 动画：`<animate>`、`<animateTransform>`、`<animateMotion>`、`<set>`。公众号支持这类 SVG，包括 `begin="click"` 的点击交互。

- 禁止 `id`、`class`、`<style>`、`<script>`、`<foreignObject>`；颜色用 `ctx.color`。
- `viewBox` 宽度统一 300，`style="display:block;width:100%"`。SVG 文本不会自动换行，需要自己切行（参考 `svg.ts` 里的 `wrapText`）。
- **点击交互的坑**：没有 id 时，`begin="click"` 只监听动画所在的元素，以及从它的**子元素冒泡**上来的点击。所以需要多个元素同时响应时，要把透明点击层（`fill-opacity="0"` 的矩形）放在最内层，让所有动画元素都是它的祖先，参考 `svg-gift-open`。

## 新增动图（GIF）

动图由脚本生成：每个动图写一个 `render(t, color)` 函数，`t ∈ [0,1)` 是循环进度，返回一帧 SVG；脚本把所有帧栅格化（resvg）并编码成 GIF（gifenc），输出到 `public/materials/gif/`，同时更新清单 `src/materials/gifs.json`，组件会自动注册为 `gif-<id>`。

1. 在 `scripts/gifs/` 下新建或编辑 `set-xxx.mjs`，`export default` 动图定义数组（字段参考 `set-core.mjs`）。
2. 设 `variants: true` 可以自动生成蓝/绿/红/橙/紫五种配色，用户通过 `:::gif-xxx{color=green}` 切换。
3. 预览帧：`pnpm gifs:preview out.png 你的id`
4. 生成：`pnpm gifs 你的id`（不带 id 则只生成缺失的文件，`--force` 全部重新生成）

注意必须无缝循环（随机元素用 `rng(seed)`，下落类用整数倍速度取模），单个 GIF 尽量小于 400KB。

> 公众号粘贴时会从「素材地址」抓取 GIF 并转存，所以发布站点（GitHub Pages）或 CDN 必须能公网访问；本地 `localhost` 地址无法被抓取。

## 新增整篇模板

在 `src/templates/` 下新建 `.md` 文件，用 frontmatter 声明主题：

```markdown
---
name: 模板名
description: 一句话介绍
theme: fresh-green
primary: '#2bae85'
order: 10
---

正文……
```

## 原创声明

请只提交**原创**或可开源授权的样式，不要直接复制其他平台（如壹伴、秀米、135 等）的样式代码与素材。
