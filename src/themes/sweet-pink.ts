import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'sweet-pink',
  name: '少女粉',
  description: '粉色圆角与可爱装饰，适合美妆、生活分享',
  tags: ['可爱', '少女'],
  defaults: { primary: '#f07c9b', fontSize: 15 },
  codeTheme: 'light',
  css: /* css */ `
.wx-root { color: #5a4a50; letter-spacing: 1px; }
.wx-h1 { color: {{primary}}; }
.wx-h2 { text-align: center; }
.wx-h2-prefix { display: inline-block; width: 10px; height: 10px; margin-right: 8px; border-radius: 50%; background: {{primary~0.5}}; vertical-align: middle; }
.wx-h2-content { display: inline-block; padding: 4px 18px; border-radius: 999px; background: {{primary}}; color: #fff; }
.wx-h2-suffix { display: inline-block; width: 10px; height: 10px; margin-left: 8px; border-radius: 50%; background: {{primary~0.5}}; vertical-align: middle; }
.wx-h3 { color: {{primary}}; }
.wx-h3-prefix { display: inline-block; margin-right: 6px; width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 9px solid {{primary}}; vertical-align: middle; }
.wx-blockquote { border-left: none; border: 1px dashed {{primary~0.3}}; background: {{primary~0.94}}; border-radius: 12px; color: #8a6a74; }
.wx-strong { color: {{primary}}; background: {{primary~0.88}}; padding: 0 3px; border-radius: 3px; }
.wx-img { border-radius: 14px; }
.wx-hr { height: 0; border-top: 2px dotted {{primary~0.4}}; background: none; }
`,
}

export default theme
