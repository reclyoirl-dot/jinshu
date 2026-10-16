import type { BlockDef } from '../core/types'
import manifest from '../materials/gifs.json'
import { esc, html } from './_utils'

/**
 * 动图素材：由 scripts/gifs 生成到 public/materials/gif/，清单在 src/materials/gifs.json。
 * 新增动图请看 docs/CONTRIBUTING.md「新增动图」。
 */
interface GifMeta {
  id: string
  name: string
  category: string
  tags: string[]
  display: string
  variants: string[] | null
  defaultColor: string | null
}

const COLOR_INFO: Record<string, { label: string; swatch: string }> = {
  blue: { label: '蓝', swatch: '#1e80ff' },
  green: { label: '绿', swatch: '#07c160' },
  red: { label: '红', swatch: '#f5455c' },
  orange: { label: '橙', swatch: '#ff8a00' },
  purple: { label: '紫', swatch: '#7c5cff' },
}

const KIND: Record<string, string> = {
  title: '标题',
  guide: '引导',
  divider: '分割',
  ending: '结尾',
  imagetext: '贴纸',
  body: '正文',
}

const blocks: BlockDef[] = (manifest as GifMeta[]).map((g) => {
  const id = `gif-${g.id}`
  return {
    id,
    name: g.name,
    category: 'gif',
    tags: ['动图', KIND[g.category] ?? '其他', ...g.tags],
    example: g.variants ? `:::${id}{color=${g.defaultColor}}\n:::` : `:::${id}\n:::`,
    variants: g.variants
      ? {
          param: 'color',
          options: g.variants.map((v) => ({ value: v, label: COLOR_INFO[v]?.label ?? v, swatch: COLOR_INFO[v]?.swatch ?? '#999' })),
        }
      : undefined,
    render: ({ params, ctx }) => {
      const key = g.variants && params.color && g.variants.includes(params.color) ? params.color : g.defaultColor
      const file = key && key !== g.defaultColor ? `${g.id}-${key}.gif` : `${g.id}.gif`
      const width = params.width && /^\d+(\.\d+)?(%|px)$/.test(params.width) ? params.width : g.display
      return html`
        <section style="margin: 1em 0; text-align: center; line-height: 0;">
          <img src="${esc(ctx.asset(`materials/gif/${file}`))}" alt="${esc(g.name)}"
            style="display: inline-block; width: ${width}; max-width: 100%; height: auto; margin: 0; border-radius: 0;">
        </section>`
    },
  }
})

export default blocks
