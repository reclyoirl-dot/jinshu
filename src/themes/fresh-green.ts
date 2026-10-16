import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'fresh-green',
  name: '清新绿',
  description: '柔和绿色与圆角，适合生活、教程类内容',
  tags: ['清新', '教程'],
  defaults: { primary: '#2bae85', fontSize: 15 },
  codeTheme: 'light',
  css: /* css */ `
.wx-root { color: #3d4a44; letter-spacing: 0.8px; }
.wx-h2 { text-align: center; }
.wx-h2-content {
  display: inline-block; padding: 6px 20px; color: {{primary^0.2}}; background: {{primary~0.88}}; border-radius: 8px;
}
.wx-h3 { color: {{primary^0.1}}; }
.wx-h3-prefix { display: inline-block; width: 6px; height: 16px; margin-right: 8px; background: {{primary}}; border-radius: 3px; vertical-align: -2px; }
.wx-blockquote { border-left: none; border-radius: 10px; background: {{primary~0.92}}; color: #4f5d56; padding: 12px 16px; }
.wx-ul { list-style-type: circle; }
.wx-img { border-radius: 12px; }
.wx-hr { height: 0; border-top: 1px dashed {{primary~0.4}}; background: none; }
`,
}

export default theme
