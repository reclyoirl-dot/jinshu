import { EditorView } from '@codemirror/view'

/** 让样式中心、工具栏等组件可以操作编辑器 */
let view: EditorView | null = null

export function setEditorView(v: EditorView | null) {
  view = v
}

export function getEditorView() {
  return view
}

/** 用 before/after 包裹选区（无选区时插入占位文字并选中） */
export function wrapSelection(before: string, after = before, placeholder = '文字', v = view) {
  if (!v) return false
  const { from, to } = v.state.selection.main
  const selected = v.state.sliceDoc(from, to) || placeholder
  v.dispatch({
    changes: { from, to, insert: before + selected + after },
    selection: { anchor: from + before.length, head: from + before.length + selected.length },
    scrollIntoView: true,
  })
  v.focus()
  return true
}

/** 给选区所在的每一行加前缀（标题、引用、列表） */
export function prefixLines(prefix: string | ((i: number) => string), v = view) {
  if (!v) return false
  const { from, to } = v.state.selection.main
  const startLine = v.state.doc.lineAt(from).number
  const endLine = v.state.doc.lineAt(to).number
  const changes = []
  for (let n = startLine; n <= endLine; n++) {
    const line = v.state.doc.line(n)
    const p = typeof prefix === 'function' ? prefix(n - startLine) : prefix
    changes.push({ from: line.from, insert: p })
  }
  v.dispatch({ changes, scrollIntoView: true })
  v.focus()
  return true
}

/** 以独立段落的形式在光标处插入一段 Markdown（组件、表格等） */
export function insertBlock(text: string, v = view) {
  if (!v) return false
  const { from, to } = v.state.selection.main
  const line = v.state.doc.lineAt(from)
  const before = from === line.from ? (line.number > 1 && v.state.doc.line(line.number - 1).text.trim() ? '\n' : '') : '\n\n'
  const insert = `${before}${text.trimEnd()}\n\n`
  v.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length },
    scrollIntoView: true,
  })
  v.focus()
  return true
}

/** 把光标移到某一行（从 1 开始）行首并滚动到视野中间 */
export function jumpToLine(line: number, v = view) {
  if (!v) return false
  const n = Math.min(Math.max(1, line), v.state.doc.lines)
  const pos = v.state.doc.line(n).from
  v.dispatch({ selection: { anchor: pos }, effects: EditorView.scrollIntoView(pos, { y: 'center' }) })
  v.focus()
  return true
}

/** 整行替换（行号从 1 开始，包含首尾行） */
export function replaceLines(fromLine: number, toLine: number, text: string, v = view) {
  if (!v) return false
  const { doc } = v.state
  if (fromLine < 1 || toLine > doc.lines || fromLine > toLine) return false
  const from = doc.line(fromLine).from
  const to = doc.line(toLine).to
  if (doc.sliceString(from, to) === text) return true
  v.dispatch({ changes: { from, to, insert: text } })
  return true
}

/** 替换两行之间的内容（不含这两行本身），用于改写素材正文 */
export function replaceBetweenLines(openLine: number, closeLine: number, text: string, v = view) {
  if (!v) return false
  const { doc } = v.state
  if (openLine < 1 || closeLine > doc.lines || openLine >= closeLine) return false
  const from = doc.line(openLine).to
  const to = doc.line(closeLine).from
  const insert = text ? `\n${text}\n` : '\n'
  if (doc.sliceString(from, to) === insert) return true
  v.dispatch({ changes: { from, to, insert } })
  return true
}
