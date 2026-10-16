import type { BlockContext, BlockDef } from '../core/types'
import { compact, esc, html, lines, splitFirst } from './_utils'

const caption = (raw: string, ctx: BlockContext) => raw.trim() && html`
  <section style="margin-top: 10px; color: #999; font-size: 12px; line-height: 1.7; letter-spacing: 1px; overflow-wrap: anywhere;">${ctx.renderInline(raw.trim())}</section>`

/** 留空时显示明确占位框，不用装饰图案冒充可扫描的二维码。 */
const qrFrame = (qr: string | undefined, ctx: BlockContext) => html`
  <section style="width: 104px; max-width: 100%; flex-shrink: 0; padding: 7px; box-sizing: border-box; background: #fff; border: 1px solid ${ctx.color.tint(0.7)}; border-radius: 4px;">
    ${qr?.trim()
      ? html`<img src="${esc(qr.trim())}" alt="公众号二维码" style="display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: contain; margin: 0;">`
      : html`<section style="display: flex; align-items: center; justify-content: center; height: 88px; box-sizing: border-box; border: 1px dashed ${ctx.color.tint(0.5)}; color: #999; font-size: 12px; line-height: 1.6; text-align: center;">二维码<br>待添加</section>`}
  </section>`

const blocks: BlockDef[] = [
  {
    id: 'd-wave-path',
    name: '潮汐波浪线',
    category: 'divider',
    tags: ['清新', '旅游', '文艺'],
    example: ':::d-wave-path\n把脚步放慢，听海风经过\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 28px 0; text-align: center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 28" width="300" height="28" aria-hidden="true" style="display: block; width: 100%; max-width: 300px; height: 28px; margin: 0 auto;">
          <path d="M2 11 Q14 1 26 11 T50 11 T74 11 T98 11 T122 11 T146 11 T170 11 T194 11 T218 11 T242 11 T266 11 T290 11" fill="none" stroke="${ctx.color.main}" stroke-width="2" stroke-linecap="round"/>
          <path d="M10 22 Q22 12 34 22 T58 22 T82 22 T106 22 T130 22 T154 22 T178 22 T202 22 T226 22 T250 22 T274 22 T298 22" fill="none" stroke="${ctx.color.tint(0.7)}" stroke-width="1"/>
        </svg>${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'd-scissor-dash',
    name: '剪一段时光',
    category: 'divider',
    tags: ['怀旧', '文艺', '通用'],
    example: ':::d-scissor-dash\n剪下这一刻，留给以后的自己\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 28px 0; text-align: center;">
        <section style="display: flex; align-items: center;">
          <span style="flex-shrink: 0; padding-right: 9px; color: ${ctx.color.main}; font-size: 24px; line-height: 1.3;">✂</span>
          <section style="flex: 1; min-width: 0; border-top: 1px dashed ${ctx.color.tint(0.35)};"></section>
          <span style="margin-left: 10px; color: ${ctx.color.tint(0.35)}; font-size: 12px; letter-spacing: 2px;">CUT HERE</span>
        </section>${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'd-flower-center',
    name: '花开一隙',
    category: 'divider',
    tags: ['清新', '少女', '文艺'],
    example: ':::d-flower-center\n日子缓缓，花也慢慢开\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 28px 0; text-align: center;">
        <section style="display: flex; align-items: center; justify-content: center;">
          <section style="width: 22%; height: 5px; border-top: 1px solid ${ctx.color.tint(0.65)}; border-bottom: 1px solid ${ctx.color.tint(0.88)};"></section>
          <span style="display: inline-block; margin: 0 14px; padding: 4px 10px; border-radius: 50%; background: ${ctx.color.tint(0.94)}; color: ${ctx.color.main}; font-size: 30px; line-height: 1.3;">❀</span>
          <section style="width: 22%; height: 5px; border-top: 1px solid ${ctx.color.tint(0.65)}; border-bottom: 1px solid ${ctx.color.tint(0.88)};"></section>
        </section>${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'd-dot-chain',
    name: '光谱圆点链',
    category: 'divider',
    tags: ['色彩', '简约', '通用'],
    example: ':::d-dot-chain\n让灵感一颗一颗亮起来\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 28px 0; text-align: center;">
        <section style="display: flex; align-items: center; justify-content: center;">
          ${[4, 6, 8, 10, 12, 10, 8, 6, 4].map((size, i) => html`
            <span style="display: inline-block; flex-shrink: 0; width: ${size}px; height: ${size}px; margin: 0 5px; border-radius: 50%; background: linear-gradient(135deg, ${ctx.color.tint(Math.abs(4 - i) * 0.18 + 0.15)}, ${ctx.color.tint(Math.abs(4 - i) * 0.14)});"></span>`)}
        </section>${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'd-diagonal-stripe',
    name: '双色斜纹纸边',
    category: 'divider',
    tags: ['潮流', '色彩', '校园'],
    example: ':::d-diagonal-stripe\n下一站，去发现生活的新鲜感\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 28px 0; text-align: center;">
        <section style="height: 9px; border-top: 3px solid #fff; border-bottom: 3px solid #fff; background: repeating-linear-gradient(135deg, ${ctx.color.main} 0, ${ctx.color.main} 6px, ${ctx.color.tint(0.82)} 6px, ${ctx.color.tint(0.82)} 12px); box-shadow: 0 1px 0 ${ctx.color.tint(0.8)}, 0 -1px 0 ${ctx.color.tint(0.8)};"></section>
        ${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'd-bookmark-tab',
    name: '页间书签',
    category: 'divider',
    tags: ['文艺', '教育', '简约'],
    example: ':::d-bookmark-tab{label="读到这里"}\n合上这一页，把答案留给下一章\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 28px 0; border-top: 1px solid ${ctx.color.tint(0.65)}; text-align: center;">
        <section style="display: inline-block; max-width: 80%; padding: 0 6px; background: #fff; margin-top: -1px; vertical-align: top;">
          <section style="padding: 9px 14px 12px; border-top: 3px solid ${ctx.color.main}; background: ${ctx.color.tint(0.9)}; color: ${ctx.color.shade(0.15)}; font-size: 12px; letter-spacing: 2px; overflow-wrap: anywhere;">${esc(params.label ?? '页间停留')}</section>
          <section style="height: 8px; background: linear-gradient(150deg, ${ctx.color.tint(0.9)} 49%, transparent 50%) left / 50% 100% no-repeat, linear-gradient(210deg, ${ctx.color.tint(0.9)} 49%, transparent 50%) right / 50% 100% no-repeat;"></section>
        </section>${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'd-continue-reading',
    name: '继续阅读页标',
    category: 'divider',
    tags: ['简约', '商务', '文艺'],
    example: ':::d-continue-reading\n故事还在继续\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 30px 0; padding: 10px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
        <section style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 2px; color: ${ctx.color.main};">CONTINUE READING</span>
          <span style="padding-left: 8px; font-size: 20px; line-height: 1.3; color: ${ctx.color.main};">↓</span>
        </section>${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'd-star-constellation',
    name: '星轨连线',
    category: 'divider',
    tags: ['可爱', '科技', '清新'],
    example: ':::d-star-constellation\n微小的光，也能连成星河\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 28px 0; text-align: center;">
        <section style="display: flex; align-items: center; max-width: 240px; margin: 0 auto; color: ${ctx.color.main};">
          <span style="font-size: 14px; transform: rotate(-12deg);">✧</span>
          <section style="flex: 1; height: 1px; background: ${ctx.color.tint(0.65)}; transform: rotate(-8deg);"></section>
          <span style="font-size: 24px; padding: 0 6px;">★</span>
          <section style="flex: 1; height: 1px; background: ${ctx.color.tint(0.65)}; transform: rotate(8deg);"></section>
          <span style="font-size: 17px;">✦</span>
          <section style="flex: 0.6; height: 1px; background: ${ctx.color.tint(0.8)}; transform: rotate(-10deg);"></section>
          <span style="font-size: 12px;">✧</span>
        </section>${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'g-follow-capsule',
    name: '遇见你关注胶囊',
    category: 'guide',
    tags: ['通用', '清新', '简约'],
    example: ':::g-follow-capsule{avatar="慢" name="慢慢生活研究所"}\n点击文章顶部名称，关注每一种小美好\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 16px 0 24px;">
        <section style="display: flex; align-items: center; padding: 8px; border: 1px solid ${ctx.color.tint(0.78)}; border-radius: 32px; background: ${ctx.color.tint(0.97)};">
          <span style="display: inline-block; flex-shrink: 0; width: 38px; height: 38px; border-radius: 50%; text-align: center; line-height: 38px; font-size: 18px; font-weight: bold; background: ${ctx.color.main}; color: #fff;">${esc(Array.from(params.avatar || '阅')[0])}</span>
          <section style="flex: 1; min-width: 0; padding: 0 10px; font-size: ${ctx.fontSize * 0.95}px; font-weight: bold; line-height: 1.5; color: #333; overflow-wrap: anywhere;">${esc(params.name ?? '日常来信')}</section>
          <span style="flex-shrink: 0; padding: 5px 12px; border-radius: 20px; border: 1px solid ${ctx.color.main}; color: ${ctx.color.main}; background: #fff; font-size: 12px;">＋ 关注</span>
        </section>
        <section style="text-align: center;">${caption(raw, ctx)}</section>
      </section>`,
  },
  {
    id: 'g-original-note',
    name: '阅读原文票签',
    category: 'guide',
    tags: ['通用', '教程', '简约'],
    example: ':::g-original-note{label="阅读原文"}\n周末散步地图已备好\n点击文章底部「阅读原文」，收藏这份城市漫游路线。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="display: flex; align-items: center; margin: 24px 0; padding: 16px 0; border-top: 1px solid ${ctx.color.tint(0.6)}; border-bottom: 1px solid ${ctx.color.tint(0.6)};">
          <section style="flex: 1; min-width: 0; padding: 0 14px 0 4px; overflow-wrap: anywhere;">
            <section style="font-size: ${ctx.fontSize}px; color: #333; font-weight: bold;">${ctx.renderInline(first || '还有一份惊喜等你')}</section>
            <section style="margin-top: 6px; font-size: 12px; color: #888; line-height: 1.8;">${ctx.renderInline(rest || '点击文章底部「阅读原文」，继续探索。')}</section>
          </section>
          <section style="flex-shrink: 0; width: 76px; padding: 10px 6px; box-sizing: border-box; border-left: 1px dashed ${ctx.color.tint(0.6)}; text-align: center; font-size: 12px; color: ${ctx.color.main}; overflow-wrap: anywhere;">
            <section style="font-size: 26px; line-height: 1.3; margin-bottom: 5px;">↙</section>${esc(params.label ?? '阅读原文')}
          </section>
        </section>`
    },
  },
  {
    id: 'g-qr-station',
    name: '扫码关注小站',
    category: 'guide',
    tags: ['清新', '通用', '文艺'],
    example: ':::g-qr-station{qr="" label="长按识别二维码"}\n在这里，遇见同频的你\n每周一封生活来信，陪你把平凡日子过成喜欢的样子。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="margin: 26px 0; padding: 22px 18px; border: 1px solid ${ctx.color.tint(0.72)}; border-radius: 18px 18px 4px 4px; background: ${ctx.color.tint(0.95)}; text-align: center; overflow-wrap: anywhere;">
          <span style="display: inline-block; padding: 3px 12px; border: 1px solid ${ctx.color.tint(0.55)}; border-radius: 20px; font-size: 12px; letter-spacing: 2px; color: ${ctx.color.main};">相遇小站</span>
          <section style="margin-top: 12px; font-size: ${ctx.fontSize * 1.1}px; font-weight: bold; color: #333;">${ctx.renderInline(first || '欢迎成为我们的朋友')}</section>
          <section style="font-size: 13px; color: #777; line-height: 1.8; margin: 8px 0 16px;">${compact(ctx.render(rest), 'margin: 0;')}</section>
          <section style="display: flex; justify-content: center;">${qrFrame(params.qr, ctx)}</section>
          <section style="margin-top: 10px; color: ${ctx.color.main}; font-size: 12px;">${esc(params.label ?? '长按识别二维码，关注我们')}</section>
        </section>`
    },
  },
  {
    id: 'g-star-three-steps',
    name: '星标三步小教程',
    category: 'guide',
    tags: ['教程', '通用', '编号'],
    example: ':::g-star-three-steps{title="把我们放进你的星标里"}\n点击文章顶部的公众号名称\n进入主页，点击右上角「…」\n选择「设为星标」，下次更容易找到\n:::',
    render: ({ params, raw, ctx }) => {
      const defaults = ['点击文章顶部的公众号名称', '进入主页，点击右上角「…」', '选择「设为星标」，下次更容易找到']
      const steps = lines(raw)
      return html`
        <section style="margin: 24px 0; padding: 18px; border: 1px solid ${ctx.color.tint(0.72)}; border-radius: 8px; overflow-wrap: anywhere;">
          <section style="margin-bottom: 16px; font-size: ${ctx.fontSize}px; font-weight: bold; color: #333;"><span style="color: ${ctx.color.main}; margin-right: 6px;">★</span>${esc(params.title ?? '星标我们，不错过下次相见')}</section>
          ${defaults.map((fallback, i) => html`
            <section style="display: flex; align-items: flex-start;">
              <section style="flex-shrink: 0; width: 28px; text-align: center;">
                <span style="display: inline-block; width: 26px; height: 26px; border-radius: 50%; line-height: 26px; background: ${i === 2 ? ctx.color.main : ctx.color.tint(0.9)}; color: ${i === 2 ? '#fff' : ctx.color.main}; font-size: 12px;">0${i + 1}</span>
                ${i < 2 && html`<section style="width: 1px; height: 20px; margin: 3px auto; background: ${ctx.color.tint(0.7)};"></section>`}
              </section>
              <section style="flex: 1; min-width: 0; padding: 3px 0 14px 12px; color: #666; font-size: 13px; line-height: 1.7;">${ctx.renderInline(steps[i] || fallback)}</section>
            </section>`)}
        </section>`
    },
  },
  {
    id: 'g-comment-invitation',
    name: '留言交换心事',
    category: 'guide',
    tags: ['对话', '文艺', '通用'],
    example: ':::g-comment-invitation{label="留言区见"}\n最近，有什么小事让你开心？\n也许是一顿热饭，也许是久违的问候。欢迎在留言区，分享你的那一刻。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="margin: 26px 0; overflow-wrap: anywhere;">
          <section style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px; margin-bottom: 8px;">❝ ${esc(params.label ?? '留言区见')}</section>
          <section style="padding: 18px; border-radius: 16px 16px 16px 2px; background: ${ctx.color.tint(0.92)};">
            <section style="font-size: ${ctx.fontSize * 1.08}px; font-weight: bold; line-height: 1.6; color: #333;">${ctx.renderInline(first || '想听听你的故事')}</section>
            <section style="margin-top: 8px; font-size: 13px; color: #666; line-height: 1.8;">${compact(ctx.render(rest), 'margin: 0;')}</section>
          </section>
          <section style="margin: 8px 0 0 18px; font-size: 12px; color: #999;">你的每一句话，我们都认真读。</section>
        </section>`
    },
  },
  {
    id: 'g-topic-ballot',
    name: '今日话题投票签',
    category: 'guide',
    tags: ['对话', '校园', '通用'],
    example: ':::g-topic-ballot{topic="周末，你更想怎样充电？" hint="在留言区写下选项，也欢迎补充你的答案。"}\n去山野走一走\n窝在家读一本书\n约朋友吃顿好饭\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 24px 0; padding: 18px; border: 1px solid ${ctx.color.tint(0.6)}; box-shadow: 4px 4px 0 ${ctx.color.tint(0.91)}; box-sizing: border-box; width: calc(100% - 4px); overflow-wrap: anywhere;">
        <section style="font-size: 12px; letter-spacing: 2px; color: ${ctx.color.main};">TODAY’S TOPIC · 今日话题</section>
        <section style="font-size: ${ctx.fontSize * 1.08}px; line-height: 1.6; font-weight: bold; color: #333; margin: 10px 0 14px;">${esc(params.topic ?? '你的选择是什么？')}</section>
        ${lines(raw).map((line, i) => html`
          <section style="display: flex; align-items: flex-start; margin-top: 8px; padding: 10px 12px; background: ${ctx.color.tint(0.95)};">
            <span style="flex-shrink: 0; color: ${ctx.color.main}; font-size: 12px; padding: 2px 10px 0 0;">${i + 1 < 10 ? '0' : ''}${i + 1}</span>
            <section style="flex: 1; min-width: 0; font-size: 13px; color: #555; line-height: 1.7;">${ctx.renderInline(line)}</section>
          </section>`)}
        <section style="margin-top: 14px; font-size: 12px; color: #999; line-height: 1.8;">${esc(params.hint ?? '在留言区写下你的选择，聊聊理由。')}</section>
      </section>`,
  },
  {
    id: 'g-reading-cards',
    name: '延伸阅读卡片集',
    category: 'guide',
    tags: ['文艺', '通用', '编号'],
    example: ':::g-reading-cards{title="还想和你分享"}\n[城市散步计划](https://mp.weixin.qq.com/)｜沿着河岸走，收集一座城的温柔\n把书桌留给自己｜用一个下午，整理出喜欢的生活角落\n一人食的四季菜单｜认真吃饭，是照顾自己的第一件小事\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 28px 0; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 2px solid ${ctx.color.main};">
          <span style="font-size: ${ctx.fontSize * 1.08}px; font-weight: bold; color: #333;">${esc(params.title ?? '延伸阅读')}</span>
          <span style="flex-shrink: 0; margin-left: 8px; font-size: 12px; letter-spacing: 1px; color: ${ctx.color.main};">READ NEXT</span>
        </section>
        ${lines(raw).map((line, i) => {
          const separator = line.indexOf('｜')
          const title = separator < 0 ? line : line.slice(0, separator).trim()
          const summary = separator < 0 ? '' : line.slice(separator + 1).trim()
          return html`
            <section style="display: flex; align-items: flex-start; margin-top: 10px; padding: 14px 12px; border: 1px solid #eee; border-radius: 4px;">
              <span style="flex-shrink: 0; padding-right: 12px; font-size: 24px; line-height: 1.3; font-family: Georgia, serif; color: ${ctx.color.tint(0.45)};">${String(i + 1).padStart(2, '0')}</span>
              <section style="flex: 1; min-width: 0;">
                <section style="font-size: ${ctx.fontSize * 0.96}px; font-weight: bold; line-height: 1.6; color: #333;">${ctx.renderInline(title)}</section>
                ${summary && html`<section style="margin-top: 5px; font-size: 12px; line-height: 1.8; color: #888;">${ctx.renderInline(summary)}</section>`}
              </section>
            </section>`
        })}
      </section>`,
  },
  {
    id: 'e-handwritten-signature',
    name: '手写信末落款',
    category: 'ending',
    tags: ['文艺', '怀旧', '通用'],
    example: ':::e-handwritten-signature{author="林间小满" date="2026.10.16"}\n愿你心里有光，脚下有路。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 30px 0 20px; padding: 16px 8px; text-align: right; overflow-wrap: anywhere;">
        <section style="font-size: ${ctx.fontSize}px; line-height: 1.9; color: #777;">${ctx.renderInline(raw.trim() || '愿下一次见面，你我都有新的故事。')}</section>
        <section style="display: inline-block; max-width: 100%; margin-top: 16px; padding: 0 4px 6px 18px; border-bottom: 1px solid ${ctx.color.tint(0.65)}; box-sizing: border-box;">
          <span style="font-family: KaiTi, STKaiti, 'Kaiti SC', cursive; font-size: 26px; font-style: italic; letter-spacing: 2px; color: ${ctx.color.main};">${esc(params.author ?? '写信的人')}</span>
        </section>
        ${params.date && html`<section style="margin-top: 8px; font-size: 12px; color: #999; letter-spacing: 2px;">${esc(params.date)}</section>`}
      </section>`,
  },
  {
    id: 'e-outline-the-end',
    name: '留白描边 THE END',
    category: 'ending',
    tags: ['简约', '潮流', '文艺'],
    example: ':::e-outline-the-end\n故事暂歇，热爱继续\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 36px 0 24px; text-align: center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 64" width="260" height="64" role="img" aria-label="THE END" style="display: block; width: 100%; max-width: 260px; height: auto; margin: 0 auto;">
          <text x="130" y="46" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="900" letter-spacing="3" fill="none" stroke="${ctx.color.main}" stroke-width="1">THE END</text>
        </svg>
        <section style="width: 22px; height: 3px; margin: 10px auto 14px; background: ${ctx.color.main};"></section>
        ${caption(raw, ctx)}
      </section>`,
  },
  {
    id: 'e-sharing-bubble',
    name: '今日分享收工气泡',
    category: 'ending',
    tags: ['可爱', '对话', '清新'],
    example: ':::e-sharing-bubble{sub="谢谢你，把时间留给这段文字"}\n今天的分享就到这里\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 32px 0 24px; text-align: center; overflow-wrap: anywhere;">
        <section style="display: inline-block; max-width: 100%; box-sizing: border-box; padding: 16px 20px; border: 1px solid ${ctx.color.tint(0.6)}; border-radius: 22px 22px 3px 22px; background: ${ctx.color.tint(0.94)}; color: ${ctx.color.shade(0.2)}; font-size: ${ctx.fontSize * 1.05}px; line-height: 1.7;">${ctx.renderInline(raw.trim() || '今天的分享就到这里')}</section>
        <section style="margin: 8px 14px 0 0; text-align: right; color: ${ctx.color.tint(0.4)}; font-size: 12px; letter-spacing: 5px;">○ · ·</section>
        <section style="margin-top: 8px; font-size: 12px; color: #999; line-height: 1.8;">${esc(params.sub ?? '谢谢陪伴，我们下次见。')}</section>
      </section>`,
  },
  {
    id: 'e-qr-business-card',
    name: '纸感二维码名片',
    category: 'ending',
    tags: ['商务', '企业', '简约'],
    example: ':::e-qr-business-card{name="山间设计手记" account="shanjian-notes" qr=""}\n记录设计，也记录生活\n长按识别二维码，和我们保持联系。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="margin: 28px 0; padding: 20px 16px 14px; border-top: 4px solid ${ctx.color.main}; background: #fafafa; border-bottom: 1px solid #eee; overflow-wrap: anywhere;">
          <section style="display: flex; align-items: center;">
            <section style="flex: 1; min-width: 0; padding-right: 14px;">
              <section style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px;">KEEP IN TOUCH</section>
              <section style="font-size: ${ctx.fontSize * 1.15}px; line-height: 1.6; font-weight: bold; color: #333; margin: 8px 0 6px;">${esc(params.name ?? '我们的公众号')}</section>
              <section style="font-size: 13px; color: #666; line-height: 1.8;">${ctx.renderInline(first || '很高兴与你相遇')}</section>
              ${params.account && html`<section style="font-size: 12px; color: #999; line-height: 1.8; margin-top: 8px;">微信号 / ${esc(params.account)}</section>`}
            </section>
            ${qrFrame(params.qr, ctx)}
          </section>
          <section style="border-top: 1px dashed #ddd; padding-top: 10px; margin-top: 16px; font-size: 12px; color: #999; line-height: 1.8;">${compact(ctx.render(rest || '长按识别二维码，和我们保持联系。'), 'margin: 0;')}</section>
        </section>`
    },
  },
  {
    id: 'e-copyright-rule',
    name: '刊物版权尾注',
    category: 'ending',
    tags: ['简约', '企业', '通用'],
    example: ':::e-copyright-rule{owner="慢慢生活研究所" year="2026"}\n本文文字与配图均为原创。转载请联系授权，并注明作者及来源。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 28px 0 16px; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: center;">
          <section style="width: 30px; height: 2px; background: ${ctx.color.main};"></section>
          <section style="flex: 1; height: 1px; background: #eee;"></section>
          <span style="padding-left: 10px; font-size: 12px; letter-spacing: 1px; color: ${ctx.color.main};">版权说明</span>
        </section>
        <section style="margin-top: 12px; font-size: 12px; line-height: 1.9; color: #999;">${compact(ctx.render(raw), 'margin: 0;')}</section>
        <section style="margin-top: 8px; color: #999; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.8;">© ${esc(params.year ?? '2026')} ${esc(params.owner ?? '本文作者')} · 保留所有权利</section>
      </section>`,
  },
  {
    id: 'e-like-watch-save',
    name: '点赞在看收藏三连',
    category: 'ending',
    tags: ['通用', '简约', '清新'],
    example: ':::e-like-watch-save\n喜欢这篇分享，就留下一点鼓励吧\n:::',
    render: ({ raw, ctx }) => {
      const icons = [
        { label: '点赞', path: 'M8 10H4v10h4V10Zm0 0 5-7c2 0 2 2 1 6h5a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 1H8V10Z' },
        { label: '在看', path: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' },
        { label: '收藏', path: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z' },
      ]
      return html`
        <section style="margin: 30px 0 20px; text-align: center;">
          <section style="margin-bottom: 18px; font-size: 13px; line-height: 1.8; color: #888; overflow-wrap: anywhere;">${ctx.renderInline(raw.trim() || '你的鼓励，是我们继续分享的动力')}</section>
          <section style="display: flex; justify-content: center;">
            ${icons.map((icon, i) => html`
              <section style="flex: 1; max-width: 100px; padding: 0 6px; box-sizing: border-box; border-left: ${i ? '1px solid #eee' : '0'};">
                <span style="display: inline-block; width: 44px; height: 44px; box-sizing: border-box; padding: 10px; background: ${ctx.color.tint(0.93)}; border-radius: 50%;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" style="display: block;">
                    <path d="${icon.path}" fill="none" stroke="${ctx.color.main}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <section style="margin-top: 7px; font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px;">${icon.label}</section>
              </section>`)}
          </section>
        </section>`
    },
  },
]

export default blocks
