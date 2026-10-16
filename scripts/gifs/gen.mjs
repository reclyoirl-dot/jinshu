// 生成全部动图素材与清单：
//   node scripts/gifs/gen.mjs            生成所有缺失的 GIF
//   node scripts/gifs/gen.mjs --force    全部重新生成
//   node scripts/gifs/gen.mjs follow end 只重新生成指定 id
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { COLORS, encodeGif } from './lib.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const outDir = path.join(root, 'public/materials/gif')
const manifestPath = path.join(root, 'src/materials/gifs.json')

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = new Set(args.filter((a) => !a.startsWith('--')))

fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(path.dirname(manifestPath), { recursive: true })

const setFiles = fs.readdirSync(here).filter((f) => /^set-.*\.mjs$/.test(f)).sort()
const defs = []
for (const f of setFiles) {
  const mod = await import(pathToFileURL(path.join(here, f)).href)
  for (const d of mod.default) defs.push({ ...d, set: f })
}

const ids = new Set()
for (const d of defs) {
  if (ids.has(d.id)) throw new Error(`重复的动图 id：${d.id}（${d.set}）`)
  ids.add(d.id)
}

const manifest = []
let made = 0
for (const d of defs) {
  const defaultColor = d.variants ? d.defaultColor ?? 'blue' : null
  const keys = d.variants ? [defaultColor, ...Object.keys(COLORS).filter((k) => k !== defaultColor)] : [null]
  for (const key of keys) {
    const file = key && key !== defaultColor ? `${d.id}-${key}.gif` : `${d.id}.gif`
    const target = path.join(outDir, file)
    const wanted = only.size ? only.has(d.id) : force || !fs.existsSync(target)
    if (!wanted) continue
    const started = Date.now()
    const bytes = encodeGif({ ...d, render: (t, i) => d.render(t, key ? COLORS[key] : undefined, i) })
    fs.writeFileSync(target, bytes)
    made++
    console.log(`✓ ${file}  ${(bytes.length / 1024).toFixed(0)} KB  ${Date.now() - started} ms`)
  }
  manifest.push({
    id: d.id,
    name: d.name,
    category: d.category,
    tags: d.tags,
    width: d.width,
    height: d.height,
    display: d.display ?? '100%',
    variants: d.variants ? keys : null,
    defaultColor,
  })
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n共 ${defs.length} 个动图，本次生成 ${made} 个文件，清单写入 ${path.relative(root, manifestPath)}`)
