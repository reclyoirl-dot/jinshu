import {
  AlignLeft,
  Film,
  Flag,
  Heading,
  History,
  Image as ImageIcon,
  LayoutGrid,
  MessageCircleQuestion,
  MousePointerClick,
  PartyPopper,
  Plus,
  Search,
  SeparatorHorizontal,
  Sparkles,
  Star,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { blocks } from '../blocks'
import { isLocalAsset } from '../core/assets'
import { renderArticle } from '../core/render'
import type { BlockDef } from '../core/types'
import { insertBlock } from '../editorBridge'
import { useStudio } from '../store'
import { toast } from '../toast'
import { useResolvedStyle, type ResolvedStyle } from '../useRendered'
import { Thumb, chip, cx } from './ui'

type RailId = 'all' | 'fav' | 'recent' | 'festival' | BlockDef['category']

const RAIL: { id: RailId; name: string; icon: LucideIcon }[] = [
  { id: 'all', name: '全部', icon: LayoutGrid },
  { id: 'fav', name: '收藏', icon: Star },
  { id: 'recent', name: '最近', icon: History },
  { id: 'title', name: '标题', icon: Heading },
  { id: 'body', name: '正文', icon: AlignLeft },
  { id: 'qa', name: '问答', icon: MessageCircleQuestion },
  { id: 'imagetext', name: '图文', icon: ImageIcon },
  { id: 'divider', name: '分割', icon: SeparatorHorizontal },
  { id: 'guide', name: '引导', icon: MousePointerClick },
  { id: 'ending', name: '结尾', icon: Flag },
  { id: 'gif', name: '动图', icon: Film },
  { id: 'svg', name: 'SVG', icon: Sparkles },
  { id: 'festival', name: '节日', icon: PartyPopper },
]

/** 不适合作为筛选标签的词 */
const HIDDEN_TAGS = new Set(['动图', '动态', '通用'])

/* ---------- 缩略图缓存：同一样式下每个组件只渲染一次 ---------- */
const thumbCache = new Map<string, string>()
function thumbHtml(block: BlockDef, style: ResolvedStyle, example = block.example) {
  const key = `${style.theme.id}|${style.primary}|${style.fontSize}|${style.assetBase}|${example}`
  let html = thumbCache.get(key)
  if (!html) {
    html = renderArticle(example, { ...style, footnoteLinks: false }).html.replace(/<img /g, '<img loading="lazy" ')
    if (thumbCache.size > 1500) thumbCache.clear()
    thumbCache.set(key, html)
  }
  return html
}

/** 把示例中的某个参数替换成指定值（用于颜色变体） */
export function withParam(example: string, param: string, value: string) {
  return example.replace(/^(:::[\w-]+)(\{[^}]*\})?/, (_, head: string, attrs?: string) => {
    const body = (attrs ?? '{}').slice(1, -1)
    const re = new RegExp(`(^|\\s)${param}=("[^"]*"|'[^']*'|[^\\s}]+)`)
    const next = re.test(body) ? body.replace(re, `$1${param}=${value}`) : `${body} ${param}=${value}`.trim()
    return `${head}{${next}}`
  })
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen] as const
}

function MaterialCard({ block, style, onInsert }: { block: BlockDef; style: ResolvedStyle; onInsert: (b: BlockDef, example?: string) => void }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const fav = useStudio((s) => s.favorites.includes(block.id))
  const toggleFavorite = useStudio((s) => s.toggleFavorite)
  const html = useMemo(() => (seen ? thumbHtml(block, style) : ''), [seen, block, style])

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lg hover:shadow-slate-900/[0.06] dark:border-white/10 dark:bg-slate-800"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 160px' }}
    >
      <button
        onClick={() => onInsert(block)}
        title="点击插入到光标处"
        className="block w-full cursor-pointer border-0 bg-white px-3 pb-1 pt-2 text-left"
      >
        {seen ? <Thumb html={html} zoom={0.78} maxHeight={260} /> : <div className="h-24 animate-pulse rounded-lg bg-slate-100" />}
      </button>
      <div className="flex items-center gap-2 border-t border-slate-100 px-3 py-1.5 dark:border-white/10">
        <span className="min-w-0 truncate text-xs font-medium text-slate-600 dark:text-slate-300">{block.name}</span>
        {block.variants && (
          <span className="flex shrink-0 items-center gap-1">
            {block.variants.options.map((o) => (
              <button
                key={o.value}
                title={`插入${o.label}色`}
                onClick={() => onInsert(block, withParam(block.example, block.variants!.param, o.value))}
                className="h-3.5 w-3.5 rounded-full border-2 border-white p-0 shadow ring-1 ring-slate-200 transition-transform hover:scale-125 dark:border-slate-800 dark:ring-white/10"
                style={{ background: o.swatch }}
              />
            ))}
          </span>
        )}
        <button
          onClick={() => toggleFavorite(block.id)}
          title={fav ? '取消收藏' : '收藏'}
          className={cx(
            'ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-0 bg-transparent transition-colors',
            fav ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400 dark:text-slate-500',
          )}
        >
          <Star size={14} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white opacity-0 shadow-md shadow-brand/30 transition-opacity group-hover:opacity-100">
        <Plus size={12} /> 插入
      </span>
    </div>
  )
}

