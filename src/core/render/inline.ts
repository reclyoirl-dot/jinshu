/**
 * 极简 CSS 内联器：把主题 CSS 写进每个元素的 style 属性。
 * 公众号会丢弃 <style> 和 class，所以最终产物只能依赖内联样式。
 * 只支持普通规则（忽略 @media 等 at-rule 与伪元素），这对主题 CSS 已经足够。
 */

interface Rule {
  selector: string
  decls: [string, string][]
  spec: number
  order: number
}

function stripComments(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/** 按分号切分声明，但忽略括号内的分号（如 url(data:...;base64,...)） */
export function parseDecls(body: string): [string, string][] {
  const out: [string, string][] = []
  let depth = 0
  let start = 0
  const push = (seg: string) => {
    const i = seg.indexOf(':')
    if (i <= 0) return
    const prop = seg.slice(0, i).trim().toLowerCase()
    const value = seg.slice(i + 1).trim().replace(/\s*!important$/, '')
    if (prop && value) out.push([prop, value])
  }
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (c === '(') depth++
    else if (c === ')') depth = Math.max(0, depth - 1)
    else if (c === ';' && depth === 0) {
      push(body.slice(start, i))
      start = i + 1
    }
  }
  push(body.slice(start))
  return out
}

export function specificity(selector: string): number {
  let s = selector
  const ids = (s.match(/#[\w-]+/g) ?? []).length
  s = s.replace(/#[\w-]+/g, ' ')
  const classes =
    (s.match(/\.[\w-]+/g) ?? []).length +
    (s.match(/\[[^\]]*\]/g) ?? []).length +
    (s.match(/:(?!:)[\w-]+(\([^)]*\))?/g) ?? []).length
  s = s.replace(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+(\([^)]*\))?/g, ' ')
  const tags = (s.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length
  return ids * 10000 + classes * 100 + tags
}

export function parseCss(css: string): Rule[] {
  const src = stripComments(css)
  const rules: Rule[] = []
  let i = 0
  let order = 0
  while (i < src.length) {
    const open = src.indexOf('{', i)
    if (open < 0) break
    const selectorText = src.slice(i, open).trim()
    if (selectorText.startsWith('@')) {
      // 跳过整个 at-rule 块
      let depth = 1
      let j = open + 1
      while (j < src.length && depth > 0) {
        if (src[j] === '{') depth++
        else if (src[j] === '}') depth--
        j++
      }
      i = j
      continue
    }
    const close = src.indexOf('}', open)
    if (close < 0) break
    const decls = parseDecls(src.slice(open + 1, close))
    for (const sel of selectorText.split(',')) {
      const selector = sel.trim()
      if (!selector || selector.includes('::')) continue
      rules.push({ selector, decls, spec: specificity(selector), order: order++ })
    }
    i = close + 1
  }
  return rules
}

export function inlineCss(root: Element, css: string): void {
  const rules = parseCss(css)
  const matched = new Map<Element, Rule[]>()
  const consider = (el: Element, rule: Rule) => {
    const list = matched.get(el)
    if (list) list.push(rule)
    else matched.set(el, [rule])
  }
  for (const rule of rules) {
    let els: Element[]
    try {
      els = Array.from(root.querySelectorAll(rule.selector))
      if (root.matches(rule.selector)) els.unshift(root)
    } catch {
      continue
    }
    for (const el of els) consider(el, rule)
  }
  for (const [el, list] of matched) {
    list.sort((a, b) => a.spec - b.spec || a.order - b.order)
    const style = new Map<string, string>()
    for (const r of list) for (const [p, v] of r.decls) {
      style.delete(p)
      style.set(p, v)
    }
    // 元素已有的内联样式（组件自带）优先级最高
    for (const [p, v] of parseDecls(el.getAttribute('style') ?? '')) {
      style.delete(p)
      style.set(p, v)
    }
    el.setAttribute('style', Array.from(style, ([p, v]) => `${p}: ${v}`).join('; ') + ';')
  }
}
