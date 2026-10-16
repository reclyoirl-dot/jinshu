/**
 * 素材总览页（gallery.html）：一页看完所有素材的真实渲染效果。
 * 支持参数：
 *   ?ids=a,b,c   只显示指定素材（按给定顺序）
 *   ?cat=svg     只显示某个分类
 *   ?cols=4      列数
 *   ?theme=simple&color=%2307c160  主题与主色
 *   ?bare=1      隐藏页头（用于截图）
 */
import { blocks } from './blocks'
import { renderArticle } from './core/render'
import { BLOCK_CATEGORIES } from './core/types'
import { getTheme } from './themes'

const q = new URLSearchParams(location.search)
const ids = q.get('ids')?.split(',').filter(Boolean)
const cat = q.get('cat')
const cols = Math.max(1, Math.min(8, Number(q.get('cols')) || 4))
const theme = getTheme(q.get('theme') ?? 'simple')
const primary = q.get('color') ?? theme.defaults.primary
const bare = q.has('bare')

const byId = new Map(blocks.map((b) => [b.id, b]))
const list = ids ? ids.map((id) => byId.get(id)).filter((b) => !!b) : blocks.filter((b) => !cat || b.category === cat)
const catName = new Map(BLOCK_CATEGORIES.map((c) => [c.id, c.name]))

const style = document.createElement('style')
style.textContent = `
  body { margin: 0; background: #f2f4f7; font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #0f172a; }
  header { padding: 32px 40px 8px; }
  header h1 { margin: 0 0 6px; font-size: 26px; }
  header p { margin: 0; color: #64748b; font-size: 14px; }
  .grid { display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: 18px; padding: 24px 40px 40px; align-items: start; }
  .card { background: #fff; border-radius: 14px; box-shadow: 0 1px 2px rgba(15,23,42,.06), 0 6px 20px rgba(15,23,42,.06); overflow: hidden; }
  .card .meta { display: flex; justify-content: space-between; gap: 8px; padding: 9px 14px; font-size: 12px; color: #64748b; border-bottom: 1px solid #f1f5f9; }
  .card .meta b { color: #0f172a; font-weight: 600; }
  .card .body { padding: 4px 16px 10px; }
  .card .body * { max-width: 100%; box-sizing: border-box; }
`
document.head.append(style)

const root = document.getElementById('gallery')!
if (!bare) {
  root.insertAdjacentHTML(
    'beforeend',
    `<header><h1>锦书 JinShu · 素材总览</h1><p>共 ${list.length} 个素材，点击编辑器左侧「素材」即可插入。以下均为真实渲染效果。</p></header>`,
  )
}
const grid = document.createElement('div')
grid.className = 'grid'
for (const b of list) {
  const html = renderArticle(b.example, { theme, primary, fontSize: theme.defaults.fontSize, footnoteLinks: false }).html
  grid.insertAdjacentHTML(
    'beforeend',
    `<div class="card"><div class="meta"><b>${b.name}</b><span>${catName.get(b.category) ?? ''} · ${b.id}</span></div><div class="body">${html}</div></div>`,
  )
}
root.append(grid)
