import type { BlockContext, BlockDef } from '../core/types'
import { esc, html } from './_utils'

// Keep wrapping rules on every title, including narrow flex columns and long English captions.
const wrap = 'min-width: 0; overflow-wrap: anywhere; word-break: break-word;'
const heading = (raw: string, ctx: BlockContext, style = '') => html`
  <section style="${wrap} font-size: ${ctx.fontSize * 1.25}px; font-weight: bold; line-height: 1.5; color: #333; ${style}">
    ${ctx.renderInline(raw.trim())}</section>`
const caption = (text: string, style = '') => html`
  <section style="${wrap} font-size: 12px; line-height: 1.6; color: #999; ${style}">${esc(text)}</section>`
const frame = (content: string, style = '') => html`
  <section style="margin: 1.8em 0 1.1em; max-width: 100%; box-sizing: border-box; ${wrap} ${style}">${content}</section>`

const blocks: BlockDef[] = [
  {
    id: 't-art-number',
    name: '切片艺术数字',
    category: 'title',
    tags: ['编号', '文艺', '潮流'],
    example: ':::t-art-number{no="01" en="CITY WALK" sub="用脚步，重新认识一座城"}\n走进街巷的日常\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: center;">
        <section style="flex: 0 1 28%; ${wrap} padding-right: 14px; font-size: 40px; line-height: 1.3; font-weight: bold;
          font-family: Georgia, serif; font-style: italic; letter-spacing: -2px; color: ${ctx.color.main};
          box-shadow: inset 0 -0.45em 0 ${ctx.color.tint(0.88)};">${esc(params.no || '01')}</section>
        <section style="flex: 1; ${wrap} border-left: 1px solid ${ctx.color.tint(0.65)}; padding-left: 14px;">
          ${caption(params.en || 'CHAPTER', `color: ${ctx.color.main}; letter-spacing: 2px;`)}
          ${heading(raw, ctx)}
        </section>
      </section>
      ${params.sub && caption(params.sub, 'margin-top: 10px; color: #666;')}
    `),
  },
  {
    id: 't-bilingual-index',
    name: '双语索引栏',
    category: 'title',
    tags: ['简约', '商务', '文艺'],
    example: ':::t-bilingual-index{en="SLOW LIVING" sub="生活观察 / 第十二期"}\n把时间留给喜欢的事\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: stretch; border-top: 2px solid ${ctx.color.main}; border-bottom: 1px solid #eee;">
        <section style="flex: 0 1 30%; ${wrap} padding: 12px 10px 12px 0; color: ${ctx.color.main};
          font-family: Georgia, serif; font-size: 16px; line-height: 1.5; letter-spacing: 1px;">${esc(params.en || 'FIELD NOTES')}</section>
        <section style="flex: 1; ${wrap} padding: 12px 0 12px 14px; border-left: 1px solid #eee;">
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 5px; color: #666;')}
        </section>
      </section>
    `),
  },
  {
    id: 't-editorial',
    name: '杂志刊头',
    category: 'title',
    tags: ['文艺', '怀旧', '通用'],
    example: ':::t-editorial{no="08" en="WEEKEND JOURNAL" sub="一份关于城市与人的周末手记"}\n在菜市场，遇见生活\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 7px; border-bottom: 3px double #333;">
        ${caption(params.en || 'THE JOURNAL', `flex: 1; color: ${ctx.color.main}; letter-spacing: 2px;`)}
        ${caption(`VOL. ${params.no || '01'}`, 'max-width: 30%; margin-left: 12px; color: #666;')}
      </section>
      ${heading(raw, ctx, `font-family: 'Songti SC', SimSun, serif; font-size: ${ctx.fontSize * 1.55}px; margin: 13px 0 10px; letter-spacing: 1px;`)}
      ${params.sub && caption(params.sub, 'color: #666; margin-bottom: 10px;')}
      <section style="height: 4px; width: 42px; background: ${ctx.color.main};"></section>
    `),
  },
  {
    id: 't-gradient-frame',
    name: '流光渐变描边',
    category: 'title',
    tags: ['科技', '色彩', '潮流'],
    example: ':::t-gradient-frame{en="NEW POSSIBILITIES" sub="让每一个好想法，走向真实世界"}\n灵感，在此刻发生\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="padding: 2px; border-radius: 16px 4px 16px 4px; background: ${ctx.color.main};
        background: linear-gradient(120deg, ${ctx.color.main}, ${ctx.color.tint(0.85)} 55%, ${ctx.color.shade(0.15)});">
        <section style="padding: 16px 18px; border-radius: 14px 2px 14px 2px; background: #fff;">
          ${caption(params.en || 'NEW IDEAS', `color: ${ctx.color.main}; letter-spacing: 2px; margin-bottom: 7px;`)}
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 8px; color: #666;')}
        </section>
      </section>
    `),
  },
  {
    id: 't-ticket-tab',
    name: '灵感入场票',
    category: 'title',
    tags: ['旅游', '文艺', '编号'],
    example: ':::t-ticket-tab{no="026" en="ADMIT ONE" sub="下一站，去海边"}\n给自己一张出发的票\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: stretch; background: ${ctx.color.tint(0.93)}; border: 1px solid ${ctx.color.tint(0.65)}; border-radius: 12px 3px 3px 12px;">
        <section style="flex: 1; ${wrap} padding: 15px 14px;">
          ${caption(params.en || 'ADMIT ONE', `color: ${ctx.color.main}; letter-spacing: 2px; margin-bottom: 5px;`)}
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 5px; color: #666;')}
        </section>
        <section style="flex: 0 1 24%; ${wrap} border-left: 1px dashed ${ctx.color.main}; padding: 16px 10px; text-align: center;
          color: ${ctx.color.main}; font-size: 24px; font-family: Georgia, serif; line-height: 1.5;">
          ${esc(params.no || '001')}
          <section style="height: 13px; margin-top: 12px; background: repeating-linear-gradient(90deg, ${ctx.color.main} 0px, ${ctx.color.main} 1px, transparent 1px, transparent 4px);"></section>
        </section>
      </section>
    `),
  },
  {
    id: 't-washi-note',
    name: '纸胶带手记',
    category: 'title',
    tags: ['清新', '可爱', '校园'],
    example: ':::t-washi-note{sub="写在新学期的第一页"}\n愿热爱，陪你慢慢长大\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="text-align: center; padding: 0 8px;">
        <section style="padding: 0 16px 16px; background: ${ctx.color.tint(0.95)}; border-bottom: 1px solid ${ctx.color.tint(0.7)}; box-shadow: 0 5px 12px ${ctx.color.alpha(0.08)};">
          <section style="display: inline-block; width: 76px; height: 20px; margin: -8px 0 14px; transform: rotate(-3deg);
            background: repeating-linear-gradient(120deg, ${ctx.color.tint(0.65)} 0px, ${ctx.color.tint(0.65)} 5px, ${ctx.color.tint(0.8)} 5px, ${ctx.color.tint(0.8)} 10px);"></section>
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 7px; color: #666;')}
        </section>
      </section>
    `, 'padding-top: 8px;'),
  },
  {
    id: 't-rail-caption',
    name: '双轨英文侧标',
    category: 'title',
    tags: ['商务', '科技', '简约'],
    example: ':::t-rail-caption{en="INSIGHT / 2026" sub="从一个小变化，看见行业新方向"}\n读懂增长背后的信号\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: stretch;">
        <section style="flex-shrink: 0; width: 5px; margin-right: 4px; background: ${ctx.color.main};"></section>
        <section style="flex-shrink: 0; width: 1px; margin-right: 13px; background: ${ctx.color.tint(0.45)};"></section>
        <section style="flex: 1; ${wrap}">
          ${caption(params.en || 'PERSPECTIVE', `color: ${ctx.color.main}; letter-spacing: 2px; margin-bottom: 6px;`)}
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 6px; color: #666;')}
        </section>
      </section>
    `),
  },
  {
    id: 't-literati-seal',
    name: '雅集方印',
    category: 'title',
    tags: ['古风', '文艺'],
    example: ':::t-literati-seal{seal="秋记" sub="山川有信，草木知时"}\n一盏清茶，半日闲\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: center; padding: 13px 0; border-top: 1px solid ${ctx.color.tint(0.7)}; border-bottom: 1px solid ${ctx.color.tint(0.7)};">
        <section style="flex-shrink: 0; width: 42px; box-sizing: border-box; padding: 5px; margin: 0 16px 0 2px;
          border: 3px double ${ctx.color.main}; border-radius: 3px; color: ${ctx.color.main}; font-family: SimSun, serif;
          font-size: 17px; line-height: 1.3; text-align: center; word-break: break-all; transform: rotate(-3deg);">${esc(params.seal || '雅集')}</section>
        <section style="flex: 1; ${wrap}">
          ${heading(raw, ctx, `font-family: 'Songti SC', SimSun, serif; letter-spacing: 2px; color: ${ctx.color.shade(0.35)};`)}
          ${params.sub && caption(params.sub, 'margin-top: 7px; letter-spacing: 2px; color: #666;')}
        </section>
      </section>
    `),
  },
  {
    id: 't-folded-corner',
    name: '折角收藏页',
    category: 'title',
    tags: ['简约', '教育', '教程'],
    example: ':::t-folded-corner{en="KEEP THIS PAGE" sub="把复杂的事，拆成小小的一步"}\n这份方法，值得收藏\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="padding: 18px 28px 18px 16px; border-left: 2px solid ${ctx.color.main};
        background: ${ctx.color.tint(0.93)};">
        <section style="float: right; width: 0; height: 0; margin: -18px -28px 0 0; border-style: solid; border-width: 0 20px 20px 0;
          border-color: transparent #fff ${ctx.color.tint(0.6)} transparent;"></section>
        ${caption(params.en || 'BOOKMARK', `color: ${ctx.color.main}; letter-spacing: 1px; margin-bottom: 7px;`)}
        ${heading(raw, ctx)}
        ${params.sub && caption(params.sub, 'margin-top: 7px; color: #666;')}
      </section>
    `),
  },
  {
    id: 't-offset-panels',
    name: '叠色章节板',
    category: 'title',
    tags: ['潮流', '色彩', '编号'],
    example: ':::t-offset-panels{no="02" en="MAKE IT HAPPEN" sub="有想法，就让它发生"}\n把灵感变成行动\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="margin: 8px 0 0 8px; background: ${ctx.color.tint(0.7)}; padding: 0 0 8px;">
        <section style="margin: -8px 8px 0 -8px; padding: 14px 16px; background: ${ctx.color.tint(0.9)}; border-left: 4px solid ${ctx.color.main};">
          ${caption(`${params.no || '01'} / ${params.en || 'IN FOCUS'}`, `color: ${ctx.color.main}; letter-spacing: 1px; margin-bottom: 6px;`)}
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 6px; color: #666;')}
        </section>
      </section>
    `, 'padding-top: 1px;'),
  },
  {
    id: 't-dot-number',
    name: '圆点目录序',
    category: 'title',
    tags: ['编号', '简约', '通用'],
    example: ':::t-dot-number{no="03" sub="让微小的坚持，慢慢生根"}\n从今天的一件小事开始\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: flex-start;">
        <section style="flex: 0 1 auto; max-width: 25%; ${wrap} box-sizing: border-box; min-width: 38px; padding: 8px 7px; margin: 2px 12px 0 0;
          border-radius: 50%; background: ${ctx.color.tint(0.88)}; color: ${ctx.color.shade(0.2)}; text-align: center; font-size: 15px; font-weight: bold; line-height: 22px;">${esc(params.no || '01')}</section>
        <section style="flex: 1; ${wrap} padding-bottom: 10px; border-bottom: 1px dotted ${ctx.color.tint(0.45)};">
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 4px; color: #666;')}
        </section>
      </section>
    `),
  },
  {
    id: 't-step-track',
    name: '行动步骤轨道',
    category: 'title',
    tags: ['教程', '编号', '教育'],
    example: ':::t-step-track{no="02" sub="先找到问题，再寻找答案"}\n画出你的第一张思维地图\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: center; margin-bottom: 10px;">
        <section style="max-width: 70%; ${wrap} padding: 4px 10px; background: ${ctx.color.main}; color: #fff;
          font-size: 12px; font-weight: bold; letter-spacing: 2px; line-height: 1.6;">STEP ${esc(params.no || '01')}</section>
        <section style="flex: 1; height: 2px; background: ${ctx.color.tint(0.78)};"></section>
        <span style="color: ${ctx.color.main}; font-size: 16px; margin-left: 7px;">◆</span>
      </section>
      ${heading(raw, ctx)}
      ${params.sub && caption(params.sub, 'margin-top: 5px; color: #666;')}
    `),
  },
  {
    id: 't-kicker',
    name: '眉题留白',
    category: 'title',
    tags: ['简约', '文艺', '通用'],
    example: ':::t-kicker{sub="关于成长的另一种答案" en="ON GROWING"}\n慢一点，也能走得很远\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="flex-shrink: 0; width: 18px; height: 2px; margin-right: 8px; background: ${ctx.color.main};"></span>
        ${caption(params.sub || '本期精选', `color: ${ctx.color.main}; letter-spacing: 1px;`)}
      </section>
      ${heading(raw, ctx, `font-size: ${ctx.fontSize * 1.45}px; font-weight: normal; letter-spacing: 1px;`)}
      ${caption(params.en || 'A MOMENT TO READ', 'margin-top: 9px; letter-spacing: 2px;')}
    `),
  },
  {
    id: 't-floral-center',
    name: '花笺小序',
    category: 'title',
    tags: ['清新', '文艺', '少女'],
    example: ':::t-floral-center{sub="收集日常里，小小的欢喜"}\n春风捎来一封信\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="text-align: center; padding: 16px 18px; border-radius: 48px 48px 6px 6px; background: ${ctx.color.tint(0.96)};">
        <section style="font-size: 18px; color: ${ctx.color.main}; letter-spacing: 8px; line-height: 1.5; margin-bottom: 8px;">✦ ❀ ✦</section>
        ${heading(raw, ctx, `letter-spacing: 2px; color: ${ctx.color.shade(0.25)};`)}
        ${params.sub && caption(params.sub, 'margin-top: 8px; color: #666;')}
        <section style="width: 28px; height: 1px; margin: 12px auto 0; background: ${ctx.color.tint(0.4)};"></section>
      </section>
    `),
  },
  {
    id: 't-dashed-wave',
    name: '点划手写线',
    category: 'title',
    tags: ['清新', '可爱', '校园'],
    example: ':::t-dashed-wave{sub="和朋友一起，把周末过得有趣"}\n今天，去发现一点新鲜\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: inline-block; max-width: 100%; box-sizing: border-box; padding: 0 3px 7px; border-bottom: 2px dashed ${ctx.color.main};">
        ${heading(raw, ctx)}
      </section>
      <section style="width: 38px; height: 3px; margin: 5px 0 0 15px; border-radius: 50%; background: ${ctx.color.tint(0.5)}; transform: rotate(-3deg);"></section>
      ${params.sub && caption(params.sub, 'margin-top: 8px; color: #666;')}
    `),
  },
  {
    id: 't-quotation',
    name: '引语视窗',
    category: 'title',
    tags: ['引用', '文艺', '简约'],
    example: ':::t-quotation{sub="留给每一个正在努力的你"}\n你走过的路，都算数\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: stretch;">
        <span style="flex-shrink: 0; padding-right: 9px; font-size: 32px; line-height: 1.3; font-family: Georgia, serif; color: ${ctx.color.main};">❝</span>
        <section style="flex: 1; ${wrap} padding: 6px 0;">
          ${heading(raw, ctx, `font-family: 'Songti SC', SimSun, serif; font-weight: normal;`)}
          ${params.sub && caption(params.sub, 'margin-top: 8px; color: #666;')}
        </section>
        <span style="flex-shrink: 0; align-self: flex-end; padding-left: 9px; font-size: 32px; line-height: 1.3; font-family: Georgia, serif; color: ${ctx.color.tint(0.5)};">❞</span>
      </section>
    `),
  },
  {
    id: 't-card-header',
    name: '档案卡片头',
    category: 'title',
    tags: ['商务', '企业', '通用'],
    example: ':::t-card-header{no="06" en="TEAM STORIES" sub="记录那些认真做事的人"}\n每一份用心，都值得被看见\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="border: 1px solid ${ctx.color.tint(0.7)}; border-radius: 10px; overflow: hidden; background: #fff;">
        <section style="display: flex; align-items: center; padding: 8px 14px; background: ${ctx.color.tint(0.92)}; border-bottom: 1px solid ${ctx.color.tint(0.7)};">
          <span style="flex-shrink: 0; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${ctx.color.main}; margin-right: 8px;"></span>
          ${caption(params.en || 'EDITOR’S PICK', `flex: 1; color: ${ctx.color.shade(0.2)}; letter-spacing: 1px;`)}
          ${caption(params.no || '01', 'max-width: 25%; margin-left: 10px; color: #666;')}
        </section>
        <section style="padding: 15px 14px;">
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 6px; color: #666;')}
        </section>
      </section>
    `),
  },
  {
    id: 't-checklist',
    name: '心愿清单勾选',
    category: 'title',
    tags: ['教程', '教育', '简约'],
    example: ':::t-checklist{no="01" sub="今天的小目标：认真吃饭，好好睡觉"}\n把照顾自己，写进计划里\n:::',
    render: ({ params, raw, ctx }) => frame(html`
      <section style="display: flex; align-items: flex-start; padding: 13px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
        <span style="flex-shrink: 0; display: inline-block; box-sizing: border-box; width: 24px; height: 24px; line-height: 20px;
          margin: 3px 12px 0 0; text-align: center; border: 2px solid ${ctx.color.main}; border-radius: 4px; font-size: 15px; font-weight: bold; color: ${ctx.color.main};">✓</span>
        <section style="flex: 1; ${wrap}">
          ${heading(raw, ctx)}
          ${params.sub && caption(params.sub, 'margin-top: 5px; color: #666;')}
        </section>
        ${caption(params.no || '01', 'max-width: 20%; margin: 6px 0 0 10px; font-family: Georgia, serif;')}
      </section>
    `),
  },
]

export default blocks
