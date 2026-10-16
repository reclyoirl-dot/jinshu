import { CircleAlert, CircleCheck, Eye, Palette, PenLine, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EditorPane from './components/EditorPane'
import Header from './components/Header'
import PreviewPane from './components/PreviewPane'
import StyleCenter from './components/StyleCenter'
import { cx } from './components/ui'
import { lintHtml } from './core/lint'
import { useStudio } from './store'
import { useToast } from './toast'
import { useRendered } from './useRendered'

type MobileTab = 'style' | 'edit' | 'preview'

const MOBILE_TABS: { id: MobileTab; name: string; icon: typeof Eye }[] = [
  { id: 'style', name: '样式', icon: Palette },
  { id: 'edit', name: '编辑', icon: PenLine },
  { id: 'preview', name: '预览', icon: Eye },
]

function Toast() {
  const { message, kind } = useToast()
  if (!message) return null
  return (
    <div
      key={message}
      className={cx(
        'toast-in pointer-events-none fixed left-1/2 top-[72px] z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-xl',
        kind === 'success' && 'bg-slate-900 text-white shadow-slate-900/20',
        kind === 'warning' && 'bg-amber-500 text-white shadow-amber-500/30',
        kind === 'error' && 'bg-red-500 text-white shadow-red-500/30',
      )}
    >
      {kind === 'success' ? (
        <CircleCheck size={16} className="text-emerald-400" />
      ) : kind === 'warning' ? (
        <TriangleAlert size={16} />
      ) : (
        <CircleAlert size={16} />
      )}
      {message}
    </div>
  )
}

export default function App() {
  const dark = useStudio((s) => s.dark)
  const rendered = useRendered()
  const issues = useMemo(() => lintHtml(rendered.html), [rendered.html])
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const panel = (id: MobileTab) => cx(mobileTab === id ? 'flex' : 'hidden', 'h-full min-h-0 min-w-0 lg:flex')

  return (
    <div className="app-shell flex h-full flex-col">
      <Header rendered={rendered} issues={issues} />
      <main className="min-h-0 flex-1 lg:grid lg:grid-cols-[330px_minmax(0,1fr)_400px] xl:grid-cols-[380px_minmax(0,1fr)_450px] 2xl:grid-cols-[420px_minmax(0,1fr)_520px]">
        <aside className={cx(panel('style'), 'border-r border-slate-200/80 dark:border-white/10')}>
          <StyleCenter onInserted={() => setMobileTab('edit')} />
        </aside>
        <section className={cx(panel('edit'), 'flex-col')}>
          <div className="h-full w-full">
            <EditorPane />
          </div>
        </section>
        <section className={cx(panel('preview'), 'border-l border-slate-200/80 dark:border-white/10')}>
          <div className="h-full w-full">
            <PreviewPane html={rendered.html} issues={issues} />
          </div>
        </section>
      </main>
      <nav className="flex shrink-0 border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-white/10 dark:bg-slate-900/95 lg:hidden">
        {MOBILE_TABS.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMobileTab(id)}
            className={cx(
              'flex flex-1 flex-col items-center gap-0.5 border-0 bg-transparent py-1.5 text-xs',
              mobileTab === id ? 'font-semibold text-brand' : 'text-slate-500',
            )}
          >
            <Icon size={18} />
            {name}
          </button>
        ))}
      </nav>
      <Toast />
    </div>
  )
}
