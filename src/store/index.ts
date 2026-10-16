import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import welcome from '../content/welcome.md?raw'
import { stripFrontmatter } from '../core/render'
import type { TemplateDef } from '../core/types'
import { DEFAULT_THEME_ID } from '../themes'

export interface Doc {
  id: string
  title: string
  content: string
  updatedAt: number
}

interface StudioState {
  docs: Doc[]
  currentId: string
  themeId: string
  /** 用户自定义主色，null 表示跟随主题默认 */
  primary: string | null
  /** 用户自定义字号，null 表示跟随主题默认 */
  fontSize: number | null
  footnoteLinks: boolean
  dark: boolean
  /** 收藏的素材 id */
  favorites: string[]
  /** 最近使用的素材 id（新的在前） */
  recent: string[]
  /** 素材文件根地址，null 表示默认（当前站点或 VITE_ASSET_BASE） */
  assetBase: string | null
  /** 预览中显示的公众号名称 */
  accountName: string
  previewMode: 'phone' | 'wide'

  setContent: (content: string) => void
  newDoc: (content?: string) => void
  selectDoc: (id: string) => void
  deleteDoc: (id: string) => void
  setTheme: (id: string) => void
  setPrimary: (color: string | null) => void
  setFontSize: (size: number | null) => void
  setFootnoteLinks: (on: boolean) => void
  setDark: (on: boolean) => void
  applyTemplate: (tpl: TemplateDef) => void
  toggleFavorite: (id: string) => void
  markUsed: (id: string) => void
  setAssetBase: (url: string | null) => void
  setAccountName: (name: string) => void
  setPreviewMode: (mode: 'phone' | 'wide') => void
}

const uid = () => Math.random().toString(36).slice(2, 10)

export function titleOf(content: string): string {
  const body = stripFrontmatter(content)
  const heading = body.match(/^#{1,3}\s+(.+)$/m)
  if (heading) return heading[1].trim().slice(0, 40)
  const line = body.split('\n').find((l) => l.trim() && !l.trim().startsWith(':::'))
  return line ? line.trim().replace(/^[>#*\-\s]+/, '').slice(0, 40) || '未命名文档' : '未命名文档'
}

const makeDoc = (content: string): Doc => ({ id: uid(), title: titleOf(content), content, updatedAt: Date.now() })

const firstDoc = makeDoc(welcome)

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      docs: [firstDoc],
      currentId: firstDoc.id,
      themeId: DEFAULT_THEME_ID,
      primary: null,
      fontSize: null,
      footnoteLinks: true,
      dark: false,
      favorites: [],
      recent: [],
      assetBase: null,
      accountName: '我的公众号',
      previewMode: 'phone',

      setContent: (content) =>
        set((s) => ({
          docs: s.docs.map((d) =>
            d.id === s.currentId ? { ...d, content, title: titleOf(content), updatedAt: Date.now() } : d,
          ),
        })),
      newDoc: (content = '# 新文章\n\n从这里开始写作…\n') => {
        const doc = makeDoc(content)
        set((s) => ({ docs: [doc, ...s.docs], currentId: doc.id }))
      },
      selectDoc: (id) => set({ currentId: id }),
      deleteDoc: (id) => {
        const rest = get().docs.filter((d) => d.id !== id)
        if (!rest.length) rest.push(makeDoc(welcome))
        set((s) => ({ docs: rest, currentId: s.currentId === id ? rest[0].id : s.currentId }))
      },
      setTheme: (id) => set({ themeId: id, primary: null }),
      setPrimary: (primary) => set({ primary }),
      setFontSize: (fontSize) => set({ fontSize }),
      setFootnoteLinks: (footnoteLinks) => set({ footnoteLinks }),
      setDark: (dark) => set({ dark }),
      applyTemplate: (tpl) => {
        get().newDoc(tpl.content)
        set({ themeId: tpl.theme, primary: tpl.primary ?? null })
      },
      toggleFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [id, ...s.favorites] })),
      markUsed: (id) => set((s) => ({ recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 24) })),
      setAssetBase: (assetBase) => set({ assetBase: assetBase?.trim() || null }),
      setAccountName: (accountName) => set({ accountName }),
      setPreviewMode: (previewMode) => set({ previewMode }),
    }),
    {
      name: 'jinshu',
      version: 2,
      // v1 → v2 只新增字段，直接合并默认值即可
      migrate: (state) => state as StudioState,
    },
  ),
)

export const useCurrentDoc = () =>
  useStudio((s) => s.docs.find((d) => d.id === s.currentId) ?? s.docs[0])
