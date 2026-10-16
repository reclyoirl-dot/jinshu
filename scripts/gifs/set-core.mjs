// 核心动图素材：引导、分割、标题装饰、贴纸、节日
import { FONT, TAU, clamp01, easeInOut, easeOut, heart, range, rng, star4, star5, svg, tint, wave } from './lib.mjs'

const W = 640

export default [
  {
    id: 'follow',
    name: '点击蓝字关注',
    category: 'guide',
    tags: ['引导', '通用'],
    width: W,
    height: 120,
    frames: 30,
    display: '100%',
    variants: true,
    render: (t, c) => {
      const b = Math.abs(Math.sin(t * TAU))
      const sweep = -160 + t * 760
      return svg(
        W,
        120,
        `<defs>
          <linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
          <clipPath id="pill"><rect x="120" y="30" width="420" height="60" rx="30"/></clipPath>
        </defs>
        <circle cx="72" cy="60" r="${22 + 18 * t}" fill="none" stroke="${c}" stroke-width="2" opacity="${1 - t}"/>
        <g transform="translate(72 ${60 - 10 * b})">
          <circle r="22" fill="${tint(c, 0.85)}"/>
          <path d="M0,-13 L11,0 L4,0 L4,13 L-4,13 L-4,0 L-11,0 Z" fill="${c}"/>
        </g>
        <rect x="120" y="30" width="420" height="60" rx="30" fill="${tint(c, 0.9)}" stroke="${tint(c, 0.6)}" stroke-width="2"/>
        <g clip-path="url(#pill)"><rect x="${sweep}" y="30" width="120" height="60" fill="url(#sh)" transform="skewX(-20)"/></g>
        <text x="330" y="70" font-family="${FONT}" font-size="26" text-anchor="middle" fill="#666">点击上方<tspan fill="${c}" font-weight="bold">蓝字</tspan>关注我们</text>
        ${star4(585, 42, 9 * (0.4 + 0.6 * Math.abs(wave(t))), c)}
        ${star4(606, 74, 6 * (0.4 + 0.6 * Math.abs(wave(t, 0.25))), tint(c, 0.4))}`,
      )
    },
  },
  {
    id: 'actions',
    name: '分享收藏点赞在看',
    category: 'guide',
    tags: ['引导', '结尾', '通用'],
    width: W,
    height: 150,
    frames: 40,
    display: '100%',
    variants: true,
    defaultColor: 'red',
    render: (t, c) => {
      const items = [
        { x: 110, label: '分享', icon: (f) => `<g fill="none" stroke="${f.stroke}" stroke-width="3" stroke-linecap="round"><path d="M-9,1 L9,-9 M-9,1 L9,11"/></g><circle cx="-9" cy="1" r="5" fill="${f.fill}" stroke="${f.stroke}" stroke-width="2.5"/><circle cx="9" cy="-9" r="5" fill="${f.fill}" stroke="${f.stroke}" stroke-width="2.5"/><circle cx="9" cy="11" r="5" fill="${f.fill}" stroke="${f.stroke}" stroke-width="2.5"/>` },
        { x: 250, label: '收藏', icon: (f) => star5(0, 1, 15, f.fill, `stroke="${f.stroke}" stroke-width="2.5" stroke-linejoin="round"`) },
        { x: 390, label: '点赞', icon: (f) => `<path d="M-14,0 h6 v16 h-6 z M-5,0 L2,-14 C6,-18 11,-14 9,-8 L7,-3 H15 C19,-3 21,0 20,4 L17,14 C16,16 14,17 12,17 H-5 Z" fill="${f.fill}" stroke="${f.stroke}" stroke-width="2.5" stroke-linejoin="round"/>` },
        { x: 530, label: '在看', icon: (f) => `<path transform="translate(0 2)" d="M0,13 C-15,2 -19,-6 -14,-12 C-9,-18 -2,-15 0,-9 C2,-15 9,-18 14,-12 C19,-6 15,2 0,13Z" fill="${f.fill}" stroke="${f.stroke}" stroke-width="2.5" stroke-linejoin="round"/>` },
      ]
      return svg(
        W,
        150,
        items
          .map((it, k) => {
            const local = range(t, k * 0.22, k * 0.22 + 0.22)
            const active = t >= k * 0.22
            const s = 1 + 0.3 * Math.sin(Math.PI * local)
            const f = active ? { fill: c, stroke: c } : { fill: '#fff', stroke: '#bbb' }
            return `<g transform="translate(${it.x} 58)">
              <circle r="${34 + 6 * Math.sin(Math.PI * local)}" fill="${active ? tint(c, 0.88) : '#f5f5f5'}"/>
              <g transform="scale(${s.toFixed(3)})">${it.icon(f)}</g>
              <text y="68" font-family="${FONT}" font-size="22" text-anchor="middle" fill="${active ? c : '#999'}" font-weight="${active ? 'bold' : 'normal'}">${it.label}</text>
            </g>`
          })
          .join(''),
      )
    },
  },
  {
    id: 'scroll',
    name: '向下滑动',
    category: 'guide',
    tags: ['引导', '简约'],
    width: 300,
    height: 150,
    frames: 24,
    display: '40%',
    variants: true,
    render: (t, c) =>
      svg(
        300,
        150,
        `<text x="150" y="34" font-family="${FONT}" font-size="22" letter-spacing="4" text-anchor="middle" fill="${c}">向下滑动</text>` +
          [0, 1, 2]
            .map((k) => {
              const o = 0.15 + 0.85 * clamp01(Math.sin(TAU * (t - k * 0.18)))
              return `<path d="M128,${62 + k * 24} L150,${80 + k * 24} L172,${62 + k * 24}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="${o.toFixed(3)}"/>`
            })
            .join(''),
      ),
  },
  {
    id: 'readmore',
    name: '阅读原文按钮',
    category: 'guide',
    tags: ['引导', '通用'],
    width: 480,
    height: 140,
    frames: 30,
    display: '70%',
    variants: true,
    render: (t, c) => {
      const press = Math.sin(Math.PI * range(t, 0.3, 0.5))
      const ripple = range(t, 0.4, 0.8)
      const fx = 330 - 20 * easeInOut(range(t, 0, 0.3)) + 20 * easeInOut(range(t, 0.7, 1))
      const fy = 105 - 18 * easeInOut(range(t, 0, 0.3)) + 18 * easeInOut(range(t, 0.7, 1))
      return svg(
        480,
        140,
        `<g transform="translate(240 64) scale(${1 - 0.05 * press})">
          <rect x="-130" y="-30" width="260" height="60" rx="30" fill="${c}"/>
          <text y="9" font-family="${FONT}" font-size="25" font-weight="bold" text-anchor="middle" fill="#fff" letter-spacing="2">阅读原文 →</text>
        </g>
        <circle cx="${fx}" cy="${fy}" r="${10 + 30 * ripple}" fill="${c}" opacity="${(0.35 * (1 - ripple)).toFixed(3)}"/>
        <circle cx="${fx}" cy="${fy}" r="${13 - 3 * press}" fill="#fff" stroke="#333" stroke-width="3"/>`,
      )
    },
  },
  {
    id: 'star',
    name: '设为星标',
    category: 'guide',
    tags: ['引导', '通用'],
    width: W,
    height: 130,
    frames: 36,
    display: '100%',
    variants: true,
    defaultColor: 'orange',
    render: (t, c) => {
      const spin = 360 * easeInOut(range(t, 0.1, 0.5))
      const glow = Math.sin(Math.PI * range(t, 0.4, 0.8))
      return svg(
        W,
        130,
        `<rect x="40" y="20" width="560" height="90" rx="16" fill="${tint(c, 0.92)}"/>
        <circle cx="110" cy="65" r="${30 + 8 * glow}" fill="${tint(c, 0.7)}" opacity="${0.6 * glow}"/>
        <g transform="translate(110 65) rotate(${spin})">${star5(0, 0, 28, c)}</g>
        <text x="160" y="58" font-family="${FONT}" font-size="26" font-weight="bold" fill="#333">把我们设为<tspan fill="${c}">星标 ★</tspan></text>
        <text x="160" y="90" font-family="${FONT}" font-size="18" fill="#888">第一时间收到推送，不再错过精彩内容</text>`,
      )
    },
  },
  {
    id: 'wave',
    name: '流动波浪线',
    category: 'divider',
    tags: ['简约', '清新'],
    width: W,
    height: 60,
    frames: 24,
    display: '100%',
    variants: true,
    render: (t, c) => {
      const pts = []
      for (let x = 20; x <= 620; x += 6) pts.push(`${x},${(30 + 9 * Math.sin(TAU * (x / 150 - t))).toFixed(2)}`)
      return svg(
        W,
        60,
        `<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${tint(c, 0.85)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${tint(c, 0.85)}"/></linearGradient></defs>
        <polyline points="${pts.join(' ')}" fill="none" stroke="url(#g)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
      )
    },
  },
  {
    id: 'dots',
    name: '跃动圆点',
    category: 'divider',
    tags: ['简约', '可爱'],
    width: W,
    height: 50,
    frames: 30,
    display: '100%',
    variants: true,
    render: (t, c) =>
      svg(
        W,
        50,
        Array.from({ length: 15 }, (_, i) => {
          const k = clamp01(Math.sin(TAU * (t - i / 15)))
          return `<circle cx="${68 + i * 36}" cy="25" r="${(3 + 5 * k).toFixed(2)}" fill="${tint(c, 0.75 - 0.75 * k)}"/>`
        }).join(''),
      ),
  },
  {
    id: 'plane',
    name: '纸飞机分割线',
    category: 'divider',
    tags: ['清新', '可爱'],
    width: W,
    height: 90,
    frames: 40,
    display: '100%',
    variants: true,
    render: (t, c) => {
      const P = (u) => ({ x: 40 + 560 * u, y: 60 - 28 * Math.sin(Math.PI * u) })
      const u = easeInOut(t)
      let dashes = ''
      for (let k = 0; k < 40; k++) {
        const a = P(k / 40)
        const b = P((k + 0.5) / 40)
        dashes += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${k / 40 < u ? c : '#ddd'}" stroke-width="3" stroke-linecap="round"/>`
      }
      const p = P(u)
      const q = P(Math.min(1, u + 0.01))
      const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI
      return svg(
        W,
        90,
        `${dashes}<g transform="translate(${p.x} ${p.y - 6}) rotate(${ang})">
          <path d="M16,0 L-14,-12 L-6,0 L-14,12 Z" fill="${c}"/><path d="M16,0 L-6,0 L-10,8 Z" fill="${tint(c, 0.4)}"/>
        </g>`,
      )
    },
  },
  {
    id: 'sparkle',
    name: '星光细线',
    category: 'divider',
    tags: ['简约', '文艺'],
    width: W,
    height: 70,
    frames: 30,
    display: '100%',
    variants: true,
    defaultColor: 'purple',
    render: (t, c) =>
      svg(
        W,
        70,
        `<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>
        <rect x="60" y="33.5" width="520" height="3" rx="1.5" fill="url(#g)"/>` +
          [120, 220, 320, 420, 520]
            .map((x, i) => {
              const k = clamp01(Math.sin(TAU * (t + i * 0.37)))
              return star4(x, 35, 6 + 12 * k, i === 2 ? c : tint(c, 0.25), 0.45 + 0.55 * k)
            })
            .join(''),
      ),
  },
  {
    id: 'new',
    name: 'NEW 爆炸贴',
    category: 'title',
    tags: ['潮流', '电商'],
    width: 200,
    height: 200,
    frames: 24,
    display: '28%',
    variants: true,
    defaultColor: 'red',
    render: (t, c) => {
      const pts = []
      for (let i = 0; i < 32; i++) {
        const r = i % 2 ? 66 : 84
        const a = (i * Math.PI) / 16
        pts.push(`${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`)
      }
      const s = 1 + 0.06 * Math.sin(TAU * t * 2)
      return svg(
        200,
        200,
        `<g transform="translate(100 100) scale(${s})">
          <g transform="rotate(${22.5 * t})"><polygon points="${pts.join(' ')}" fill="${c}"/></g>
          <circle r="58" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 5" opacity=".7"/>
          <text y="16" font-family="Arial Black, ${FONT}" font-size="44" font-weight="900" text-anchor="middle" fill="#fff" transform="rotate(-10)">NEW</text>
        </g>`,
      )
    },
  },
  {
    id: 'hot',
    name: 'HOT 火焰',
    category: 'title',
    tags: ['潮流', '电商'],
    width: 200,
    height: 200,
    frames: 20,
    display: '28%',
    render: (t) => {
      const f = (p, a) => (a * Math.sin(TAU * (t * 2 + p))).toFixed(2)
      return svg(
        200,
        200,
        `<defs><linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff3d00"/><stop offset=".6" stop-color="#ff8a00"/><stop offset="1" stop-color="#ffd54f"/></linearGradient></defs>
        <path d="M100,${22 + +f(0, 6)} C${126 + +f(0.2, 6)},60 150,80 146,120 C144,150 124,168 100,168 C76,168 56,150 54,122 C52,96 70,${84 + +f(0.5, 5)} 78,62 C84,78 90,84 96,84 C92,64 92,44 100,${22 + +f(0, 6)}Z" fill="url(#fl)"/>
        <path d="M100,${92 + +f(0.3, 5)} C112,110 122,124 120,140 C118,154 110,162 100,162 C90,162 82,154 81,142 C80,126 92,114 100,${92 + +f(0.3, 5)}Z" fill="#fff3c4"/>
        <text x="100" y="192" font-family="Arial Black, ${FONT}" font-size="30" font-weight="900" text-anchor="middle" fill="#ff3d00">HOT</text>`,
      )
    },
  },
  {
    id: 'end',
    name: 'END 动态结尾',
    category: 'ending',
    tags: ['简约', '通用'],
    width: 480,
    height: 150,
    frames: 40,
    display: '60%',
    variants: true,
    render: (t, c) => {
      const out = 1 - range(t, 0.88, 1)
      const letters = ['E', 'N', 'D']
        .map((ch, i) => {
          const p = easeOut(range(t, 0.05 + i * 0.1, 0.25 + i * 0.1))
          return `<text x="${180 + i * 60}" y="${92 + 20 * (1 - p)}" font-family="Georgia, ${FONT}" font-size="64" font-weight="bold" text-anchor="middle" fill="${c}" opacity="${(p * out).toFixed(3)}">${ch}</text>`
        })
        .join('')
      const w = 220 * easeInOut(range(t, 0.4, 0.6))
      return svg(
        480,
        150,
        `${letters}<rect x="${240 - w / 2}" y="110" width="${w}" height="4" rx="2" fill="${c}" opacity="${out}"/>
        <circle cx="${240 - w / 2 - 14}" cy="112" r="4" fill="${tint(c, 0.4)}" opacity="${(w / 220) * out}"/>
        <circle cx="${240 + w / 2 + 14}" cy="112" r="4" fill="${tint(c, 0.4)}" opacity="${(w / 220) * out}"/>`,
      )
    },
  },
  {
    id: 'thanks',
    name: '感谢阅读 · 爱心',
    category: 'ending',
    tags: ['可爱', '通用'],
    width: 480,
    height: 180,
    frames: 40,
    display: '70%',
    variants: true,
    defaultColor: 'red',
    render: (t, c) => {
      const r = rng(7)
      const hearts = Array.from({ length: 7 }, () => ({ x: 40 + r() * 400, ph: r(), s: 10 + r() * 10 }))
        .map(({ x, ph, s }) => {
          const p = (t + ph) % 1
          return heart(x + 10 * Math.sin(TAU * p), 190 - 200 * p, s, tint(c, 0.3 + 0.4 * ph), (Math.sin(Math.PI * p) * 0.8).toFixed(3))
        })
        .join('')
      const beat = 1 + 0.08 * Math.max(0, Math.sin(TAU * t * 2))
      return svg(
        480,
        180,
        `${hearts}<g transform="translate(240 92) scale(${beat})"><text y="12" font-family="${FONT}" font-size="40" font-weight="bold" text-anchor="middle" fill="${c}" letter-spacing="6">感谢阅读</text></g>
        <text x="240" y="140" font-family="Georgia, ${FONT}" font-size="14" letter-spacing="4" text-anchor="middle" fill="#aaa">THANKS FOR READING</text>`,
      )
    },
  },
  {
    id: 'typing',
    name: '打字机开场',
    category: 'title',
    tags: ['简约', '科技'],
    width: 560,
    height: 100,
    frames: 40,
    display: '80%',
    variants: true,
    render: (t, c) => {
      const text = '今天，想和你聊聊'
      const n = Math.floor(text.length * clamp01(t / 0.6))
      const shown = text.slice(0, Math.max(0, n))
      const cursorOn = t < 0.6 || Math.floor(t * 8) % 2 === 0
      const w = shown.length * 32
      return svg(
        560,
        100,
        `<rect x="30" y="20" width="6" height="60" rx="3" fill="${c}"/>
        <text x="56" y="62" font-family="${FONT}" font-size="32" fill="#333">${shown}</text>
        ${cursorOn ? `<rect x="${60 + w}" y="32" width="3" height="38" fill="${c}"/>` : ''}`,
      )
    },
  },
  {
    id: 'hearts',
    name: '心动贴纸',
    category: 'imagetext',
    tags: ['可爱', '少女'],
    width: 240,
    height: 240,
    frames: 30,
    display: '36%',
    variants: true,
    defaultColor: 'red',
    render: (t, c) => {
      const beat = 1 + 0.12 * Math.max(0, Math.sin(TAU * t * 2)) ** 2
      const small = [0, 0.33, 0.66]
        .map((ph, i) => {
          const p = (t + ph) % 1
          return heart(60 + i * 60 + 12 * Math.sin(TAU * p), 210 - 190 * p, 14, tint(c, 0.4), (Math.sin(Math.PI * p) * 0.9).toFixed(3))
        })
        .join('')
      return svg(240, 240, `${small}${heart(120, 128, 92 * beat, c)}<ellipse cx="96" cy="104" rx="10" ry="6" fill="#fff" opacity=".6" transform="rotate(-35 96 104)"/>`)
    },
  },
  {
    id: 'confetti',
    name: '彩纸庆祝',
    category: 'title',
    tags: ['节日', '色彩', '企业'],
    width: 480,
    height: 200,
    frames: 40,
    display: '80%',
    render: (t) => {
      const r = rng(42)
      const colors = ['#ff4d4f', '#ffc53d', '#40a9ff', '#73d13d', '#9254de', '#ff85c0']
      let pieces = ''
      for (let i = 0; i < 46; i++) {
        const x0 = r() * 480
        const y0 = r() * 240
        const k = 1 + Math.floor(r() * 2)
        const y = ((y0 + k * t * 240) % 240) - 20
        const x = x0 + 8 * Math.sin(TAU * (t * k + r()))
        const rot = 360 * k * t + r() * 360
        pieces += `<rect x="-5" y="-3" width="10" height="6" rx="1" fill="${colors[i % colors.length]}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})"/>`
      }
      return svg(
        480,
        200,
        `${pieces}<rect x="110" y="66" width="260" height="70" rx="35" fill="#fff" opacity=".92"/>
        <text x="240" y="114" font-family="${FONT}" font-size="36" font-weight="bold" text-anchor="middle" fill="#e8402a" letter-spacing="8">热烈祝贺</text>`,
      )
    },
  },
  {
    id: 'lantern',
    name: '新春灯笼',
    category: 'title',
    tags: ['节日', '春节', '古风'],
    width: 480,
    height: 230,
    frames: 36,
    display: '80%',
    render: (t) => {
      const lantern = (x, ph) => {
        const a = 7 * Math.sin(TAU * (t + ph))
        return `<g transform="translate(${x} 0) rotate(${a.toFixed(2)})">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#b8860b" stroke-width="2"/>
          <rect x="-16" y="40" width="32" height="10" rx="2" fill="#f5c542"/>
          <ellipse cx="0" cy="96" rx="48" ry="46" fill="#e8312a"/>
          <ellipse cx="0" cy="96" rx="26" ry="46" fill="none" stroke="#c4171d" stroke-width="2"/>
          <ellipse cx="0" cy="96" rx="8" ry="46" fill="none" stroke="#c4171d" stroke-width="2"/>
          <text x="0" y="110" font-family="${FONT}" font-size="36" font-weight="bold" text-anchor="middle" fill="#ffd666">福</text>
          <rect x="-16" y="140" width="32" height="10" rx="2" fill="#f5c542"/>
          <g stroke="#e8312a" stroke-width="2.5"><line x1="-6" y1="150" x2="-8" y2="186"/><line x1="0" y1="150" x2="0" y2="190"/><line x1="6" y1="150" x2="8" y2="186"/></g>
        </g>`
      }
      return svg(
        480,
        230,
        `${lantern(80, 0)}${lantern(400, 0.5)}
        <text x="240" y="112" font-family="${FONT}" font-size="40" font-weight="bold" text-anchor="middle" fill="#d4241c" letter-spacing="6">新春快乐</text>
        <text x="240" y="146" font-family="${FONT}" font-size="16" text-anchor="middle" fill="#c9a227" letter-spacing="6">HAPPY NEW YEAR</text>`,
      )
    },
  },
  {
    id: 'snow',
    name: '初雪横幅',
    category: 'title',
    tags: ['节日', '清新', '圣诞'],
    width: W,
    height: 200,
    frames: 40,
    display: '100%',
    render: (t) => {
      const r = rng(9)
      let flakes = ''
      for (let i = 0; i < 40; i++) {
        const x0 = r() * W
        const y0 = r() * 220
        const k = 1 + Math.floor(r() * 2)
        const size = 2 + r() * 4
        const y = ((y0 + k * t * 220) % 220) - 10
        const x = x0 + 10 * Math.sin(TAU * (t * k + i / 7))
        flakes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="#fff" opacity="${(0.6 + r() * 0.4).toFixed(2)}"/>`
      }
      return svg(
        W,
        200,
        `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8c8ff"/><stop offset="1" stop-color="#e3eeff"/></linearGradient>
        <clipPath id="c"><rect x="10" y="10" width="620" height="180" rx="18"/></clipPath></defs>
        <g clip-path="url(#c)"><rect width="${W}" height="200" fill="url(#sky)"/>
        <path d="M0,170 Q160,140 320,168 T640,160 L640,200 L0,200Z" fill="#fff"/>${flakes}</g>
        <text x="320" y="100" font-family="${FONT}" font-size="40" font-weight="bold" text-anchor="middle" fill="#2f5fb8" letter-spacing="8">冬日 · 初雪</text>
        <text x="320" y="132" font-family="Georgia, ${FONT}" font-size="16" text-anchor="middle" fill="#5b7fc4" letter-spacing="5">THE FIRST SNOW</text>`,
      )
    },
  },
  {
    id: 'fireworks',
    name: '新年烟花',
    category: 'title',
    tags: ['节日', '春节', '元旦'],
    width: 480,
    height: 240,
    frames: 45,
    display: '80%',
    render: (t) => {
      const bursts = [
        { x: 120, y: 80, ph: 0, c: '#ffd666' },
        { x: 360, y: 70, ph: 0.33, c: '#ff85c0' },
        { x: 240, y: 110, ph: 0.66, c: '#5cdbd3' },
      ]
      const parts = bursts
        .map(({ x, y, ph, c }) => {
          const p = (t + ph) % 1
          const e = easeOut(p / 0.7)
          const o = 1 - range(p, 0.4, 0.8)
          if (p > 0.85) return ''
          return Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * TAU
            const r1 = 6 + 44 * e
            const r0 = Math.max(0, r1 - 14)
            return `<line x1="${x + r0 * Math.cos(a)}" y1="${y + r0 * Math.sin(a) + 8 * e}" x2="${x + r1 * Math.cos(a)}" y2="${y + r1 * Math.sin(a) + 8 * e}" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="${o.toFixed(3)}"/>`
          }).join('')
        })
        .join('')
      return svg(
        480,
        240,
        `<defs><clipPath id="c"><rect x="8" y="8" width="464" height="224" rx="18"/></clipPath>
        <linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a3a"/><stop offset="1" stop-color="#22305e"/></linearGradient></defs>
        <g clip-path="url(#c)"><rect width="480" height="240" fill="url(#n)"/>${parts}</g>
        <text x="240" y="196" font-family="${FONT}" font-size="36" font-weight="bold" text-anchor="middle" fill="#ffd666" letter-spacing="8">新年快乐</text>`,
      )
    },
  },
  {
    id: 'moon',
    name: '中秋明月',
    category: 'title',
    tags: ['节日', '中秋', '古风'],
    width: 480,
    height: 220,
    frames: 40,
    display: '80%',
    render: (t) => {
      const cloud = (x, y, s, o) =>
        `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}" fill="#fff"><ellipse cx="0" cy="0" rx="34" ry="12"/><ellipse cx="-14" cy="-8" rx="16" ry="12"/><ellipse cx="10" cy="-12" rx="18" ry="14"/></g>`
      const cx1 = ((60 + t * 480) % 560) - 40
      const cx2 = ((300 + t * 480) % 560) - 40
      return svg(
        480,
        220,
        `<defs><clipPath id="c"><rect x="8" y="8" width="464" height="204" rx="18"/></clipPath>
        <linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2b53"/><stop offset="1" stop-color="#3b4a7a"/></linearGradient>
        <radialGradient id="m" cx=".38" cy=".38"><stop offset="0" stop-color="#fffbe6"/><stop offset=".7" stop-color="#ffd666"/><stop offset="1" stop-color="#f0b400"/></radialGradient></defs>
        <g clip-path="url(#c)"><rect width="480" height="220" fill="url(#n)"/>
        <circle cx="140" cy="108" r="${60 + 4 * Math.sin(TAU * t)}" fill="#ffd666" opacity=".15"/>
        <circle cx="140" cy="108" r="48" fill="url(#m)"/>
        ${cloud(cx1, 140, 1.1, 0.85)}${cloud(cx2, 70, 0.8, 0.6)}
        ${[0, 1, 2, 3].map((i) => star4(260 + i * 50, 40 + (i % 2) * 20, 3 + 3 * clamp01(Math.sin(TAU * (t + i * 0.3))), '#fff')).join('')}</g>
        <text x="330" y="118" font-family="${FONT}" font-size="38" font-weight="bold" text-anchor="middle" fill="#ffd666" letter-spacing="6">中秋快乐</text>
        <text x="330" y="152" font-family="${FONT}" font-size="16" text-anchor="middle" fill="#c8d0ea" letter-spacing="6">月圆 · 人团圆</text>`,
      )
    },
  },
  {
    id: 'gift',
    name: '礼物惊喜',
    category: 'imagetext',
    tags: ['节日', '电商', '可爱'],
    width: 240,
    height: 240,
    frames: 40,
    display: '36%',
    render: (t) => {
      const shake = t < 0.4 ? 6 * Math.sin(TAU * t * 6) : 0
      const lift = easeOut(range(t, 0.45, 0.6)) * (1 - range(t, 0.9, 1))
      const sp = range(t, 0.5, 0.9)
      const sparks = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * TAU - Math.PI / 2
        const r = 20 + 50 * easeOut(sp)
        return star4(120 + r * Math.cos(a), 100 + r * Math.sin(a) * 0.7, 6, i % 2 ? '#ffc53d' : '#ff4d4f', (1 - sp).toFixed(3))
      }).join('')
      return svg(
        240,
        240,
        `${sparks}<g transform="rotate(${shake} 120 200)">
          <rect x="62" y="120" width="116" height="90" rx="6" fill="#ff4d4f"/>
          <rect x="112" y="120" width="16" height="90" fill="#ffd666"/>
          <g transform="translate(0 ${-40 * lift}) rotate(${-12 * lift} 60 110)">
            <rect x="54" y="98" width="132" height="26" rx="5" fill="#e8312a"/>
            <rect x="112" y="98" width="16" height="26" fill="#ffd666"/>
            <path d="M120,98 C100,70 82,80 92,94 Z M120,98 C140,70 158,80 148,94 Z" fill="#ffd666"/>
          </g>
        </g>`,
      )
    },
  },
]
