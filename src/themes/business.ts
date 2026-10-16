import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'business',
  name: '商务',
  description: '深蓝稳重、色块标题，适合企业新闻、政务通报',
  tags: ['商务', '企业'],
  defaults: { primary: '#1f3a5f', fontSize: 15 },
  codeTheme: 'light',
  css: /* css */ `
.wx-root { color: #333; text-align: justify; }
.wx-h1 { color: {{primary}}; border-bottom: 2px solid {{primary}}; padding-bottom: 10px; }
.wx-h2 { background: {{primary}}; color: #fff; padding: 8px 14px; font-size: {{fs*1.15}}; border-left: 6px solid #c9a227; }
.wx-h3 { color: {{primary}}; border-bottom: 1px solid {{primary~0.7}}; padding-bottom: 6px; }
.wx-blockquote { border-left: 4px solid #c9a227; background: #f7f8fa; color: #555; }
.wx-strong { color: {{primary}}; }
.wx-th { background: {{primary}}; color: #fff; border-color: {{primary}}; }
.wx-hr { background: {{primary~0.6}}; }
`,
}

export default theme
