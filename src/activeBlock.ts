import { EditorView } from '@codemirror/view'
import { create } from 'zustand'
import { blockAtLine, type BlockRange } from './core/blockSyntax'

export interface ActiveBlock extends BlockRange {
  /** 素材正文（开始行与闭合行之间的原始 Markdown） */
  content: string
}

/** 编辑器光标所在的素材块，供参数面板使用 */
export const useActiveBlock = create<{ block: ActiveBlock | null }>(() => ({ block: null }))

function compute(view: EditorView): ActiveBlock | null {
  const { doc, selection } = view.state
  const block = blockAtLine(doc.toString(), doc.lineAt(selection.main.head).number)
  if (!block) return null
  const last = block.closeLine ? block.closeLine - 1 : block.endLine
  const content = last > block.openLine ? doc.sliceString(doc.line(block.openLine + 1).from, doc.line(last).to) : ''
  return { ...block, content }
}

const keyOf = (b: ActiveBlock | null) =>
  b ? [b.id, b.openLine, b.closeLine, b.content, JSON.stringify(b.params)].join('\u0000') : ''

export function publishActiveBlock(view: EditorView) {
  const next = compute(view)
  if (keyOf(next) !== keyOf(useActiveBlock.getState().block)) useActiveBlock.setState({ block: next })
}

/** 文档或光标变化时重新计算 */
export const activeBlockTracker = EditorView.updateListener.of((u) => {
  if (u.docChanged || u.selectionSet) publishActiveBlock(u.view)
})
