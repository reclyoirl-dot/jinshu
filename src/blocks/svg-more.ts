import type { BlockDef } from '../core/types'
import { esc, extractImages, html, lines, SAMPLE_IMG, splitFirst } from './_utils'

// 复用 svg.ts 的无 id 工具思路；所有 SMIL 仅依赖本元素或冒泡的 click。
const FONT = "-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
const EASE = 'calcMode="spline" keyTimes="0;1" keySplines="0.22 0.7 0.25 1"'
const svg = (w: number, h: number, body: string) =>
  html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="display:block;width:100%;height:auto;overflow:hidden;" font-family="${FONT}">${body}</svg>`
const wrap = (inner: string) => html`<section style="margin:1.4em 0;line-height:0;">${inner}</section>`
const units = (s: string) => Array.from(s).reduce((n, ch) => n + (/[\u0000-ÿ]/.test(ch) ? 0.58 : 1), 0)

/** 不能出现在行首的标点（避头点） */
const NO_LINE_START = /[，。、；：？！）》」』”’,.;:?!)]/

function wrapText(s: string, maxUnits: number): string[] {
  const out: string[] = []
  for (const para of s.split(/\n+/)) {
    let line = ''
    let width = 0
    for (const ch of Array.from(para.trim())) {
      const cw = /[\u0000-ÿ]/.test(ch) ? 0.58 : 1
      if (width + cw > maxUnits && line && !NO_LINE_START.test(ch)) {
        out.push(line)
        line = ''
        width = 0
      }
      line += ch
      width += cw
    }
    if (line) out.push(line)
  }
  return out
}

const plain = (s: string) => s
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/[*_\x60~#>]/g, '')
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
  .trim()
const fitSize = (text: string, max: number, width: number) =>
  Math.max(12, Math.min(max, Math.floor(width / Math.max(1, units(text)))))
const numeric = (s: string | undefined, fallback: number, min: number, max: number) => {
  const n = Number(s?.trim().replace(/[,，%％]/g, ''))
  return Math.max(min, Math.min(max, s?.trim() && Number.isFinite(n) ? n : fallback))
}
const textLines = (ls: string[], x: number, y: number, size = 14, lh = 23, color = '#333', anchor = 'start', weight = 'normal') =>
  ls.map((line, i) => html`<text x="${x}" y="${y + i * lh}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`).join('')
const copy = (s: string, width: number, size = 14) => wrapText(plain(s), width / size)
const fade = (begin = '0s', dur = 0.7) =>
  html`<animate attributeName="opacity" from="0" to="1" dur="${dur}s" begin="${begin}" fill="freeze" ${EASE}/>`
// 状态变化挂在同一遮罩 g 上，点击文字或背景都能触发，无需跨元素 id。
const dismiss = () => html`<animate attributeName="opacity" from="1" to="0" dur="0.45s" begin="click" restart="never" fill="freeze" ${EASE}/>
  <set attributeName="visibility" to="hidden" begin="click+0.45s" fill="freeze"/>`
const frame = (h: number, fill: string, stroke: string) =>
  html`<rect x="0.5" y="0.5" width="299" height="${h - 1}" rx="14" fill="${fill}" stroke="${stroke}"/>`
const pair = (s: string) => {
  // 优先中文冒号，兼容 09:30：集合 这样的时间字段。
  const i = s.includes('：') ? s.indexOf('：') : s.indexOf(':')
  return i > 0 ? [s.slice(0, i).trim(), s.slice(i + 1).trim()] : ['', s.trim()]
}

