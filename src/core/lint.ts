/**
 * 公众号兼容检测：对渲染后的内联样式 HTML 做静态检查，
 * 提前发现粘贴到公众号后台时会被「内容结构检测」提示、或者会显示异常的问题。
 */

export type LintLevel = 'error' | 'warning' | 'info'

export type LintRule =
  | 'gradient-on-text'
  | 'low-line-height'
  | 'local-image'
  | 'gif-not-public'
  | 'data-image'
  | 'external-link'

export interface LintIssue {
  rule: LintRule
  level: LintLevel
  message: string
  /** 出问题的片段：文字摘要、图片地址或链接 */
  snippet: string
}

/** 文字行高低于这个倍数时，公众号会提示「行高异常，多行文本可能重叠」 */
export const MIN_LINE_HEIGHT = 1.3

const LEVEL_ORDER: Record<LintLevel, number> = { error: 0, warning: 1, info: 2 }

/** 解析内联 style，正确处理括号里的分号和逗号（如 url(data:...;base64)、渐变） */
export function parseStyle(style: string | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!style) return out
  let depth = 0
  let start = 0
  const push = (decl: string) => {
    const i = decl.indexOf(':')
    if (i > 0) out[decl.slice(0, i).trim().toLowerCase()] = decl.slice(i + 1).trim()
  }
  for (let i = 0; i < style.length; i++) {
    const c = style[i]
    if (c === '(') depth++
    else if (c === ')') depth = Math.max(0, depth - 1)
    else if (c === ';' && depth === 0) {
      push(style.slice(start, i))
      start = i + 1
    }
  }
  push(style.slice(start))
  return out
}

