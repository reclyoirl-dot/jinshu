import { parseFrontmatter } from '../core/render'
import type { TemplateDef } from '../core/types'

/**
 * 整篇模板：本目录下的 .md 文件，frontmatter 声明名称、主题和主色。
 *   ---
 *   name: 科技文章
 *   description: 一句话介绍
 *   theme: tech-blue
 *   primary: '#2563eb'   # 可选
 *   order: 1             # 可选，排序
 *   ---
 */
const files = import.meta.glob<string>('./*.md', { query: '?raw', import: 'default', eager: true })

export const templates: TemplateDef[] = Object.entries(files)
  .map(([path, src]) => {
    const { data, body } = parseFrontmatter(src)
    const id = path.replace(/^\.\//, '').replace(/\.md$/, '')
    return {
      template: {
        id,
        name: data.name ?? id,
        description: data.description ?? '',
        theme: data.theme ?? 'simple',
        primary: data.primary || undefined,
        content: body.trim() + '\n',
      },
      order: Number(data.order ?? 999),
    }
  })
  .sort((a, b) => a.order - b.order)
  .map((x) => x.template)
