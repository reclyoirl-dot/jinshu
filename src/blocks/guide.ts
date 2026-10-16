import type { BlockDef } from '../core/types'
import { esc, html, lines, splitFirst } from './_utils'

const blocks: BlockDef[] = [
  {
    id: 'follow-top',
    name: '顶部关注引导',
    category: 'guide',
    tags: ['通用', '引导'],
    example: ':::follow-top{name="蓝字"}\n:::',
    params: [{ key: 'name', label: '强调文字', type: 'text', placeholder: '蓝字' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, ctx }) => html`
      <section style="margin: 0.5em 0 1.5em; text-align: center; font-size: 13px; color: #888; letter-spacing: 1px;">
        <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent;
          border-bottom: 7px solid ${ctx.color.main}; margin-right: 6px; vertical-align: middle;"></span>点击上方
        <span style="color: ${ctx.color.main}; font-weight: bold;">${esc(params.name ?? '蓝字')}</span> 关注我们
      </section>`,
  },
  {
    id: 'follow-card',
    name: '关注我们卡片',
    category: 'guide',
    tags: ['通用', '引导', '企业'],
    example: ':::follow-card{qr=""}\n关注我们\n每周分享干货内容，与你一起成长\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="display: flex; align-items: center; margin: 1.8em 0; padding: 16px 18px; border-radius: 10px; color: #fff;
          background: ${ctx.color.main};">
          <section style="flex: 1;">
            <section style="font-size: ${ctx.fontSize * 1.1}px; font-weight: bold;">${ctx.renderInline(first || '关注我们')}</section>
            ${rest && html`<section style="font-size: 13px; opacity: 0.9; margin-top: 4px;">${ctx.renderInline(rest.replace(/\n+/g, ' '))}</section>`}
          </section>
          ${params.qr && html`<img src="${esc(params.qr)}" alt="二维码" style="flex-shrink: 0; width: 72px; height: 72px; margin: 0 0 0 12px;
            padding: 4px; background: #fff; border-radius: 6px; box-sizing: border-box;">`}
        </section>`
    },
  },
  {
    id: 'guide-actions',
    name: '分享点赞在看',
    category: 'guide',
    tags: ['通用', '引导', '结尾'],
    example: ':::guide-actions\n喜欢这篇文章，就分享给更多朋友吧\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.8em 0; text-align: center;">
        ${raw.trim() && html`<section style="font-size: 13px; color: #999; margin-bottom: 10px;">${ctx.renderInline(raw.trim())}</section>`}
        ${['分享', '点赞', '在看']
          .map(
            (t) =>
              html`<span style="display: inline-block; margin: 0 6px; padding: 3px 16px; border: 1px solid ${ctx.color.main}; color: ${ctx.color.main};
                border-radius: 999px; font-size: 13px;">${t}</span>`,
          )
          .join('')}
      </section>`,
  },
  {
    id: 'read-more',
    name: '往期推荐',
    category: 'guide',
    tags: ['通用', '引导'],
    example:
      ':::read-more{title="往期推荐"}\n- [如何写出一篇爆款文章](https://mp.weixin.qq.com/)\n- [公众号排版的 10 个小技巧](https://mp.weixin.qq.com/)\n- [我们的 2026 年度回顾](https://mp.weixin.qq.com/)\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.8em 0;">
        <section style="display: flex; align-items: center; margin-bottom: 6px;">
          <span style="display: inline-block; width: 4px; height: 16px; background: ${ctx.color.main}; border-radius: 2px;"></span>
          <span style="margin-left: 8px; font-weight: bold; color: #222; font-size: ${ctx.fontSize * 1.05}px;">${esc(params.title ?? '往期推荐')}</span>
        </section>
        ${lines(raw).map(
          (l) => html`
            <section style="padding: 8px 0; border-bottom: 1px dashed #e5e5e5; font-size: ${ctx.fontSize * 0.92}px; color: #444;">
              <span style="color: ${ctx.color.main};">▸ </span>${ctx.renderInline(l.replace(/^[-*]\s+/, ''))}</section>`,
        )}
      </section>`,
  },
  {
    id: 'scroll-down',
    name: '向下滑动提示',
    category: 'guide',
    tags: ['简约', '引导'],
    example: ':::scroll-down\n向下滑动阅读\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.5em 0; text-align: center; color: ${ctx.color.main}; font-size: 12px; letter-spacing: 2px; line-height: 1.5;">
        <section>${ctx.renderInline(raw.trim() || '向下滑动阅读')}</section>
        <section style="font-size: 14px; color: ${ctx.color.tint(0.4)};">︾</section>
      </section>`,
  },
  {
    id: 'contact-card',
    name: '联系方式',
    category: 'guide',
    tags: ['企业', '商务'],
    example: ':::contact-card{title="联系我们"}\n电话：400-000-0000\n邮箱：hello@example.com\n地址：上海市浦东新区某某路 88 号\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.5em 0; padding: 14px 16px; background: ${ctx.color.tint(0.94)}; border-radius: 8px;">
        <section style="font-weight: bold; color: ${ctx.color.main}; margin-bottom: 6px;">${esc(params.title ?? '联系我们')}</section>
        ${lines(raw).map((l) => {
          const i = l.search(/[:：]/)
          const label = i > 0 ? l.slice(0, i) : ''
          const value = i > 0 ? l.slice(i + 1).trim() : l
          return html`
            <section style="font-size: ${ctx.fontSize * 0.9}px; color: #555; line-height: 1.9;">
              ${label && html`<span style="display: inline-block; min-width: 3em; color: #999;">${esc(label)}</span>`}${esc(value)}</section>`
        })}
      </section>`,
  },
]

export default blocks
