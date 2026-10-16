import { LayoutTemplate, Palette, Shapes } from 'lucide-react'
import MaterialPanel from './MaterialPanel'
import TemplatePanel from './TemplatePanel'
import { useUi } from '../store/ui'
import ThemePanel from './ThemePanel'
import { Segmented } from './ui'

export default function StyleCenter({ onInserted }: { onInserted?: () => void }) {
  const tab = useUi((s) => s.styleTab)
  const setTab = useUi((s) => s.setStyleTab)
  return (
    <div className="flex h-full w-full min-w-0 flex-col bg-slate-50 dark:bg-slate-950">
      <div className="shrink-0 border-b border-slate-200/80 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-900">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'materials', label: <><Shapes size={15} /> 素材</> },
            { value: 'themes', label: <><Palette size={15} /> 主题</> },
            { value: 'templates', label: <><LayoutTemplate size={15} /> 模板</> },
          ]}
        />
      </div>
      <div className="min-h-0 flex-1">
        {tab === 'materials' && <MaterialPanel onInserted={onInserted} />}
        {tab === 'themes' && (
          <div className="thin-scroll h-full overflow-y-auto">
            <ThemePanel />
          </div>
        )}
        {tab === 'templates' && (
          <div className="thin-scroll h-full overflow-y-auto">
            <TemplatePanel onApplied={onInserted} />
          </div>
        )}
      </div>
    </div>
  )
}
