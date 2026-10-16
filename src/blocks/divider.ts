import type { BlockDef } from '../core/types'
import { esc, html } from './_utils'

const wrap = (inner: string, margin = '2em 0') => html`<section style="margin: ${margin}; text-align: center; line-height: 1.3;">${inner}</section>`

const blocks: BlockDef[] = [
  {
    id: 'divider-dots',
    name: '三点分割',
    category: 'divider',
    tags: ['简约', '通用'],
    example: ':::divider-dots\n:::',
    render: ({ ctx }) =>
      wrap(
        [0.6, 0.3, 0]
          .map(
            (t) =>
              html`<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin: 0 6px; background: ${ctx.color.tint(t)};"></span>`,
          )
          .join(''),
      ),
  },
  {
    id: 'divider-diamond',
    name: '菱形分割',
    category: 'divider',
    tags: ['简约', '商务'],
    example: ':::divider-diamond\n:::',
    render: ({ ctx }) => html`
      <section style="display: flex; align-items: center; margin: 2em 0;">
        <section style="flex: 1; height: 1px; background: ${ctx.color.tint(0.6)};"></section>
        <span style="padding: 0 10px; color: ${ctx.color.main}; font-size: 12px;">◆</span>
        <section style="flex: 1; height: 1px; background: ${ctx.color.tint(0.6)};"></section>
      </section>`,
  },
  {
    id: 'divider-gradient',
    name: '渐隐细线',
    category: 'divider',
    tags: ['简约', '清新'],
    example: ':::divider-gradient\n:::',
    render: ({ ctx }) =>
      html`<section style="margin: 2em 0; height: 2px; background: linear-gradient(to right, transparent, ${ctx.color.main}, transparent);"></section>`,
  },
  {
    id: 'divider-text',
    name: '文字分割线',
    category: 'divider',
    tags: ['简约', '通用'],
    example: ':::divider-text{text="未完待续"}\n:::',
    render: ({ params, ctx }) => html`
      <section style="display: flex; align-items: center; margin: 2em 0;">
        <section style="flex: 1; height: 1px; background: #ddd;"></section>
        <span style="padding: 0 12px; color: ${ctx.color.main}; font-size: 13px; letter-spacing: 3px;">${esc(params.text ?? '分割线')}</span>
        <section style="flex: 1; height: 1px; background: #ddd;"></section>
      </section>`,
  },
  {
    id: 'divider-stars',
    name: '星星分割',
    category: 'divider',
    tags: ['可爱', '清新'],
    example: ':::divider-stars\n:::',
    render: ({ ctx }) =>
      wrap(html`<span style="color: ${ctx.color.tint(0.4)}; font-size: 14px; letter-spacing: 12px;">✦ ✧ <span style="color: ${ctx.color.main};">✦</span> ✧ ✦</span>`),
  },
  {
    id: 'divider-double',
    name: '粗细双线',
    category: 'divider',
    tags: ['商务', '怀旧'],
    example: ':::divider-double\n:::',
    render: ({ ctx }) =>
      html`<section style="margin: 2em auto; width: 60%; height: 3px; border-top: 3px solid ${ctx.color.main}; border-bottom: 1px solid ${ctx.color.main};"></section>`,
  },
  {
    id: 'divider-bars',
    name: '渐变色块',
    category: 'divider',
    tags: ['色彩', '潮流'],
    example: ':::divider-bars\n:::',
    render: ({ ctx }) =>
      wrap(
        [
          [8, 0.7],
          [16, 0.45],
          [32, 0],
          [16, 0.45],
          [8, 0.7],
        ]
          .map(
            ([w, t]) =>
              html`<span style="display: inline-block; width: ${w}px; height: 4px; margin: 0 3px; border-radius: 2px; background: ${ctx.color.tint(t)};"></span>`,
          )
          .join(''),
      ),
  },
]

export default blocks
