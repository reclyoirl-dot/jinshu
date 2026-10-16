import type { BlockDef, BlockParam } from './types'
import { parseAttrs } from './render/attrs'

/**
 * :::素材 语法的编辑器侧解析。配对规则与 core/render/markdown.ts 保持一致：
 * 开始行 `:::id{参数}`，闭合行单独的 `:::`，支持嵌套；顶层的围栏代码块里不识别。
 */
export const OPEN_RE = /^:::\s*([\w-]+)\s*(\{.*\})?\s*$/
export const CLOSE_RE = /^:::\s*$/
const FENCE_RE = /^(`{3,}|~{3,})/

export interface BlockRange {
  id: string
  params: Record<string, string>
  /** 开始行，从 1 开始 */
  openLine: number
  /** 闭合行，从 1 开始；未闭合时为 null（素材一直延续到文末） */
  closeLine: number | null
  /** 素材覆盖的最后一行 */
  endLine: number
  /** 嵌套深度，顶层为 0 */
  depth: number
}

/** 跳过开头的 YAML frontmatter，返回正文第一行的下标（从 0 开始） */
function frontmatterEnd(lines: string[]): number {
  if (lines[0]?.trim() !== '---') return 0
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === '---') return i + 1
  return 0
}

function scan(lines: string[], start: number, end: number, depth: number, out: BlockRange[]) {
  let fence: string | null = null
  for (let i = start; i < end; i++) {
    const text = lines[i].trim()
    if (fence) {
      if (text.startsWith(fence)) fence = null
      continue
    }
    const f = text.match(FENCE_RE)
    if (f) {
      fence = f[1][0].repeat(f[1].length)
      continue
    }
    const m = text.match(OPEN_RE)
    if (!m) continue
    // 与渲染器一致：内部遇到开始行加一层，遇到闭合行减一层
    let level = 1
    let j = i
    while (++j < end) {
      const l = lines[j].trim()
      if (OPEN_RE.test(l)) level++
      else if (CLOSE_RE.test(l) && --level === 0) break
    }
    const closed = j < end
    out.push({
      id: m[1],
      params: parseAttrs(m[2]),
      openLine: i + 1,
      closeLine: closed ? j + 1 : null,
      endLine: closed ? j + 1 : end,
      depth,
    })
    // 容器内部会被再次当作 Markdown 渲染，所以嵌套素材按同样规则解析
    scan(lines, i + 1, closed ? j : end, depth + 1, out)
    i = closed ? j : end
  }
}

/** 找出文档里所有素材块（按开始行排序） */
export function findBlocks(src: string): BlockRange[] {
  const lines = src.split(/\r?\n/)
  const out: BlockRange[] = []
  scan(lines, frontmatterEnd(lines), lines.length, 0, out)
  return out.sort((a, b) => a.openLine - b.openLine)
}

/** 包含某一行（从 1 开始）的最内层素材块 */
export function blockAtLine(src: string, line: number): BlockRange | null {
  let hit: BlockRange | null = null
  for (const b of findBlocks(src)) {
    if (b.openLine <= line && line <= b.endLine && (!hit || b.depth > hit.depth)) hit = b
  }
  return hit
}

/** 把参数写回 {k="v"} 形式；值里有双引号时改用单引号 */
export function stringifyAttrs(entries: [string, string][]): string {
  if (!entries.length) return ''
  const parts = entries.map(([k, v]) => {
    if (!v.includes('"')) return `${k}="${v}"`
    if (!v.includes("'")) return `${k}='${v}'`
    return `${k}="${v.replace(/"/g, '”')}"`
  })
  return `{${parts.join(' ')}}`
}

export function buildOpenLine(id: string, entries: [string, string][]): string {
  return `:::${id}${stringifyAttrs(entries)}`
}

/** 从示例的第一行里取出参数（保持顺序） */
export function exampleParams(def: BlockDef): [string, string][] {
  const m = def.example.split('\n')[0].match(OPEN_RE)
  return Object.entries(parseAttrs(m?.[2]))
}

/** 常见参数名的中文标签（素材没有声明 params 时使用） */
const PARAM_LABELS: Record<string, string> = {
  color: '颜色',
  title: '标题',
  sub: '副标题',
  label: '标签',
  no: '序号',
  en: '英文',
  author: '作者',
  name: '名称',
  role: '身份',
  qr: '二维码图片地址',
  avatar: '头像文字',
  note: '备注',
  date: '日期',
  width: '宽度',
  text: '文字',
  value: '数值',
  unit: '单位',
  to: '称呼',
  from: '落款',
  sign: '署名',
  seal: '印章',
  price: '价格',
  original: '原价',
  badge: '角标',
  foot: '底部文字',
  explain: '解析',
  answer: '答案',
  account: '账号',
  year: '年份',
  topic: '话题',
  hint: '提示',
  serial: '编号',
  score: '评分',
  left: '上联',
  right: '下联',
  icon: '图标',
  button: '按钮文字',
  done: '完成后文字',
  issue: '期号',
  day: '日',
  month: '月',
  offer: '优惠',
  pros: '优点',
  cons: '缺点',
}

const NUMBER_RE =/^-?(0|[1-9]\d*)(\.\d+)?$/

function inferType(key: string, value: string): BlockParam['type'] {
  if (key === 'color') return 'color'
  return NUMBER_RE.test(value) ? 'number' : 'text'
}

/**
 * 素材面板里展示的参数：优先用素材自己声明的 params，
 * 否则从示例里推断；再补上 color 和当前文本里已有、但未声明的参数。
 */
export function paramFields(def: BlockDef | undefined, current: Record<string, string>): BlockParam[] {
  const fields: BlockParam[] = []
  const seen = new Set<string>()
  const add = (f: BlockParam) => {
    if (seen.has(f.key)) return
    seen.add(f.key)
    fields.push(f)
  }
  const label = (key: string) => PARAM_LABELS[key] ?? key

  if (def?.variants) {
    add({
      key: def.variants.param,
      label: label(def.variants.param),
      type: 'select',
      options: def.variants.options.map((o) => ({ value: o.value, label: o.label })),
    })
  }
  if (def?.params) def.params.forEach(add)
  else if (def) for (const [k, v] of exampleParams(def)) add({ key: k, label: label(k), type: inferType(k, v) })
  add({ key: 'color', label: label('color'), type: 'color' })
  for (const [k, v] of Object.entries(current)) add({ key: k, label: label(k), type: inferType(k, v) })
  return fields
}
