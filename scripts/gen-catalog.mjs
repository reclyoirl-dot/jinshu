/**
 * 生成素材手册 docs/MATERIALS.md：读取 src/blocks 的素材注册表，列出每个素材的 id、名称、标签、参数和示例。
 *
 *   pnpm catalog            重新生成手册
 *   pnpm catalog --check    只检查手册是否最新，过期时退出码为 1
 *
 * 素材注册表用了 Vite 的 import.meta.glob，所以借 Vite 的 SSR 模块加载器来读取 TS 源码。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFile = path.join(root, 'docs/MATERIALS.md')
const check = process.argv.includes('--check')

const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
})

let markdown
try {
  const { blocks } = await server.ssrLoadModule('/src/blocks/index.ts')
  const { BLOCK_CATEGORIES } = await server.ssrLoadModule('/src/core/types.ts')
  const { parseAttrs } = await server.ssrLoadModule('/src/core/render/attrs.ts')
  const { themes } = await server.ssrLoadModule('/src/themes/index.ts')
  markdown = build({ blocks, categories: BLOCK_CATEGORIES, parseAttrs, themes })
} finally {
  await server.close()
}

if (check) {
  const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8').replace(/\r\n/g, '\n') : ''
  if (current !== markdown) {
    console.error('docs/MATERIALS.md 已过期，请运行 pnpm catalog 重新生成')
    process.exit(1)
  }
  console.log('docs/MATERIALS.md 是最新的')
} else {
  fs.writeFileSync(outFile, markdown)
  console.log(`已生成 docs/MATERIALS.md（${markdown.split('\n').length} 行）`)
}

/* ---------- 手册内容 ---------- */

/** 示例第一行 :::id{...} 里的参数 */
function exampleParams(example, parseAttrs) {
  const m = example.split('\n')[0].match(/^:::\s*[\w-]+\s*(\{.*\})?\s*$/)
  return parseAttrs(m?.[1])
}

/** 代码围栏要比示例里最长的反引号串更长 */
function fence(text) {
  const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map((s) => s.length))
  return '`'.repeat(Math.max(3, longest + 1))
}

/** GitHub 标题锚点：去掉标点，空格换成连字符 */
function anchor(name) {
  return name.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-')
}

