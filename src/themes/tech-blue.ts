import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'tech-blue',
  name: '科技蓝',
  description: '深色代码块 + 胶囊标题，适合技术文章',
  tags: ['科技', '商务'],
  defaults: { primary: '#2563eb', fontSize: 15 },
  codeTheme: 'dark',
  css: /* css */ `
.wx-root { color: #3a3f4b; }
.wx-h1 { color: {{primary}}; }
.wx-h2 { text-align: left; }
.wx-h2-content {
  display: inline-block; padding: 4px 14px 4px 12px; color: #fff; border-radius: 0 20px 20px 0;
  background: {{primary}};
}
.wx-h3 { color: {{primary}}; }
.wx-h3-prefix { display: inline-block; width: 8px; height: 8px; margin-right: 8px; background: {{primary}}; border-radius: 2px; vertical-align: middle; }
.wx-blockquote { border-left: 4px solid {{primary}}; background: #f3f6fc; color: #5b6475; }
.wx-pre { border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
.wx-codespan { color: {{primary}}; background: {{primary/0.08}}; }
.wx-strong { color: {{primary}}; }
.wx-th { background: {{primary}}; color: #fff; border-color: {{primary}}; }
`,
}

export default theme
