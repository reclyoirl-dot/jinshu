/** 以富文本形式写入剪贴板，粘贴到公众号后台即可保留样式 */
export async function copyRichText(html: string, text: string): Promise<void> {
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        }),
      ])
      return
    } catch {
      // 回退到 execCommand
    }
  }
  const box = document.createElement('div')
  box.contentEditable = 'true'
  box.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;'
  box.innerHTML = html
  document.body.append(box)
  const range = document.createRange()
  range.selectNodeContents(box)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
  const ok = document.execCommand('copy')
  sel?.removeAllRanges()
  box.remove()
  if (!ok) throw new Error('复制失败，请检查浏览器剪贴板权限')
}

export function downloadFile(filename: string, content: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