function build({ blocks, categories, parseAttrs, themes }) {
  const groups = categories
    .map((c) => ({ ...c, items: blocks.filter((b) => b.category === c.id) }))
    .filter((g) => g.items.length)

  const out = []
  const line = (s = '') => out.push(s)

  line('# 素材手册')
  line()
  line('<!-- 本文件由 `pnpm catalog`（scripts/gen-catalog.mjs）根据 src/blocks 自动生成，请勿手动修改 -->')
  line()
  line(`「锦书 JinShu」共有 **${blocks.length} 个素材**，全部可以直接写进 Markdown。这份手册既给人查，也可以整份发给 AI，让它写文章时直接用素材排版。`)
  line()
  line('## 语法规则')
  line()
  line('素材用 `:::` 容器包裹，开头一行写素材 id 和参数，结尾单独一行 `:::`：')
  line()
  line('```markdown')
  line(':::素材id{参数1="值" 参数2=值}')
  line('素材内容（普通 Markdown）')
  line(':::')
  line('```')
  line()
  line('- **开头行**：`:::` 后紧跟素材 id，参数写在同一行的 `{}` 里；整行不能有其他文字。')
  line('- **参数**：`key="value"`，值里有空格时必须加引号，单引号也可以；不带值的 `key` 等于 `key="true"`。参数可以省略，省略时使用素材自带的默认文字。')
  line('- **结尾行**：单独一行 `:::`，前后不要有其他字符。')
  line('- **内容**：容器里写普通 Markdown，支持加粗、行内代码、链接、图片 `![说明](https://图片地址)`。多数素材约定「第一行是标题、其余是正文」，问答类素材约定「第一行是问题、其余是回答」（`Q:` / `问：` / `A:` / `答：` 前缀会被自动去掉）。没有内容的素材（如动图、分割线）直接写 `:::id` 加一行 `:::`。')
  line('- **嵌套**：素材里可以再放素材，每个容器都用自己的 `:::` 结尾，按出现顺序配对：')
  line()
  line('```markdown')
  line(':::card-border')
  line(':::title-pill')
  line('卡片里的标题')
  line(':::')
  line('卡片正文')
  line(':::')
  line('```')
  line()
  line('- **未知 id** 会在预览里显示红色的「未知组件」提示，请只使用本手册列出的 id。')
  line()
  line('## 颜色参数')
  line()
  line('- 所有素材都跟随编辑器里设置的**主色**，不写颜色时自动协调。')
  line('- 任意素材都可以加 `color=#ff6600`（3 位或 6 位十六进制）单独指定这一处的颜色，例如 `:::card-border{color=#e85d75}`。')
  line('- 动图（`gif-*`）的 `color` 是**配色名**而不是色值：`blue` / `green` / `red` / `orange` / `purple`，只有标注了「配色」的动图支持；动图还支持 `width="60%"` 或 `width="240px"` 调整显示宽度。')
  line()
  line('## 使用提示')
  line()
  line('- **动图**粘贴到公众号时，公众号会从网络抓取 GIF，所以编辑器必须部署在公网（或在「主题 → 动图素材地址」填写公网 CDN）；本地 `localhost` 预览时复制过去会显示不出来。')
  line('- **SVG 素材**是公众号支持的原生动画，其中带「互动」标签的素材读者点一下才会触发（揭晓答案、翻面、拆礼物等），适合做互动和悬念，一篇文章 1–3 个即可。')
  line('- 公众号正文不能放外链：普通链接会被自动转成文末「参考链接」，只有 `mp.weixin.qq.com` 的公众号文章链接会保留。')
  line('- 预览区顶部的「兼容检测」会提示渐变文字背景、行高过小、本地图片地址等问题。')
  line()
  line('## 全局主题')
  line()
  line('主题决定 Markdown 原生元素（标题、引用、列表、代码块、表格）的样式，在编辑器「样式中心 → 主题」里切换。')
  line()
  line('| id | 名称 | 说明 |')
  line('| --- | --- | --- |')
  for (const t of themes) line(`| \`${t.id}\` | ${t.name} | ${t.description} |`)
  line()
  line('## 素材目录')
  line()
  for (const g of groups) line(`- [${g.name}](#${anchor(`${g.name}（${g.id}）`)})：${g.items.length} 个`)
  line()

  for (const g of groups) {
    line(`## ${g.name}（${g.id}）`)
    line()
    line('| id | 名称 | 标签 | 参数 |')
    line('| --- | --- | --- | --- |')
    for (const b of g.items) {
      const params = Object.keys(exampleParams(b.example, parseAttrs))
      line(`| \`${b.id}\` | ${b.name} | ${[...new Set(b.tags)].join('、')} | ${params.map((p) => `\`${p}\``).join(' ') || '—'} |`)
    }
    line()
    for (const b of g.items) {
      line(`### \`${b.id}\` ${b.name}`)
      line()
      const params = exampleParams(b.example, parseAttrs)
      const meta = [`标签：${[...new Set(b.tags)].join('、')}`]
      const keys = Object.keys(params)
      if (keys.length) meta.push(`参数：${keys.map((k) => `\`${k}\`（如 \`${params[k]}\`）`).join('、')}`)
      if (b.variants) meta.push(`配色：${b.variants.options.map((o) => `\`${o.value}\` ${o.label}`).join('、')}`)
      line(meta.join(' · '))
      line()
      const f = fence(b.example)
      line(`${f}markdown`)
      line(b.example)
      line(f)
      line()
    }
  }
  return out.join('\n')
}
