// 预览动图帧：把指定动图的若干帧排成一张 PNG，方便检查设计
//   node scripts/gifs/preview.mjs out.png follow end   （不写 id 则预览全部，每个取 4 帧）
import { Resvg } from '@resvg/resvg-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { COLORS } from './lib.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const [out, ...ids] = process.argv.slice(2)
if (!out) throw new Error('用法：node scripts/gifs/preview.mjs out.png [id...]')

const defs = []
for (const f of fs.readdirSync(here).filter((f) => /^set-.*\.mjs$/.test(f)).sort()) {
  defs.push(...(await import(pathToFileURL(path.join(here, f)).href)).default)
}
const list = ids.length ? defs.filter((d) => ids.includes(d.id)) : defs

const SAMPLES = [0, 0.25, 0.5, 0.75]
const CELL_W = 340
let y = 0
const rows = []
for (const d of list) {
  const scale = CELL_W / d.width
  const h = d.height * scale
  const color = d.variants ? COLORS[d.defaultColor ?? 'blue'] : undefined
  const cells = SAMPLES.map((t, i) => {
    const inner = d
      .render(t, color, 0)
      .replace(/\sid="([\w-]+)"/g, ` id="$1_${d.id}_${i}"`)
      .replace(/url\(#([\w-]+)\)/g, `url(#$1_${d.id}_${i})`)
      .replace(/^<svg[^>]*?viewBox="([^"]+)"[^>]*>/, `<svg x="${i * (CELL_W + 10)}" y="${y + 22}" width="${CELL_W}" height="${h}" viewBox="$1">`)
    return inner
  }).join('')
  rows.push(`<text x="4" y="${y + 16}" font-size="14" font-family="Microsoft YaHei" fill="#c00">${d.id} · ${d.name}</text>${cells}`)
  y += h + 34
}
const width = SAMPLES.length * (CELL_W + 10)
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y}"><rect width="${width}" height="${y}" fill="#e9e9e9"/>${rows.join('')}</svg>`
fs.writeFileSync(out, new Resvg(sheet, { font: { loadSystemFonts: true } }).render().asPng())
console.log(`已输出 ${out}（${list.length} 个动图）`)
