import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import { getBlock } from '../../blocks'
import { colorKit, isValidHex } from '../color'
import type { BlockContext } from '../types'
import { escapeHtml, parseAttrs } from './attrs'

export interface RenderEnv {
  primary: string
  fontSize: number
  assetBase: string
}

export const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: false,
  highlight(code, lang) {
    const src = code.replace(/\n$/, '')
    const language = lang && hljs.getLanguage(lang) ? lang : undefined
    const html = language
      ? hljs.highlight(src, { language, ignoreIllegals: true }).value
      : escapeHtml(src)
    return `<pre class="wx-pre"><code class="wx-code hljs">${html}</code></pre>\n`
  },
})

/* ---------- 给标准元素打上 wx-* 语义类，供主题 CSS 选择 ---------- */

const CLASS_MAP: Record<string, string> = {
  paragraph_open: 'wx-p',
  blockquote_open: 'wx-blockquote',
  bullet_list_open: 'wx-ul',
  ordered_list_open: 'wx-ol',
  list_item_open: 'wx-li',
  table_open: 'wx-table',
  thead_open: 'wx-thead',
  tbody_open: 'wx-tbody',
  tr_open: 'wx-tr',
  th_open: 'wx-th',
  td_open: 'wx-td',
  hr: 'wx-hr',
  strong_open: 'wx-strong',
  em_open: 'wx-em',
  s_open: 'wx-del',
  code_inline: 'wx-codespan',
  link_open: 'wx-a',
  image: 'wx-img',
}

md.core.ruler.push('wx_classes', (state) => {
  const walk = (tokens: typeof state.tokens) => {
    for (const t of tokens) {
      const cls = CLASS_MAP[t.type]
      if (cls) t.attrJoin('class', cls)
      if (t.children) walk(t.children)
    }
  }
  walk(state.tokens)
})

// 标题拆成 prefix / content / suffix 三段，主题可以只用 CSS 给前后缀做装饰
md.renderer.rules.heading_open = (tokens, idx) => {
  const tag = tokens[idx].tag
  return `<${tag} class="wx-${tag}"><span class="wx-${tag}-prefix"></span><span class="wx-${tag}-content">`
}
md.renderer.rules.heading_close = (tokens, idx) => {
  const tag = tokens[idx].tag
  return `</span><span class="wx-${tag}-suffix"></span></${tag}>\n`
}

// 有 alt 的图片自动带图注
const defaultImage = md.renderer.rules.image!
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const alt = self.renderInlineAsText(token.children ?? [], options, env).trim()
  const img = defaultImage(tokens, idx, options, env, self)
  return alt ? `${img}<span class="wx-figcaption">${escapeHtml(alt)}</span>` : img
}

/* ---------- 组件容器语法 :::block-id{k="v"} ... ::: ---------- */

type BlockRule = Parameters<MarkdownIt['block']['ruler']['before']>[2]

const OPEN_RE = /^:::\s*([\w-]+)\s*(\{.*\})?\s*$/

const blockRule: BlockRule = (state, startLine, endLine, silent) => {
  const lineText = (n: number) => state.src.slice(state.bMarks[n] + state.tShift[n], state.eMarks[n])
  const m = lineText(startLine).match(OPEN_RE)
  if (!m) return false
  if (silent) return true

  // 找到配对的闭合 :::，支持嵌套
  let depth = 1
  let next = startLine
  while (++next < endLine) {
    const l = lineText(next).trim()
    if (OPEN_RE.test(l)) depth++
    else if (/^:::\s*$/.test(l) && --depth === 0) break
  }
  const closed = next < endLine
  const raw = state.getLines(startLine + 1, next, state.blkIndent, false)

  const token = state.push('wx_block', '', 0)
  token.info = m[1]
  token.meta = { params: parseAttrs(m[2]), raw }
  token.map = [startLine, closed ? next + 1 : next]
  token.block = true
  state.line = closed ? next + 1 : next
  return true
}

md.block.ruler.before('fence', 'wx_block', blockRule, {
  alt: ['paragraph', 'reference', 'blockquote', 'list'],
})

md.renderer.rules.wx_block = (tokens, idx, _options, env: RenderEnv) => {
  const token = tokens[idx]
  const def = getBlock(token.info)
  if (!def) {
    return `<section class="wx-block-unknown">未知组件：${escapeHtml(token.info)}</section>\n`
  }
  const params = token.meta.params as Record<string, string>
  const color = params.color && isValidHex(params.color) ? params.color : env.primary
  const ctx: BlockContext = {
    color: colorKit(color.startsWith('#') ? color : `#${color}`),
    fontSize: env.fontSize,
    renderInline: (s) => md.renderInline(s, env),
    render: (s) => md.render(s, env),
    asset: (p) => env.assetBase + p.replace(/^\/+/, ''),
  }
  try {
    return def.render({ params, raw: token.meta.raw as string, ctx }) + '\n'
  } catch (e) {
    return `<section class="wx-block-unknown">组件 ${escapeHtml(token.info)} 渲染失败：${escapeHtml(String(e))}</section>\n`
  }
}
