import type { BlockDef } from '../core/types'
import { esc, html, lines, splitFirst, splitQA } from './_utils'

/**
 * SVG 动效素材：使用 SMIL 动画（<animate> / <animateTransform> / <set>），公众号支持这类内联 SVG，
 * 包括 begin="click" 的点击交互。注意：不能用 id、class、<style>、<script>、foreignObject。
 */

const FONT = `-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`

const svg = (w: number, h: number, body: string, style = '') =>
  html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="display: block; width: 100%; ${style}">${body}</svg>`

const wrap = (inner: string, margin = '1.2em 0') => html`<section style="margin: ${margin}; line-height: 0;">${inner}</section>`

/** 估算文字宽度：中文 1em，英文数字约 0.58em */
const units = (s: string) => Array.from(s).reduce((n, ch) => n + (/[\u0000-ÿ]/.test(ch) ? 0.58 : 1), 0)

/** 按宽度把文字切成多行（SVG 文本不会自动换行） */
/** 不能出现在行首的标点（避头点） */
const NO_LINE_START = /[，。、；：？！）》」』”’,.;:?!)]/

function wrapText(s: string, maxUnits: number): string[] {
  const out: string[] = []
  for (const para of s.split(/\n+/)) {
    let line = ''
    let w = 0
    for (const ch of Array.from(para.trim())) {
      const cw = /[\u0000-ÿ]/.test(ch) ? 0.58 : 1
      if (w + cw > maxUnits && line && !NO_LINE_START.test(ch)) {
        out.push(line)
        line = ''
        w = 0
      }
      line += ch
      w += cw
    }
    if (line) out.push(line)
  }
  return out
}

/** 去掉 Markdown 标记，SVG 里只能放纯文本 */
const plain = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~#>]/g, '')
    .trim()

const fitSize = (text: string, max: number, width: number) => Math.min(max, Math.floor(width / Math.max(1, units(text))))

const blocks: BlockDef[] = [
  {
    id: 'svg-wave',
    name: '流动波浪分割',
    category: 'svg',
    tags: ['分割', '清新', '动态'],
    example: ':::svg-wave\n:::',
    render: ({ ctx }) => {
      const wave = (y: number, amp: number) => {
        let d = `M0,${y}`
        for (let x = 0; x < 600; x += 60) d += ` q15,${-amp} 30,0 t30,0`
        return d
      }
      return wrap(
        svg(
          300,
          24,
          html`<g><path d="${wave(12, 8)}" fill="none" stroke="${ctx.color.tint(0.6)}" stroke-width="2" stroke-linecap="round">
              <animateTransform attributeName="transform" type="translate" from="0 0" to="-60 0" dur="2.4s" repeatCount="indefinite"/></path>
            <path d="${wave(12, 6)}" fill="none" stroke="${ctx.color.main}" stroke-width="2" stroke-linecap="round">
              <animateTransform attributeName="transform" type="translate" from="-60 0" to="0 0" dur="1.8s" repeatCount="indefinite"/></path></g>`,
          'height: auto;',
        ),
        '1.6em auto',
      )
    },
  },
  {
    id: 'svg-pulse-dots',
    name: '呼吸三点',
    category: 'svg',
    tags: ['分割', '简约', '动态'],
    example: ':::svg-pulse-dots\n:::',
    render: ({ ctx }) =>
      wrap(
        svg(
          300,
          20,
          [130, 150, 170]
            .map(
              (x, i) => html`<circle cx="${x}" cy="10" r="4" fill="${ctx.color.main}">
                <animate attributeName="r" values="3;6;3" dur="1.2s" begin="${i * 0.2}s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="${i * 0.2}s" repeatCount="indefinite"/></circle>`,
            )
            .join(''),
        ),
        '1.6em 0',
      ),
  },
  {
    id: 'svg-spin-flower',
    name: '旋转花心分割',
    category: 'svg',
    tags: ['分割', '文艺', '动态'],
    example: ':::svg-spin-flower\n:::',
    render: ({ ctx }) => {
      const petals = Array.from({ length: 6 }, (_, i) => html`<ellipse cx="0" cy="-6" rx="3.2" ry="6" fill="${ctx.color.tint(i % 2 ? 0.35 : 0)}" transform="rotate(${i * 60})"/>`).join('')
      return wrap(
        svg(
          300,
          30,
          html`<line x1="30" y1="15" x2="128" y2="15" stroke="${ctx.color.tint(0.6)}" stroke-width="1"/>
          <line x1="172" y1="15" x2="270" y2="15" stroke="${ctx.color.tint(0.6)}" stroke-width="1"/>
          <g transform="translate(150 15)"><g>${petals}<circle r="2.6" fill="#fff"/>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite"/></g></g>`,
        ),
        '1.6em 0',
      )
    },
  },
  {
    id: 'svg-arrow-down',
    name: '跳动下滑箭头',
    category: 'svg',
    tags: ['引导', '简约', '动态'],
    example: ':::svg-arrow-down\n继续往下看\n:::',
    render: ({ raw, ctx }) => {
      const text = plain(raw) || '向下滑动'
      return wrap(
        svg(
          300,
          56,
          html`<text x="150" y="16" font-size="12" letter-spacing="3" text-anchor="middle" fill="${ctx.color.main}" font-family="${FONT}">${esc(text)}</text>
          <g fill="none" stroke="${ctx.color.main}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M140,26 L150,34 L160,26"><animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite"/></path>
            <path d="M140,36 L150,44 L160,36" opacity="0.5"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" repeatCount="indefinite"/></path>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 4;0 0" dur="1.4s" repeatCount="indefinite"/>
          </g>`,
        ),
      )
    },
  },
  {
    id: 'svg-underline-title',
    name: '描线下划线标题',
    category: 'svg',
    tags: ['标题', '简约', '动态'],
    example: ':::svg-underline-title{sub="DRAW THE LINE"}\n好的设计会说话\n:::',
    render: ({ params, raw, ctx }) => {
      const text = plain(raw) || '标题'
      const fs = fitSize(text, 22, 260)
      const w = Math.min(260, units(text) * fs + 16)
      return wrap(
        svg(
          300,
          params.sub ? 74 : 56,
          html`<text x="150" y="30" font-size="${fs}" font-weight="bold" text-anchor="middle" fill="#222" font-family="${FONT}">${esc(text)}</text>
          <rect x="${150 - w / 2}" y="40" width="0" height="4" rx="2" fill="${ctx.color.main}">
            <animate attributeName="width" from="0" to="${w}" dur="1.2s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/></rect>
          <rect x="${150 - w / 2}" y="40" width="${w}" height="4" rx="2" fill="${ctx.color.alpha(0.15)}"/>
          ${params.sub && html`<text x="150" y="64" font-size="10" letter-spacing="3" text-anchor="middle" fill="#999" font-family="${FONT}">${esc(params.sub)}</text>`}`,
        ),
        '1.6em 0 1em',
      )
    },
  },
  {
    id: 'svg-sparkle-title',
    name: '闪烁星光标题',
    category: 'svg',
    tags: ['标题', '可爱', '动态'],
    example: ':::svg-sparkle-title\n今日份小确幸\n:::',
    render: ({ raw, ctx }) => {
      const text = plain(raw) || '标题'
      const fs = fitSize(text, 22, 200)
      const half = (units(text) * fs) / 2
      const star = (x: number, y: number, s: number, delay: number, fill: string) =>
        html`<path transform="translate(${x} ${y})" d="M0,${-s} Q0,0 ${s},0 Q0,0 0,${s} Q0,0 ${-s},0 Q0,0 0,${-s}Z" fill="${fill}">
          <animate attributeName="opacity" values="0.15;1;0.15" dur="1.6s" begin="${delay}s" repeatCount="indefinite"/></path>`
      return wrap(
        svg(
          300,
          56,
          html`<rect x="${150 - half - 18}" y="10" width="${half * 2 + 36}" height="38" rx="19" fill="${ctx.color.tint(0.9)}"/>
          <text x="150" y="${29 + fs * 0.36}" font-size="${fs}" font-weight="bold" text-anchor="middle" fill="${ctx.color.shade(0.1)}" font-family="${FONT}">${esc(text)}</text>
          ${star(150 - half - 30, 14, 6, 0, ctx.color.main)}${star(150 - half - 22, 44, 3.5, 0.5, ctx.color.tint(0.4))}
          ${star(150 + half + 28, 16, 4, 0.8, ctx.color.tint(0.4))}${star(150 + half + 32, 42, 6, 0.3, ctx.color.main)}`,
        ),
        '1.6em 0 1em',
      )
    },
  },
  {
    id: 'svg-badge-title',
    name: '旋转环序号标题',
    category: 'svg',
    tags: ['标题', '编号', '科技', '动态'],
    example: ':::svg-badge-title{no="01"}\n用数据驱动增长\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="display: flex; align-items: center; margin: 1.6em 0 1em;">
        <section style="flex-shrink: 0; width: 52px; line-height: 0;">
          ${svg(
            52,
            52,
            html`<circle cx="26" cy="26" r="23" fill="none" stroke="${ctx.color.main}" stroke-width="2" stroke-dasharray="6 5">
                <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="8s" repeatCount="indefinite"/></circle>
              <circle cx="26" cy="26" r="17" fill="${ctx.color.main}"/>
              <text x="26" y="31" font-size="14" font-weight="bold" text-anchor="middle" fill="#fff" font-family="${FONT}">${esc(params.no ?? '01')}</text>`,
          )}
        </section>
        <section style="margin-left: 12px; font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; color: #222; line-height: 1.5;">${ctx.renderInline(raw.trim())}</section>
      </section>`,
  },
  {
    id: 'svg-typing-title',
    name: '光标闪烁标题',
    category: 'svg',
    tags: ['标题', '科技', '简约', '动态'],
    example: ':::svg-typing-title\nHello，新朋友\n:::',
    render: ({ raw, ctx }) => html`
      <section style="margin: 1.6em 0 1em; font-size: ${ctx.fontSize * 1.25}px; font-weight: bold; color: #222; line-height: 1.5;">
        <span style="color: ${ctx.color.main}; margin-right: 6px; font-family: Menlo, Consolas, monospace;">&gt;</span>${ctx.renderInline(raw.trim())}<span style="display: inline-block; width: 3px; height: 1.1em; margin-left: 4px; vertical-align: -0.15em; line-height: 0;">${svg(
          3,
          20,
          html`<rect width="3" height="20" fill="${ctx.color.main}"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.51;1" dur="1s" repeatCount="indefinite"/></rect>`,
          'height: 100%;',
        )}</span>
      </section>`,
  },
  {
    id: 'svg-progress',
    name: '数据进度条',
    category: 'svg',
    tags: ['正文', '商务', '科技', '动态'],
    example: ':::svg-progress\n用户满意度：96\n复购率：78\n推荐意愿：88\n:::',
    render: ({ raw, ctx }) => {
      const rows = lines(raw).map((l) => {
        const i = l.search(/[:：]/)
        const label = i > 0 ? l.slice(0, i) : l
        const value = Math.max(0, Math.min(100, parseFloat(i > 0 ? l.slice(i + 1) : '50') || 0))
        return { label: plain(label), value }
      })
      const rowH = 40
      return wrap(
        svg(
          300,
          rows.length * rowH + 6,
          rows
            .map((r, i) => {
              const y = i * rowH
              const w = (276 * r.value) / 100
              return html`<text x="12" y="${y + 16}" font-size="12" fill="#555" font-family="${FONT}">${esc(r.label)}</text>
              <text x="288" y="${y + 16}" font-size="12" font-weight="bold" text-anchor="end" fill="${ctx.color.main}" font-family="${FONT}">${r.value}%</text>
              <rect x="12" y="${y + 23}" width="276" height="8" rx="4" fill="${ctx.color.tint(0.88)}"/>
              <rect x="12" y="${y + 23}" width="0" height="8" rx="4" fill="${ctx.color.main}">
                <animate attributeName="width" from="0" to="${w.toFixed(1)}" dur="1.4s" begin="${0.2 + i * 0.15}s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/></rect>`
            })
            .join(''),
        ),
      )
    },
  },
  {
    id: 'svg-marquee',
    name: '滚动公告栏',
    category: 'svg',
    tags: ['引导', '电商', '企业', '动态'],
    example: ':::svg-marquee{label="公告"}\n本周六晚 8 点直播抽奖，全场好物限时 8 折，记得设好闹钟哦！\n:::',
    render: ({ params, raw, ctx }) => {
      const text = plain(raw).replace(/\n+/g, '　') || '这里是滚动公告'
      const tw = units(text) * 13
      const label = params.label ?? '公告'
      return wrap(
        svg(
          300,
          34,
          html`<rect x="0.5" y="0.5" width="299" height="33" rx="17" fill="${ctx.color.tint(0.93)}" stroke="${ctx.color.tint(0.7)}"/>
          <svg x="64" y="0" width="226" height="34" viewBox="0 0 226 34">
            <text x="226" y="22" font-size="13" fill="#555" font-family="${FONT}">${esc(text)}
              <animate attributeName="x" from="226" to="${-tw}" dur="${Math.max(6, (tw + 226) / 40).toFixed(1)}s" repeatCount="indefinite"/></text>
          </svg>
          <rect x="4" y="4" width="56" height="26" rx="13" fill="${ctx.color.main}"/>
          <text x="32" y="21.5" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff" font-family="${FONT}">${esc(label)}</text>`,
        ),
      )
    },
  },
  {
    id: 'svg-swing-tag',
    name: '摇摆吊牌',
    category: 'svg',
    tags: ['标题', '可爱', '电商', '动态'],
    example: ':::svg-swing-tag\n今日上新\n:::',
    render: ({ raw, ctx }) => {
      const text = plain(raw) || '上新'
      const fs = fitSize(text, 18, 120)
      const w = Math.max(90, units(text) * fs + 36)
      return wrap(
        svg(
          300,
          96,
          html`<line x1="110" y1="0" x2="190" y2="0" stroke="#ccc" stroke-width="2"/>
          <g>
            <line x1="150" y1="0" x2="150" y2="22" stroke="${ctx.color.shade(0.2)}" stroke-width="1.5"/>
            <rect x="${150 - w / 2}" y="22" width="${w}" height="44" rx="8" fill="${ctx.color.main}"/>
            <circle cx="150" cy="30" r="3" fill="#fff"/>
            <text x="150" y="${50 + fs * 0.3}" font-size="${fs}" font-weight="bold" text-anchor="middle" fill="#fff" letter-spacing="2" font-family="${FONT}">${esc(text)}</text>
            <animateTransform attributeName="transform" type="rotate" values="-6 150 0;6 150 0;-6 150 0" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1"/>
          </g>`,
        ),
        '1em 0',
      )
    },
  },
  {
    id: 'svg-ripple-follow',
    name: '波纹关注引导',
    category: 'svg',
    tags: ['引导', '通用', '动态'],
    example: ':::svg-ripple-follow{name="排版研究所"}\n每天一个排版小技巧\n:::',
    render: ({ params, raw, ctx }) => {
      const name = params.name ?? '我们'
      const sub = plain(raw) || '关注我们，获取更多精彩内容'
      const ring = (begin: number) =>
        html`<circle cx="36" cy="36" r="18" fill="none" stroke="${ctx.color.main}" stroke-width="2">
          <animate attributeName="r" from="18" to="32" dur="2s" begin="${begin}s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.7" to="0" dur="2s" begin="${begin}s" repeatCount="indefinite"/></circle>`
      return wrap(
        svg(
          300,
          72,
          html`<rect x="0.5" y="6.5" width="299" height="59" rx="30" fill="${ctx.color.tint(0.94)}"/>
          ${ring(0)}${ring(1)}
          <circle cx="36" cy="36" r="18" fill="${ctx.color.main}"/>
          <text x="36" y="41" font-size="14" font-weight="bold" text-anchor="middle" fill="#fff" font-family="${FONT}">${esc(Array.from(name)[0] ?? '关')}</text>
          <text x="66" y="32" font-size="14" font-weight="bold" fill="#222" font-family="${FONT}">${esc(name)}</text>
          <text x="66" y="50" font-size="11" fill="#888" font-family="${FONT}">${esc(wrapText(sub, 13)[0] ?? '')}</text>
          <rect x="226" y="22" width="60" height="28" rx="14" fill="${ctx.color.main}"/>
          <text x="256" y="40" font-size="12" font-weight="bold" text-anchor="middle" fill="#fff" font-family="${FONT}">+ 关注</text>`,
        ),
      )
    },
  },
  {
    id: 'svg-heart-end',
    name: '心跳感谢结尾',
    category: 'svg',
    tags: ['结尾', '可爱', '动态'],
    example: ':::svg-heart-end\n感谢你读到这里\n:::',
    render: ({ raw, ctx }) => {
      const text = plain(raw) || '感谢阅读'
      return wrap(
        svg(
          300,
          84,
          html`<g transform="translate(150 28)"><path d="M0,10 C-14,0 -18,-8 -13,-14 C-8,-20 0,-16 0,-10 C0,-16 8,-20 13,-14 C18,-8 14,0 0,10Z" fill="${ctx.color.main}">
            <animateTransform attributeName="transform" type="scale" values="1;1.25;1;1.15;1" keyTimes="0;0.15;0.3;0.45;1" dur="1.3s" repeatCount="indefinite"/></path></g>
          <text x="150" y="66" font-size="14" letter-spacing="4" text-anchor="middle" fill="${ctx.color.shade(0.1)}" font-family="${FONT}">${esc(text)}</text>
          <line x1="70" y1="78" x2="230" y2="78" stroke="${ctx.color.tint(0.75)}" stroke-width="1" stroke-dasharray="2 4"/>`,
        ),
        '2em 0 1em',
      )
    },
  },
  {
    id: 'svg-tap-reveal',
    name: '点击揭晓答案',
    category: 'svg',
    tags: ['问答', '互动', '教育', '动态'],
    example: ':::svg-tap-reveal\n猜一猜：公众号文章里能放外链吗？\n\n不能哦。除了公众号文章链接外，正文里的外链都无法点击，所以本编辑器会自动把它们转成文末的参考链接。\n:::',
    render: ({ raw, ctx }) => {
      const { q, a } = splitQA(raw)
      const ans = wrapText(plain(a) || '答案', 17)
      const h = Math.max(70, 28 + ans.length * 22)
      return html`
        <section style="margin: 1.2em 0;">
          <section style="font-weight: bold; color: #222; margin-bottom: 8px;">${ctx.renderInline(q)}</section>
          <section style="line-height: 0;">${svg(
            300,
            h,
            html`<rect x="0.5" y="0.5" width="299" height="${h - 1}" rx="10" fill="${ctx.color.tint(0.94)}" stroke="${ctx.color.tint(0.7)}"/>
            ${ans.map((l, i) => html`<text x="16" y="${30 + i * 22}" font-size="14" fill="#444" font-family="${FONT}">${esc(l)}</text>`).join('')}
            <g>
              <rect x="0" y="0" width="300" height="${h}" rx="10" fill="${ctx.color.main}"/>
              <text x="150" y="${h / 2 + 5}" font-size="15" font-weight="bold" text-anchor="middle" fill="#fff" letter-spacing="2" font-family="${FONT}">👆 点击揭晓答案</text>
              <animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="click" fill="freeze"/>
              <set attributeName="visibility" to="hidden" begin="click+0.5s" fill="freeze"/>
            </g>`,
          )}</section>
        </section>`
    },
  },
  {
    id: 'svg-gift-open',
    name: '点击拆礼物',
    category: 'svg',
    tags: ['互动', '节日', '电商', '动态'],
    example: ':::svg-gift-open\n恭喜你获得「早鸟 8 折券」，评论区回复「早鸟」领取！\n:::',
    render: ({ raw, ctx }) => {
      const msg = wrapText(plain(raw) || '恭喜你！', 16)
      const h = 150 + msg.length * 20
      const red = ctx.color.main
      return wrap(
        svg(
          300,
          h,
          // SMIL 的 begin="click" 只监听动画所在元素（及冒泡上来的子元素点击），
          // 所以把透明点击层放在最内层，让礼盒、盒盖、祝福语三层动画都能收到同一次点击。
          html`<rect x="0.5" y="0.5" width="299" height="${h - 1}" rx="12" fill="${ctx.color.tint(0.95)}"/>
          <g>
            <rect x="110" y="60" width="80" height="56" rx="4" fill="${red}"/>
            <rect x="144" y="60" width="12" height="56" fill="#ffd666"/>
            <g>
              <rect x="104" y="46" width="92" height="18" rx="4" fill="${ctx.color.shade(0.12)}"/>
              <rect x="144" y="46" width="12" height="18" fill="#ffd666"/>
              <path d="M150,46 C136,26 122,34 130,44 Z M150,46 C164,26 178,34 170,44 Z" fill="#ffd666"/>
              <g opacity="0">
                <rect x="0" y="0" width="300" height="${h}" fill="#ffffff" fill-opacity="0"/>
                ${msg.map((l, i) => html`<text x="150" y="${132 + i * 20}" font-size="14" font-weight="bold" text-anchor="middle" fill="${ctx.color.shade(0.15)}" font-family="${FONT}">${esc(l)}</text>`).join('')}
                <animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="click+0.3s" fill="freeze"/>
                <animateTransform attributeName="transform" type="translate" from="0 0" to="0 34" dur="0.5s" begin="click" fill="freeze"/>
              </g>
              <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -34" dur="0.5s" begin="click" fill="freeze"/>
            </g>
            <animateTransform attributeName="transform" type="rotate" values="0 150 116;-4 150 116;4 150 116;0 150 116" dur="0.8s" repeatCount="indefinite" end="click"/>
          </g>
          <text x="150" y="${h - 14}" font-size="11" text-anchor="middle" fill="#999" font-family="${FONT}">轻点礼盒拆开惊喜</text>`,
        ),
      )
    },
  },
  {
    id: 'svg-flip-card',
    name: '点击翻面卡片',
    category: 'svg',
    tags: ['互动', '正文', '教育', '动态'],
    example: ':::svg-flip-card\n「乘风破浪」出自哪里？\n\n出自《宋书·宗悫传》：“愿乘长风破万里浪。”比喻志向远大、奋勇前进。\n:::',
    render: ({ raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      const front = wrapText(plain(first) || '正面', 15)
      const back = wrapText(plain(rest) || '背面', 17)
      const h = Math.max(110, 40 + Math.max(front.length * 24, back.length * 22))
      const textBlock = (ls: string[], size: number, lh: number, fill: string, weight = 'normal') =>
        ls
          .map(
            (l, i) =>
              html`<text x="150" y="${h / 2 - ((ls.length - 1) * lh) / 2 + 5 + i * lh}" font-size="${size}" font-weight="${weight}" text-anchor="middle" fill="${fill}" font-family="${FONT}">${esc(l)}</text>`,
          )
          .join('')
      return wrap(
        svg(
          300,
          h,
          // 背面静止在下层，正面盖住它；点击正面后正面收缩露出背面
          html`<g>
            <rect x="0.5" y="0.5" width="299" height="${h - 1}" rx="12" fill="#fff" stroke="${ctx.color.tint(0.6)}" stroke-width="1.5"/>
            ${textBlock(back, 14, 22, '#444')}
          </g>
          <g>
            <rect x="0" y="0" width="300" height="${h}" rx="12" fill="${ctx.color.main}"/>
            <rect x="8" y="8" width="284" height="${h - 16}" rx="8" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-dasharray="4 4"/>
            ${textBlock(front, 17, 24, '#fff', 'bold')}
            <text x="150" y="${h - 16}" font-size="10" text-anchor="middle" fill="#fff" fill-opacity="0.75" font-family="${FONT}">点击翻面</text>
            <animateTransform attributeName="transform" type="translate" from="0 0" to="150 0" dur="0.3s" begin="click" fill="freeze" additive="sum"/>
            <animateTransform attributeName="transform" type="scale" from="1 1" to="0 1" dur="0.3s" begin="click" fill="freeze" additive="sum"/>
          </g>`,
        ),
      )
    },
  },
]

export default blocks
