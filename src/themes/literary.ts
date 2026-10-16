import type { ThemeDef } from '../core/types'

const theme: ThemeDef = {
  id: 'literary',
  name: '文艺',
  description: '衬线字体、宽松行距，适合随笔、书评与散文',
  tags: ['文艺', '阅读'],
  defaults: { primary: '#a0522d', fontSize: 16 },
  codeTheme: 'light',
  css: /* css */ `
.wx-root {
  color: #4a4a4a; line-height: 2; letter-spacing: 1px;
  font-family: Georgia, "Songti SC", "STSong", "SimSun", serif;
}
.wx-p { line-height: 2; text-indent: 2em; }
.wx-li .wx-p, .wx-blockquote .wx-p { text-indent: 0; }
.wx-h1 { font-weight: normal; letter-spacing: 3px; }
.wx-h2 { text-align: center; font-weight: normal; letter-spacing: 3px; color: {{primary}}; }
.wx-h2-prefix { display: block; width: 24px; height: 1px; margin: 0 auto 10px; background: {{primary}}; }
.wx-h2-suffix { display: block; width: 24px; height: 1px; margin: 10px auto 0; background: {{primary}}; }
.wx-h3 { font-weight: normal; color: {{primary}}; }
.wx-blockquote { border-left: none; background: none; text-align: center; color: #8a7a6a; font-style: italic; padding: 0 1.5em; }
.wx-strong { color: {{primary}}; }
.wx-img { border-radius: 0; }
.wx-figcaption { font-style: italic; }
.wx-hr { width: 30%; margin: 2.5em auto; background: {{primary~0.5}}; }
`,
}

export default theme
