import { ChevronDown, RotateCcw, SlidersHorizontal, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useActiveBlock } from '../activeBlock'
import { getBlock } from '../blocks'
import { buildOpenLine, paramFields } from '../core/blockSyntax'
import { isValidHex } from '../core/color'
import type { BlockParam } from '../core/types'
import { replaceBetweenLines, replaceLines } from '../editorBridge'
import { useResolvedStyle } from '../useRendered'
import { cx, iconBtn } from './ui'

const input =
  'h-8 w-full min-w-0 rounded-md border border-slate-200 bg-white px-2 text-[13px] text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100'

/** 取色器只接受 #rrggbb */
function toPickerHex(value: string | undefined, fallback: string): string {
  if (!value || !isValidHex(value)) return fallback
  const hex = value.replace(/^#/, '')
  return `#${hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex}`.toLowerCase()
}

function Field({
  field,
  value,
  primary,
  onChange,
}: {
  field: BlockParam
  value: string | undefined
  primary: string
  onChange: (v: string) => void
}) {
  if (field.type === 'color') {
    return (
      <div className="flex items-center gap-1.5">
        <label
          className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-md ring-1 ring-slate-200 dark:ring-white/10"
          style={{ background: toPickerHex(value, primary) }}
          title="选择颜色"
        >
          <input
            type="color"
            value={toPickerHex(value, primary)}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input className={input} value={value ?? ''} placeholder={`跟随主色 ${primary}`} onChange={(e) => onChange(e.target.value.trim())} />
        {value && (
          <button className={cx(iconBtn, 'h-8 w-8')} title="恢复跟随主色" onClick={() => onChange('')}>
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    )
  }
  if (field.type === 'select') {
    return (
      <select className={input} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">默认</option>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {value && !field.options?.some((o) => o.value === value) && <option value={value}>{value}</option>}
      </select>
    )
  }
  return (
    <input
      className={input}
      type={field.type === 'number' ? 'number' : 'text'}
      step="any"
      value={value ?? ''}
      placeholder={field.placeholder ?? '留空使用默认'}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

/** 光标位于 :::素材 块内时显示：可视化修改参数与正文，实时写回 Markdown */
export default function BlockParamsPanel() {
  const block = useActiveBlock((s) => s.block)
  const { primary } = useResolvedStyle()
  const [collapsed, setCollapsed] = useState(false)
  if (!block) return null

  const def = getBlock(block.id)
  const fields = paramFields(def, block.params)

  const setParam = (key: string, value: string) => {
    const entries = Object.entries(block.params)
    const i = entries.findIndex(([k]) => k === key)
    // 清空即删除参数，素材回到默认值
    if (!value) {
      if (i >= 0) entries.splice(i, 1)
    } else if (i >= 0) entries[i] = [key, value]
    else entries.push([key, value])
    replaceLines(block.openLine, block.openLine, buildOpenLine(block.id, entries))
  }

  if (collapsed) {
    return (
      <button
        className="pop-in absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-lg shadow-slate-900/10 hover:text-brand dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
        onClick={() => setCollapsed(false)}
      >
        <SlidersHorizontal size={13} /> 编辑素材参数
      </button>
    )
  }

  return (
    <div
      className="pop-in absolute bottom-3 right-3 z-20 flex max-h-[calc(100%-24px)] w-[300px] max-w-[calc(100%-24px)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-slate-800/95"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-100 px-3 py-2 dark:border-white/10">
        <SlidersHorizontal size={14} className="shrink-0 text-brand" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">{def?.name ?? '未知素材'}</div>
          <div className="truncate font-mono text-[10px] text-slate-400">
            :::{block.id} · 第 {block.openLine} 行
          </div>
        </div>
        <button className={cx(iconBtn, 'h-7 w-7')} title="收起" onClick={() => setCollapsed(true)}>
          <ChevronDown size={15} />
        </button>
      </div>
      <div className="thin-scroll min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-2.5">
        {!def && (
          <p className="m-0 flex items-start gap-1.5 text-[11px] leading-relaxed text-amber-600">
            <TriangleAlert size={13} className="mt-px shrink-0" /> 没有名为 {block.id} 的素材，请检查拼写
          </p>
        )}
        {fields.map((f) => (
          <div key={f.key}>
            <span className="mb-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              {f.label}
              <code className="text-[10px] text-slate-300 dark:text-slate-500">{f.key}</code>
            </span>
            <Field field={f} value={block.params[f.key]} primary={primary} onChange={(v) => setParam(f.key, v)} />
          </div>
        ))}
        <label className="block">
          <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">正文内容（支持 Markdown）</span>
          {block.closeLine ? (
            <textarea
              className={cx(input, 'h-auto min-h-[84px] resize-y py-1.5 leading-relaxed')}
              rows={Math.min(10, Math.max(3, block.content.split('\n').length))}
              value={block.content}
              placeholder="这个素材不需要正文时可以留空"
              onChange={(e) => replaceBetweenLines(block.openLine, block.closeLine!, e.target.value)}
            />
          ) : (
            <p className="m-0 flex items-start gap-1.5 text-[11px] leading-relaxed text-amber-600">
              <TriangleAlert size={13} className="mt-px shrink-0" />
              素材缺少结尾的 <code>:::</code>，请先在编辑器里补上再修改正文
            </p>
          )}
        </label>
      </div>
    </div>
  )
}
