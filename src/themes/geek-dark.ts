import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'geek-dark',
  name: '极客暗黑',
  description: '深色背景与终端风格，适合开发者内容',
  tags: ['科技', '暗黑'],
  defaults: { primary: '#22c55e', fontSize: 15 },
  codeTheme: 'dark',
  css: /* css */ `
.wx-root { background: #1b1f24; color: #c9d1d9; padding: 16px 14px; border-radius: 6px; }
.wx-h1, .wx-h2, .wx-h3, .wx-h4, .wx-h5, .wx-h6 { color: #f0f6fc; }
.wx-h1 { color: {{primary}}; }
.wx-h2-prefix { display: inline-block; width: 4px; height: 18px; margin-right: 10px; background: {{primary}}; vertical-align: -3px; }
.wx-h2 { border-bottom: 1px solid #30363d; padding-bottom: 8px; }
.wx-h2-content { color: #f0f6fc; }
.wx-h3 { color: {{primary}}; }
.wx-blockquote { background: #22272e; border-left: 3px solid {{primary}}; color: #8b949e; }
.wx-strong { color: {{primary}}; }
.wx-em { color: #d2a8ff; }
.wx-a, .wx-a-note { color: #58a6ff; border-bottom: 1px solid rgba(88,166,255,0.4); }
.wx-codespan { background: #2d333b; color: {{primary}}; }
.wx-pre { background: #0d1117; border: 1px solid #30363d; }
.wx-hr { background: #30363d; }
.wx-th { background: #22272e; color: #f0f6fc; border-color: #30363d; }
.wx-td { border-color: #30363d; }
.wx-figcaption { color: #8b949e; }
.wx-footnotes { border-top-color: #30363d; color: #8b949e; }
.wx-footnotes-title { color: #c9d1d9; }
`,
}

export default theme
