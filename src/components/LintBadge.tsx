import { CircleAlert, CircleCheck, Info, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { LintIssue, LintLevel } from '../core/lint'
import { Popover, cx } from './ui'

const LEVEL_STYLE: Record<LintLevel, { icon: typeof Info; color: string; label: string }> = {
  error: { icon: CircleAlert, color: 'text-red-500', label: '错误' },
  warning: { icon: TriangleAlert, color: 'text-amber-500', label: '警告' },
  info: { icon: Info, color: 'text-slate-400', label: '提示' },
}

/** 同一类问题（如多张本地动图）合并成一条，列出所有片段 */
function groupByMessage(issues: LintIssue[]) {
  const groups = new Map<string, { level: LintLevel; message: string; snippets: string[] }>()
  for (const { level, message, snippet } of issues) {
    const g = groups.get(message) ?? { level, message, snippets: [] }
    g.snippets.push(snippet)
    groups.set(message, g)
  }
  return Array.from(groups.values())
}

/** 预览区顶部的「兼容检测」徽标，点击展开问题列表 */
export default function LintBadge({ issues }: { issues: LintIssue[] }) {
  const errors = issues.filter((i) => i.level === 'error').length
  const warnings = issues.filter((i) => i.level === 'warning').length
  const tone = errors ? 'error' : warnings ? 'warning' : issues.length ? 'info' : 'ok'

  return (
    <Popover
      width={300}
      trigger={(open, toggle) => (
        <button
          onClick={toggle}
          title="检查粘贴到公众号后可能出现的问题"
          className={cx(
            'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-medium transition-colors',
            tone === 'ok' && 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
            tone === 'error' && 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
            tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400',
            tone === 'info' && 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
            open && 'ring-2 ring-brand/20',
          )}
        >
          {tone === 'ok' ? <ShieldCheck size={13} /> : tone === 'error' ? <CircleAlert size={13} /> : <TriangleAlert size={13} />}
          兼容检测
          {tone !== 'ok' && <span className="font-semibold">{issues.length}</span>}
        </button>
      )}
    >
      {() => (
        <div>
          <div className="border-b border-slate-100 px-3 py-2.5 dark:border-white/10">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">公众号兼容检测</div>
            <div className="mt-0.5 text-[11px] text-slate-400">
              {issues.length
                ? [errors && `${errors} 个错误`, warnings && `${warnings} 个警告`, issues.length - errors - warnings && `${issues.length - errors - warnings} 个提示`]
                    .filter(Boolean)
                    .join(' · ') + '，粘贴前建议处理'
                : '检查渐变文字背景、行高、图片地址与外链'}
            </div>
          </div>
          {issues.length ? (
            <div className="thin-scroll max-h-80 overflow-y-auto p-1.5">
              {groupByMessage(issues).map(({ level, message, snippets }) => {
                const { icon: Icon, color, label } = LEVEL_STYLE[level]
                return (
                  <div key={message} className="flex gap-2 rounded-lg px-2 py-2 hover:bg-slate-50 dark:hover:bg-white/5">
                    <Icon size={15} className={cx('mt-0.5 shrink-0', color)} aria-label={label} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                        {message}
                        {snippets.length > 1 && <span className="ml-1 text-slate-400">×{snippets.length}</span>}
                      </div>
                      {snippets.filter(Boolean).map((s, i) => (
                        <div
                          key={i}
                          className="mt-1 break-all rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] leading-relaxed text-slate-500 dark:bg-white/10 dark:text-slate-400"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-4 py-6 text-center">
              <CircleCheck size={26} className="text-emerald-500" />
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">没有发现问题</div>
              <div className="text-[11px] leading-relaxed text-slate-400">可以放心复制到公众号后台</div>
            </div>
          )}
        </div>
      )}
    </Popover>
  )
}
