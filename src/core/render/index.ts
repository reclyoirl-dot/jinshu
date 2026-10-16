import { defaultAssetBase, withSlash } from '../assets'
import { fillPlaceholders } from '../color'
import type { RenderOptions } from '../types'
import { BASE_CSS, CODE_CSS } from './baseCss'
import { inlineCss } from './inline'
import { md, type RenderEnv } from './markdown'

export { md } from './markdown'
export { parseAttrs } from './attrs'

/** 去掉开头的 YAML frontmatter（模板用它声明主题） */
export function stripFrontmatter(src: string): string {
  return src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { data: {}, body: src }
  const data: Record<string, string> = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return { data, body: src.slice(m[0].length) }
}

const isWechatLink = (href: string) => /^https?:\/\/mp\.weixin\.qq\.com\//i.test(href)

/** 公众号正文不能放外链：把外链替换为「文字[n]」，并在文末列出参考链接 */
function linksToFootnotes(root: Element, doc: Document) {
  const notes: { text: string; href: string }[] = []
  for (const a of Array.from(root.querySelectorAll('a'))) {
    const href = a.getAttribute('href') ?? ''
    if (!href || href.startsWith('#') || isWechatLink(href)) continue
    let n = notes.findIndex((x) => x.href === href) + 1
    if (!n) {
      notes.push({ text: a.textContent ?? '', href })
      n = notes.length
    }
    const span = doc.createElement('span')
    span.className = 'wx-a-note'
    span.innerHTML = a.innerHTML
    const sup = doc.createElement('sup')
    sup.className = 'wx-footnote-ref'
    sup.textContent = `[${n}]`
    a.replaceWith(span, sup)
  }
  if (!notes.length) return
  const section = doc.createElement('section')
  section.className = 'wx-footnotes'
  const title = doc.createElement('p')
  title.className = 'wx-footnotes-title'
  title.textContent = '参考链接'
  section.append(title)
  notes.forEach((note, i) => {
    const p = doc.createElement('p')
    p.className = 'wx-footnote-item'
    const label = note.text && note.text !== note.href ? `${note.text}：` : ''
    p.textContent = `[${i + 1}] ${label}${note.href}`
    section.append(p)
  })
  root.append(section)
}

/** 公众号会折叠空格和换行：代码块里的空格转 &nbsp;，换行转 <br> */
function fixCodeWhitespace(root: Element, doc: Document) {
  for (const pre of Array.from(root.querySelectorAll('pre'))) {
    const walker = doc.createTreeWalker(pre, 4 /* NodeFilter.SHOW_TEXT */)
    const texts: Text[] = []
    while (walker.nextNode()) texts.push(walker.currentNode as Text)
    for (const node of texts) {
      const value = (node.nodeValue ?? '').replace(/\t/g, '    ').replace(/ /g, ' ')
      if (!value.includes('\n')) {
        node.nodeValue = value
        continue
      }
      const frag = doc.createDocumentFragment()
      value.split('\n').forEach((part, i) => {
        if (i > 0) frag.append(doc.createElement('br'))
        if (part) frag.append(doc.createTextNode(part))
      })
      node.replaceWith(frag)
    }
  }
}

/** 去掉公众号不认的 class / id，以及只给预览区用的 data-line */
function cleanup(root: Element, keepLineMarks = false) {
  const all = [root, ...Array.from(root.querySelectorAll('*'))]
  for (const el of all) {
    el.removeAttribute('class')
    el.removeAttribute('id')
    if (!keepLineMarks) el.removeAttribute('data-line')
  }
  // 主题没有装饰的标题前后缀是空 span，删掉
  for (const span of Array.from(root.querySelectorAll('span'))) {
    if (!span.hasAttribute('style') && !span.childNodes.length) span.remove()
  }
}

export interface RenderResult {
  /** 复制到公众号用的 HTML，不含 class / id / data-* */
  html: string
  text: string
  /** 仅当 lineMarks 为真时提供：素材外层带 data-line，只用于预览区点击跳转 */
  previewHtml?: string
}

/** Markdown → 公众号可直接粘贴的内联样式 HTML */
export function renderArticle(markdown: string, opts: RenderOptions): RenderResult {
  const env: RenderEnv = {
    primary: opts.primary,
    fontSize: opts.fontSize,
    assetBase: withSlash(opts.assetBase || defaultAssetBase()),
  }
  const source = stripFrontmatter(markdown)
  if (opts.lineMarks) {
    env.markLines = true
    env.lineOffset = markdown.slice(0, markdown.length - source.length).split('\n').length - 1
  }
  const body = md.render(source, env)

  const doc = document.implementation.createHTMLDocument('')
  doc.body.innerHTML = `<section class="wx-root">${body}</section>`
  const root = doc.body.firstElementChild as HTMLElement

  if (opts.footnoteLinks) linksToFootnotes(root, doc)
  const css = fillPlaceholders(BASE_CSS + CODE_CSS[opts.theme.codeTheme] + opts.theme.css, env)
  inlineCss(root, css)
  fixCodeWhitespace(root, doc)
  if (!opts.lineMarks) {
    cleanup(root)
    return { html: root.outerHTML, text: root.textContent ?? '' }
  }
  cleanup(root, true)
  const previewHtml = root.outerHTML
  cleanup(root)
  return { html: root.outerHTML, text: root.textContent ?? '', previewHtml }
}
