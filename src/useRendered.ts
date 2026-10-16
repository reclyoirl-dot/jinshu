import { useDeferredValue, useMemo } from 'react'
import { defaultAssetBase, withSlash } from './core/assets'
import { renderArticle, type RenderResult } from './core/render'
import type { ThemeDef } from './core/types'
import { useCurrentDoc, useStudio } from './store'
import { getTheme } from './themes'

export interface ResolvedStyle {
  theme: ThemeDef
  primary: string
  fontSize: number
  footnoteLinks: boolean
  assetBase: string
}

export function useResolvedStyle(): ResolvedStyle {
  const themeId = useStudio((s) => s.themeId)
  const primary = useStudio((s) => s.primary)
  const fontSize = useStudio((s) => s.fontSize)
  const footnoteLinks = useStudio((s) => s.footnoteLinks)
  const assetBase = useStudio((s) => s.assetBase)
  return useMemo(() => {
    const theme = getTheme(themeId)
    return {
      theme,
      primary: primary ?? theme.defaults.primary,
      fontSize: fontSize ?? theme.defaults.fontSize,
      footnoteLinks,
      assetBase: withSlash(assetBase || defaultAssetBase()),
    }
  }, [themeId, primary, fontSize, footnoteLinks, assetBase])
}

export function useRendered(): RenderResult {
  const doc = useCurrentDoc()
  const style = useResolvedStyle()
  const content = useDeferredValue(doc.content)
  // 预览需要 data-line 用于点击素材跳转；复制用的 html 由渲染器保证不含该属性
  return useMemo(() => renderArticle(content, { ...style, lineMarks: true }), [content, style])
}
