/** 颜色工具：所有输出都是字面颜色值，因为公众号不支持 CSS 变量 */

export function parseHex(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0]
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}

const toHex = (rgb: number[]) =>
  '#' + rgb.map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('')

/** 透明度：alpha('#ff0000', 0.1) => rgba(255,0,0,0.1) */
export function alpha(hex: string, a: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r},${g},${b},${a})`
}

/** 向白色混合：t=0 原色，t=1 白色 */
export function tint(hex: string, t: number): string {
  return toHex(parseHex(hex).map((c) => c + (255 - c) * t))
}

/** 向黑色混合：t=0 原色，t=1 黑色 */
export function shade(hex: string, t: number): string {
  return toHex(parseHex(hex).map((c) => c * (1 - t)))
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim())
}

export interface ColorKit {
  /** 主色 */
  main: string
  alpha: (a: number) => string
  tint: (t: number) => string
  shade: (t: number) => string
}

export function colorKit(hex: string): ColorKit {
  return {
    main: hex,
    alpha: (a) => alpha(hex, a),
    tint: (t) => tint(hex, t),
    shade: (t) => shade(hex, t),
  }
}

/**
 * 主题 CSS 占位符：
 *   {{primary}}        主色
 *   {{primary/0.1}}    主色 10% 透明度
 *   {{primary~0.9}}    主色向白色混合 90%
 *   {{primary^0.2}}    主色向黑色混合 20%
 *   {{fs}}             基础字号（px）
 *   {{fs*1.2}}         基础字号 × 1.2（px）
 */
export function fillPlaceholders(css: string, vars: { primary: string; fontSize: number }): string {
  return css.replace(/\{\{\s*(primary|fs)\s*(?:([*/~^])\s*([\d.]+))?\s*\}\}/g, (_, name, op, num) => {
    const n = num === undefined ? undefined : parseFloat(num)
    if (name === 'fs') {
      const v = op === '*' && n !== undefined ? vars.fontSize * n : vars.fontSize
      return `${Math.round(v * 10) / 10}px`
    }
    if (n === undefined) return vars.primary
    if (op === '/') return alpha(vars.primary, n)
    if (op === '~') return tint(vars.primary, n)
    if (op === '^') return shade(vars.primary, n)
    return vars.primary
  })
}
