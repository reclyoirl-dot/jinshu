import type { ThemeDef } from '../core/types'

/**
 * 主题注册表：自动收集本目录下所有主题文件（index 除外）。
 * 新增主题只需新建一个 .ts 文件 default 导出 ThemeDef，详见 docs/CONTRIBUTING.md。
 */
const modules = import.meta.glob<{ default: ThemeDef }>(['./*.ts', '!./index.ts'], { eager: true })

const ORDER = ['simple', 'tech-blue', 'fresh-green', 'literary', 'business', 'sweet-pink', 'chinese-ancient', 'geek-dark']

export const themes: ThemeDef[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => {
    const ia = ORDER.indexOf(a.id)
    const ib = ORDER.indexOf(b.id)
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib)
  })

export const DEFAULT_THEME_ID = 'simple'

export function getTheme(id: string): ThemeDef {
  return themes.find((t) => t.id === id) ?? themes.find((t) => t.id === DEFAULT_THEME_ID) ?? themes[0]
}
