import type { BlockDef } from '../core/types'
import { esc, html } from './_utils'

const TITLE_COLOR = '#222'

const blocks: BlockDef[] = [
  {
    id: 'title-numbered',
    name: '序号居中标题',
    category: 'title',
    tags: ['简约', '通用', '编号'],
    example: ':::title-numbered{no="01" sub="SIMPLE TITLE"}\n简单通用标题\n:::',
    params: [{ key: 'no', label: '序号', type: 'text', placeholder: '01' }, { key: 'sub', label: '英文副标题', type: 'text' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 2em 0 1.2em; text-align: center;">
        <section style="font-size: 36px; font-weight: bold; line-height: 1.3; color: ${ctx.color.tint(0.5)};
          font-family: Georgia, 'Times New Roman', serif;">${esc(params.no ?? '01')}</section>
        <section style="display: inline-block; margin-top: 8px; padding-bottom: 6px; font-size: ${ctx.fontSize * 1.25}px;
          font-weight: bold; color: ${TITLE_COLOR}; border-bottom: 3px solid ${ctx.color.main}; letter-spacing: 1px;">
          ${ctx.renderInline(raw.trim())}</section>
        ${params.sub && html`<section style="margin-top: 6px; font-size: 12px; color: #999; letter-spacing: 2px;">${esc(params.sub)}</section>`}
      </section>`,
  },
  {
    id: 'title-leftbar',
    name: '左竖条标题',
    category: 'title',
    tags: ['简约', '商务', '通用'],
    example: ':::title-leftbar{sub="SUBTITLE"}\n左侧竖条标题\n:::',
    params: [{ key: 'sub', label: '副标题', type: 'text' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.8em 0 1em; padding-left: 12px; border-left: 5px solid ${ctx.color.main};">
        <section style="font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; color: ${TITLE_COLOR}; line-height: 1.5;">
          ${ctx.renderInline(raw.trim())}</section>
        ${params.sub && html`<section style="font-size: 12px; color: #999; letter-spacing: 1px; margin-top: 2px;">${esc(params.sub)}</section>`}
      </section>`,
  },
  {
    id: 'title-pill',
    name: '胶囊标题',
    category: 'title',
    tags: ['可爱', '清新', '通用'],
    example: ':::title-pill\n胶囊底色标题\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.8em 0 1em; text-align: center;">
        <span style="display: inline-block; padding: 6px 22px; border-radius: 999px; background: ${ctx.color.main}; color: #fff;
          font-size: ${ctx.fontSize * 1.1}px; font-weight: bold; letter-spacing: 1px; box-shadow: 0 4px 10px ${ctx.color.alpha(0.3)};">
          ${ctx.renderInline(raw.trim())}</span>
      </section>`,
  },
  {
    id: 'title-highlight',
    name: '马克笔标题',
    category: 'title',
    tags: ['简约', '文艺', '通用'],
    example: ':::title-highlight\n马克笔高亮标题\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.8em 0 1em;">
        <span style="font-size: ${ctx.fontSize * 1.25}px; font-weight: bold; color: ${TITLE_COLOR}; padding: 0 4px;
          box-shadow: inset 0 -0.5em 0 ${ctx.color.alpha(0.35)};">${ctx.renderInline(raw.trim())}</span>
      </section>`,
  },
  {
    id: 'title-part',
    name: 'PART 章节标题',
    category: 'title',
    tags: ['简约', '商务', '科技', '编号'],
    example: ':::title-part{no="01"}\n简约而不简单\n:::',
    params: [{ key: 'no', label: '序号', type: 'text', placeholder: '01' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 2em 0 1.2em; text-align: center;">
        <section style="display: inline-block; font-size: 12px; color: #fff; background: ${ctx.color.main}; padding: 2px 10px; letter-spacing: 2px;">
          PART ${esc(params.no ?? '01')}</section>
        <section style="font-size: ${ctx.fontSize * 1.25}px; font-weight: bold; color: ${TITLE_COLOR}; margin-top: 10px;">
          ${ctx.renderInline(raw.trim())}</section>
        <section style="width: 40px; height: 3px; background: ${ctx.color.main}; margin: 10px auto 0;"></section>
      </section>`,
  },
  {
    id: 'title-badge',
    name: '方块序号标题',
    category: 'title',
    tags: ['商务', '科技', '编号'],
    example: ':::title-badge{no="1"}\n攻坚核心技术，突破发展壁垒\n:::',
    params: [{ key: 'no', label: '序号', type: 'text', placeholder: '1' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => html`
      <section style="display: flex; align-items: center; margin: 1.8em 0 1em; padding-bottom: 8px; border-bottom: 1px solid ${ctx.color.tint(0.7)};">
        <section style="flex-shrink: 0; width: 34px; height: 34px; line-height: 34px; text-align: center; background: ${ctx.color.main};
          color: #fff; font-weight: bold; font-size: 17px; border-radius: 6px;">${esc(params.no ?? '1')}</section>
        <section style="margin-left: 12px; font-size: ${ctx.fontSize * 1.15}px; font-weight: bold; color: ${TITLE_COLOR}; line-height: 1.5;">
          ${ctx.renderInline(raw.trim())}</section>
      </section>`,
  },
  {
    id: 'title-brackets',
    name: '书名号标题',
    category: 'title',
    tags: ['古风', '文艺'],
    example: ':::title-brackets\n心随秋静，守岁月安然\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 2em 0 1.2em; text-align: center; font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; color: ${TITLE_COLOR};
        letter-spacing: 2px;">
        <span style="color: ${ctx.color.main}; font-size: ${ctx.fontSize * 1.5}px;">「</span>${ctx.renderInline(raw.trim())}<span style="color: ${ctx.color.main}; font-size: ${ctx.fontSize * 1.5}px;">」</span>
      </section>`,
  },
  {
    id: 'title-lines',
    name: '渐变双线标题',
    category: 'title',
    tags: ['简约', '清新', '通用'],
    example: ':::title-lines\n专注本身，褪去冗余\n:::',
    render: ({ raw, ctx }) => html`
      <section style="display: flex; align-items: center; margin: 2em 0 1.2em;">
        <section style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, ${ctx.color.main});"></section>
        <section style="padding: 0 14px; font-size: ${ctx.fontSize * 1.15}px; font-weight: bold; color: ${ctx.color.main};">
          ${ctx.renderInline(raw.trim())}</section>
        <section style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, ${ctx.color.main});"></section>
      </section>`,
  },
  {
    id: 'title-chapter',
    name: '圆环章节标题',
    category: 'title',
    tags: ['文艺', '古风', '编号'],
    example: ':::title-chapter{no="第一章" sub="CHAPTER ONE"}\n初见\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 2em 0 1.2em; text-align: center;">
        <section style="display: inline-block; width: 56px; height: 56px; line-height: 52px; border-radius: 50%; border: 2px solid ${ctx.color.main};
          color: ${ctx.color.main}; font-size: 13px; font-weight: bold; box-sizing: border-box;">${esc(params.no ?? '第一章')}</section>
        <section style="margin-top: 8px; font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; color: ${TITLE_COLOR}; letter-spacing: 2px;">
          ${ctx.renderInline(raw.trim())}</section>
        ${params.sub && html`<section style="font-size: 11px; color: #aaa; letter-spacing: 3px; margin-top: 2px;">${esc(params.sub)}</section>`}
      </section>`,
  },
  {
    id: 'title-shadow',
    name: '错位投影标题',
    category: 'title',
    tags: ['潮流', '色彩'],
    example: ':::title-shadow\n错位投影标题\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.8em 0 1.2em;">
        <span style="display: inline-block; padding: 6px 16px; border: 2px solid #222; background: #fff; color: #222;
          font-size: ${ctx.fontSize * 1.15}px; font-weight: bold; box-shadow: 5px 5px 0 ${ctx.color.main};">${ctx.renderInline(raw.trim())}</span>
      </section>`,
  },
  {
    id: 'title-bgword',
    name: '英文衬底标题',
    category: 'title',
    tags: ['简约', '商务', '科技'],
    example: ':::title-bgword{en="INNOVATION"}\n创新破局 科技致远\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 2em 0 1.2em; text-align: center;">
        <section style="font-size: 38px; font-weight: 900; line-height: 1.3; color: ${ctx.color.alpha(0.13)}; letter-spacing: 2px;
          font-family: Arial, Helvetica, sans-serif;">${esc(params.en ?? 'TITLE')}</section>
        <section style="margin-top: -26px; font-size: ${ctx.fontSize * 1.25}px; font-weight: bold; color: ${TITLE_COLOR};">
          ${ctx.renderInline(raw.trim())}</section>
      </section>`,
  },
  {
    id: 'title-spring',
    name: '春节红金标题',
    category: 'title',
    tags: ['节日', '春节', '喜庆', '红色'],
    example: ':::title-spring\n新春快乐 万事如意\n:::',
    render: ({ params, raw, ctx }) => {
      const red = params.color ? ctx.color.main : '#c8161d'
      return html`
        <section style="margin: 2em 0 1.2em; text-align: center;">
          <section style="display: inline-block; padding: 10px 26px; background: ${red}; color: #ffe7a8; border: 3px double #f5c26b;
            border-radius: 4px; box-shadow: 0 0 0 4px ${red}; font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; letter-spacing: 4px;">
            <span style="color: #f5c26b;">✦ </span>${ctx.renderInline(raw.trim())}<span style="color: #f5c26b;"> ✦</span></section>
        </section>`
    },
  },
  {
    id: 'title-moon',
    name: '中秋明月标题',
    category: 'title',
    tags: ['节日', '中秋', '古风'],
    example: ':::title-moon\n但愿人长久\n:::',
    render: ({ raw, ctx }) => html`
      <section style="display: flex; align-items: center; justify-content: center; margin: 2em 0 1.2em;">
        <section style="flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff8dc, #f2c94c 70%, #e0a82e); box-shadow: 0 0 12px rgba(242,201,76,0.6);"></section>
        <section style="margin-left: 14px; font-size: ${ctx.fontSize * 1.25}px; font-weight: bold; color: #8a5a19; letter-spacing: 3px;
          font-family: 'Songti SC', 'STSong', SimSun, serif;">${ctx.renderInline(raw.trim())}</section>
      </section>`,
  },
]

export default blocks
