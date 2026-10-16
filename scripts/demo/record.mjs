// 录制 README 用的演示动图：用本机 Chrome 自动操作编辑器，录屏后编码为 GIF。
//   先启动开发服务器（pnpm dev），然后：
//   node scripts/demo/record.mjs [输出路径] [页面地址]
//   默认输出 public/showcase/demo.gif，页面地址 http://localhost:5173/
// 可用 CHROME_PATH 指定 Chrome 路径。
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import gifenc from 'gifenc'
import jpeg from 'jpeg-js'
import puppeteer from 'puppeteer-core'

const { GIFEncoder, quantize, applyPalette } = gifenc

const out = process.argv[2] ?? 'public/showcase/demo.gif'
const url = process.argv[3] ?? 'http://localhost:5173/'
const CHROME =
  process.env.CHROME_PATH ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ].find((p) => fs.existsSync(p))

const VIEW = { width: 1280, height: 760 }
const OUT_WIDTH = 960
const MIN_FRAME_MS = 100 // 最高约 10 帧/秒

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'jinshu-demo-')),
  defaultViewport: { ...VIEW, deviceScaleFactor: 1 },
  args: ['--no-first-run', '--hide-scrollbars'],
})
const page = await browser.newPage()
await browser.defaultBrowserContext().overridePermissions(new URL(url).origin, ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write'])
await page.goto(url, { waitUntil: 'networkidle0' })
await sleep(1200)

/* ---------- 操作工具 ---------- */
/** 点击文字匹配的元素；素材卡片的名称在按钮旁边，所以也匹配父元素的文字 */
async function clickText(selector, text) {
  const handle = await page.evaluateHandle(
    (sel, t) =>
      [...document.querySelectorAll(sel)].find(
        (el) => el.textContent.trim().includes(t) || (el.title === '点击插入到光标处' && el.parentElement?.textContent.includes(t)),
      ),
    selector,
    text,
  )
  const el = handle.asElement()
  if (!el) throw new Error(`找不到元素：${selector} 「${text}」`)
  // 偶尔会因为布局还在变化而点击失败，重试几次
  for (let i = 0; ; i++) {
    try {
      await el.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await sleep(150)
      await el.click()
      return
    } catch (e) {
      if (i >= 3) throw e
      await sleep(400)
    }
  }
}

async function type(text, delay = 70) {
  for (const ch of text) {
    if (ch === '\n') await page.keyboard.press('Enter')
    else await page.keyboard.type(ch)
    await sleep(delay)
  }
}

// 清空编辑器，光标放到开头
await page.click('.cm-content')
await page.keyboard.down('Control')
await page.keyboard.press('a')
await page.keyboard.up('Control')
await page.keyboard.press('Backspace')
await sleep(600)

/* ---------- 开始录屏 ---------- */
const frames = []
const cdp = await page.createCDPSession()
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  frames.push({ data, t: metadata.timestamp * 1000 })
  await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
})
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: VIEW.width, maxHeight: VIEW.height })
await sleep(500)

// 1. 写标题
await type('# 周末去看海\n\n')
await sleep(300)
// 2. 插入一个标题素材
await clickText('aside button[title="点击插入到光标处"]', '切片艺术数字')
await sleep(900)
// 3. 写一段正文
await type('海风、日落和一杯冰美式，就是周末最好的样子。\n\n', 60)
await sleep(300)
// 4. 插入 SVG 点击互动
await clickText('aside nav button', 'SVG')
await sleep(700)
await clickText('aside button[title="点击插入到光标处"]', '点击揭晓答案')
await sleep(1000)
// 5. 换主题色
await clickText('aside button', '主题')
await sleep(700)
await page.click('button[title="#f07c9b"]')
await sleep(1300)
// 6. 在预览里点击 SVG
const svgBox = await page.evaluateHandle(() => {
  const svgs = [...document.querySelectorAll('main section .wx-preview svg')]
  return svgs.find((s) => s.textContent.includes('点击揭晓答案'))
})
const svgEl = svgBox.asElement()
if (svgEl) {
  await svgEl.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  await sleep(1200)
  await svgEl.click()
  await sleep(1600)
}
// 7. 复制到公众号
await clickText('header button', '复制到公众号')
await sleep(1800)

await cdp.send('Page.stopScreencast')
await browser.close()
console.log(`录到 ${frames.length} 帧，开始编码…`)

/* ---------- 编码 GIF ---------- */
// 合并过于密集的帧
const picked = []
for (const f of frames) {
  const last = picked[picked.length - 1]
  if (last && f.t - last.t < MIN_FRAME_MS) picked[picked.length - 1] = { ...f, t: last.t }
  else picked.push(f)
}

function downscale(rgba, w, h, ow) {
  const oh = Math.round((h * ow) / w)
  const out = new Uint8Array(ow * oh * 4)
  const sx = w / ow
  const sy = h / oh
  for (let y = 0; y < oh; y++) {
    for (let x = 0; x < ow; x++) {
      const x0 = Math.floor(x * sx)
      const x1 = Math.min(w, Math.floor((x + 1) * sx))
      const y0 = Math.floor(y * sy)
      const y1 = Math.min(h, Math.floor((y + 1) * sy))
      let r = 0, g = 0, b = 0, n = 0
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * w + xx) * 4
          r += rgba[i]; g += rgba[i + 1]; b += rgba[i + 2]; n++
        }
      }
      const o = (y * ow + x) * 4
      out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n; out[o + 3] = 255
    }
  }
  return { data: out, width: ow, height: oh }
}

const gif = GIFEncoder()
let shown = null // 当前已显示的画面，用来做差分
for (let i = 0; i < picked.length; i++) {
  const raw = jpeg.decode(Buffer.from(picked[i].data, 'base64'), { useTArray: true })
  const { data, width, height } = downscale(raw.data, raw.width, raw.height, OUT_WIDTH)
  const next = picked[i + 1]
  const delay = next ? Math.max(MIN_FRAME_MS, Math.min(3000, next.t - picked[i].t)) : 2500

  // 255 色 + 1 个透明色：与上一帧几乎相同的像素设为透明，大幅减小体积
  const palette = quantize(data, 255)
  const index = applyPalette(data, palette)
  if (!shown) {
    shown = new Uint8Array(data)
    gif.writeFrame(index, width, height, { palette, delay, repeat: 0 })
    continue
  }
  const transparentIndex = palette.length
  palette.push([0, 0, 0])
  for (let p = 0; p < width * height; p++) {
    const o = p * 4
    const diff = Math.abs(data[o] - shown[o]) + Math.abs(data[o + 1] - shown[o + 1]) + Math.abs(data[o + 2] - shown[o + 2])
    if (diff < 18) index[p] = transparentIndex
    else {
      shown[o] = data[o]; shown[o + 1] = data[o + 1]; shown[o + 2] = data[o + 2]
    }
  }
  gif.writeFrame(index, width, height, { palette, delay, transparent: true, transparentIndex, dispose: 1 })
}
gif.finish()
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, gif.bytes())
console.log(`已输出 ${out}：${picked.length} 帧，${(gif.bytes().length / 1024 / 1024).toFixed(2)} MB`)
