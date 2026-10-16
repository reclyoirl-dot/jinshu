import {
  Check,
  ChevronDown,
  Copy,
  Download,
  FileCode2,
  FileText,
  FileUp,
  Github,
  LayoutGrid,
  Moon,
  Plus,
  Sun,
  Trash2,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { APP_NAME, APP_NAME_EN, APP_SLOGAN, REPO_URL } from '../config'
import { copyRichText, downloadFile } from '../core/clipboard'
import type { LintIssue } from '../core/lint'
import type { RenderResult } from '../core/render'
import { escapeHtml } from '../core/render/attrs'
import { useCurrentDoc, useStudio } from '../store'
import { toast } from '../toast'
import { Popover, cx, iconBtn } from './ui'

const safeName = (s: string) => s.replace(/[\\/:*?"<>|]/g, '_').slice(0, 40) || 'article'

function timeAgo(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m} 分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} 小时前`
  return new Date(ts).toLocaleDateString('zh-CN')
}

function DocMenu() {
  const docs = useStudio((s) => s.docs)
  const currentId = useStudio((s) => s.currentId)
  const { selectDoc, newDoc, deleteDoc } = useStudio.getState()
  const doc = useCurrentDoc()

  return (
    <Popover
      width={320}
      trigger={(open, toggle) => (
        <button
          onClick={toggle}
          className={cx(
            'flex h-9 max-w-[13rem] items-center gap-2 rounded-lg border px-3 text-sm transition-colors sm:max-w-[20rem]',
            open
              ? 'border-brand/40 bg-brand/5'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/5',
          )}
        >
          <FileText size={15} className="shrink-0 text-brand" />
          <span className="truncate font-medium text-slate-700 dark:text-slate-200">{doc.title}</span>
          <ChevronDown size={14} className={cx('shrink-0 text-slate-400 transition-transform', open && 'rotate-180')} />
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 dark:border-white/10">
            <span className="text-xs font-semibold text-slate-400">我的文档 · {docs.length}</span>
            <button
              className="inline-flex items-center gap-1 rounded-md border-0 bg-brand/10 px-2 py-1 text-xs font-medium text-brand hover:bg-brand/20"
              onClick={() => {
                newDoc()
                close()
              }}
            >
              <Plus size={13} /> 新建
            </button>
          </div>
          <div className="thin-scroll max-h-80 overflow-y-auto p-1.5">
            {docs.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  selectDoc(d.id)
                  close()
                }}
                className={cx(
                  'group flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2',
                  d.id === currentId ? 'bg-brand/10' : 'hover:bg-slate-50 dark:hover:bg-white/5',
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className={cx('truncate text-sm', d.id === currentId ? 'font-medium text-brand' : 'text-slate-700 dark:text-slate-200')}>
                    {d.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {timeAgo(d.updatedAt)} · {d.content.length} 字符
                  </div>
                </div>
                {d.id === currentId && <Check size={15} className="text-brand" />}
                <button
                  title="删除"
                  className="hidden h-7 w-7 items-center justify-center rounded-md border-0 bg-transparent text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:inline-flex"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`确定删除「${d.title}」吗？此操作无法撤销。`)) deleteDoc(d.id)
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Popover>
  )
}

export default function Header({ rendered, issues }: { rendered: RenderResult; issues: LintIssue[] }) {
  const dark = useStudio((s) => s.dark)
  const { setDark, newDoc } = useStudio.getState()
  const doc = useCurrentDoc()
  const fileRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await copyRichText(rendered.html, rendered.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
      // 有错误级问题时照常复制，但提醒用户去看兼容检测
      const errors = issues.filter((i) => i.level === 'error').length
      if (errors) toast(`已复制，但有 ${errors} 个问题会导致公众号显示异常，详见预览区「兼容检测」`, 'warning')
      else toast('已复制！去公众号后台编辑器 Ctrl+V 粘贴吧')
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), 'error')
    }
  }

  const importFile = async (file: File | undefined) => {
    if (!file) return
    newDoc(await file.text())
    toast(`已导入 ${file.name}`)
  }

  const exportHtml = () => {
    const page = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(doc.title)}</title></head><body style="margin:0;background:#fff;"><div style="max-width:677px;margin:0 auto;padding:20px 16px;">${rendered.html}</div></body></html>`
    downloadFile(`${safeName(doc.title)}.html`, page, 'text/html')
  }

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/90 px-3 backdrop-blur dark:border-white/10 dark:bg-slate-900/90 sm:px-4">
      <a href="./" className="flex shrink-0 items-center gap-2.5 pr-1 no-underline">
        <img src="./favicon.svg" alt="" className="h-8 w-8 rounded-[10px] shadow-md shadow-brand/30" />
        <span className="hidden flex-col leading-tight lg:flex">
          <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            {APP_NAME} <span className="text-xs font-semibold text-brand">{APP_NAME_EN}</span>
          </span>
          <span className="text-[10px] text-slate-400">{APP_SLOGAN}</span>
        </span>
      </a>

      <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-white/10 sm:block" />
      <DocMenu />

      <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
        <button className={cx(iconBtn, 'hidden md:inline-flex')} onClick={() => fileRef.current?.click()} title="导入 Markdown 文件">
          <FileUp size={18} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown"
          hidden
          onChange={(e) => {
            importFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
        <Popover
          align="right"
          width={220}
          trigger={(_, toggle) => (
            <button className={cx(iconBtn, 'hidden md:inline-flex')} onClick={toggle} title="导出">
              <Download size={18} />
            </button>
          )}
        >
          {(close) => (
            <div className="p-1.5">
              {[
                {
                  icon: FileText,
                  label: '导出 Markdown',
                  hint: '.md 源文件',
                  run: () => downloadFile(`${safeName(doc.title)}.md`, doc.content, 'text/markdown'),
                },
                { icon: FileCode2, label: '导出 HTML', hint: '内联样式网页', run: exportHtml },
              ].map(({ icon: Icon, label, hint, run }) => (
                <button
                  key={label}
                  onClick={() => {
                    run()
                    close()
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <Icon size={17} className="text-slate-500" />
                  <span>
                    <span className="block text-sm text-slate-700 dark:text-slate-200">{label}</span>
                    <span className="block text-[11px] text-slate-400">{hint}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </Popover>
        <button className={iconBtn} onClick={() => setDark(!dark)} title={dark ? '浅色界面' : '深色界面'}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a className={cx(iconBtn, 'hidden sm:inline-flex')} href="./gallery.html" target="_blank" rel="noreferrer" title="素材总览">
          <LayoutGrid size={18} />
        </a>
        <a className={cx(iconBtn, 'hidden sm:inline-flex')} href={REPO_URL} target="_blank" rel="noreferrer" title="GitHub">
          <Github size={18} />
        </a>
        <button
          onClick={copy}
          className={cx(
            'ml-1.5 inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-0 px-3.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-px sm:px-4',
            copied
              ? 'bg-emerald-600 shadow-emerald-600/30'
              : 'bg-gradient-to-r from-[#10c96b] to-[#07a352] shadow-brand/30 hover:shadow-lg hover:shadow-brand/40',
          )}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span className="hidden sm:inline">{copied ? '已复制' : '复制到公众号'}</span>
          <span className="sm:hidden">{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
    </header>
  )
}
