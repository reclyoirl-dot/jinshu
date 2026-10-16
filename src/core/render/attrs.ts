/** 解析 {no="01" sub='副标题' color=#ff6600 flag} 形式的组件参数 */
export function parseAttrs(src: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!src) return out
  const body = src.trim().replace(/^\{/, '').replace(/\}$/, '')
  const re = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+)))?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(body))) {
    out[m[1]] = m[2] ?? m[3] ?? m[4] ?? 'true'
  }
  return out
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
