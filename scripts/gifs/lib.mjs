// GIF 生成工具：每一帧用 SVG 描述 → resvg 栅格化 → gifenc 编码
import { Resvg } from '@resvg/resvg-js'
import gifenc from 'gifenc'

const { GIFEncoder, quantize, applyPalette } = gifenc

export const FONT = `'Microsoft YaHei','PingFang SC','Noto Sans CJK SC','Source Han Sans SC',sans-serif`

/** 公众号常用配色变体：key 会出现在文件名与组件参数 color=key 中 */
export const COLORS = {
  blue: '#1e80ff',
  green: '#07c160',
  red: '#f5455c',
  orange: '#ff8a00',
  purple: '#7c5cff',
}

const PI2 = Math.PI * 2
export const TAU = PI2

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('')
export const tint = (hex, t) => toHex(hexToRgb(hex).map((c) => c + (255 - c) * t))
export const shade = (hex, t) => toHex(hexToRgb(hex).map((c) => c * (1 - t)))

export const clamp01 = (x) => Math.max(0, Math.min(1, x))
export const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3)
export const easeInOut = (x) => {
  x = clamp01(x)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
/** 区间 [a,b] 内的进度 0..1 */
export const range = (t, a, b) => clamp01((t - a) / (b - a))
export const wave = (t, phase = 0) => Math.sin(PI2 * (t + phase))

export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let r = Math.imul(a ^ (a >>> 15), 1 | a)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function svg(w, h, body, bg = '#ffffff') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${
    bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''
  }${body}</svg>`
}

/** 四角星 */
export const star4 = (x, y, s, fill, opacity = 1) =>
  `<path transform="translate(${x} ${y})" d="M0,${-s} Q0,0 ${s},0 Q0,0 0,${s} Q0,0 ${-s},0 Q0,0 0,${-s}Z" fill="${fill}" opacity="${opacity}"/>`

/** 爱心，中心 (x,y)，大小 s */
export const heart = (x, y, s, fill, opacity = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s / 20})" d="M0,6 C-10,-2 -14,-8 -10,-13 C-6,-18 0,-15 0,-10 C0,-15 6,-18 10,-13 C14,-8 10,-2 0,6Z" fill="${fill}" opacity="${opacity}"/>`

/** 五角星 */
export function star5(x, y, r, fill, extra = '') {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push(`${(x + rr * Math.cos(a)).toFixed(2)},${(y + rr * Math.sin(a)).toFixed(2)}`)
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" ${extra}/>`
}

/**
 * 渲染一个 GIF，返回字节。
 * 加载系统字体很慢，所以把所有帧拼成一张竖长的雪碧图只栅格化一次，再按帧切片。
 */
export function encodeGif({ width, height, frames, fps = 20, render }) {
  const parts = []
  for (let i = 0; i < frames; i++) {
    const markup = render(i / frames, i)
      .replace(/\sid="([\w-]+)"/g, ` id="$1_f${i}"`)
      .replace(/url\(#([\w-]+)\)/g, `url(#$1_f${i})`)
      .replace(/^<svg /, `<svg x="0" y="${i * height}" `)
    parts.push(markup)
  }
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height * frames}" viewBox="0 0 ${width} ${height * frames}">${parts.join('')}</svg>`
  const img = new Resvg(sprite, {
    font: { loadSystemFonts: true, defaultFontFamily: 'Microsoft YaHei' },
  }).render()
  const all = new Uint8Array(img.pixels)
  const frameBytes = width * height * 4

  const gif = GIFEncoder()
  const delay = Math.round(1000 / fps)
  for (let i = 0; i < frames; i++) {
    // 注意必须复制：gifenc 会直接读取底层 buffer，subarray 的偏移会被忽略
    const rgba = all.slice(i * frameBytes, (i + 1) * frameBytes)
    const palette = quantize(rgba, 256)
    const index = applyPalette(rgba, palette)
    gif.writeFrame(index, width, height, { palette, delay, repeat: 0 })
  }
  gif.finish()
  return gif.bytes()
}