const BG_PROPS = ['background', 'background-color', 'background-image']
const TRANSPARENT_RE = /^(none|transparent|initial|inherit|unset|rgba\([^)]*,\s*0\s*\))$/i
const GRADIENT_RE = /gradient\(/i

/** 元素自身声明的背景：none 表示没有背景（文字透出到祖先），gradient 表示渐变 */
function backgroundKind(style: Record<string, string>): 'none' | 'solid' | 'gradient' {
  let kind: 'none' | 'solid' | 'gradient' = 'none'
  for (const p of BG_PROPS) {
    const v = style[p]
    if (!v || TRANSPARENT_RE.test(v)) continue
    if (GRADIENT_RE.test(v)) return 'gradient'
    if (p === 'background-image' && /url\(/i.test(v)) continue
    kind = 'solid'
  }
  return kind
}

const brief = (s: string, max = 24) => {
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max)}…` : t
}

/** 元素内（不含 SVG）的可见文字 */
function htmlText(el: Element): string {
  let out = ''
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3) out += node.nodeValue ?? ''
    else if (node.nodeType === 1 && (node as Element).tagName.toLowerCase() !== 'svg') out += htmlText(node as Element)
  }
  return out
}

const ownText = (el: Element) =>
  Array.from(el.childNodes)
    .filter((n) => n.nodeType === 3)
    .map((n) => n.nodeValue ?? '')
    .join('')
    .trim()

/* ---------- 地址检查 ---------- */

const PRIVATE_HOST_RE =
  /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|\[::1\]|.+\.local|.+\.localhost)$/i

/** 公众号抓取不到的地址返回原因，可以抓取返回 null */
export function addressProblem(url: string): 'local' | 'relative' | 'data' | null {
  const u = url.trim()
  if (/^data:/i.test(u)) return 'data'
  if (/^(blob|file):/i.test(u)) return 'local'
  const m = u.match(/^(?:https?:)?\/\/([^/:?#]+|\[[^\]]+\])/i)
  if (!m) return 'relative'
  return PRIVATE_HOST_RE.test(m[1]) ? 'local' : null
}

const isWechatLink = (href: string) => /^https?:\/\/mp\.weixin\.qq\.com\//i.test(href)

/* ---------- 行高计算 ---------- */

interface TextMetrics {
  /** 字号 px */
  fontSize: number
  /** 行高：factor 为倍数（无单位，按子元素字号继承），px 为固定值 */
  lineHeight: { kind: 'factor' | 'px'; value: number }
  /** 声明该行高的元素，用来定位问题 */
  source: Element | null
}

const KEYWORD_SIZES: Record<string, number> = {
  'xx-small': 9,
  'x-small': 10,
  small: 13,
  medium: 16,
  large: 18,
  'x-large': 24,
  'xx-large': 32,
}

function resolveFontSize(value: string | undefined, parent: number): number {
  if (!value) return parent
  const v = value.trim().toLowerCase()
  if (v in KEYWORD_SIZES) return KEYWORD_SIZES[v]
  if (v === 'smaller') return parent * 0.83
  if (v === 'larger') return parent * 1.2
  const m = v.match(/^([\d.]+)(px|em|rem|%|pt)?$/)
  if (!m) return parent
  const n = parseFloat(m[1])
  switch (m[2]) {
    case 'em':
      return parent * n
    case 'rem':
      return 16 * n
    case '%':
      return (parent * n) / 100
    case 'pt':
      return (n * 4) / 3
    default:
      return n
  }
}

function resolveLineHeight(value: string | undefined, fontSize: number): TextMetrics['lineHeight'] | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === 'normal') return { kind: 'factor', value: 1.2 }
  const m = v.match(/^([\d.]+)(px|em|rem|%|pt)?$/)
  if (!m) return null
  const n = parseFloat(m[1])
  switch (m[2]) {
    case undefined:
      return { kind: 'factor', value: n }
    case 'em':
      return { kind: 'px', value: fontSize * n }
    case 'rem':
      return { kind: 'px', value: 16 * n }
    case '%':
      return { kind: 'px', value: (fontSize * n) / 100 }
    case 'pt':
      return { kind: 'px', value: (n * 4) / 3 }
    default:
      return { kind: 'px', value: n }
  }
}

const ratioOf = (m: TextMetrics) => (m.lineHeight.kind === 'factor' ? m.lineHeight.value : m.lineHeight.value / m.fontSize)

/* ---------- 检测 ---------- */

/** 检测 HTML（通常是 renderArticle 的输出），按严重程度排序返回问题列表 */
export function lintHtml(html: string): LintIssue[] {
  const doc = document.implementation.createHTMLDocument('')
  doc.body.innerHTML = html
  const issues: LintIssue[] = []
  const seen = new Set<string>()
  const add = (issue: LintIssue, key = `${issue.rule}|${issue.snippet}`) => {
    if (seen.has(key)) return
    seen.add(key)
    issues.push(issue)
  }

  // 1. 文字直接画在渐变背景上：公众号深色模式无法转换渐变（darkmode-no-gradient）
  const gradientFlagged = new Set<Element>()
  const walkBg = (el: Element, bgOwner: Element | null, bgGradient: boolean) => {
    if (el.tagName.toLowerCase() === 'svg') return
    const kind = backgroundKind(parseStyle(el.getAttribute('style')))
    if (kind !== 'none') {
      bgOwner = el
      bgGradient = kind === 'gradient'
    }
    if (bgGradient && bgOwner && !gradientFlagged.has(bgOwner) && ownText(el)) {
      gradientFlagged.add(bgOwner)
      add(
        {
          rule: 'gradient-on-text',
          level: 'warning',
          message: '文字背景使用了渐变，公众号深色模式无法适配，建议改为纯色背景',
          snippet: brief(htmlText(bgOwner)),
        },
        `gradient|${issues.length}`,
      )
    }
    for (const child of Array.from(el.children)) walkBg(child, bgOwner, bgGradient)
  }

  // 2. 行高过小：多行文字会重叠
  const lineFlagged = new Set<Element>()
  const walkText = (el: Element, parent: TextMetrics) => {
    if (el.tagName.toLowerCase() === 'svg') return
    const style = parseStyle(el.getAttribute('style'))
    const fontSize = resolveFontSize(style['font-size'], parent.fontSize)
    const lh = resolveLineHeight(style['line-height'], fontSize)
    const metrics: TextMetrics = lh
      ? { fontSize, lineHeight: lh, source: el }
      : { fontSize, lineHeight: parent.lineHeight, source: parent.source }
    const ratio = ratioOf(metrics)
    const text = ownText(el)
    if (text && ratio < MIN_LINE_HEIGHT && metrics.source && !lineFlagged.has(metrics.source)) {
      lineFlagged.add(metrics.source)
      add(
        {
          rule: 'low-line-height',
          level: 'warning',
          message: `文字行高 ${Math.round(ratio * 100) / 100} 过小，多行时可能重叠，建议不低于 1.5`,
          snippet: brief(htmlText(metrics.source) || text),
        },
        `line|${issues.length}`,
      )
    }
    for (const child of Array.from(el.children)) walkText(child, metrics)
  }

  for (const el of Array.from(doc.body.children)) {
    walkBg(el, null, false)
    walkText(el, { fontSize: 16, lineHeight: { kind: 'factor', value: 1.6 }, source: null })
  }

  // 3. 图片地址：公众号粘贴时会抓取并转存图片，本地 / 内网 / 相对地址都抓不到
  const imageUrls: string[] = []
  for (const img of Array.from(doc.querySelectorAll('img'))) imageUrls.push(img.getAttribute('src') ?? '')
  for (const img of Array.from(doc.querySelectorAll('image'))) {
    imageUrls.push(img.getAttribute('href') ?? img.getAttribute('xlink:href') ?? '')
  }
  for (const el of Array.from(doc.querySelectorAll('[style]'))) {
    for (const m of (el.getAttribute('style') ?? '').matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) imageUrls.push(m[1])
  }
  for (const url of imageUrls) {
    if (!url) continue
    const problem = addressProblem(url)
    if (!problem) continue
    const isGif = /\.gif(?:[?#]|$)/i.test(url)
    if (problem === 'data') {
      add({ rule: 'data-image', level: 'warning', message: 'Base64 内嵌图片粘贴到公众号可能丢失，建议上传图床', snippet: brief(url, 40) })
    } else if (isGif) {
      add({
        rule: 'gif-not-public',
        level: 'error',
        message: '动图地址公众号无法访问：部署到公网后使用，或在「主题 → 动图素材地址」填写公网地址',
        snippet: url,
      })
    } else {
      add({
        rule: 'local-image',
        level: 'error',
        message: problem === 'relative' ? '图片使用了相对地址，公众号无法抓取，请改为公网图片链接' : '图片是本地 / 内网地址，公众号无法抓取，请上传图床',
        snippet: url,
      })
    }
  }

  // 4. 外链：公众号正文只允许跳转公众号文章
  for (const a of Array.from(doc.querySelectorAll('a[href]'))) {
    const href = a.getAttribute('href') ?? ''
    if (!href || href.startsWith('#') || isWechatLink(href)) continue
    add({ rule: 'external-link', level: 'warning', message: '公众号正文不支持外链，点击无效；可开启「外链转脚注」', snippet: href })
  }

  return issues.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level])
}