const blocks: BlockDef[] = [
  {
    id: 'sv-fold-letter',
    name: '点击展开长信',
    category: 'svg',
    tags: ['文艺', '通用', '动态', '互动'],
    example: ':::sv-fold-letter\n写给正在赶路的你\n今天也许没有惊天动地的进展，但你认真做好的每一件小事，都在悄悄铺向远方。\n累了就停一停，给自己泡杯热茶。花有花期，你也有自己的时区。\n:::',
    render: ({ raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      const title = copy(first || '一封给你的信', 244, 17)
      const body = copy(rest || '愿你在平凡的日子里，也能收获安稳与明亮。', 252)
      const collapsed = 52 + title.length * 25
      const h = collapsed + body.length * 25 + 42
      const header = (hint: string) => html`${textLines(title, 22, 32, 17, 25, ctx.color.shade(0.2), 'start', 'bold')}
        ${textLines([hint], 22, collapsed - 15, 12, 20, ctx.color.main)}`
      return wrap(svg(300, collapsed, html`${frame(h, ctx.color.tint(0.97), ctx.color.tint(0.7))}
        <path d="M278 0 L278 ${h}" stroke="${ctx.color.tint(0.8)}" stroke-dasharray="2 5"/>
        ${header('已展开 · 把日子慢慢读')}
        <line x1="22" y1="${collapsed}" x2="260" y2="${collapsed}" stroke="${ctx.color.tint(0.7)}"/>
        ${body.map((line, i) => html`<line x1="22" y1="${collapsed + 36 + i * 25}" x2="268" y2="${collapsed + 36 + i * 25}" stroke="${ctx.color.tint(0.86)}"/>${textLines([line], 22, collapsed + 29 + i * 25)}`).join('')}
        <g style="cursor:pointer;">
          <rect x="1" y="1" width="298" height="${collapsed - 2}" rx="14" fill="${ctx.color.tint(0.94)}"/>
          ${header('轻点展开这封信 ↓')}${dismiss()}
        </g>
        <animate attributeName="viewBox" from="0 0 300 ${collapsed}" to="0 0 300 ${h}" begin="click" dur="0.7s" restart="never" fill="freeze" ${EASE}/>
        <set attributeName="pointer-events" to="none" begin="click+0.7s" fill="freeze"/>`))
    },
  },
  {
    id: 'sv-before-after',
    name: '点击查看前后对比',
    category: 'svg',
    tags: ['教程', '简约', '动态', '互动'],
    example: ':::sv-before-after\n从前：把每天的空闲塞满，忙了一整天，依然不知道自己完成了什么。\n现在：只写下三件重要的事，留一段空白给散步，也留一点心力给生活。\n:::',
    render: ({ raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      const before = copy(first || '曾经：事情很多，却总在原地打转。', 244)
      const after = copy(rest || '现在：找准方向，让每一步都有回响。', 244)
      const h = 112 + Math.max(before.length, after.length) * 24
      const face = (label: string, ls: string[], final: boolean) => html`
        ${frame(h, final ? ctx.color.tint(0.94) : '#fff', ctx.color.tint(0.65))}
        <rect x="22" y="22" width="4" height="17" rx="2" fill="${final ? ctx.color.main : '#999'}"/>
        ${textLines([label], 36, 36, 12, 20, final ? ctx.color.main : '#999', 'start', 'bold')}
        ${textLines(ls, 26, 72, 14, 24, final ? ctx.color.shade(0.25) : '#666')}
        <line x1="26" y1="${h - 42}" x2="274" y2="${h - 42}" stroke="${ctx.color.tint(0.75)}"/>
        ${textLines([final ? '✓ 一个小改变，让生活轻一点' : '轻点查看 AFTER →'], 26, h - 21, 12, 20, ctx.color.main)}`
      return wrap(svg(300, h, html`${face('AFTER / 改变之后', after, true)}
        <g style="cursor:pointer;">${face('BEFORE / 改变之前', before, false)}${dismiss()}</g>`))
    },
  },
  {
    id: 'sv-photo-carousel',
    name: '自动横移旅行胶片',
    category: 'svg',
    tags: ['旅游', '文艺', '动态'],
    example: `:::sv-photo-carousel\n把周末交给山海\n![海边等一场日落](${SAMPLE_IMG('sv-coast-evening')})\n![山间听一夜松风](${SAMPLE_IMG('sv-pine-weekend')})\n![小城喝一杯慢咖啡](${SAMPLE_IMG('sv-town-coffee')})\n:::`,
    render: ({ raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const photos = images.filter((im) => /^https?:\/\//i.test(im.src))
      const title = copy(text || '沿途的风景，值得慢慢看', 260, 16)
      const top = 35 + title.length * 23
      const captionH = Math.max(1, ...photos.map((im) => copy(im.alt, 248, 12).length)) * 18 + 18
      const slideH = 166 + captionH
      const h = top + slideH + 45
      const slides = photos.length > 1 ? [...photos, photos[0]] : photos
      const n = photos.length
      const values = Array.from({ length: n }, (_, i) => `${-300 * i} 0;${-300 * i} 0`).concat(`${-300 * n} 0`)
      const times = Array.from({ length: n }, (_, i) => `${i / n};${(i + 0.78) / n}`).concat('1')
      const splines = Array.from({ length: Math.max(0, n * 2) }, (_, i) => i % 2 ? '0.4 0 0.2 1' : '0 0 1 1').join(';')
      return wrap(svg(300, h, html`${frame(h, ctx.color.tint(0.97), ctx.color.tint(0.75))}
        ${textLines(title, 20, 30, 16, 23, ctx.color.shade(0.15), 'start', 'bold')}
        <svg x="0" y="${top}" width="300" height="${slideH}" viewBox="0 0 300 ${slideH}" style="overflow:hidden;">
          <g>${slides.map((im, i) => html`<g transform="translate(${i * 300} 0)">
            <image href="${esc(im.src)}" x="12" y="0" width="276" height="166" preserveAspectRatio="xMidYMid slice"/>
            ${textLines(copy(im.alt || '沿途风景', 248, 12), 24, 191, 12, 18, '#666')}
          </g>`).join('')}
          ${n > 1 ? html`<animateTransform attributeName="transform" type="translate" values="${values.join(';')}" keyTimes="${times.join(';')}" calcMode="spline" keySplines="${splines}" dur="${n * 3.8}s" repeatCount="indefinite"/>` : ''}
          </g>
          ${!n ? html`<rect x="12" width="276" height="166" fill="${ctx.color.tint(0.9)}"/>${textLines(['请在正文中插入 Markdown 图片', '支持 https / http 图片地址'], 150, 74, 12, 24, ctx.color.shade(0.15), 'middle')}` : ''}
        </svg>
        <path d="M22 ${h - 22} H58 m-5 -4 5 4 -5 4" fill="none" stroke="${ctx.color.main}" stroke-width="1.5"/>
        ${textLines([n > 1 ? `自动向左轮播 · ${n} 帧风景` : '风景留在这里，故事继续向前'], 72, h - 18, 12, 20, '#999')}`))
    },
  },
  {
    id: 'sv-number-counter',
    name: '增长数字滚动计数',
    category: 'svg',
    tags: ['商务', '企业', '动态'],
    example: ':::sv-number-counter{value="1286" unit="位同行者"}\n从第一位读者，到一座温暖的小城\n:::',
    render: ({ params, raw, ctx }) => {
      const value = Math.round(numeric(params.value, 1286, 0, 999999999))
      const unit = copy(params.unit || '次美好相遇', 260, 13)
      const label = copy(raw || '每一个数字背后，都是一份信任', 252)
      const h = 136 + (unit.length - 1) * 20 + label.length * 23
      const frames = Array.from({ length: 15 }, (_, i) => Math.round(value * (1 - (1 - i / 14) ** 3)))
      const number = (n: number) => textLines([String(n)], 24, 85, 40, 44, ctx.color.main, 'start', 'bold')
      return wrap(svg(300, h, html`${frame(h, '#fff', ctx.color.tint(0.75))}
        ${textLines(['GROWING TOGETHER'], 24, 29, 12, 20, '#999')}
        ${frames.map((n, i) => html`<g opacity="${i === 0 ? 1 : 0}">${number(n)}
          ${i < 14 ? html`<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.99;1" calcMode="discrete" dur="0.12s" begin="${(i * 0.12).toFixed(2)}s" fill="freeze"/>` : html`<set attributeName="opacity" to="1" begin="1.68s" fill="freeze"/>`}
        </g>`).join('')}
        ${textLines(unit, 26, 112, 13, 20, ctx.color.shade(0.1))}
        <line x1="24" y1="${122 + (unit.length - 1) * 20}" x2="276" y2="${122 + (unit.length - 1) * 20}" stroke="${ctx.color.tint(0.8)}"/>
        ${textLines(label, 24, 149 + (unit.length - 1) * 20, 14, 23, '#666')}`))
    },
  },
  {
    id: 'sv-orbit-progress',
    name: '环形目标进度',
    category: 'svg',
    tags: ['简约', '教育', '动态'],
    example: ':::sv-orbit-progress{value="76" label="阅读计划"}\n已经读完 19 本书，下一本的世界正在等你。\n:::',
    render: ({ params, raw, ctx }) => {
      const value = Math.round(numeric(params.value, 76, 0, 100))
      const label = copy(params.label || '目标进行中', 180, 14)
      const body = copy(raw || '慢慢积累，也是一种了不起的速度。', 252)
      const h = 211 + label.length * 22 + body.length * 23
      return wrap(svg(300, h, html`${frame(h, ctx.color.tint(0.98), ctx.color.tint(0.78))}
        <circle cx="150" cy="89" r="58" fill="none" stroke="${ctx.color.tint(0.88)}" stroke-width="9"/>
        <circle cx="150" cy="89" r="58" pathLength="100" fill="none" stroke="${ctx.color.main}" stroke-width="9" stroke-linecap="round" stroke-dasharray="100 100" stroke-dashoffset="100" transform="rotate(-90 150 89)">
          <animate attributeName="stroke-dashoffset" from="100" to="${100 - value}" dur="1.8s" begin="0.15s" fill="freeze" ${EASE}/>
        </circle>
        ${textLines([`${value}%`], 150, 96, 34, 40, ctx.color.main, 'middle', 'bold')}
        ${textLines(['已完成'], 150, 117, 12, 20, '#999', 'middle')}
        ${textLines(label, 150, 182, 14, 22, ctx.color.shade(0.2), 'middle', 'bold')}
        <line x1="126" y1="${195 + (label.length - 1) * 22}" x2="174" y2="${195 + (label.length - 1) * 22}" stroke="${ctx.color.tint(0.55)}" stroke-width="2"/>
        ${textLines(body, 24, 222 + (label.length - 1) * 22, 14, 23, '#666')}`))
    },
  },
  {
    id: 'sv-rising-bars',
    name: '阶梯升起柱状图',
    category: 'svg',
    tags: ['商务', '科技', '动态'],
    example: ':::sv-rising-bars{title="把日子过成向上的曲线"}\n春季：128\n夏季：196\n秋季：285\n冬季：360\n:::',
    render: ({ params, raw, ctx }) => {
      const rows = lines(raw || '第一周：32\n第二周：56\n第三周：84').map((s) => {
        const [label, value] = pair(plain(s))
        return { label: label || '记录', value: numeric(value, 0, 0, 999999999) }
      })
      const title = copy(params.title || '每一点进步，都有迹可循', 252, 16)
      const top = 30 + title.length * 24
      const max = Math.max(1, ...rows.map((r) => r.value))
      let offset = top
      const charts: string[] = []
      // 每组最多四列，较长列表继续向下排，保证手机端不挤压或丢弃数据。
      for (let start = 0; start < rows.length; start += 4) {
        const group = rows.slice(start, start + 4)
        const cell = 252 / group.length
        const labelRows = group.map((r) => copy(r.label, cell - 10, 12))
        const baseline = offset + 151
        charts.push(html`${[0, 0.5, 1].map((v) => html`<line x1="24" y1="${baseline - v * 118}" x2="276" y2="${baseline - v * 118}" stroke="${ctx.color.tint(0.83)}" stroke-dasharray="3 4"/>`).join('')}
          ${group.map((r, i) => {
            const x = 24 + cell * (i + 0.5)
            const bh = r.value / max * 118
            const valueSize = fitSize(String(r.value), 12, cell - 8)
            return html`<rect x="${x - 16}" y="${baseline - 118}" width="32" height="118" rx="6" fill="${ctx.color.tint(0.94)}"/>
              <rect x="${x - 16}" y="${baseline}" width="32" height="0" rx="6" fill="${ctx.color.tint(i * 0.12)}">
                <animate attributeName="y" from="${baseline}" to="${baseline - bh}" dur="1.1s" begin="${(start + i) * 0.18}s" fill="freeze" ${EASE}/>
                <animate attributeName="height" from="0" to="${bh}" dur="1.1s" begin="${(start + i) * 0.18}s" fill="freeze" ${EASE}/>
              </rect>
              <g opacity="0">${textLines(copy(String(r.value), cell - 8, valueSize), x, baseline - bh - 10, valueSize, 15, ctx.color.shade(0.2), 'middle', 'bold')}${fade(`${0.6 + (start + i) * 0.18}s`)}</g>
              ${textLines(labelRows[i], x, baseline + 23, 12, 18, '#666', 'middle')}`
          }).join('')}`)
        offset = baseline + 26 + Math.max(...labelRows.map((ls) => ls.length)) * 18
      }
      return wrap(svg(300, offset + 16, html`${frame(offset + 16, '#fff', ctx.color.tint(0.78))}
        ${textLines(title, 24, 31, 16, 24, ctx.color.shade(0.15), 'start', 'bold')}${charts.join('')}`))
    },
  },
  {
    id: 'sv-seven-day-checkin',
    name: '七日签到点亮日历',
    category: 'svg',
    tags: ['校园', '教育', '动态'],
    example: ':::sv-seven-day-checkin{title="七天，把早起变成习惯"}\n拉开窗帘\n喝杯温水\n伸个懒腰\n读两页书\n认真早餐\n散步十分钟\n对自己说早安\n:::',
    render: ({ params, raw, ctx }) => {
      const title = copy(params.title || '七天，养成一个小习惯', 252, 16)
      const tasks = lines(plain(raw))
      const top = 34 + title.length * 24
      const cells = Array.from({ length: 7 }, (_, i) => copy(tasks[i] || '给自己一点鼓励', 56, 12))
      const firstH = 52 + Math.max(...cells.slice(0, 4).map((ls) => ls.length)) * 18
      const secondH = 52 + Math.max(...cells.slice(4).map((ls) => ls.length)) * 18
      const extra = tasks.slice(7).flatMap((task) => copy(task, 252, 12))
      const footerY = top + firstH + secondH + 26
      const h = footerY + 25 + extra.length * 19
      return wrap(svg(300, h, html`${frame(h, ctx.color.tint(0.97), ctx.color.tint(0.75))}
        ${textLines(title, 24, 31, 16, 24, ctx.color.shade(0.15), 'start', 'bold')}
        ${cells.map((ls, i) => {
          const x = 17 + (i < 4 ? i : i - 4) * 69
          const y = top + (i < 4 ? 0 : firstH + 8)
          return html`<rect x="${x}" y="${y}" width="59" height="36" rx="9" fill="#fff" stroke="${ctx.color.tint(0.72)}"/>
            ${textLines([String(i + 1).padStart(2, '0')], x + 29.5, y + 24, 16, 20, ctx.color.tint(0.35), 'middle', 'bold')}
            <g opacity="0"><rect x="${x}" y="${y}" width="59" height="36" rx="9" fill="${ctx.color.main}"/>
              ${textLines([`${i + 1} ✓`], x + 29.5, y + 24, 14, 20, '#fff', 'middle', 'bold')}${fade(`${0.3 + i * 0.35}s`, 0.45)}</g>
            ${textLines(ls, x + 29.5, y + 57, 12, 18, '#666', 'middle')}`
        }).join('')}
        ${textLines(['✓ 每一天，都在认真靠近自己'], 24, footerY, 12, 20, ctx.color.main)}
        ${textLines(extra, 24, footerY + 24, 12, 19, '#666')}`))
    },
  },
  {
    id: 'sv-poem-stanzas',
    name: '一行一行读给你听',
    category: 'svg',
    tags: ['文艺', '古风', '动态'],
    example: ':::sv-poem-stanzas{title="把秋天写进信里" author="山间来信"}\n风把树影叠成一页薄笺\n我在黄昏处，写下一点想念\n等桂花香走过长街\n这封信，就抵达你的窗前\n:::',
    render: ({ params, raw, ctx }) => {
      const title = copy(params.title || '留一行，给此刻', 244, 18)
      const poem = copy(raw || '让风吹过肩头\n让心慢慢停留', 244)
      const author = copy(`—— ${params.author || '写给生活的诗'}`, 244, 12)
      const top = 55 + title.length * 27
      const h = top + poem.length * 31 + author.length * 20 + 35
      return wrap(svg(300, h, html`${frame(h, ctx.color.tint(0.97), ctx.color.tint(0.82))}
        <path d="M22 17 V37 M22 17 H42 M278 ${h - 17} V${h - 37} M278 ${h - 17} H258" fill="none" stroke="${ctx.color.tint(0.5)}" stroke-width="1.5"/>
        ${textLines(title, 150, 45, 18, 27, ctx.color.shade(0.18), 'middle', 'bold')}
        <line x1="136" y1="${top - 25}" x2="164" y2="${top - 25}" stroke="${ctx.color.main}"/>
        ${poem.map((line, i) => html`<g opacity="0">${textLines([line], 150, top + i * 31, 14, 31, '#555', 'middle')}${fade(`${0.35 + i * 0.65}s`, 1.1)}</g>`).join('')}
        <g opacity="0">${textLines(author, 272, top + poem.length * 31 + 8, 12, 20, ctx.color.main, 'end')}${fade(`${0.5 + poem.length * 0.65}s`)}</g>`))
    },
  },
  {
    id: 'sv-glow-claim',
    name: '呼吸光晕点击领取',
    category: 'svg',
    tags: ['电商', '通用', '动态', '互动'],
    example: ':::sv-glow-claim{button="点我领取" done="已领取 ✓"}\n送你一份周末松弛指南\n五个不赶时间的小提案，让心情轻盈一点。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      const title = copy(first || '送你一份小小的心意', 244, 17)
      const body = copy(rest || '愿你有空看云，也有心情听风。', 244)
      const button = copy(params.button || '点我领取', 202, 15)
      const done = copy(params.done || '已领取 ✓', 202, 15)
      const top = 50 + title.length * 25 + body.length * 23
      const buttonH = Math.max(button.length, done.length) * 22 + 24
      const h = top + buttonH + 58
      const buttonText = (ls: string[], fill: string) => textLines(ls, 150, top + (buttonH - (ls.length - 1) * 22) / 2 + 5, 15, 22, fill, 'middle', 'bold')
      const heading = () => html`${textLines(title, 150, 36, 17, 25, ctx.color.shade(0.12), 'middle', 'bold')}
        ${textLines(body, 150, 54 + title.length * 25, 14, 23, '#666', 'middle')}`
      return wrap(svg(300, h, html`${frame(h, ctx.color.tint(0.97), ctx.color.tint(0.75))}${heading()}
        <rect x="34" y="${top}" width="232" height="${buttonH}" rx="${buttonH / 2}" fill="${ctx.color.tint(0.85)}"/>
        ${buttonText(done, ctx.color.shade(0.1))}
        ${textLines(['领取状态仅在本次页面展示'], 150, h - 21, 12, 20, '#999', 'middle')}
        <g style="cursor:pointer;">
          <rect x="1" y="1" width="298" height="${h - 2}" rx="14" fill="${ctx.color.tint(0.97)}"/>
          ${heading()}
          <rect x="29" y="${top - 5}" width="242" height="${buttonH + 10}" rx="${buttonH / 2 + 5}" fill="none" stroke="${ctx.color.main}" stroke-width="5" opacity="0.15">
            <animate attributeName="opacity" values="0.08;0.35;0.08" dur="2.4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
          </rect>
          <rect x="34" y="${top}" width="232" height="${buttonH}" rx="${buttonH / 2}" fill="${ctx.color.main}"/>
          ${buttonText(button, '#fff')}
          ${textLines(['轻点按钮 · 收下一点好心情'], 150, h - 21, 12, 20, ctx.color.main, 'middle')}${dismiss()}
        </g>`))
    },
  },
  {
    id: 'sv-star-rating',
    name: '逐颗点亮五星口碑',
    category: 'svg',
    tags: ['电商', '简约', '动态'],
    example: ':::sv-star-rating{score="4.9"}\n一碗热汤的认真，吃过的人都记得。\n:::',
    params: [{ key: 'score', label: '评分（0–5）', type: 'number' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => {
      const score = numeric(params.score, 4.9, 0, 5)
      const body = copy(raw || '把每一份喜欢，都放在心上。', 248)
      const h = 177 + body.length * 23
      const star = 'M0 -15 L4.4 -4.8 L15 -4.6 L7 2.5 L9.3 13 L0 7.5 L-9.3 13 L-7 2.5 L-15 -4.6 L-4.4 -4.8 Z'
      return wrap(svg(300, h, html`${frame(h, '#fff', ctx.color.tint(0.7))}
        ${textLines(['每一份喜欢，都闪闪发光'], 150, 31, 12, 20, '#999', 'middle')}
        ${Array.from({ length: 5 }, (_, i) => {
          const fraction = Math.max(0, Math.min(1, score - i))
          return html`<g transform="translate(${62 + i * 44} 68)"><path d="${star}" fill="${ctx.color.tint(0.9)}"/>
            ${fraction > 0 ? html`<svg x="-15" y="-16" width="${30 * fraction}" height="32" viewBox="-15 -16 ${30 * fraction} 32" style="overflow:hidden;">
              <path d="${star}" fill="${ctx.color.main}" opacity="0">${fade(`${0.2 + i * 0.22}s`, 0.5)}</path>
            </svg>` : ''}</g>`
        }).join('')}
        ${textLines([`${score.toFixed(1)} / 5.0`], 150, 126, 32, 40, ctx.color.shade(0.15), 'middle', 'bold')}
        <line x1="116" y1="145" x2="184" y2="145" stroke="${ctx.color.tint(0.65)}"/>
        ${textLines(body, 150, 175, 14, 23, '#666', 'middle')}`))
    },
  },
  {
    id: 'sv-heart-like',
    name: '点击爱心加一',
    category: 'svg',
    tags: ['可爱', '通用', '动态', '互动'],
    example: ':::sv-heart-like{count="128"}\n如果这段文字刚好温暖了你，留一颗心再走吧。\n:::',
    render: ({ params, raw, ctx }) => {
      const count = Math.floor(numeric(params.count, 128, 0, 999999998))
      const body = copy(raw || '为认真生活的自己，留一颗心。', 248)
      const h = 151 + body.length * 23
      const heart = 'M0 16 C-8 10 -26 -1 -21 -14 C-16 -26 -3 -22 0 -14 C3 -22 16 -26 21 -14 C26 -1 8 10 0 16 Z'
      const face = (liked: boolean) => html`${frame(h, liked ? ctx.color.tint(0.94) : '#fff', ctx.color.tint(0.7))}
        <g transform="translate(150 49)"><path d="${heart}" fill="${liked ? ctx.color.main : ctx.color.tint(0.97)}" stroke="${ctx.color.main}" stroke-width="2"/></g>
        ${textLines([String(count + (liked ? 1 : 0))], 150, 104, 28, 35, ctx.color.main, 'middle', 'bold')}
        ${textLines([liked ? '谢谢你的喜欢 ✓' : '轻点爱心 · 为喜欢加一'], 150, 130, 12, 20, ctx.color.main, 'middle')}
        ${textLines(body, 150, 159, 14, 23, '#666', 'middle')}`
      return wrap(svg(300, h, html`${face(true)}<g style="cursor:pointer;">${face(false)}${dismiss()}</g>`))
    },
  },
  {
    id: 'sv-petal-letterhead',
    name: '花瓣飘落信笺标题',
    category: 'svg',
    tags: ['清新', '文艺', '动态'],
    example: ':::sv-petal-letterhead{sub="愿每一次出发，都遇见好风景"}\n风起时，花也在赶路\n:::',
    render: ({ params, raw, ctx }) => {
      const title = copy(raw || '把春天写进生活', 232, 21)
      const sub = copy(params.sub || '有花，有风，也有你', 248, 12)
      const h = 98 + title.length * 31 + sub.length * 20
      return wrap(svg(300, h, html`${frame(h, ctx.color.tint(0.96), ctx.color.tint(0.82))}
        ${Array.from({ length: 9 }, (_, i) => {
          const x = 10 + (i * 37) % 280
          return html`<g opacity="0.45"><g><path d="M0 -6 C9 -5 10 3 0 8 C-7 3 -5 -3 0 -6Z" fill="${ctx.color.tint(i % 2 ? 0.4 : 0.1)}"/>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${4 + i * 0.2}s" repeatCount="indefinite"/>
            </g><animateMotion path="M${x} -14 C${x - 26} ${h * 0.3} ${x + 28} ${h * 0.55} ${x - 12} ${h + 14}" dur="${6 + i * 0.35}s" begin="${-i * 0.9}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.35 0 0.65 1"/>
          </g>`
        }).join('')}
        <rect x="22" y="30" width="256" height="${h - 60}" rx="4" fill="#fff" fill-opacity="0.8"/>
        ${textLines(title, 150, 64, 21, 31, ctx.color.shade(0.2), 'middle', 'bold')}
        <line x1="138" y1="${75 + (title.length - 1) * 31}" x2="162" y2="${75 + (title.length - 1) * 31}" stroke="${ctx.color.main}"/>
        ${textLines(sub, 150, 100 + (title.length - 1) * 31, 12, 20, '#666', 'middle')}`))
    },
  },
  {
    id: 'sv-timeline-stops',
    name: '沿途逐点出现时间轴',
    category: 'svg',
    tags: ['旅游', '企业', '动态'],
    example: ':::sv-timeline-stops{title="一日小城漫游"}\n09:30：在街角吃一碗热腾腾的面\n11:00：走进老书店，翻一封旧时光\n15:00：沿着河岸散步，等风吹过树梢\n18:30：把落日装进相册，慢慢回家\n:::',
    render: ({ params, raw, ctx }) => {
      const title = copy(params.title || '沿途的每一站，都值得记住', 248, 16)
      const rows = lines(raw || '清晨：为自己准备一份早餐\n傍晚：和喜欢的人分享今天').map((line) => {
        const [time, event] = pair(plain(line))
        return { time: copy(time || '此刻', 224, 13), event: copy(event, 224) }
      })
      let y = 43 + title.length * 24
      const stops = rows.map((r, i) => {
        const start = y
        const gap = r.time.length * 20 + r.event.length * 23 + 25
        y += gap
        return html`${i < rows.length - 1 ? html`<line x1="28" y1="${start}" x2="28" y2="${y}" stroke="${ctx.color.tint(0.72)}" stroke-width="2"/>` : ''}
          <g opacity="0"><circle cx="28" cy="${start - 4}" r="8" fill="${ctx.color.tint(0.85)}"/>
            <circle cx="28" cy="${start - 4}" r="3.5" fill="${ctx.color.main}"/>
            ${textLines(r.time, 50, start, 13, 20, ctx.color.main, 'start', 'bold')}
            ${textLines(r.event, 50, start + r.time.length * 20 + 3, 14, 23, '#555')}
            ${fade(`${0.25 + i * 0.5}s`, 0.8)}
          </g>`
      }).join('')
      return wrap(svg(300, y + 6, html`${frame(y + 6, '#fff', ctx.color.tint(0.8))}
        ${textLines(title, 24, 32, 16, 24, ctx.color.shade(0.15), 'start', 'bold')}${stops}`))
    },
  },
  {
    id: 'sv-breathing-clock',
    name: '给自己一分钟时钟',
    category: 'svg',
    tags: ['简约', '通用', '动态'],
    example: ':::sv-breathing-clock{title="给自己一分钟"}\n放下手机，松开肩膀。\n吸一口气，再慢慢呼出。\n不必急着回答世界，先听见自己。\n:::',
    render: ({ params, raw, ctx }) => {
      const title = copy(params.title || '把这一分钟，还给自己', 248, 17)
      const body = copy(raw || '让呼吸慢下来，也让心慢下来。', 248)
      const cy = 82 + title.length * 25
      const h = cy + 96 + body.length * 23
      return wrap(svg(300, h, html`${frame(h, ctx.color.tint(0.97), ctx.color.tint(0.75))}
        ${textLines(title, 150, 35, 17, 25, ctx.color.shade(0.15), 'middle', 'bold')}
        <circle cx="150" cy="${cy}" r="55" fill="#fff" stroke="${ctx.color.tint(0.7)}" stroke-width="1.5"/>
        ${Array.from({ length: 12 }, (_, i) => html`<line x1="150" y1="${cy - 48}" x2="150" y2="${cy - (i % 3 ? 44 : 40)}" stroke="${i % 3 ? ctx.color.tint(0.65) : ctx.color.main}" stroke-width="${i % 3 ? 1 : 2}" transform="rotate(${i * 30} 150 ${cy})"/>`).join('')}
        <line x1="150" y1="${cy}" x2="150" y2="${cy - 36}" stroke="${ctx.color.main}" stroke-width="2" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 150 ${cy}" to="360 150 ${cy}" dur="60s" repeatCount="indefinite" calcMode="linear"/>
        </line>
        <circle cx="150" cy="${cy}" r="4" fill="${ctx.color.main}"/>
        ${textLines(['一圈 60 秒 · 跟着呼吸慢下来'], 150, cy + 79, 12, 20, ctx.color.main, 'middle')}
        ${textLines(body, 150, cy + 108, 14, 23, '#666', 'middle')}`))
    },
  },
]

export default blocks
