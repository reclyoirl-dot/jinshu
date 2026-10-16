---
name: 技术文章
description: 科技蓝主题 + 代码块 + 提示框，适合开发者分享
theme: tech-blue
order: 1
---

:::follow-top{name="技术周刊"}
:::

# 用 300 行代码实现一个 Markdown 渲染管线

:::card-topbar{title="导读"}
本文介绍如何把 Markdown 转成**公众号可直接粘贴**的富文本：解析、主题、内联样式与兼容处理。
:::

:::title-part{no="01"}
为什么不能直接贴 HTML
:::

公众号编辑器会**丢弃 `<style>` 标签和 class**，只保留内联样式。所以我们需要把主题 CSS 写进每个元素的 `style` 属性里。

:::note-tip{label="注意" icon="⚠️"}
公众号也不支持 CSS 变量，主题色必须在渲染时替换成字面值。
:::

:::title-part{no="02"}
核心代码
:::

```ts
export function renderArticle(markdown: string, opts: RenderOptions) {
  const body = md.render(markdown)
  const root = parse(`<section class="wx-root">${body}</section>`)
  inlineCss(root, themeCss(opts))
  return cleanup(root)
}
```

:::title-part{no="03"}
常见问题
:::

:::qa-card
代码块的缩进为什么会丢？
公众号会折叠连续空格，需要把空格转成 `&nbsp;`，换行转成 `<br>`。
:::

:::qa-card
可以放外部链接吗？
不行，非公众号链接会被自动转成文末「参考链接」脚注。
:::

:::divider-gradient
:::

:::read-more{title="往期推荐"}
- [深入理解浏览器剪贴板 API](https://mp.weixin.qq.com/)
- [TypeScript 类型体操入门](https://mp.weixin.qq.com/)
:::

:::end-lines
:::
