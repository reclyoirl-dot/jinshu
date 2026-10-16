import { ChevronLeft, Monitor, MoreHorizontal, Smartphone } from 'lucide-react'
import { useCallback } from 'react'
import type { LintIssue } from '../core/lint'
import { registerScroll } from '../scrollSync'
import { useCurrentDoc, useStudio } from '../store'
import LintBadge from './LintBadge'
import { Segmented, cx } from './ui'

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function StatusBar() {
  return (
    <div className="flex h-11 items-center justify-between px-7 pt-1 text-[13px] font-semibold text-slate-900">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="#111">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="#111" opacity=".4" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="#111" />
          <rect x="22.5" y="4" width="1.8" height="4" rx="1" fill="#111" opacity=".4" />
        </svg>
      </span>
    </div>
  )
}

export default function PreviewPane({ html, issues }: { html: string; issues: LintIssue[] }) {
  const doc = useCurrentDoc()
  const accountName = useStudio((s) => s.accountName)
  const mode = useStudio((s) => s.previewMode)
  const setPreviewMode = useStudio((s) => s.setPreviewMode)
  const scrollRef = useCallback((el: HTMLDivElement | null) => registerScroll('preview', el), [])

  const article = (
    <div className="bg-white px-4 pb-12 pt-5">
      <h1 className="m-0 mb-3 text-[22px] font-semibold leading-snug text-[#1a1a1a]">{doc.title}</h1>
      <div className="mb-6 flex items-center gap-2.5 text-[14px] text-[#999]">
        <span className="text-[#576b95]">{accountName || '我的公众号'}</span>
        <span>{today()}</span>
      </div>
      <div className="wx-preview" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-4 text-[13px] text-[#999]">
        <span>阅读 10万+</span>
        <span className="flex gap-5">
          <span>分享</span>
          <span>赞</span>
          <span>在看</span>
        </span>
      </div>
    </div>
  )

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#eef0f3] dark:bg-slate-950">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white px-3 dark:border-white/10 dark:bg-slate-900">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">实时预览</span>
        <LintBadge issues={issues} />
        <div className="ml-auto w-44">
          <Segmented
            size="sm"
            value={mode}
            onChange={setPreviewMode}
            options={[
              { value: 'phone', label: <><Smartphone size={13} /> 手机</> },
              { value: 'wide', label: <><Monitor size={13} /> 宽屏</> },
            ]}
          />
        </div>
      </div>
      <div ref={scrollRef} className="preview-bg thin-scroll min-h-0 flex-1 overflow-y-auto">
        {mode === 'phone' ? (
          <div className="mx-auto my-6 w-[390px] max-w-[calc(100%-24px)] rounded-[46px] bg-[#1c1c1e] p-[10px] shadow-2xl shadow-slate-900/25 ring-1 ring-black/5">
            <div className="overflow-hidden rounded-[36px] bg-white">
              <div className="sticky top-0 z-10 bg-[#f7f7f7]/95 backdrop-blur">
                <div className="relative">
                  <StatusBar />
                  <div className="absolute left-1/2 top-2.5 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
                </div>
                <div className="flex h-10 items-center justify-between px-3 text-slate-800">
                  <ChevronLeft size={22} />
                  <span className="max-w-[60%] truncate text-[15px] font-medium">{accountName || '我的公众号'}</span>
                  <MoreHorizontal size={22} />
                </div>
              </div>
              {article}
              <div className="flex justify-center bg-white pb-2">
                <div className="h-[5px] w-32 rounded-full bg-black/80" />
              </div>
            </div>
          </div>
        ) : (
          <div className={cx('mx-auto my-6 w-[677px] max-w-[calc(100%-32px)] overflow-hidden rounded-xl shadow-xl shadow-slate-900/10 ring-1 ring-black/5')}>
            {article}
          </div>
        )}
      </div>
    </div>
  )
}
