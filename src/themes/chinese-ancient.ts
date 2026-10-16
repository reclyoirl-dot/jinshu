import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'chinese-ancient',
  name: '古风',
  description: '朱砂红配宋体，适合传统节日、诗词与国风内容',
  tags: ['古风', '节日'],
  defaults: { primary: '#b33a3a', fontSize: 16 },
  codeTheme: 'light',
  css: /* css */ `
.wx-root {
  color: #3b2f2a; line-height: 2; letter-spacing: 1.5px; background: #fbf7ef; padding: 12px 10px;
  font-family: "Songti SC", "STSong", "SimSun", "Noto Serif SC", serif;
}
.wx-p { line-height: 2; }
.wx-h1 { color: {{primary}}; letter-spacing: 6px; }
.wx-h2 { text-align: center; color: {{primary}}; letter-spacing: 4px; font-weight: bold; }
.wx-h2-content { display: inline-block; padding: 4px 16px; border-top: 1px solid {{primary}}; border-bottom: 1px solid {{primary}}; }
.wx-h3 { color: {{primary}}; }
.wx-h3-prefix { display: inline-block; width: 18px; height: 18px; line-height: 18px; margin-right: 8px; background: {{primary}}; border-radius: 2px; vertical-align: -2px; }
.wx-blockquote { border-left: none; background: none; border-top: 1px solid {{primary~0.6}}; border-bottom: 1px solid {{primary~0.6}}; border-radius: 0; text-align: center; color: #6b5a50; }
.wx-strong { color: {{primary}}; }
.wx-hr { background: {{primary~0.5}}; width: 50%; margin: 2.5em auto; }
.wx-th { background: {{primary~0.85}}; }
`,
}

export default theme
