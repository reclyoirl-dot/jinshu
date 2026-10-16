import type { BlockDef } from '../core/types'
import { compact, esc, html, lines } from './_utils'

const blocks: BlockDef[] = [
  {
    id: 'card-border',
    name: '浅色边框卡片',
    category: 'body',
    tags: ['简约', '通用'],
    example: ':::card-border\n简约是一种生活态度，也是一种设计智慧。通过精简元素、优化结构，让每一个细节都拥有存在的意义。\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.2em 0; padding: 12px 16px; border: 1px solid ${ctx.color.tint(0.6)}; background: ${ctx.color.tint(0.95)};
        border-radius: 8px; color: #444;">${compact(ctx.render(raw))}</section>`,
  },
  {
    id: 'card-topbar',
    name: '顶部色条卡片',
    category: 'body',
    tags: ['商务', '科技', '通用'],
    example: ':::card-topbar{title="核心观点"}\n品质是企业的立身之本，诚信是长远发展的核心底气。\n:::',
    params: [{ key: 'title', label: '标题', type: 'text' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.2em 0; padding: 14px 18px; background: #fff; border-top: 4px solid ${ctx.color.main}; border-radius: 6px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08); color: #444;">
        ${params.title && html`<section style="font-weight: bold; font-size: ${ctx.fontSize * 1.05}px; color: ${ctx.color.main}; margin-bottom: 4px;">${esc(params.title)}</section>`}
        ${compact(ctx.render(raw))}
      </section>`,
  },
  {
    id: 'quote-big',
    name: '大引号引用',
    category: 'body',
    tags: ['文艺', '引用', '通用'],
    example: ':::quote-big{author="佚名"}\n当我们学会为一片落叶驻足，为一缕阳光感动，心灵便能在简单日常中，获得真正的富足与自由。\n:::',
    params: [{ key: 'author', label: '作者', type: 'text' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.5em 0; padding: 6px 18px 14px; background: ${ctx.color.tint(0.94)}; border-radius: 8px;">
        <section style="font-size: 48px; line-height: 1.3; height: 30px; margin-top: -6px; color: ${ctx.color.tint(0.35)}; font-family: Georgia, serif;">“</section>
        <section style="color: #555; font-size: ${ctx.fontSize * 0.95}px; line-height: 1.8;">${compact(ctx.render(raw))}</section>
        ${params.author && html`<section style="text-align: right; font-size: 13px; color: #999; margin-top: 6px;">—— ${esc(params.author)}</section>`}
      </section>`,
  },
  {
    id: 'note-tip',
    name: '提示框',
    category: 'body',
    tags: ['通用', '科技', '教程'],
    example: ':::note-tip{label="小贴士" icon="💡"}\n随意连接公共免费 WiFi、弱密码长期不更换，都是网络安全的漏洞。\n:::',
    params: [{ key: 'label', label: '标签', type: 'text', placeholder: '提示' }, { key: 'icon', label: '图标', type: 'text', placeholder: '💡' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.2em 0; border: 1px solid ${ctx.color.alpha(0.3)}; border-radius: 6px; overflow: hidden;">
        <section style="background: ${ctx.color.alpha(0.1)}; color: ${ctx.color.main}; font-weight: bold; font-size: 14px; padding: 6px 12px;">
          ${esc(params.icon ?? '💡')} ${esc(params.label ?? '提示')}</section>
        <section style="padding: 4px 12px; font-size: ${ctx.fontSize * 0.95}px; color: #555;">${compact(ctx.render(raw))}</section>
      </section>`,
  },
  {
    id: 'card-dashed',
    name: '虚线框重点',
    category: 'body',
    tags: ['简约', '教程'],
    example: ':::card-dashed\n**划重点**：不用过度恐慌，但需时刻警惕，主动学习网络安全知识。\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.2em 0; padding: 10px 14px; border: 1px dashed ${ctx.color.main}; border-radius: 4px;
        background: ${ctx.color.alpha(0.04)}; color: #444;">${compact(ctx.render(raw))}</section>`,
  },
  {
    id: 'card-paper',
    name: '信纸横线',
    category: 'body',
    tags: ['文艺', '怀旧', '清新'],
    example: ':::card-paper\n展信佳。\n秋天从不是落幕的萧瑟，而是一场松弛的治愈。\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.2em 0; padding: 4px 16px; border-left: 3px double ${ctx.color.tint(0.5)}; color: #555;
        background: #fffdf6; line-height: 32px;">${compact(
          // 横线不能用渐变背景（公众号深色模式会警告），改为每行一个段落、段落底边画线
          ctx.render(raw.replace(/\n(?!\n)/g, '\n\n')),
          `margin: 0; line-height: 32px; border-bottom: 1px solid ${ctx.color.tint(0.8)};`,
        )}</section>`,
  },
  {
    id: 'card-gradient',
    name: '渐变顶条卡片',
    category: 'body',
    tags: ['清新', '色彩', '通用'],
    example: ':::card-gradient{title="写在前面"}\n温柔的秋风漫遍人间，我们捡拾散落的秋光，收藏日常的温柔。\n:::',
    params: [{ key: 'title', label: '标题', type: 'text' }, { key: 'color', label: '主色', type: 'color' }],
    // 渐变只用在无文字的顶条上，文字区用纯色，避免公众号深色模式警告
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.2em 0; border-radius: 12px; overflow: hidden; color: #444; background: ${ctx.color.tint(0.9)};">
        <section style="height: 5px; background: linear-gradient(90deg, ${ctx.color.main}, ${ctx.color.tint(0.6)});"></section>
        <section style="padding: 12px 18px 14px;">
          ${params.title && html`<section style="font-weight: bold; color: ${ctx.color.shade(0.1)}; margin-bottom: 4px;">${esc(params.title)}</section>`}
          ${compact(ctx.render(raw))}
        </section>
      </section>`,
  },
  {
    id: 'timeline',
    name: '时间轴',
    category: 'body',
    tags: ['商务', '企业', '通用'],
    example: ':::timeline\n2024：品牌创立，完成天使轮融资\n2025：用户突破 100 万\n2026：发布全新 2.0 版本\n:::',
    render: ({ raw, ctx }) => {
      const items = lines(raw).map((l) => {
        const s = l.replace(/^[-*]\s+/, '')
        const i = s.search(/[:：]/)
        return i > 0 ? { time: s.slice(0, i), text: s.slice(i + 1).trim() } : { time: '', text: s }
      })
      return html`
        <section style="margin: 1.2em 0; padding-left: 6px;">
          ${items.map(
            (it, i) => html`
              <section style="margin-left: 6px; padding: 0 0 ${i === items.length - 1 ? 2 : 14}px 16px;
                border-left: 2px solid ${i === items.length - 1 ? 'transparent' : ctx.color.tint(0.6)};">
                <section style="display: flex; align-items: center; margin-left: -25px;">
                  <span style="display: inline-block; flex-shrink: 0; width: 12px; height: 12px; border-radius: 50%; background: ${ctx.color.main};
                    border: 2px solid #fff; box-shadow: 0 0 0 1px ${ctx.color.main};"></span>
                  <span style="margin-left: 10px; font-weight: bold; color: ${ctx.color.main}; font-size: 14px;">${ctx.renderInline(it.time)}</span>
                </section>
                <section style="font-size: ${ctx.fontSize * 0.95}px; color: #555; margin-top: 2px;">${ctx.renderInline(it.text)}</section>
              </section>`,
          )}
        </section>`
    },
  },
]

export default blocks
