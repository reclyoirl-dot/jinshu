import type { BlockDef } from '../core/types'
import { SAMPLE_IMG, compact, esc, extractImages, html } from './_utils'

const img = (src: string, alt: string, style: string) =>
  html`<img src="${esc(src)}" alt="${esc(alt)}" style="${style}">`

const blocks: BlockDef[] = [
  {
    id: 'img-card',
    name: '图片说明卡片',
    category: 'imagetext',
    tags: ['通用', '简约'],
    example: `:::img-card\n![](${SAMPLE_IMG('wxmd-a')})\n别致的设计，赋予这款产品无可比拟的美感，每一个细节都彰显出精致与品质。\n:::`,
    render: ({ raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const first = images[0]
      return html`
        <section style="margin: 1.5em 0; border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          ${first && img(first.src, first.alt, 'display: block; width: 100%; margin: 0;')}
          ${text && html`<section style="padding: 10px 16px; font-size: ${ctx.fontSize * 0.92}px; color: #555; border-top: 3px solid ${ctx.color.main};">
            ${compact(ctx.render(text))}</section>`}
        </section>`
    },
  },
  {
    id: 'img-side',
    name: '左图右文',
    category: 'imagetext',
    tags: ['商务', '电商', '通用'],
    example: `:::img-side{title="产品亮点"}\n![](${SAMPLE_IMG('wxmd-b')})\n依托前沿算法，兼顾性能与便捷，高效响应多元需求。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const first = images[0]
      return html`
        <section style="display: flex; align-items: center; margin: 1.5em 0; padding: 10px; background: ${ctx.color.tint(0.95)}; border-radius: 8px;">
          ${first && html`<section style="flex: 0 0 40%; max-width: 40%;">${img(first.src, first.alt, 'display: block; width: 100%; border-radius: 6px; margin: 0;')}</section>`}
          <section style="flex: 1; padding-left: 12px; font-size: ${ctx.fontSize * 0.9}px; color: #555;">
            ${params.title && html`<section style="font-weight: bold; color: ${ctx.color.main}; font-size: ${ctx.fontSize}px;">${esc(params.title)}</section>`}
            ${compact(ctx.render(text), 'margin: 0.2em 0;')}
          </section>
        </section>`
    },
  },
  {
    id: 'img-polaroid',
    name: '拍立得相框',
    category: 'imagetext',
    tags: ['文艺', '清新', '旅游'],
    example: `:::img-polaroid\n![](${SAMPLE_IMG('wxmd-c')})\n邂逅秋光，留存温柔\n:::`,
    render: ({ raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const first = images[0]
      return html`
        <section style="margin: 1.8em auto; width: 86%; padding: 10px 10px 4px; background: #fff; border: 1px solid #eee;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);">
          ${first && img(first.src, first.alt, 'display: block; width: 100%; margin: 0;')}
          <section style="text-align: center; padding: 10px 0 8px; color: #666; font-size: ${ctx.fontSize * 0.9}px; letter-spacing: 2px;
            font-family: 'Kaiti SC', STKaiti, KaiTi, serif;">${ctx.renderInline(text.replace(/\n+/g, ' '))}</section>
        </section>`
    },
  },
  {
    id: 'img-offset',
    name: '错位色块图',
    category: 'imagetext',
    tags: ['潮流', '色彩'],
    example: `:::img-offset\n![](${SAMPLE_IMG('wxmd-d')})\n:::`,
    render: ({ raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const first = images[0]
      return html`
        <section style="margin: 1.5em 0; padding: 0 12px 12px 0;">
          ${first && img(first.src, first.alt, `display: block; width: 100%; margin: 0; box-shadow: 12px 12px 0 ${ctx.color.tint(0.7)};`)}
          ${text && html`<section style="margin-top: 20px; font-size: 13px; color: #999; text-align: center;">${ctx.renderInline(text)}</section>`}
        </section>`
    },
  },
  {
    id: 'img-double',
    name: '双图并排',
    category: 'imagetext',
    tags: ['通用', '多图'],
    example: `:::img-double\n![](${SAMPLE_IMG('wxmd-e')})\n![](${SAMPLE_IMG('wxmd-f')})\n左：清晨的街道 · 右：午后的咖啡\n:::`,
    render: ({ raw, ctx }) => {
      const { images, text } = extractImages(raw)
      return html`
        <section style="margin: 1.5em 0;">
          <section style="display: flex;">
            ${images.slice(0, 2).map(
              (im, i) => html`<section style="flex: 1; ${i ? 'margin-left: 6px;' : ''}">${img(im.src, im.alt, 'display: block; width: 100%; border-radius: 4px; margin: 0;')}</section>`,
            )}
          </section>
          ${text && html`<section style="margin-top: 6px; text-align: center; font-size: 13px; color: #999;">${ctx.renderInline(text.replace(/\n+/g, ' '))}</section>`}
        </section>`
    },
  },
]

export default blocks