export default function MaterialPanel({ onInserted }: { onInserted?: () => void }) {
  const style = useResolvedStyle()
  const favorites = useStudio((s) => s.favorites)
  const recent = useStudio((s) => s.recent)
  const markUsed = useStudio((s) => s.markUsed)
  const [rail, setRail] = useState<RailId>('all')
  const [tag, setTag] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const byId = useMemo(() => new Map(blocks.map((b) => [b.id, b])), [])

  const base = useMemo(() => {
    if (rail === 'all') return blocks
    if (rail === 'fav') return favorites.map((id) => byId.get(id)).filter(Boolean) as BlockDef[]
    if (rail === 'recent') return recent.map((id) => byId.get(id)).filter(Boolean) as BlockDef[]
    if (rail === 'festival') return blocks.filter((b) => b.tags.includes('节日'))
    return blocks.filter((b) => b.category === rail)
  }, [rail, favorites, recent, byId])

  const tags = useMemo(() => {
    const count = new Map<string, number>()
    for (const b of base) for (const t of b.tags) if (!HIDDEN_TAGS.has(t)) count.set(t, (count.get(t) ?? 0) + 1)
    return [...count].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 16).map(([t]) => t)
  }, [base])

  const q = query.trim().toLowerCase()
  const list = base.filter(
    (b) =>
      (!tag || b.tags.includes(tag)) &&
      (!q || b.name.toLowerCase().includes(q) || b.id.includes(q) || b.tags.some((t) => t.includes(q))),
  )

  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const b of blocks) m.set(b.category, (m.get(b.category) ?? 0) + 1)
    m.set('all', blocks.length)
    m.set('fav', favorites.length)
    m.set('festival', blocks.filter((b) => b.tags.includes('节日')).length)
    return m
  }, [favorites.length])

  const selectRail = (id: RailId) => {
    setRail(id)
    setTag(null)
    listRef.current?.scrollTo({ top: 0 })
  }

  const insert = (block: BlockDef, example = block.example) => {
    if (insertBlock(example)) {
      markUsed(block.id)
      toast(`已插入「${block.name}」`)
      onInserted?.()
    }
  }

  const showAssetWarning = rail === 'gif' && isLocalAsset(style.assetBase)

  return (
    <div className="flex h-full min-h-0">
      <nav className="no-scrollbar flex w-[64px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-slate-200/80 bg-white py-2 dark:border-white/10 dark:bg-slate-900">
        {RAIL.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => selectRail(id)}
            className={cx(
              'relative mx-1.5 flex flex-col items-center gap-1 whitespace-nowrap rounded-lg border-0 px-0 py-2 text-[11px] leading-none transition-colors',
              rail === id
                ? 'bg-brand/10 font-semibold text-brand'
                : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white',
            )}
          >
            {rail === id && <span className="absolute -left-1.5 top-2 h-[calc(100%-16px)] w-[3px] rounded-r bg-brand" />}
            <Icon size={18} strokeWidth={rail === id ? 2.4 : 2} />
            {name}
          </button>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="space-y-2.5 border-b border-slate-200/80 px-3 pb-2.5 pt-3 dark:border-white/10">
          <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 dark:border-white/10 dark:bg-white/5">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`搜索 ${blocks.length} 个素材，如 标题、春节、卡片`}
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            {query && (
              <button className="inline-flex border-0 bg-transparent p-0 text-slate-400 hover:text-slate-600" onClick={() => setQuery('')}>
                <X size={15} />
              </button>
            )}
          </div>
          {tags.length > 0 && (
            <div className="thin-scroll -mx-3 flex gap-1.5 overflow-x-auto px-3 pb-0.5">
              <button className={chip(tag === null)} onClick={() => setTag(null)}>
                全部 {counts.get(rail) ?? base.length}
              </button>
              {tags.map((t) => (
                <button key={t} className={chip(tag === t)} onClick={() => setTag(tag === t ? null : t)}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={listRef} className="thin-scroll min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/80 p-3 dark:bg-slate-950/40">
          {showAssetWarning && (
            <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" />
              <span>
                当前素材地址是本地地址，公众号无法抓取动图。发布前请部署站点，或在「主题 → 素材地址」里填入公网地址（如 jsDelivr）。
              </span>
            </div>
          )}
          {list.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-slate-400">
              {rail === 'fav' ? <Star size={28} /> : rail === 'recent' ? <History size={28} /> : <Search size={28} />}
              {rail === 'fav' ? '还没有收藏，点击素材右下角的 ☆ 收藏' : rail === 'recent' ? '插入过的素材会出现在这里' : '没有找到匹配的素材'}
            </div>
          )}
          {list.map((b) => (
            <MaterialCard key={b.id} block={b} style={style} onInsert={insert} />
          ))}
        </div>
      </div>
    </div>
  )
}
