import type { ColorKit } from './color'

export interface ThemeDef {
  id: string
  name: string
  description: string
  tags: string[]
  author?: string
  defaults: {
    /** 主色，十六进制 */
    primary: string
    /** 正文字号 px */
    fontSize: number
  }
  /** 代码块配色 */
  codeTheme: 'light' | 'dark'
  /** 主题 CSS，只使用 .wx-* 类选择器，支持 {{primary}} 等占位符（见 core/color.ts） */
  css: string
}

export type BlockCategory = 'title' | 'body' | 'qa' | 'imagetext' | 'divider' | 'guide' | 'ending' | 'gif' | 'svg'

export const BLOCK_CATEGORIES: { id: BlockCategory; name: string }[] = [
  { id: 'title', name: '标题' },
  { id: 'body', name: '正文' },
  { id: 'qa', name: '问答' },
  { id: 'imagetext', name: '图文' },
  { id: 'divider', name: '分割' },
  { id: 'guide', name: '引导' },
  { id: 'ending', name: '结尾' },
  { id: 'gif', name: '动图' },
  { id: 'svg', name: 'SVG' },
]

export interface BlockContext {
  /** 当前主色（组件参数 color 可覆盖） */
  color: ColorKit
  fontSize: number
  /** 把行内 Markdown 渲染为 HTML（不包 <p>） */
  renderInline: (src: string) => string
  /** 把块级 Markdown 渲染为 HTML */
  render: (src: string) => string
  /** 素材文件（如 GIF）的绝对地址：asset('materials/gif/x.gif') */
  asset: (path: string) => string
}

export interface BlockRenderInput {
  /** :::id{key="value"} 中的参数 */
  params: Record<string, string>
  /** 容器内的原始 Markdown 文本 */
  raw: string
  ctx: BlockContext
}

export interface BlockDef {
  id: string
  name: string
  category: BlockCategory
  /** 风格/行业/节日等标签，用于样式中心筛选 */
  tags: string[]
  /** 点击插入时写入编辑器的示例 Markdown（含 ::: 包裹） */
  example: string
  /** 返回内联样式 HTML。禁止使用 class / <style> / CSS 变量 */
  render: (input: BlockRenderInput) => string
  /** 可选：样式中心里提供的快捷变体（例如动图的颜色），点击即插入带该参数的示例 */
  variants?: { param: string; options: { value: string; label: string; swatch: string }[] }
}

export interface TemplateDef {
  id: string
  name: string
  description: string
  theme: string
  primary?: string
  content: string
}

export interface RenderOptions {
  theme: ThemeDef
  primary: string
  fontSize: number
  /** 把非公众号链接转为文末脚注（公众号正文不允许外链） */
  footnoteLinks: boolean
  /** 素材文件根地址（以 / 结尾），默认取当前站点；部署后可改为 CDN */
  assetBase?: string
}
