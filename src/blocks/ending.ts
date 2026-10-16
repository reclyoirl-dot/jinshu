import type { BlockDef } from '../core/types'
import { compact, esc, html, lines } from './_utils'

const blocks: BlockDef[] = [
  {
    id: 'end-lines',
    name: 'END 结束线',
    category: 'ending',
    tags: ['简约', '通用'],
    example: ':::end-lines\n:::',
    render: ({ params, ctx }) => html`
      <section style="display: flex; align-items: center; justify-content: center; margin: 2.5em 0 1.5em;">
        <section style="width: 60px; height: 1px; background: linear-gradient(to right, transparent, ${ctx.color.main});"></section>
        <span style="padding: 0 14px; color: ${ctx.color.main}; font-size: 14px; font-weight: bold; letter-spacing: 4px;">${esc(params.text ?? 'END')}</span>
        <section style="width: 60px; height: 1px; background: linear-gradient(to left, transparent, ${ctx.color.main});"></section>
      </section>`,
  },
  {
    id: 'end-circle',
    name: '圆形完结',
    category: 'ending',
    tags: ['文艺', '古风'],
    example: ':::end-circle{text="完"}\n:::',
    params: [{ key: 'text', label: '圆圈文字', type: 'text', placeholder: '完' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, ctx }) => html`
      <section style="margin: 2.5em 0 1.5em; text-align: center;">
        <span style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 50%; background: ${ctx.color.main};
          color: #fff; font-size: 16px; font-weight: bold; box-shadow: 0 0 0 4px ${ctx.color.tint(0.8)};">${esc(params.text ?? '完')}</span>
      </section>`,
  },
  {
    id: 'end-thanks',
    name: '感谢阅读',
    category: 'ending',
    tags: ['通用', '清新'],
    example: ':::end-thanks{sub="THANKS FOR READING"}\n感谢阅读\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 2.5em 0 1.5em; text-align: center;">
        <section style="font-size: ${ctx.fontSize * 1.15}px; font-weight: bold; color: ${ctx.color.main}; letter-spacing: 4px;">
          ${ctx.renderInline(raw.trim() || '感谢阅读')}</section>
        <section style="font-size: 11px; color: #aaa; letter-spacing: 3px; margin-top: 4px;">${esc(params.sub ?? 'THANKS FOR READING')}</section>
        <section style="margin-top: 8px; color: ${ctx.color.tint(0.4)}; font-size: 12px; letter-spacing: 6px;">♥ ♥ ♥</section>
      </section>`,
  },
  {
    id: 'end-credits',
    name: '作者署名',
    category: 'ending',
    tags: ['通用', '企业'],
    example: ':::end-credits\n文字 | 张三\n排版 | 李四\n审核 | 王五\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 2em 0 1em; padding-top: 10px; border-top: 1px solid #eee; text-align: right; font-size: 13px; color: #888; line-height: 1.9;">
        ${lines(raw).map((l) => {
          const [label, ...rest] = l.split(/\s*[|｜]\s*/)
          return rest.length
            ? html`<section><span style="color: ${ctx.color.main};">${esc(label)}</span> | ${esc(rest.join(' | '))}</section>`
            : html`<section>${esc(l)}</section>`
        })}
      </section>`,
  },
  {
    id: 'end-copyright',
    name: '版权声明',
    category: 'ending',
    tags: ['通用', '简约'],
    example: ':::end-copyright\n本文为原创内容，转载请联系后台授权，并注明出处。部分图片来源于网络，如有侵权请联系删除。\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 2em 0 1em; padding: 10px 14px; background: #f7f7f7; border-radius: 6px; font-size: 12px; color: #999; line-height: 1.8;">
        <span style="color: ${ctx.color.main}; font-weight: bold;">声明</span>
        ${compact(ctx.render(raw), 'margin: 0.2em 0; font-size: 12px; color: #999;')}
      </section>`,
  },
]

export default blocks
