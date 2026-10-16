import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { Prec } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import {
  Bold,
  CheckCircle2,
  Code,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Table,
  type LucideIcon,
} from 'lucide-react'
import { Fragment, useEffect } from 'react'
import { insertBlock, prefixLines, setEditorView, wrapSelection } from '../editorBridge'
import { registerScroll } from '../scrollSync'
import { useCurrentDoc, useStudio } from '../store'
import { cx, iconBtn } from './ui'

const editorTheme = EditorView.theme({
  '&': { backgroundColor: 'transparent' },
  '.cm-content': { padding: '20px 0 40vh', maxWidth: '760px', margin: '0 auto' },
  '.cm-line': { padding: '0 24px' },
  '.cm-gutters': { display: 'none' },
  '.cm-activeLine': { backgroundColor: 'rgba(7,193,96,0.05)' },
})

const extensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  EditorView.lineWrapping,
  editorTheme,
  Prec.high(
    keymap.of([
      { key: 'Mod-b', run: (v) => wrapSelection('**', '**', '加粗文字', v) },
      { key: 'Mod-i', run: (v) => wrapSelection('*', '*', '斜体文字', v) },
    ]),
  ),
]

type Tool = { icon: LucideIcon; title: string; run: () => void }

const GROUPS: Tool[][] = [
  [
    { icon: Heading2, title: '二级标题', run: () => prefixLines('## ') },
    { icon: Heading3, title: '三级标题', run: () => prefixLines('### ') },
  ],
  [
    { icon: Bold, title: '加粗 Ctrl+B', run: () => wrapSelection('**', '**', '加粗文字') },
    { icon: Italic, title: '斜体 Ctrl+I', run: () => wrapSelection('*', '*', '斜体文字') },
    { icon: Strikethrough, title: '删除线', run: () => wrapSelection('~~', '~~', '删除文字') },
  ],
  [
    { icon: Quote, title: '引用', run: () => prefixLines('> ') },
    { icon: List, title: '无序列表', run: () => prefixLines('- ') },
    { icon: ListOrdered, title: '有序列表', run: () => prefixLines((i) => `${i + 1}. `) },
  ],
  [
    { icon: Link, title: '链接', run: () => wrapSelection('[', '](https://)', '链接文字') },
    { icon: Image, title: '图片', run: () => wrapSelection('![', '](https://)', '图片描述') },
    { icon: Table, title: '表格', run: () => insertBlock('| 标题 | 标题 |\n| --- | --- |\n| 内容 | 内容 |') },
    { icon: Code, title: '代码块', run: () => insertBlock('```js\n\n```') },
    { icon: Minus, title: '分割线', run: () => insertBlock('---') },
  ],
]

/** 统计正文字数（去掉 Markdown 标记与组件语法） */
function countWords(src: string) {
  const text = src
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^:::.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|\-]/g, '')
  const cjk = (text.match(/[一-鿿]/g) ?? []).length
  const words = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length
  return cjk + words
}

export default function EditorPane() {
  const doc = useCurrentDoc()
  const setContent = useStudio((s) => s.setContent)
  const dark = useStudio((s) => s.dark)
  const words = countWords(doc.content)

  useEffect(
    () => () => {
      setEditorView(null)
      registerScroll('editor', null)
    },
    [],
  )

  return (
    <div className="flex h-full min-w-0 flex-col bg-white dark:bg-[#1b1d23]">
      <div className="thin-scroll flex h-12 shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200/80 px-2 dark:border-white/10">
        {GROUPS.map((group, gi) => (
          <Fragment key={gi}>
            {gi > 0 && <span className="mx-1 h-5 w-px shrink-0 bg-slate-200 dark:bg-white/10" />}
            {group.map(({ icon: Icon, title, run }) => (
              <button key={title} className={cx(iconBtn, 'h-8 w-8')} title={title} onMouseDown={(e) => e.preventDefault()} onClick={run}>
                <Icon size={17} />
              </button>
            ))}
          </Fragment>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        <CodeMirror
          value={doc.content}
          height="100%"
          theme={dark ? 'dark' : 'light'}
          extensions={extensions}
          basicSetup={{ foldGutter: false, lineNumbers: false, highlightActiveLineGutter: false }}
          onChange={setContent}
          onCreateEditor={(view) => {
            setEditorView(view)
            registerScroll('editor', view.scrollDOM)
          }}
          className="h-full"
        />
      </div>
      <div className="flex h-8 shrink-0 items-center gap-4 border-t border-slate-200/80 px-4 text-[11px] text-slate-400 dark:border-white/10">
        <span>{words} 字</span>
        <span>约 {Math.max(1, Math.round(words / 400))} 分钟读完</span>
        <span className="hidden sm:inline">支持 Markdown 与 :::素材 语法</span>
        <span className="ml-auto inline-flex items-center gap-1 text-emerald-500">
          <CheckCircle2 size={12} /> 已自动保存
        </span>
      </div>
    </div>
  )
}
