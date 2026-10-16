import { EditorView } from '@codemirror/view'
import { imageHostProblem, uploadImage } from './core/imageHost'
import { useStudio } from './store'
import { openImageHostSettings } from './store/ui'
import { toast } from './toast'

export const UPLOAD_PLACEHOLDER = '![上传中…]()'

/** 正在上传的占位符在文档中的位置，随编辑实时映射 */
interface Pending {
  from: number
  to: number
}
const pending = new Set<Pending>()

export const uploadTracker = EditorView.updateListener.of((u) => {
  if (!u.docChanged) return
  for (const p of pending) {
    p.from = u.changes.mapPos(p.from, 1)
    p.to = u.changes.mapPos(p.to, -1)
  }
})

/** 找到占位符当前的位置；被挪动过（如切换文档）则退回全文搜索 */
function locate(view: EditorView, p: Pending): { from: number; to: number } | null {
  const { doc } = view.state
  if (p.to - p.from === UPLOAD_PLACEHOLDER.length && doc.sliceString(p.from, p.to) === UPLOAD_PLACEHOLDER) return p
  const i = doc.toString().indexOf(UPLOAD_PLACEHOLDER)
  return i < 0 ? null : { from: i, to: i + UPLOAD_PLACEHOLDER.length }
}

function settle(view: EditorView, p: Pending, insert: string) {
  pending.delete(p)
  const at = locate(view, p)
  if (!at) return false
  let { from, to } = at
  // 上传失败要删掉占位符时，把插入时补的空行一起删掉
  if (!insert) {
    const { doc } = view.state
    if (from >= 2 && doc.sliceString(from - 2, from) === '\n\n') from -= 2
    else if (to + 2 <= doc.length && doc.sliceString(to, to + 2) === '\n\n') to += 2
  }
  view.dispatch({ changes: { from, to, insert } })
  return true
}

export function imageFilesOf(data: DataTransfer | null): File[] {
  if (!data) return []
  return Array.from(data.files).filter((f) => f.type.startsWith('image/'))
}

/** 图床未配置时提示并带用户去设置；返回是否可以上传 */
export function ensureImageHost(): boolean {
  const problem = imageHostProblem(useStudio.getState().imageHost)
  if (!problem) return true
  toast(problem, 'warning')
  openImageHostSettings()
  return false
}

/**
 * 上传图片并写入编辑器：先在 at（默认当前选区）插入占位符，
 * 成功后替换为 ![](链接)，失败则删掉占位符并提示。
 */
export function uploadImagesToEditor(files: File[], view: EditorView, at?: number): boolean {
  const images = files.filter((f) => f.type.startsWith('image/'))
  if (!images.length) return false
  if (!ensureImageHost()) return true
  const cfg = useStudio.getState().imageHost

  const { doc } = view.state
  const sel = view.state.selection.main
  let from = at ?? sel.from
  let to = at ?? sel.to
  // 没有选区且插入点在一行文字中间时，改到行尾，不把标题、段落拆开
  const line = doc.lineAt(from)
  if (from === to && from > line.from && from < line.to) from = to = line.to
  const sep = '\n\n'
  // 图片单独成段：插入点前后有文字时补空行，避免粘到素材的 ::: 行或正文里
  const before = from > 0 && doc.sliceString(from - 1, from) !== '\n' ? sep : ''
  const after = to < doc.length && doc.sliceString(to, to + 1) !== '\n' ? sep : ''
  const insert = before + images.map(() => UPLOAD_PLACEHOLDER).join(sep) + after
  view.dispatch({
    changes: { from, to, insert },
    selection: { anchor: from + insert.length - after.length },
    scrollIntoView: true,
  })
  view.focus()

  let done = 0
  let failed = 0
  images.forEach((file, i) => {
    const start = from + before.length + i * (UPLOAD_PLACEHOLDER.length + sep.length)
    const p: Pending = { from: start, to: start + UPLOAD_PLACEHOLDER.length }
    pending.add(p)
    uploadImage(file, cfg)
      .then((url) => {
        settle(view, p, `![](${url})`)
        done++
      })
      .catch((e: unknown) => {
        settle(view, p, '')
        failed++
        toast(`图片上传失败：${e instanceof Error ? e.message : String(e)}`, 'error')
      })
      .finally(() => {
        if (done + failed === images.length && !failed) toast(images.length > 1 ? `${done} 张图片已上传` : '图片已上传')
      })
  })
  return true
}

/** 粘贴截图、拖入图片文件时自动上传 */
export const imageDropPaste = EditorView.domEventHandlers({
  paste(event, view) {
    const files = imageFilesOf(event.clipboardData)
    // 从 Word / Excel 复制时会同时带一张图片，有纯文本时按文本粘贴
    if (!files.length || event.clipboardData?.types.includes('text/plain')) return false
    event.preventDefault()
    return uploadImagesToEditor(files, view)
  },
  drop(event, view) {
    const files = imageFilesOf(event.dataTransfer)
    if (!files.length) return false
    event.preventDefault()
    const pos = view.posAtCoords({ x: event.clientX, y: event.clientY }) ?? undefined
    return uploadImagesToEditor(files, view, pos)
  },
})
