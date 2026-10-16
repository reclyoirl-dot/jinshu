import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { renderArticle } from '../core/render'
import { useStudio } from '../store'
import { templates } from '../templates'
import { getTheme } from '../themes'
import { toast } from '../toast'
import { SectionTitle, Thumb } from './ui'

export default function TemplatePanel({ onApplied }: { onApplied?: () => void }) {
  const applyTemplate = useStudio((s) => s.applyTemplate)

  const previews = useMemo(
    () =>
      Object.fromEntries(
        templates.map((t) => {
          const theme = getTheme(t.theme)
          return [
            t.id,
            renderArticle(t.content, {
              theme,
              primary: t.primary ?? theme.defaults.primary,
              fontSize: theme.defaults.fontSize,
              footnoteLinks: false,
            }).html.replace(/<img /g, '<img loading="lazy" '),
          ]
        }),
      ),
    [],
  )

  return (
    <div className="p-4">
      <SectionTitle>整篇模板 · {templates.length}</SectionTitle>
      <p className="-mt-1 mb-3 text-xs text-slate-400">使用模板会新建一篇文档，不会覆盖当前内容。</p>
      <div className="space-y-4">
        {templates.map((t) => {
          const theme = getTheme(t.theme)
          const color = t.primary ?? theme.defaults.primary
          return (
            <div
              key={t.id}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-all hover:shadow-lg dark:bg-slate-800 dark:ring-white/10"
            >
              <div className="relative h-56 overflow-hidden bg-white px-4 pt-3">
                <Thumb html={previews[t.id]} zoom={0.62} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 dark:border-white/10">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.name}</span>
                    <span className="rounded-full px-1.5 py-px text-[10px] font-medium" style={{ background: `${color}1a`, color }}>
                      {theme.name}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-slate-400">{t.description}</div>
                </div>
                <button
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border-0 bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand/30 transition-transform hover:-translate-y-px"
                  onClick={() => {
                    applyTemplate(t)
                    toast(`已用「${t.name}」新建文档`)
                    onApplied?.()
                  }}
                >
                  使用 <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
