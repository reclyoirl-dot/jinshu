/** 编辑区与预览区按滚动比例同步 */
type Side = 'editor' | 'preview'

const els: Partial<Record<Side, HTMLElement>> = {}
let leader: Side | null = null
let releaseTimer: ReturnType<typeof setTimeout> | undefined

function onScroll(side: Side) {
  if (leader && leader !== side) return
  leader = side
  clearTimeout(releaseTimer)
  releaseTimer = setTimeout(() => (leader = null), 120)

  const from = els[side]
  const to = els[side === 'editor' ? 'preview' : 'editor']
  if (!from || !to) return
  const max = from.scrollHeight - from.clientHeight
  const ratio = max > 0 ? from.scrollTop / max : 0
  to.scrollTop = ratio * (to.scrollHeight - to.clientHeight)
}

const handlers: Record<Side, () => void> = {
  editor: () => onScroll('editor'),
  preview: () => onScroll('preview'),
}

export function registerScroll(side: Side, el: HTMLElement | null) {
  els[side]?.removeEventListener('scroll', handlers[side])
  if (el) {
    els[side] = el
    el.addEventListener('scroll', handlers[side], { passive: true })
  } else {
    delete els[side]
  }
}
