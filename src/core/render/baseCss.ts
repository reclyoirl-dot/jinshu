/** 所有主题共用的基础样式，主题 CSS 在其后追加覆盖 */
export const BASE_CSS = /* css */ `
.wx-root {
  font-size: {{fs}}; color: #333; line-height: 1.75; letter-spacing: 0.5px;
  word-break: break-word; text-align: left; padding: 0 4px;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
}
.wx-p { margin: 1em 0; font-size: {{fs}}; line-height: 1.75; }
.wx-h1, .wx-h2, .wx-h3, .wx-h4, .wx-h5, .wx-h6 { font-weight: bold; color: #222; line-height: 1.5; }
.wx-h1 { font-size: {{fs*1.6}}; margin: 1.2em 0 0.8em; text-align: center; }
.wx-h2 { font-size: {{fs*1.3}}; margin: 1.6em 0 1em; }
.wx-h3 { font-size: {{fs*1.15}}; margin: 1.4em 0 0.8em; }
.wx-h4, .wx-h5, .wx-h6 { font-size: {{fs}}; margin: 1.2em 0 0.6em; }
.wx-blockquote {
  margin: 1em 0; padding: 10px 14px; color: #666;
  border-left: 3px solid {{primary}}; background: {{primary/0.06}}; border-radius: 0 4px 4px 0;
}
.wx-blockquote .wx-p { margin: 0.4em 0; font-size: {{fs*0.95}}; }
.wx-ul, .wx-ol { margin: 0.8em 0; padding-left: 1.6em; }
.wx-ul { list-style-type: disc; }
.wx-ol { list-style-type: decimal; }
.wx-li { margin: 0.3em 0; line-height: 1.75; }
.wx-li .wx-p { margin: 0; }
.wx-strong { font-weight: bold; color: {{primary}}; }
.wx-em { font-style: italic; }
.wx-del { text-decoration: line-through; color: #999; }
.wx-a, .wx-a-note { color: {{primary}}; text-decoration: none; border-bottom: 1px solid {{primary/0.4}}; }
.wx-codespan {
  font-size: 90%; padding: 2px 5px; margin: 0 2px; border-radius: 4px;
  background: {{primary/0.08}}; color: {{primary^0.15}};
  font-family: Menlo, Consolas, Monaco, "Courier New", monospace;
}
.wx-pre { margin: 1em 0; padding: 14px 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; }
.wx-code {
  display: block; white-space: nowrap; font-size: 13px; line-height: 1.6;
  font-family: Menlo, Consolas, Monaco, "Courier New", monospace;
}
.wx-hr { border: none; height: 1px; background: #e5e5e5; margin: 2em 0; }
.wx-img { display: block; max-width: 100%; margin: 1em auto 0.4em; border-radius: 6px; }
.wx-figcaption { display: block; text-align: center; font-size: 13px; color: #999; margin-bottom: 1em; }
.wx-table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: {{fs*0.9}}; }
.wx-th { background: {{primary/0.1}}; font-weight: bold; border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; }
.wx-td { border: 1px solid #e0e0e0; padding: 6px 10px; }
.wx-footnote-ref { color: {{primary}}; font-size: 12px; }
.wx-footnotes { margin-top: 2em; padding-top: 1em; border-top: 1px dashed #ddd; color: #888; }
.wx-footnotes-title { font-weight: bold; margin: 0 0 0.5em; font-size: 14px; color: #666; }
.wx-footnote-item { margin: 0.2em 0; word-break: break-all; line-height: 1.6; font-size: 12px; }
.wx-block-unknown { padding: 8px 12px; border: 1px dashed #f56c6c; color: #f56c6c; font-size: 13px; margin: 1em 0; border-radius: 4px; }
`

export const CODE_CSS = {
  light: /* css */ `
.wx-pre { background: #f6f8fa; color: #24292e; border: 1px solid #eaecef; }
.hljs-comment, .hljs-quote { color: #6a737d; font-style: italic; }
.hljs-keyword, .hljs-selector-tag, .hljs-type, .hljs-doctag { color: #d73a49; }
.hljs-string, .hljs-regexp, .hljs-addition, .hljs-meta .hljs-string { color: #032f62; }
.hljs-number, .hljs-literal, .hljs-variable, .hljs-template-variable, .hljs-attr, .hljs-attribute { color: #005cc5; }
.hljs-title, .hljs-section, .hljs-function .hljs-title, .hljs-title.function_ { color: #6f42c1; }
.hljs-built_in, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-tag { color: #22863a; }
.hljs-deletion { color: #b31d28; background: #ffeef0; }
.hljs-meta { color: #735c0f; }
`,
  dark: /* css */ `
.wx-pre { background: #282c34; color: #abb2bf; }
.hljs-comment, .hljs-quote { color: #7f848e; font-style: italic; }
.hljs-keyword, .hljs-selector-tag, .hljs-doctag, .hljs-type { color: #c678dd; }
.hljs-string, .hljs-regexp, .hljs-addition, .hljs-meta .hljs-string { color: #98c379; }
.hljs-number, .hljs-literal, .hljs-attr, .hljs-attribute, .hljs-variable, .hljs-template-variable { color: #d19a66; }
.hljs-title, .hljs-section, .hljs-function .hljs-title, .hljs-title.function_ { color: #61afef; }
.hljs-built_in, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-tag { color: #e06c75; }
.hljs-deletion { color: #e06c75; }
.hljs-meta { color: #56b6c2; }
`,
}
