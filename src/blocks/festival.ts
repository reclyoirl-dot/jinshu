import { colorKit } from '../core/color'
import type { BlockContext, BlockDef } from '../core/types'
import { compact, esc, html } from './_utils'

// 节日默认色独立于文章主题；显式 color 参数交由渲染管线生成的 ColorKit 接管。
function palette(params: Record<string, string>, ctx: BlockContext, main: string, accent: string) {
  const color = params.color ? ctx.color : colorKit(main)
  return { ...color, accent: params.color ? color.tint(0.65) : accent }
}

// 仅接收本文件内的静态几何图形，不插入用户原文；无外部资源或 SVG id。
function drawing(width: number, height: number, shapes: string): string {
  return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"
    width="${width}" height="${height}" aria-hidden="true"
    style="display: block; max-width: 100%; height: auto; margin: 0 auto;">${shapes}</svg>`
}

function prose(raw: string, ctx: BlockContext): string {
  return raw.trim() ? html`<section style="margin-top: 12px; font-size: ${ctx.fontSize}px; line-height: 1.9; color: #555; text-align: left; overflow-wrap: anywhere;">
    ${compact(ctx.render(raw))}</section>` : ''
}

const blocks: BlockDef[] = [
  {
    id: 'fest-new-year',
    name: '元旦 · 翻开新历',
    category: 'title',
    tags: ['节日', '元旦', '简约'],
    example: ':::fest-new-year{sub="新的一页，写给热爱的生活"}\n把第一缕光，写进新年\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#236c86', '#d6aa57')
      return html`<section style="margin: 28px 0 20px; display: flex; align-items: center; border-bottom: 1px solid ${c.tint(0.76)}; padding-bottom: 18px; overflow-wrap: anywhere;">
        <section style="flex: 0 0 65px; margin-right: 16px; text-align: center; border: 1px solid ${c.tint(0.55)}; border-radius: 8px; background: ${c.tint(0.96)};">
          <section style="padding: 3px; background: ${c.main}; color: #fff; border-radius: 7px 7px 0 0; font-size: 12px; letter-spacing: 2px;">元旦</section>
          <section style="font-size: 36px; line-height: 1.3; color: ${c.main}; font-family: Georgia, serif;">01</section>
          <section style="padding-bottom: 6px; font-size: 12px; color: ${c.accent};">✦ JAN ✦</section>
        </section>
        <section style="flex: 1; min-width: 0;">
          <section style="font-size: ${ctx.fontSize * 1.3}px; font-weight: bold; line-height: 1.6; color: ${c.shade(0.2)};">${ctx.renderInline(raw.trim())}</section>
          <section style="margin-top: 7px; font-size: 12px; color: #888;">${esc(params.sub ?? '一元复始，万象更新')}</section>
        </section>
      </section>`
    },
  },
  {
    id: 'fest-spring-couplet',
    name: '春节 · 春联横批',
    category: 'title',
    tags: ['节日', '春节', '古风'],
    example: ':::fest-spring-couplet{left="春来万物生" right="岁暖千家福" sub="灯火可亲，归家有期"}\n人间好时节\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#ae292c', '#f3d798')
      const strip = (text: string) => html`<section style="flex: 0 0 30px; padding: 12px 5px; box-sizing: border-box; background: ${c.main}; border-top: 3px solid ${c.accent}; border-bottom: 3px solid ${c.accent}; color: ${c.accent}; font-size: 14px; line-height: 1.7; text-align: center; overflow-wrap: anywhere;">${Array.from(text).map((char) => html`<span style="display: block;">${esc(char)}</span>`)}</section>`
      return html`<section style="margin: 28px 0 20px; padding: 16px 12px; background: ${c.tint(0.96)}; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: center;">
          ${strip(params.left ?? '春来万物生')}
          <section style="flex: 1; min-width: 0; margin: 0 10px; text-align: center;">
            <section style="padding: 9px 5px; background: ${c.main}; color: ${c.accent}; border-top: 1px solid ${c.accent}; border-bottom: 1px solid ${c.accent}; font-size: ${ctx.fontSize * 1.3}px; font-weight: bold; letter-spacing: 3px; font-family: SimSun, serif;">${ctx.renderInline(raw.trim())}</section>
            <section style="margin: 14px 0 5px; font-size: 20px; color: ${c.main};">❀</section>
            <section style="font-size: 12px; line-height: 1.8; color: ${c.shade(0.2)};">${esc(params.sub ?? '迎春接福，岁岁安康')}</section>
          </section>
          ${strip(params.right ?? '岁暖千家福')}
        </section>
      </section>`
    },
  },
  {
    id: 'fest-spring-fu',
    name: '春节 · 福满家书',
    category: 'body',
    tags: ['节日', '春节', '古风'],
    example: ':::fest-spring-fu{title="把福气，带回家"}\n年味是灶台上的热气，也是门口那一声等了许久的「回来啦」。\n\n愿新岁三餐有暖，四季有伴，所念之人都在身旁。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#b92832', '#efcd85')
      return html`<section style="margin: 24px 0; padding: 24px 20px 18px; background: #fffaf0; border: 1px solid ${c.tint(0.7)}; text-align: center; overflow-wrap: anywhere;">
        <section style="display: inline-block; margin: 18px 0 26px; width: 78px; height: 78px; box-sizing: border-box; padding: 7px; transform: rotate(45deg); background: ${c.main}; box-shadow: 4px 4px 0 ${c.accent};">
          <section style="border: 1px solid ${c.accent}; width: 62px; height: 62px; box-sizing: border-box;">
            <span style="display: block; transform: rotate(-45deg); line-height: 60px; font-family: SimSun, serif; font-size: 40px; color: ${c.accent};">福</span>
          </section>
        </section>
        <section style="font-size: ${ctx.fontSize * 1.2}px; color: ${c.main}; font-weight: bold; letter-spacing: 2px;">${esc(params.title ?? '把福气，带回家')}</section>
        ${prose(raw, ctx)}
        <section style="margin-top: 16px; border-top: 1px dashed ${c.tint(0.6)}; padding-top: 10px; font-size: 12px; letter-spacing: 3px; color: ${c.main};">新春 · 万事胜意</section>
      </section>`
    },
  },
  {
    id: 'fest-lantern',
    name: '元宵 · 灯火团圆',
    category: 'title',
    tags: ['节日', '元宵', '古风'],
    example: ':::fest-lantern{sub="一碗汤圆，盛满人间的圆满"}\n灯火映万家，今宵共团圆\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#bd4934', '#e8b65b')
      const lantern = drawing(150, 92, html`<path d="M0 12 Q75 34 150 12" fill="none" stroke="${c.accent}" stroke-width="2"/>
        <path d="M49 22 V30 M103 21 V38" stroke="${c.accent}" stroke-width="2"/>
        <ellipse cx="49" cy="49" rx="27" ry="20" fill="${c.main}"/>
        <ellipse cx="49" cy="49" rx="14" ry="20" fill="none" stroke="${c.accent}"/>
        <path d="M28 40 H70 M28 58 H70 M49 69 V85 M44 76 V89 M54 76 V89" stroke="${c.accent}" stroke-width="2"/>
        <ellipse cx="103" cy="54" rx="18" ry="16" fill="${c.tint(0.2)}"/>
        <path d="M103 38 Q90 54 103 70 Q116 54 103 38 M103 70 V85" fill="none" stroke="${c.accent}" stroke-width="2"/>`)
      return html`<section style="margin: 24px 0; text-align: center; padding: 0 12px 18px; border-bottom: 1px solid ${c.tint(0.75)}; overflow-wrap: anywhere;">
        ${lantern}
        <section style="margin-top: 8px; color: ${c.main}; font-size: ${ctx.fontSize * 1.35}px; font-weight: bold; font-family: SimSun, serif; letter-spacing: 2px;">${ctx.renderInline(raw.trim())}</section>
        <section style="margin-top: 8px; font-size: 12px; color: #888;">${esc(params.sub ?? '上元灯暖，喜乐长安')}</section>
      </section>`
    },
  },
  {
    id: 'fest-valentine',
    name: '情人节 · 心动邮笺',
    category: 'body',
    tags: ['节日', '情人节', '文艺'],
    example: ':::fest-valentine{to="致最特别的你" sign="爱在每一个平凡日子"}\n喜欢是与你分享一朵云、一杯热茶，以及生活里每一件不起眼的小事。\n\n愿往后的晨昏，都能和你慢慢走。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#b75070', '#e9c0ca')
      return html`<section style="margin: 24px 0; padding: 5px; background: repeating-linear-gradient(135deg, ${c.tint(0.3)} 0, ${c.tint(0.3)} 8px, #fff 8px, #fff 16px, ${c.accent} 16px, ${c.accent} 24px, #fff 24px, #fff 32px); overflow-wrap: anywhere;">
        <section style="padding: 18px; background: #fffafc;">
          <section style="display: flex; align-items: center; justify-content: space-between; color: ${c.main};">
            <span style="min-width: 0; font-size: 13px; letter-spacing: 1px;">${esc(params.to ?? '致最特别的你')}</span>
            <span style="flex-shrink: 0; margin-left: 12px; border: 1px dashed ${c.main}; padding: 6px 9px; font-size: 22px;">♡</span>
          </section>
          ${prose(raw, ctx)}
          <section style="margin-top: 18px; text-align: right; font-size: 12px; color: ${c.main};">♥ ${esc(params.sign ?? '爱在每一个平凡日子')}</section>
        </section>
      </section>`
    },
  },
  {
    id: 'fest-womens-day',
    name: '妇女节 · 自在盛放',
    category: 'title',
    tags: ['节日', '妇女节', '文艺'],
    example: ':::fest-womens-day{sub="不被定义，自有光芒"}\n她的每一种选择，都值得盛放\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#78558c', '#c6a0ae')
      return html`<section style="margin: 28px 0; padding: 20px 18px; border-radius: 60px 0 60px 0; background: ${c.tint(0.94)}; border-left: 2px solid ${c.accent}; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: center; color: ${c.main};">
          <span style="font-size: 36px; line-height: 1.3; margin-right: 12px;">♀</span>
          <section style="min-width: 0; font-size: 12px; letter-spacing: 3px; line-height: 1.8;">03 / 08<br>自在生长 · 自在绽放</section>
          <span style="margin-left: auto; padding-left: 8px; font-size: 30px; color: ${c.accent};">✿</span>
        </section>
        <section style="margin-top: 18px; font-size: ${ctx.fontSize * 1.35}px; font-weight: bold; color: ${c.shade(0.25)}; line-height: 1.6;">${ctx.renderInline(raw.trim())}</section>
        <section style="margin-top: 9px; font-size: 12px; color: #888;">${esc(params.sub ?? '愿每一位女性，拥有选择的自由')}</section>
      </section>`
    },
  },
  {
    id: 'fest-qingming',
    name: '清明 · 青山寄思',
    category: 'body',
    tags: ['节日', '清明', '古风'],
    example: ':::fest-qingming{title="风过青山，念念清明"}\n细雨落在新绿的枝头，思念也有了温柔的回声。\n\n把牵挂寄给春风，把日子过得清明。那些被爱照亮的时光，始终在心里生长。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#417b68', '#a9bca2')
      const landscape = drawing(280, 74, html`<path d="M0 65 Q25 38 46 47 Q79 4 115 45 Q138 24 166 50 Q208 0 249 41 L280 32 V74 H0Z" fill="${c.tint(0.84)}"/>
        <path d="M0 73 Q33 48 65 60 Q98 26 135 63 Q180 34 210 60 Q244 43 280 64 V74 H0Z" fill="${c.tint(0.6)}"/>
        <path d="M203 7 Q234 20 262 10 M229 16 Q219 33 215 44 M246 15 Q238 31 240 40" fill="none" stroke="${c.main}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M224 26 Q212 21 215 34 Q226 35 224 26 M242 27 Q232 22 235 34 Q246 36 242 27" fill="${c.accent}"/>`)
      return html`<section style="margin: 24px 0; background: ${c.tint(0.97)}; padding: 20px 20px 0; border-top: 1px solid ${c.tint(0.65)}; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: center;">
          <span style="flex-shrink: 0; padding: 7px 4px; margin-right: 12px; border: 1px solid ${c.main}; color: ${c.main}; font-family: SimSun, serif; font-size: 13px; line-height: 1.5;">清<br>明</span>
          <section style="min-width: 0; font-size: ${ctx.fontSize * 1.2}px; color: ${c.shade(0.3)}; font-family: SimSun, serif; letter-spacing: 2px;">${esc(params.title ?? '风过青山，念念清明')}</section>
        </section>
        ${prose(raw, ctx)}
        <section style="margin-top: 14px;">${landscape}</section>
      </section>`
    },
  },
  {
    id: 'fest-labor',
    name: '劳动节 · 致敬每一双手',
    category: 'body',
    tags: ['节日', '劳动节', '企业'],
    example: ':::fest-labor{title="把平凡，做成不凡" sub="致敬每一位认真生活的劳动者"}\n从清晨的第一班车，到深夜仍亮着的窗口，每一份默默付出，都让城市向前一步。\n\n谢谢你，用双手把日子建成了更好的模样。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#a84632', '#c6a36b')
      return html`<section style="margin: 24px 0; border: 1px solid ${c.tint(0.65)}; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: stretch; border-bottom: 1px solid ${c.tint(0.65)};">
          <section style="flex: 0 0 68px; padding: 12px 3px; text-align: center; background: ${c.main}; color: #fff;">
            <section style="font-size: 28px; font-weight: bold; line-height: 1.3;">05.01</section>
            <section style="font-size: 12px; margin-top: 5px; color: ${c.accent};">★ LABOR</section>
          </section>
          <section style="flex: 1; min-width: 0; padding: 12px; background: ${c.tint(0.96)};">
            <section style="font-size: ${ctx.fontSize * 1.15}px; font-weight: bold; color: ${c.main};">${esc(params.title ?? '把平凡，做成不凡')}</section>
            <section style="font-size: 12px; color: #888; margin-top: 5px;">${esc(params.sub ?? '致敬每一位认真生活的劳动者')}</section>
          </section>
        </section>
        <section style="padding: 0 16px 14px;">${prose(raw, ctx)}</section>
        <section style="height: 5px; background: repeating-linear-gradient(135deg, ${c.main} 0, ${c.main} 6px, ${c.accent} 6px, ${c.accent} 12px);"></section>
      </section>`
    },
  },
  {
    id: 'fest-dragon-boat',
    name: '端午 · 粽叶裹安康',
    category: 'body',
    tags: ['节日', '端午', '古风'],
    example: ':::fest-dragon-boat{title="一叶一粽，都是牵挂"}\n粽叶裹住糯米，也裹住了家里的好时光。艾草清香过门，牵挂便有了熟悉的味道。\n\n愿你端午安康，顺遂如常。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#366b43', '#d1bd80')
      const zongzi = drawing(80, 80, html`<path d="M40 7 Q45 4 49 13 L72 62 Q75 69 66 71 L16 71 Q7 71 11 61 L34 13 Q37 6 40 7Z" fill="${c.main}" stroke="${c.shade(0.2)}" stroke-width="2"/>
        <path d="M15 59 L49 15 M23 70 L60 38 M12 62 L67 62 M25 32 L58 70" fill="none" stroke="${c.tint(0.25)}" stroke-width="2"/>
        <path d="M30 25 L55 70 M17 47 L64 47" stroke="${c.accent}" stroke-width="3"/>
        <path d="M43 47 Q56 29 57 41 Q58 50 43 47 Q29 35 32 46 Q34 54 43 47 L39 60 M43 47 L52 57" fill="none" stroke="${c.accent}" stroke-width="2"/>`)
      return html`<section style="margin: 24px 0; padding: 16px 18px; background: ${c.tint(0.96)}; border-radius: 36px 4px 36px 4px; border-right: 4px solid ${c.main}; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: center;">
          <section style="flex: 0 0 72px; margin-right: 12px;">${zongzi}</section>
          <section style="flex: 1; min-width: 0;">
            <section style="font-size: 12px; color: ${c.main}; letter-spacing: 3px;">端 / 午 / 安 / 康</section>
            <section style="margin-top: 8px; color: ${c.shade(0.2)}; font-size: ${ctx.fontSize * 1.2}px; font-weight: bold;">${esc(params.title ?? '一叶一粽，都是牵挂')}</section>
          </section>
        </section>
        ${prose(raw, ctx)}
      </section>`
    },
  },
  {
    id: 'fest-childrens-day',
    name: '儿童节 · 云端气球',
    category: 'title',
    tags: ['节日', '儿童节', '可爱', '色彩'],
    example: ':::fest-childrens-day{sub="愿好奇心永远有一片自由的天空"}\n把快乐，放飞到云朵上\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#397ca8', '#edbd4c')
      const pink = params.color ? c.tint(0.4) : '#dc8188'
      const green = params.color ? c.shade(0.15) : '#6fae99'
      const balloons = drawing(210, 100, html`<path d="M53 59 Q67 76 68 96 M102 48 Q89 77 105 96 M157 62 Q146 82 146 96" fill="none" stroke="${c.tint(0.5)}" stroke-width="1.5"/>
        <ellipse cx="47" cy="34" rx="22" ry="28" fill="${pink}"/><path d="M47 59 L43 65 H52Z" fill="${pink}"/>
        <ellipse cx="104" cy="27" rx="21" ry="25" fill="${c.accent}"/><path d="M104 50 L99 56 H108Z" fill="${c.accent}"/>
        <ellipse cx="159" cy="40" rx="23" ry="26" fill="${green}"/><path d="M159 63 L154 68 H163Z" fill="${green}"/>
        <path d="M34 24 Q35 17 40 15 M92 20 Q93 13 98 11 M146 31 Q147 24 152 22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <path d="M7 67 H15 M11 63 V71 M190 18 H198 M194 14 V22" stroke="${c.accent}" stroke-width="2"/>`)
      return html`<section style="margin: 24px 0; padding: 14px 16px 20px; text-align: center; background: ${c.tint(0.96)}; border-radius: 36px 36px 12px 12px; border-bottom: 4px dotted ${c.accent}; overflow-wrap: anywhere;">
        ${balloons}
        <section style="font-size: ${ctx.fontSize * 1.35}px; font-weight: bold; color: ${c.main}; line-height: 1.6;">${ctx.renderInline(raw.trim())}</section>
        <section style="margin-top: 8px; font-size: 12px; color: #777;">${esc(params.sub ?? '小小的你，有大大的梦想')}</section>
      </section>`
    },
  },
  {
    id: 'fest-qixi',
    name: '七夕 · 鹊桥星河',
    category: 'body',
    tags: ['节日', '七夕', '文艺'],
    example: ':::fest-qixi{title="星河有渡，相逢有期" sub="迢迢银河，藏着一句想你"}\n越过日常的忙碌，仍想把今晚最亮的一颗星指给你看。\n\n人间烟火很长，幸好身旁是你。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#414575', '#e7c98e')
      const bridge = drawing(260, 72, html`<path d="M7 67 Q130 -14 253 67 M9 58 Q130 -23 251 58" fill="none" stroke="${c.accent}" stroke-width="1.5"/>
        <path d="M40 40 V49 M70 26 V35 M100 18 V27 M130 15 V24 M160 18 V27 M190 26 V35 M220 40 V49" stroke="${c.accent}" stroke-width="2"/>
        <path d="M112 12 Q118 5 124 12 Q130 5 136 12 M148 8 Q154 1 160 8 Q166 1 172 8" fill="none" stroke="${c.accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="20" cy="13" r="2" fill="${c.accent}"/><circle cx="239" cy="7" r="2" fill="${c.accent}"/>`)
      return html`<section style="margin: 24px 0; padding: 22px 20px 16px; background: ${c.shade(0.2)}; border-radius: 70px 70px 8px 8px; overflow-wrap: anywhere;">
        <section style="text-align: center; color: ${c.accent}; font-size: 14px; letter-spacing: 9px;">✦ · 七夕 · ✦</section>
        <section style="margin: 18px 0 8px; color: #fff; text-align: center; font-size: ${ctx.fontSize * 1.3}px; font-family: SimSun, serif; letter-spacing: 2px;">${esc(params.title ?? '星河有渡，相逢有期')}</section>
        <section style="text-align: center; color: ${c.accent}; font-size: 12px;">${esc(params.sub ?? '迢迢银河，藏着一句想你')}</section>
        <section style="margin: 16px 0; padding: 1px 14px 8px; background: #fff; border-radius: 6px;">${prose(raw, ctx)}</section>
        ${bridge}
      </section>`
    },
  },
  {
    id: 'fest-mid-autumn-moon',
    name: '中秋 · 月下团圆笺',
    category: 'body',
    tags: ['节日', '中秋', '古风'],
    example: ':::fest-mid-autumn-moon{title="今夜，月与人团圆" sub="一轮明月，照见万家牵挂"}\n桂香落进茶盏，月光铺满庭院。走过再远的路，总有一盏灯为你留着。\n\n愿此刻的圆满，也照亮往后的每一天。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#365e71', '#d7b970')
      const moon = drawing(130, 104, html`<circle cx="65" cy="48" r="40" fill="${c.accent}"/>
        <circle cx="49" cy="32" r="8" fill="#ffffff" fill-opacity="0.2"/><circle cx="78" cy="58" r="12" fill="#ffffff" fill-opacity="0.12"/>
        <path d="M10 72 H55 Q60 62 71 69 Q81 58 91 71 H122 M0 83 H37 M88 91 H130" fill="none" stroke="${c.tint(0.7)}" stroke-width="2" stroke-linecap="round"/>
        <path d="M97 6 V15 M93 10 H101" stroke="${c.accent}" stroke-width="1.5"/>`)
      return html`<section style="margin: 24px 0; border-radius: 90px 90px 6px 6px; background: ${c.main}; padding: 16px 12px 12px; overflow-wrap: anywhere;">
        ${moon}
        <section style="margin: 0 8px 18px; text-align: center; font-size: ${ctx.fontSize * 1.35}px; color: #fff; font-family: SimSun, serif; letter-spacing: 2px;">${esc(params.title ?? '今夜，月与人团圆')}</section>
        <section style="padding: 16px; background: #fffdf7; border-radius: 4px;">
          <section style="font-size: 12px; color: ${c.main}; letter-spacing: 1px; border-bottom: 1px solid ${c.tint(0.8)}; padding-bottom: 10px;">${esc(params.sub ?? '一轮明月，照见万家牵挂')}</section>
          ${prose(raw, ctx)}
        </section>
      </section>`
    },
  },
  {
    id: 'fest-mid-autumn-cake',
    name: '中秋 · 月饼花纹分割线',
    category: 'divider',
    tags: ['节日', '中秋', '美食'],
    example: ':::fest-mid-autumn-cake\n一口月饼，一份团圆\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#a77435', '#e6c586')
      const cake = drawing(58, 58, html`<path d="M29 3 Q34 0 38 7 Q46 4 48 13 Q56 14 53 23 Q61 29 53 35 Q56 44 48 45 Q46 54 38 51 Q34 58 29 55 Q24 58 20 51 Q12 54 10 45 Q2 44 5 35 Q-3 29 5 23 Q2 14 10 13 Q12 4 20 7 Q24 0 29 3Z" fill="${c.accent}" stroke="${c.main}" stroke-width="1.5"/>
        <circle cx="29" cy="29" r="18" fill="none" stroke="${c.main}" stroke-width="1.5"/>
        <path d="M29 15 L43 29 L29 43 L15 29Z M23 29 H35 M29 23 V35" fill="none" stroke="${c.main}" stroke-width="1.5"/>`)
      return html`<section style="margin: 26px 0; text-align: center; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: center;">
          <section style="flex: 1; height: 4px; border-top: 1px solid ${c.accent}; border-bottom: 1px dashed ${c.main};"></section>
          <section style="flex: 0 0 58px; margin: 0 16px;">${cake}</section>
          <section style="flex: 1; height: 4px; border-top: 1px solid ${c.accent}; border-bottom: 1px dashed ${c.main};"></section>
        </section>
        <section style="margin-top: 9px; font-size: 12px; color: ${c.main}; letter-spacing: 2px;">${ctx.renderInline(raw.trim() || '一口月饼，一份团圆')}</section>
      </section>`
    },
  },
  {
    id: 'fest-national-day',
    name: '国庆 · 山河华章',
    category: 'title',
    tags: ['节日', '国庆', '企业'],
    example: ':::fest-national-day{sub="山河锦绣，万家同庆"}\n把心中的热爱，写给中国\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#b5232e', '#eed093')
      return html`<section style="margin: 26px 0; padding: 4px; background: ${c.accent}; overflow-wrap: anywhere;">
        <section style="background: ${c.main}; padding: 20px 18px 0;">
          <section style="display: flex; align-items: center; justify-content: space-between; color: ${c.accent};">
            <span style="font-size: 32px; line-height: 1.3;">★</span>
            <span style="font-size: 12px; letter-spacing: 3px;">10.01 / 国庆</span>
          </section>
          <section style="margin-top: 20px; color: #fff; font-size: ${ctx.fontSize * 1.5}px; line-height: 1.6; font-weight: bold; letter-spacing: 2px;">${ctx.renderInline(raw.trim())}</section>
          <section style="margin-top: 12px; font-size: 12px; color: ${c.accent};">${esc(params.sub ?? '山河锦绣，万家同庆')}</section>
          <section style="margin-top: 24px; display: flex; align-items: flex-end; height: 20px;">
            ${[10, 15, 8, 20, 13, 17, 9, 14, 19, 11].map((height) => html`<section style="flex: 1; margin: 0 2px; height: ${height}px; background: ${c.accent};"></section>`)}
          </section>
        </section>
      </section>`
    },
  },
  {
    id: 'fest-teachers-day',
    name: '教师节 · 一页师恩',
    category: 'body',
    tags: ['节日', '教师节', '教育'],
    example: ':::fest-teachers-day{title="您教过的，后来都成了光" sign="九月十日 · 致敬师者"}\n曾以为您讲的是一道题，后来才懂，那也是面对世界的方法。\n\n感谢每一次耐心的等待，让懵懂的我们，慢慢长成自己的答案。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#3c665c', '#b5a277')
      return html`<section style="margin: 24px 0; display: flex; background: #fffdf8; border: 1px solid ${c.tint(0.65)}; border-radius: 2px 10px 10px 2px; box-shadow: 3px 3px 0 ${c.tint(0.88)}; overflow-wrap: anywhere;">
        <section style="flex: 0 0 22px; background: ${c.main}; border-right: 3px double ${c.accent}; padding-top: 18px; text-align: center; color: ${c.accent}; font-size: 13px; line-height: 1.8;">师<br>恩<br>长<br>记</section>
        <section style="flex: 1; min-width: 0; padding: 18px 16px;">
          <section style="font-size: 12px; color: ${c.main}; letter-spacing: 2px;">✎ 09.10 · 感谢有您</section>
          <section style="margin-top: 12px; font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; line-height: 1.6; color: ${c.shade(0.2)};">${esc(params.title ?? '您教过的，后来都成了光')}</section>
          ${prose(raw, ctx)}
          <section style="margin-top: 18px; padding-top: 9px; border-top: 1px solid ${c.tint(0.8)}; text-align: right; font-size: 12px; color: #888;">${esc(params.sign ?? '九月十日 · 致敬师者')}</section>
        </section>
      </section>`
    },
  },
  {
    id: 'fest-double-ninth',
    name: '重阳 · 菊香登高',
    category: 'body',
    tags: ['节日', '重阳', '古风'],
    example: ':::fest-double-ninth{title="岁岁重阳，久久相伴"}\n陪您再走一段山路，听您再讲一遍往事。菊花开得正好，今天的风也不急。\n\n愿岁月慢一点，让陪伴长一点。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#95702d', '#d4b764')
      const flower = drawing(88, 100, html`<path d="M44 52 V98 M44 80 Q22 58 19 78 Q26 91 44 88 M44 88 Q62 65 71 79 Q63 96 44 93" fill="${c.tint(0.7)}" stroke="${c.main}" stroke-width="1.5"/>
        ${Array.from({ length: 12 }, (_, i) => html`<ellipse cx="44" cy="28" rx="5" ry="21" fill="${i % 2 ? c.tint(0.45) : c.accent}" stroke="${c.main}" stroke-width="0.7" transform="rotate(${i * 30} 44 45)"/>`)}
        <circle cx="44" cy="45" r="8" fill="${c.main}"/>`)
      return html`<section style="margin: 24px 0; padding: 18px; background: #fffcf4; border-left: 1px solid ${c.accent}; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: center; border-bottom: 1px solid ${c.tint(0.8)}; padding-bottom: 12px;">
          <section style="flex: 1; min-width: 0;">
            <section style="font-size: 12px; color: ${c.main}; letter-spacing: 3px;">九月初九 · 重阳</section>
            <section style="margin-top: 12px; color: ${c.shade(0.15)}; font-size: ${ctx.fontSize * 1.25}px; font-family: SimSun, serif; line-height: 1.7;">${esc(params.title ?? '岁岁重阳，久久相伴')}</section>
          </section>
          <section style="flex: 0 0 76px; margin-left: 8px;">${flower}</section>
        </section>
        ${prose(raw, ctx)}
      </section>`
    },
  },
  {
    id: 'fest-double-eleven',
    name: '双十一 · 好物心愿票',
    category: 'body',
    tags: ['节日', '双十一', '电商', '潮流'],
    example: ':::fest-double-eleven{title="心愿清单，今天兑现" offer="每满300减50" note="11月11日 00:00—23:59 · 指定商品参与"}\n给书桌添一盏暖灯，给冬天备一条软围巾。把预算留给真正喜欢、也真正需要的好物。\n\n**慢慢挑，认真选，让每一份喜欢都物有所值。**\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#a42e67', '#f2b74f')
      return html`<section style="margin: 24px 0; border: 2px solid ${c.main}; border-radius: 14px; background: ${c.tint(0.97)}; overflow-wrap: anywhere;">
        <section style="padding: 16px; background: ${c.main}; color: #fff; border-radius: 10px 10px 0 0;">
          <section style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 36px; line-height: 1.3; font-weight: bold; color: ${c.accent};">11.11</span>
            <span style="font-size: 12px; border: 1px solid ${c.accent}; padding: 3px 7px; margin-left: 8px;">好物心愿票 ✦</span>
          </section>
          <section style="font-size: ${ctx.fontSize * 1.2}px; margin-top: 12px; font-weight: bold;">${esc(params.title ?? '心愿清单，今天兑现')}</section>
        </section>
        <section style="padding: 18px 16px 14px; border-bottom: 2px dashed ${c.tint(0.6)};">
          <section style="display: inline-block; padding: 5px 12px; background: ${c.accent}; color: ${c.shade(0.4)}; font-size: 24px; font-weight: bold;">${esc(params.offer ?? '每满300减50')}</section>
          ${prose(raw, ctx)}
        </section>
        <section style="padding: 10px 16px; font-size: 12px; color: #888;">${esc(params.note ?? '优惠以实际活动规则为准，按需选购')}</section>
      </section>`
    },
  },
  {
    id: 'fest-christmas',
    name: '圣诞 · 冬日雪松',
    category: 'body',
    tags: ['节日', '圣诞', '清新'],
    example: ':::fest-christmas{title="愿你的冬天，有光有暖" sub="MERRY CHRISTMAS"}\n把小小的心愿挂上树梢，把热可可捧在手心。窗外有雪，心里有惦念的人。\n\n愿每一份善意，都在这个冬天收到温柔的回音。\n:::',
    render: ({ params, raw, ctx }) => {
      const c = palette(params, ctx, '#316453', '#b34443')
      const gold = params.color ? c.tint(0.6) : '#c9ab6f'
      const tree = drawing(96, 104, html`<path d="M48 4 L51 11 L59 11 L53 16 L55 24 L48 19 L41 24 L43 16 L37 11 L45 11Z" fill="${gold}"/>
        <path d="M48 24 L28 48 H36 L18 70 H28 L8 91 H88 L68 70 H78 L60 48 H68Z" fill="${c.main}"/>
        <path d="M28 56 Q48 69 68 56 M20 76 Q48 88 76 76" fill="none" stroke="${gold}" stroke-width="2"/>
        <path d="M44 91 V103 H52 V91" fill="${gold}"/>
        <circle cx="43" cy="47" r="3" fill="${c.accent}"/><circle cx="56" cy="69" r="3.5" fill="${c.accent}"/>
        <path d="M9 19 H19 M14 14 V24 M77 28 H89 M83 22 V34 M79 24 L87 32 M79 32 L87 24" stroke="${c.tint(0.45)}" stroke-width="1.5"/>`)
      return html`<section style="margin: 24px 0; padding: 18px; background: #fffdf8; border-top: 4px solid ${c.main}; border-bottom: 4px solid ${c.accent}; border-radius: 8px; overflow-wrap: anywhere;">
        <section style="text-align: center; color: ${c.accent}; font-size: 12px; letter-spacing: 3px;">❄ ${esc(params.sub ?? 'MERRY CHRISTMAS')} ❄</section>
        <section style="margin-top: 14px; display: flex; align-items: center;">
          <section style="flex: 0 0 80px; margin-right: 14px;">${tree}</section>
          <section style="flex: 1; min-width: 0; color: ${c.main}; font-size: ${ctx.fontSize * 1.3}px; font-family: SimSun, serif; line-height: 1.7;">${esc(params.title ?? '愿你的冬天，有光有暖')}</section>
        </section>
        ${prose(raw, ctx)}
        <section style="margin-top: 16px; text-align: center; color: ${gold}; font-size: 14px; letter-spacing: 8px;">❄ · ✦ · ❄</section>
      </section>`
    },
  },
]

export default blocks
