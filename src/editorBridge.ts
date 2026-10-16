import type { EditorView } from '@codemirror/view'

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
