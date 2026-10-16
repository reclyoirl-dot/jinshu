import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'simple',
  name: '简约',
  description: '克制留白，适合任何内容的默认主题',
  tags: ['简约', '通用'],
  defaults: { primary: '#1e80ff', fontSize: 15 },
  codeTheme: 'light',
  css: /* css */ `
.wx-h2 { text-align: center; }
.wx-h2-content { display: inline-block; padding-bottom: 4px; border-bottom: 2px solid {{primary}}; }
.wx-h3 { padding-left: 8px; border-left: 3px solid {{primary}}; line-height: 1.5; }
`,
}

export default theme
