import type { BlockDef } from '../core/types'
import { compact, esc, html, splitQA } from './_utils'

const EXAMPLE_Q = '公众号为什么不能直接贴外链？'
const EXAMPLE_A = '公众号正文只允许跳转到公众号文章，本编辑器会自动把外链转成文末的「参考链接」。'

const badge = (text: string, bg: string, color: string) => html`
  <span style="display: inline-block; flex-shrink: 0; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%;
    background: ${bg}; color: ${color}; font-size: 13px; font-weight: bold; margin-top: 2px;">${text}</span>`

const blocks: BlockDef[] = [
  {
    id: 'qa-classic',
    name: 'Q/A 圆标问答',
    category: 'qa',
    tags: ['通用', '简约'],
    example: `:::qa-classic\n${EXAMPLE_Q}\n\n${EXAMPLE_A}\n:::`,
    render: ({ raw, ctx }) => {
      const { q, a } = splitQA(raw)
      return html`
        <section style="margin: 1.2em 0;">
          <section style="display: flex; align-items: flex-start;">
            ${badge('Q', ctx.color.main, '#fff')}
            <section style="margin-left: 10px; font-weight: bold; color: #222; line-height: 1.75;">${ctx.renderInline(q)}</section>
          </section>
          <section style="display: flex; align-items: flex-start; margin-top: 6px;">
            ${badge('A', ctx.color.tint(0.8), ctx.color.main)}
            <section style="flex: 1; margin-left: 10px; color: #555;">${compact(ctx.render(a), 'margin: 0 0 0.4em;')}</section>
          </section>
        </section>`
    },
  },
  {
    id: 'qa-chat',
    name: '聊天气泡问答',
    category: 'qa',
    tags: ['可爱', '清新', '对话'],
    example: `:::qa-chat\n${EXAMPLE_Q}\n\n${EXAMPLE_A}\n:::`,
    render: ({ raw, ctx }) => {
      const { q, a } = splitQA(raw)
      return html`
        <section style="margin: 1.2em 0;">
          <section style="display: flex;">
            <section style="max-width: 80%; background: #f2f3f5; color: #333; padding: 8px 12px; border-radius: 2px 12px 12px 12px;
              font-size: ${ctx.fontSize * 0.95}px;">${ctx.renderInline(q)}</section>
          </section>
          <section style="display: flex; justify-content: flex-end; margin-top: 10px;">
            <section style="max-width: 80%; background: ${ctx.color.tint(0.85)}; color: #333; padding: 8px 12px; border-radius: 12px 2px 12px 12px;
              font-size: ${ctx.fontSize * 0.95}px;">${compact(ctx.render(a), 'margin: 0;')}</section>
          </section>
        </section>`
    },
  },
  {
    id: 'qa-card',
    name: '卡片问答',
    category: 'qa',
    tags: ['商务', '科技'],
    example: `:::qa-card\n${EXAMPLE_Q}\n\n${EXAMPLE_A}\n:::`,
    render: ({ raw, ctx }) => {
      const { q, a } = splitQA(raw)
      return html`
        <section style="margin: 1.2em 0; border-radius: 8px; overflow: hidden; border: 1px solid ${ctx.color.tint(0.7)};">
          <section style="background: ${ctx.color.main}; color: #fff; padding: 8px 14px; font-weight: bold;">${ctx.renderInline(q)}</section>
          <section style="padding: 6px 14px; color: #555; background: #fff;">${compact(ctx.render(a))}</section>
        </section>`
    },
  },
  {
    id: 'qa-interview',
    name: '访谈问答',
    category: 'qa',
    tags: ['访谈', '文艺'],
    example: `:::qa-interview\n问：${EXAMPLE_Q}\n\n答：${EXAMPLE_A}\n:::`,
    render: ({ raw, ctx }) => {
      const { q, a } = splitQA(raw)
      const label = (t: string, solid: boolean) => html`
        <span style="display: inline-block; padding: 0 6px; margin-right: 8px; font-size: 13px; line-height: 20px; border-radius: 3px;
          ${solid ? `background: ${ctx.color.main}; color: #fff;` : `border: 1px solid ${ctx.color.main}; color: ${ctx.color.main};`}">${t}</span>`
      return html`
        <section style="margin: 1.2em 0;">
          <section style="font-weight: bold; color: #222;">${label('问', true)}${ctx.renderInline(q)}</section>
          <section style="margin-top: 6px; color: #555;">${label('答', false)}${ctx.renderInline(a.replace(/\n+/g, ' '))}</section>
        </section>`
    },
  },
  {
    id: 'qa-faq',
    name: 'FAQ 序号问答',
    category: 'qa',
    tags: ['教程', '编号'],
    example: `:::qa-faq{no="01"}\n${EXAMPLE_Q}\n\n${EXAMPLE_A}\n:::`,
    render: ({ params, raw, ctx }) => {
      const { q, a } = splitQA(raw)
      return html`
        <section style="margin: 1.2em 0; display: flex; align-items: flex-start;">
          <section style="flex-shrink: 0; font-size: 28px; font-weight: bold; line-height: 1.3; color: ${ctx.color.tint(0.4)};
            font-family: Georgia, serif; width: 44px;">${esc(params.no ?? '01')}</section>
          <section style="flex: 1; border-left: 1px solid ${ctx.color.tint(0.7)}; padding-left: 12px;">
            <section style="font-weight: bold; color: #222;">${ctx.renderInline(q)}</section>
            <section style="color: #666; font-size: ${ctx.fontSize * 0.95}px;">${compact(ctx.render(a))}</section>
          </section>
        </section>`
    },
  },
]

export default blocks
