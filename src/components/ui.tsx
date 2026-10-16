import { useEffect, useRef, useState, type ReactNode } from 'react'

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export const iconBtn =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent text-slate-500 transition-colors hover:bg-slate-900/[0.06] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'

export const chip = (active: boolean) =>
  cx(
    'shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-all',
    active
      ? 'border-transparent bg-brand text-white shadow-sm shadow-brand/30'
      : 'border-slate-200 bg-white text-slate-600 hover:border-brand/50 hover:text-brand dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
  )

/** 分段选择器 */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
}: {
  value: T
  options: { value: T; label: ReactNode }[]
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}) {
  return (
    <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 dark:bg-white/5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg border-0 font-medium transition-all',
            size === 'sm' ? 'py-1 text-xs' : 'py-1.5 text-sm',
            value === o.value
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'bg-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-5 w-9 shrink-0 rounded-full border-0 p-0 transition-colors',
        checked ? 'bg-brand' : 'bg-slate-300 dark:bg-slate-600',
      )}
    >
      <span
        className={cx(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
          checked ? 'left-[18px]' : 'left-0.5',
        )}
      />
    </button>
  )
}

/** 点击外部关闭的弹出层 */
export function Popover({
  trigger,
  children,
  align = 'left',
  width = 280,
}: {
  trigger: (open: boolean, toggle: () => void) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  width?: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return (
    <div ref={ref} className="relative">
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <div
          className={cx(
            'pop-in absolute top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-800',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          style={{ width }}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function SectionTitle({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{children}</span>
      {extra}
    </div>
  )
}

/** 缩小显示的实时渲染缩略图 */
export function Thumb({ html, zoom = 0.8, maxHeight }: { html: string; zoom?: number; maxHeight?: number }) {
  return (
    <div className="pointer-events-none overflow-hidden" style={{ maxHeight }}>
      <div className="wx-preview" style={{ zoom }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
