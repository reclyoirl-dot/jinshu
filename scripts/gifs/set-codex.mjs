// 独立动图集：季节、生活与文章交互。使用固定随机种子与周期运动。
import { FONT, easeInOut, easeOut, heart, range, rng, shade, star4, star5, svg, tint, wave } from './lib.mjs'

const W = 640
const circleLength = (r) => 2 * Math.PI * r
const tickLength = Math.hypot(22, 22) + Math.hypot(42, 44)
const ink = '#35465c'
const text = (x, y, value, size, color = ink, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" fill="${color}" text-anchor="middle" ${extra}>${value}</text>`
const path = (d, color, width = 3, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`
const panel = (w, h, color) => `<rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="24" fill="${color}"/>`
const petals = (x, y, size) => `<g transform="translate(${x} ${y}) scale(${size})">${Array.from({ length: 5 }, (_, i) =>
  `<path d="M0,0 C-13,-8 -17,-23 -7,-26 L0,-21 L7,-26 C17,-23 13,-8 0,0Z" fill="#ffb5ce" transform="rotate(${i * 72})"/>`,
).join('')}<circle r="4" fill="#ef799e"/></g>`
// 进度动画淡出后复位，避免完成状态直接跳回起点。
const envelope = (t) => easeInOut(range(t, 0, 0.08)) * (1 - easeInOut(range(t, 0.84, 1)))

export default [
  {
    id: 'sakura-breeze',
    name: '春日樱花飘落',
    category: 'title',
    tags: ['春天', '樱花', '清新'],
    width: W,
    height: 200,
    frames: 40,
    fps: 20,
    display: '100%',
    render: (t) => {
      const random = rng(318)
      let falling = ''
      for (let i = 0; i < 14; i++) {
        const x0 = 25 + random() * 590, y0 = random() * 280, phase = random(), k = 1 + Math.floor(random() * 2)
        const y = ((y0 + k * t * 280) % 280) - 40
        falling += `<path d="M0,-8 C10,-8 11,2 0,9 C-9,2 -10,-5 0,-8Z" fill="${i % 3 ? '#f5a8c2' : '#ffd0df'}" transform="translate(${x0 + 16 * wave(t, phase)} ${y}) rotate(${360 * t + phase * 360})"/>`
      }
      return svg(W, 200, `${panel(W, 200, '#fff4f7')}
        <defs><clipPath id="sakura-window"><rect x="10" y="10" width="620" height="180" rx="24"/></clipPath></defs>
        <g clip-path="url(#sakura-window)">
          ${path('M28,18 Q70,45 112,56 Q138,64 163,99 M78,45 L91,17 M112,56 L146,36', '#ae8279', 5)}
          ${petals(59, 31, 0.7)}${petals(108, 59, 0.85)}${petals(151, 88, 0.62)}${petals(145, 32, 0.55)}
          ${falling}
        </g>
        <rect x="208" y="49" width="306" height="105" rx="22" fill="#fff9fb" opacity=".94"/>
        ${text(361, 97, '把春天写进日常', 32, '#aa4e72', 'font-weight="bold"')}
        ${text(361, 132, '花开有时 · 美好正当时', 18, '#bf7a93')}`)
    },
  },
  {
    id: 'sunny-rays',
    name: '夏日旋转小太阳',
    category: 'imagetext',
    tags: ['夏天', '阳光', '可爱'],
    width: 240,
    height: 240,
    frames: 32,
    fps: 20,
    display: '36%',
    // 12 根相同光芒转过 30° 后与起点重合。
    render: (t) => svg(240, 240, `
      <circle cx="120" cy="107" r="88" fill="#fff9e6"/>
      <g transform="translate(120 107) rotate(${t * 30})">${Array.from({ length: 12 }, (_, i) =>
        path('M0,-64 L0,-77', '#ffbf42', 7, `transform="rotate(${i * 30})"`),
      ).join('')}</g>
      <circle cx="120" cy="107" r="49" fill="#ffd75c"/>
      <circle cx="104" cy="103" r="3.5" fill="#945927"/><circle cx="136" cy="103" r="3.5" fill="#945927"/>
      <ellipse cx="92" cy="116" rx="8" ry="5" fill="#ffa76f"/><ellipse cx="148" cy="116" rx="8" ry="5" fill="#ffa76f"/>
      ${path('M110,117 Q120,130 130,117', '#945927', 3.5)}
      ${text(120, 216, '今日份晴朗', 22, '#b47b26', 'font-weight="bold"')}`),
  },
  {
    id: 'autumn-postcard',
    name: '秋日落叶来信',
    category: 'title',
    tags: ['秋天', '落叶', '文艺'],
    width: W,
    height: 200,
    frames: 40,
    fps: 20,
    display: '100%',
    render: (t) => {
      const random = rng(927)
      let leaves = ''
      for (let i = 0; i < 11; i++) {
        const x0 = 24 + random() * 592, y0 = random() * 300, phase = random(), size = 0.65 + random() * 0.35
        const y = ((y0 + t * 300) % 300) - 50, c = ['#e69a46', '#ce6e4c', '#d8b54c'][i % 3]
        leaves += `<g transform="translate(${x0 + 23 * wave(t, phase)} ${y}) rotate(${26 * wave(t, phase) + phase * 180}) scale(${size})">
          <path d="M0,-21 C22,-13 20,9 0,21 C-20,9 -22,-13 0,-21Z" fill="${c}"/>
          ${path('M0,-12 L0,25 M0,3 L9,-4 M0,10 L-9,3', '#fff2ce', 3.2)}
        </g>`
      }
      return svg(W, 200, `${panel(W, 200, '#fff7e9')}
        <defs><clipPath id="autumn-window"><rect x="10" y="10" width="620" height="180" rx="24"/></clipPath></defs>
        <g clip-path="url(#autumn-window)">${leaves}</g>
        <rect x="168" y="48" width="304" height="104" rx="20" fill="#fffaf1" opacity=".96"/>
        ${text(320, 96, '收集一整个秋天', 32, '#9e6238', 'font-weight="bold"')}
        ${text(320, 130, '风有来信 · 叶有归期', 18, '#b28a58')}`)
    },
  },
  {
    id: 'rainy-umbrella',
    name: '雨天的小伞',
    category: 'imagetext',
    tags: ['下雨', '天气', '治愈'],
    width: 240,
    height: 240,
    frames: 32,
    fps: 20,
    display: '36%',
    render: (t) => {
      const random = rng(602)
      const drops = Array.from({ length: 14 }, () => {
        const x = 32 + random() * 176, y0 = random() * 260, y = ((y0 + 2 * t * 260) % 260) - 20
        return path(`M${x},${y} l-4,10`, '#91c9df', 3)
      }).join('')
      const ripple = [0, 0.5].map((phase) => {
        const p = (t + phase) % 1
        return `<ellipse cx="120" cy="195" rx="${20 + p * 45}" ry="${3 + p * 5}" fill="none" stroke="#a4d6e3" stroke-width="2.5" opacity="${Math.sin(Math.PI * p) ** 2}"/>`
      }).join('')
      return svg(240, 240, `${panel(240, 240, '#f0f9fc')}
        <defs><clipPath id="rain-window"><rect x="22" y="18" width="196" height="177" rx="24"/></clipPath></defs>
        <g clip-path="url(#rain-window)">${drops}</g>${ripple}
        <g transform="rotate(${3 * wave(t)} 120 145)">
          ${path('M120,57 V165 C120,185 96,185 96,167', '#517181', 5)}
          <path d="M53,107 Q64,57 120,56 Q176,57 187,107 Q170,94 154,107 Q137,94 120,107 Q103,94 86,107 Q69,94 53,107Z" fill="#ffc86b" stroke="#e5a545" stroke-width="3" stroke-linejoin="round"/>
          ${path('M120,57 Q90,71 86,105 M120,57 Q150,71 154,105', '#fff0c1', 3)}
        </g>
        ${text(120, 221, '为你撑一把伞', 18, '#537b8e')}`)
    },
  },
  {
    id: 'birthday-balloons',
    name: '彩色气球上升',
    category: 'title',
    tags: ['生日', '儿童节', '庆祝'],
    width: W,
    height: 200,
    frames: 40,
    fps: 20,
    display: '100%',
    render: (t) => {
      const random = rng(611)
      const colors = ['#fb879c', '#75cfc3', '#ffcc63', '#9f9ae8', '#87bdf2', '#fbab78']
      const balloons = colors.map((c, i) => {
        const x0 = 48 + i * 108, y0 = random() * 380, phase = random()
        // 包含绳子的整个气球离开卡片后才回绕。
        const y = 300 - ((y0 + t * 380) % 380)
        return `<g transform="translate(${x0 + 9 * wave(t, phase)} ${y}) rotate(${5 * wave(t, phase)})">
          ${path('M0,25 C-12,44 13,58 0,78', tint(c, 0.25), 2.5)}
          <path d="M0,22 L-5,29 L5,29Z" fill="${shade(c, 0.1)}"/>
          <ellipse cy="-3" rx="24" ry="30" fill="${c}"/>
          ${path('M-13,-15 Q-17,-6 -14,0', '#ffffff', 4, 'opacity=".65"')}
        </g>`
      }).join('')
      return svg(W, 200, `${panel(W, 200, '#f5faff')}
        <defs><clipPath id="balloon-window"><rect x="10" y="10" width="620" height="180" rx="24"/></clipPath></defs>
        <g clip-path="url(#balloon-window)">${balloons}</g>
        <rect x="173" y="54" width="294" height="92" rx="26" fill="#ffffff" opacity=".94"/>
        ${text(320, 97, '快乐，正在上升', 31, '#5972a8', 'font-weight="bold"')}
        ${text(320, 130, '愿每一天都有小小惊喜', 17, '#8b9bb5')}`)
    },
  },
  {
    id: 'candle-wishes',
    name: '生日蛋糕与烛光',
    category: 'imagetext',
    tags: ['生日', '蛋糕', '祝福'],
    width: 240,
    height: 240,
    frames: 32,
    fps: 20,
    display: '36%',
    render: (t) => {
      const candles = [83, 120, 157].map((x, i) => {
        const flicker = wave(2 * t, i / 3)
        return `<rect x="${x - 5}" y="79" width="10" height="34" rx="3" fill="${i === 1 ? '#8bcfc7' : '#c5b3ec'}"/>
          ${path(`M${x - 2},86 l4,4 M${x - 2},99 l4,4`, '#fff', 2)}
          <circle cx="${x}" cy="64" r="${14 + flicker * 2}" fill="#fff1bd" opacity=".7"/>
          <path d="M${x},76 C${x - 13},70 ${x - 7},58 ${x + flicker * 3},49 C${x + 4},59 ${x + 13},70 ${x},76Z" fill="#ffbc50"/>
          <path d="M${x},74 Q${x - 6},68 ${x},62 Q${x + 6},70 ${x},74Z" fill="#fff5cf"/>`
      }).join('')
      return svg(240, 240, `
        <circle cx="120" cy="117" r="92" fill="#fff7ed"/>
        ${star4(45, 75, 5 + 2 * wave(t), '#e8b259')}${star4(194, 91, 6 - 2 * wave(t), '#e8b259')}
        ${candles}
        <ellipse cx="120" cy="181" rx="83" ry="11" fill="#f0dfd6"/>
        <rect x="54" y="112" width="132" height="64" rx="13" fill="#eca4b9"/>
        <rect x="54" y="145" width="132" height="12" fill="#ffe6cf"/>
        <path d="M54,122 V116 Q54,103 68,103 H172 Q186,103 186,116 V125 Q177,140 167,125 Q158,112 148,128 Q139,142 129,126 Q120,112 110,127 Q101,143 91,127 Q82,114 73,128 Q62,140 54,122Z" fill="#fffdf7" stroke="#eecdbf" stroke-width="2" stroke-linejoin="round"/>
        ${text(120, 218, '许个愿吧', 23, '#b87387', 'font-weight="bold"')}`)
    },
  },
  {
    id: 'coffee-pause',
    name: '热咖啡休息时间',
    category: 'imagetext',
    tags: ['咖啡', '生活', '治愈'],
    width: 240,
    height: 240,
    frames: 32,
    fps: 20,
    display: '36%',
    render: (t) => {
      const steam = [0, 1, 2].map((i) => {
        const p = (t + i / 3) % 1, x = 96 + i * 22 + 4 * wave(t, i / 3), y = 91 - 34 * p
        return path(`M${x},${y} c-14,-13 13,-20 0,-34`, '#bc9d86', 4, `opacity="${0.65 * Math.sin(Math.PI * p) ** 2}"`)
      }).join('')
      return svg(240, 240, `
        <circle cx="120" cy="116" r="91" fill="#faf3e9"/>
        ${steam}
        <ellipse cx="120" cy="177" rx="76" ry="13" fill="#decebb"/>
        <ellipse cx="120" cy="173" rx="68" ry="10" fill="#f1e4d2"/>
        <path d="M169,111 H178 C205,111 205,151 175,151 H164" fill="none" stroke="#a9c7bf" stroke-width="11"/>
        <path d="M66,102 H174 L168,149 Q165,172 120,172 Q75,172 72,149Z" fill="#bdd9ce"/>
        <ellipse cx="120" cy="102" rx="54" ry="13" fill="#e9f3e9"/>
        <ellipse cx="120" cy="103" rx="46" ry="9" fill="#92674e"/>
        ${path('M86,122 l3,23 Q91,153 103,155', '#e8f4e9', 4)}
        ${heart(122, 145, 15, '#f2fcf3')}
        ${text(120, 218, '歇一会，再出发', 19, '#8c7563')}`)
    },
  },
  {
    id: 'countdown-three',
    name: '倒计时 3 2 1',
    category: 'title',
    tags: ['倒计时', '活动', '开场'],
    width: 240,
    height: 240,
    frames: 48,
    fps: 16,
    display: '36%',
    variants: true,
    defaultColor: 'purple',
    render: (t, c) => {
      const u = (t * 3) % 1
      const alpha = easeInOut(range(u, 0, 0.18)) * (1 - easeInOut(range(u, 0.78, 1)))
      const scale = 0.86 + 0.14 * easeOut(range(u, 0, 0.4))
      return svg(240, 240, `
        <circle cx="120" cy="105" r="81" fill="${tint(c, 0.95)}"/>
        <circle cx="120" cy="105" r="68" fill="none" stroke="${tint(c, 0.85)}" stroke-width="6"/>
        <g opacity="${alpha}">
          <circle cx="120" cy="105" r="68" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="${circleLength(68) * u} ${circleLength(68)}" stroke-linecap="round" transform="rotate(-90 120 105)"/>
          <g transform="translate(120 105) scale(${scale})">${text(0, 26, 3 - Math.floor(t * 3), 80, c, 'font-weight="bold"')}</g>
        </g>
        ${text(120, 218, '精彩即将开始', 20, shade(c, 0.18), 'font-weight="bold"')}`)
    },
  },
  {
    id: 'notice-speaker',
    name: '喇叭最新公告',
    category: 'title',
    tags: ['公告', '企业', '通知'],
    width: W,
    height: 160,
    frames: 32,
    fps: 20,
    display: '100%',
    variants: true,
    defaultColor: 'orange',
    render: (t, c) => {
      const waves = [0, 0.5].map((phase) => {
        const p = (t + phase) % 1, x = 157 + p * 29
        return path(`M${x},${65 - p * 16} Q${x + 13 + p * 5},80 ${x},${95 + p * 16}`, c, 4, `opacity="${Math.sin(Math.PI * p) ** 2}"`)
      }).join('')
      return svg(W, 160, `${panel(W, 160, tint(c, 0.94))}
        <circle cx="111" cy="80" r="48" fill="${tint(c, 0.86)}"/>
        <g transform="rotate(${3 * wave(t)} 110 82)">
          <path d="M96,91 L104,116 H119 L110,86Z" fill="${shade(c, 0.15)}"/>
          <rect x="73" y="65" width="31" height="31" rx="7" fill="${c}"/>
          <path d="M99,64 L140,47 Q145,45 145,51 V110 Q145,116 140,114 L99,96Z" fill="${c}"/>
          ${path('M138,56 V105', tint(c, 0.6), 4)}
        </g>${waves}
        ${text(340, 76, '最新公告', 34, shade(c, 0.28), 'font-weight="bold" letter-spacing="5"')}
        ${text(339, 111, '重要消息 · 请及时查收', 19, '#7f8792')}
        <rect x="543" y="43" width="54" height="30" rx="15" fill="${c}"/>
        ${text(570, 64, 'NEW', 13, '#fff', 'font-weight="bold"')}`)
    },
  },
  {
    id: 'task-complete',
    name: '对勾描绘已完成',
    category: 'ending',
    tags: ['完成', '对勾', '简约'],
    width: 240,
    height: 240,
    frames: 40,
    fps: 20,
    display: '36%',
    variants: true,
    defaultColor: 'green',
    render: (t, c) => {
      const a = envelope(t), draw = easeInOut(range(t, 0.1, 0.52))
      return svg(240, 240, `
        <circle cx="120" cy="105" r="77" fill="${tint(c, 0.95)}"/>
        <circle cx="120" cy="105" r="60" fill="#fff" stroke="${tint(c, 0.83)}" stroke-width="4"/>
        <g opacity="${a}">
          <circle cx="120" cy="105" r="60" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="${circleLength(60) * easeOut(range(t, 0.04, 0.36))} ${circleLength(60)}" transform="rotate(-90 120 105)"/>
          ${path('M89,105 L111,127 L153,83', c, 9, `stroke-dasharray="${tickLength}" stroke-dashoffset="${tickLength * (1 - draw)}" opacity="${draw}"`)}
          ${star4(40, 62, 7 * draw, tint(c, 0.25))}${star4(197, 133, 8 * draw, tint(c, 0.25))}
          ${text(120, 216, '已完成', 26, shade(c, 0.15), 'font-weight="bold"')}
        </g>`)
    },
  },
  {
    id: 'loading-hundred',
    name: '进度加载到百分百',
    category: 'guide',
    tags: ['加载', '进度', '科技'],
    width: W,
    height: 160,
    frames: 40,
    fps: 20,
    display: '100%',
    variants: true,
    render: (t, c) => {
      const p = easeInOut(range(t, 0.06, 0.68)), a = envelope(t)
      return svg(W, 160, `${panel(W, 160, tint(c, 0.96))}
        <rect x="60" y="91" width="520" height="20" rx="10" fill="${tint(c, 0.86)}"/>
        <g opacity="${a}">
          ${text(159, 65, p >= 1 ? '加载完成' : '美好加载中', 23, shade(c, 0.2), 'font-weight="bold"')}
          ${text(547, 65, `${Math.round(p * 100)}%`, 26, c, 'font-weight="bold"')}
          <defs><clipPath id="progress-track"><rect x="60" y="91" width="520" height="20" rx="10"/></clipPath></defs>
          <g clip-path="url(#progress-track)">
            <rect x="60" y="91" width="${520 * p}" height="20" rx="10" fill="${c}"/>
            <rect x="60" y="93" width="${520 * p}" height="6" fill="${tint(c, 0.25)}"/>
          </g>
        </g>`)
    },
  },
  {
    id: 'swipe-gallery',
    name: '左右滑动查看更多',
    category: 'guide',
    tags: ['引导', '滑动', '相册'],
    width: W,
    height: 160,
    frames: 32,
    fps: 20,
    display: '100%',
    variants: true,
    render: (t, c) => {
      const dx = 15 * wave(t), left = 0.45 + 0.55 * (0.5 - 0.5 * wave(t)), right = 0.45 + 0.55 * (0.5 + 0.5 * wave(t))
      return svg(W, 160, `${panel(W, 160, tint(c, 0.96))}
        <rect x="244" y="36" width="152" height="52" rx="16" fill="${tint(c, 0.88)}"/>
        ${path(`M${216 + dx * 0.3},49 l-14,13 l14,13`, c, 4, `opacity="${left}"`)}
        ${path(`M${424 + dx * 0.3},49 l14,13 l-14,13`, c, 4, `opacity="${right}"`)}
        <g transform="translate(${310 + dx} 58)">
          <path d="M-10,17 V-14 C-10,-24 2,-24 2,-14 V3 L9,0 Q13,-1 16,3 Q24,0 27,8 L31,18 Q33,29 25,37 H1 Q-4,34 -7,28 L-19,15 C-24,7 -17,3 -12,9 L-10,12Z" fill="#fff" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
          ${path('M3,9 v10 M13,8 v10 M23,11 v8', tint(c, 0.45), 2)}
        </g>
        ${text(320, 132, '左右滑动查看更多', 23, shade(c, 0.2), 'font-weight="bold" letter-spacing="2"')}`)
    },
  },
  {
    id: 'lucky-envelope',
    name: '红包摇晃来啦',
    category: 'imagetext',
    tags: ['红包', '春节', '活动'],
    width: 240,
    height: 240,
    frames: 32,
    fps: 20,
    display: '36%',
    render: (t) => svg(240, 240, `
      <circle cx="120" cy="108" r="89" fill="#fff5e7"/>
      ${star4(39, 67, 6 + 2 * wave(t), '#efbd60')}${star4(197, 126, 7 - 2 * wave(t), '#efbd60')}
      <g transform="translate(120 111) rotate(${7 * wave(t) + 2 * wave(3 * t)})">
        <rect x="-53" y="-67" width="106" height="134" rx="14" fill="#e84d4b"/>
        <path d="M-53,-47 L-53,-53 Q-53,-67 -39,-67 H39 Q53,-67 53,-53 V-47 Q0,4 -53,-47Z" fill="#fc7560"/>
        ${path('M-48,-44 Q0,0 48,-44', '#f6ba67', 3)}
        <circle cy="-8" r="22" fill="#ffdb83"/><circle cy="-8" r="16" fill="none" stroke="#e9ac48" stroke-width="2"/>
        ${text(0, 0, '福', 23, '#bf4b32', 'font-weight="bold"')}
        ${path('M-31,40 H31 M-20,49 H20', '#f9a584', 3)}
      </g>
      ${text(120, 219, '红包来啦', 24, '#cf4a40', 'font-weight="bold" letter-spacing="3"')}`),
  },
  {
    id: 'christmas-lights',
    name: '圣诞树彩灯闪烁',
    category: 'imagetext',
    tags: ['圣诞', '节日', '祝福'],
    width: 240,
    height: 240,
    frames: 32,
    fps: 20,
    display: '36%',
    render: (t) => {
      const lamps = [[105, 83], [135, 91], [86, 121], [117, 128], [150, 135], [79, 159], [116, 164], [161, 170]]
        .map(([x, y], i) => {
          const glow = 0.5 + 0.5 * wave(t, i / 8), c = ['#ffd46d', '#ff9690', '#a8dfea'][i % 3]
          return `<circle cx="${x}" cy="${y}" r="${6 + 4 * glow}" fill="${c}" opacity="${0.08 + 0.16 * glow}"/>
            <circle cx="${x}" cy="${y}" r="4.5" fill="${c}"/>
            <circle cx="${x - 1}" cy="${y - 1}" r="2" fill="#fff" opacity="${0.3 + 0.7 * glow}"/>`
        }).join('')
      return svg(240, 240, `
        <circle cx="120" cy="114" r="94" fill="#f1f8f2"/>
        <ellipse cx="120" cy="191" rx="72" ry="8" fill="#dcebdd"/>
        <rect x="111" y="164" width="18" height="29" rx="3" fill="#bc8a61"/>
        <path d="M120,49 Q105,81 82,103 H99 Q82,128 65,142 H84 Q67,166 51,179 Q120,197 189,179 Q173,166 156,142 H175 Q158,128 141,103 H158 Q135,81 120,49Z" fill="#4b9d79" stroke="#3d8969" stroke-width="3" stroke-linejoin="round"/>
        ${path('M96,94 Q115,106 146,109 M80,133 Q117,151 168,155 M68,170 Q106,184 155,184', '#a9cf91', 2.5)}
        ${lamps}
        <circle cx="120" cy="42" r="${16 + 3 * wave(t)}" fill="#ffeab1" opacity=".6"/>
        ${star5(120, 42, 15, '#edc35d', 'stroke="#dfb24c" stroke-width="2" stroke-linejoin="round"')}
        ${text(120, 224, '圣诞快乐', 22, '#5a8d70', 'font-weight="bold" letter-spacing="3"')}`)
    },
  },
  {
    id: 'health-pulse',
    name: '健康心电图',
    category: 'divider',
    tags: ['健康', '医疗', '心电图'],
    width: W,
    height: 110,
    frames: 40,
    fps: 20,
    display: '100%',
    variants: true,
    defaultColor: 'green',
    render: (t, c) => {
      const trace = 'M98,59 H165 L180,48 L196,70 L213,27 L232,87 L250,50 L267,59 H346 L361,48 L377,70 L394,27 L413,87 L431,50 L448,59 H584'
      // 两份扫描窗首尾平移，心电图形本身保持不动。
      const scanX = 98 + t * 566
      const scans = [scanX, scanX - 566].map((x) => `<rect x="${x}" y="20" width="80" height="70"/>`).join('')
      return svg(W, 110, `${panel(W, 110, tint(c, 0.97))}
        <defs><clipPath id="ecg-bounds"><rect x="98" y="20" width="486" height="70" rx="4"/></clipPath>
          <clipPath id="ecg-scan">${scans}</clipPath></defs>
        <g opacity=".45">${[35, 59, 83].map((y) => path(`M98,${y} H584`, tint(c, 0.8), 2)).join('')}</g>
        ${heart(58, 65, 31 * (1 + 0.07 * wave(2 * t)), c)}
        ${path(trace, tint(c, 0.76), 3)}
        <g clip-path="url(#ecg-bounds)"><g clip-path="url(#ecg-scan)">${path(trace, c, 4.5)}</g></g>`)
    },
  },
  {
    id: 'book-turning',
    name: '书本轻轻翻页',
    category: 'imagetext',
    tags: ['教育', '阅读', '书本'],
    width: 240,
    height: 240,
    frames: 40,
    fps: 20,
    display: '36%',
    variants: true,
    defaultColor: 'blue',
    render: (t, c) => {
      // 翻页贴合左页后淡出；起点和终点都是同一本摊开的书。
      const p = easeInOut(range(t, 0.1, 0.78)), angle = Math.PI * p
      const edgeX = 120 + 72 * Math.cos(angle), lift = 31 * Math.sin(angle), a = envelope(t)
      const page = `M120,88 Q${(120 + edgeX) / 2},${73 - lift} ${edgeX},${86 - lift} V${166 - lift} Q${(120 + edgeX) / 2},${153 - lift} 120,170Z`
      const lines = [0, 1, 2].map((i) => `${path(`M59,${109 + i * 15} Q80,${106 + i * 15} 103,${115 + i * 15}`, '#ccd4db', 3)}${path(`M137,${115 + i * 15} Q160,${106 + i * 15} 181,${109 + i * 15}`, '#ccd4db', 3)}`).join('')
      return svg(240, 240, `
        <circle cx="120" cy="114" r="94" fill="${tint(c, 0.96)}"/>
        <ellipse cx="120" cy="181" rx="86" ry="9" fill="${tint(c, 0.9)}"/>
        <path d="M40,88 Q80,75 120,91 Q160,75 200,88 V175 Q160,163 120,180 Q80,163 40,175Z" fill="${c}" stroke="${shade(c, 0.12)}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M48,81 Q84,71 120,88 Q156,71 192,81 V167 Q155,156 120,173 Q85,156 48,167Z" fill="#fffdf7" stroke="#dbe3e8" stroke-width="2.5" stroke-linejoin="round"/>
        ${lines}${path('M120,89 V172', tint(c, 0.6), 3)}
        <g opacity="${a}"><path d="${page}" fill="${p < 0.5 ? '#f1f6fb' : '#ffffff'}" stroke="#cbd8e3" stroke-width="2.5" stroke-linejoin="round"/></g>
        <path d="M156,81 V110 L163,105 L170,108 V79Z" fill="${tint(c, 0.35)}"/>
        ${text(120, 221, '翻开新的一页', 21, shade(c, 0.22), 'font-weight="bold"')}`)
    },
  },
]
