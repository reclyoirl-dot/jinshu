export { escapeHtml as esc } from '../core/render/attrs'

/**
 * 组件 HTML 模板标签：去掉模板里静态部分的换行和缩进，插值原样保留
 * （插值可能是代码块等对空白敏感的内容）。
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let out = ''
  strings.forEach((s, i) => {
    out += s.replace(/\n\s*/g, '')
    if (i < values.length) {
      const v = values[i]
      out += v == null || v === false ? '' : Array.isArray(v) ? v.join('') : String(v)
    }
  })
  return out.trim()
}

/** 组件内正文段落间距更紧凑：给渲染出的 <p> 加内联样式（内联优先级高于主题） */
export function compact(rendered: string, style = 'margin: 0.4em 0;'): string {
  return rendered.replace(/<p class="wx-p">/g, `<p class="wx-p" style="${style}">`)
}

export function lines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
}

/** 第一行作为标题，其余作为正文 */
export function splitFirst(raw: string): { first: string; rest: string } {
  const all = raw.replace(/^\s*\n/, '').split(/\r?\n/)
  const idx = all.findIndex((l) => l.trim())
  if (idx < 0) return { first: '', rest: '' }
  return { first: all[idx].trim(), rest: all.slice(idx + 1).join('\n').trim() }
}

/** 问答：第一行是问题，其余是回答；自动去掉 Q:/问：/A:/答： 前缀 */
export function splitQA(raw: string): { q: string; a: string } {
  const { first, rest } = splitFirst(raw)
  return {
    q: first.replace(/^(Q|问)\s*[:：]\s*/i, ''),
    a: rest.replace(/^(A|答)\s*[:：]\s*/i, ''),
  }
}

const IMG_RE = /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g

/** 取出原文中的图片，返回图片列表和去掉图片后的文字 */
export function extractImages(raw: string): { images: { alt: string; src: string }[]; text: string } {
  const images: { alt: string; src: string }[] = []
  const text = raw
    .replace(IMG_RE, (_, alt: string, src: string) => {
      images.push({ alt, src })
      return ''
    })
    .trim()
  return { images, text }
}

export const SAMPLE_IMG = (seed: string) => `https://picsum.photos/seed/${seed}/800/500`
