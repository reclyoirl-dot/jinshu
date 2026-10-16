import { describe, expect, it } from 'vitest'
import { blocks } from '../src/blocks'
import { parseAttrs, renderArticle } from '../src/core/render'
import { fillPlaceholders, tint } from '../src/core/color'
import { lintHtml, type LintRule } from '../src/core/lint'
import { specificity } from '../src/core/render/inline'
import { themes, getTheme } from '../src/themes'
import { templates } from '../src/templates'

const SAMPLE = `# 一级标题

## 二级标题

### 三级标题

正文段落，包含 **加粗**、*斜体*、~~删除线~~ 和 \`行内代码\`，以及[一个外链](https://example.com)。

> 这是一段引用

- 列表一
- 列表二

1. 有序一
2. 有序二

| 表头 | 表头 |
| --- | --- |
| 单元格 | 单元格 |

\`\`\`js
function hello() {
  return 'world'
}
\`\`\`

---

![图注文字](https://example.com/a.png)
`

const render = (md: string, themeId = 'simple') => {
  const theme = getTheme(themeId)
  return renderArticle(md, {
    theme,
    primary: theme.defaults.primary,
    fontSize: theme.defaults.fontSize,
    footnoteLinks: true,
  }).html
}

/** 公众号兼容性约束：不允许 class / <style> / CSS 变量 / 未替换的占位符 */
function expectWechatSafe(html: string) {
  expect(html).not.toMatch(/\sclass=/)
  expect(html).not.toMatch(/<style/i)
  expect(html).not.toMatch(/var\(--/)
  expect(html).not.toMatch(/\{\{/)
  expect(html).not.toMatch(/\sid=/)
}

describe('工具函数', () => {
  it('解析组件参数', () => {
    expect(parseAttrs('{no="01" sub=\'副 标题\' color=#ff6600 flag}')).toEqual({
      no: '01',
      sub: '副 标题',
      color: '#ff6600',
      flag: 'true',
    })
    expect(parseAttrs(undefined)).toEqual({})
  })

  it('替换主题占位符', () => {
    const out = fillPlaceholders('a{{primary}} b{{primary/0.1}} c{{primary~0.5}} d{{fs}} e{{fs*2}}', {
      primary: '#ff0000',
      fontSize: 15,
    })
    expect(out).toBe(`a#ff0000 brgba(255,0,0,0.1) c${tint('#ff0000', 0.5)} d15px e30px`)
  })

  it('计算选择器优先级', () => {
    expect(specificity('.a .b')).toBeGreaterThan(specificity('.a'))
    expect(specificity('.a')).toBeGreaterThan(specificity('p'))
    expect(specificity('.wx-li:last-child')).toBeGreaterThan(specificity('.wx-li'))
  })
})

describe('渲染管线', () => {
  it('输出内联样式且符合公众号约束', () => {
    const html = render(SAMPLE)
    expectWechatSafe(html)
    expect(html).toContain('style=')
    expect(html.startsWith('<section')).toBe(true)
  })

  it('外链转为文末脚注', () => {
    const html = render('看[这里](https://example.com)和[公众号](https://mp.weixin.qq.com/s/abc)')
    expect(html).not.toContain('href="https://example.com"')
    expect(html).toContain('[1]')
    expect(html).toContain('参考链接')
    expect(html).toContain('href="https://mp.weixin.qq.com/s/abc"')
  })

  it('代码块保留缩进与换行', () => {
    const html = render('```\nif (a) {\n  b()\n}\n```')
    expect(html).toContain('<br>')
    expect(html).toContain('&nbsp;&nbsp;b()')
  })

  it('图片 alt 生成图注', () => {
    expect(render('![一张图](https://x.com/a.png)')).toContain('一张图</span>')
  })

  it('未知组件给出提示', () => {
    expect(render(':::no-such-block\n内容\n:::')).toContain('未知组件：no-such-block')
  })

  it('支持组件嵌套与 frontmatter', () => {
    const html = render('---\ntheme: simple\n---\n:::card-border\n:::title-pill\n嵌套标题\n:::\n正文\n:::')
    expect(html).toContain('嵌套标题')
    expect(html).not.toContain(':::')
    expect(html).not.toContain('theme: simple')
  })

  it('color 参数覆盖主色', () => {
    expect(render(':::title-pill{color=#ff0000}\n红色\n:::')).toMatch(/background: ?#ff0000/)
  })
})

describe.each(themes.map((t) => [t.id, t] as const))('主题 %s', (id, theme) => {
  it('元信息完整', () => {
    expect(theme.name).toBeTruthy()
    expect(theme.defaults.primary).toMatch(/^#[0-9a-f]{6}$/i)
  })
  it('渲染示例文章符合约束', () => {
    expectWechatSafe(render(SAMPLE, id))
  })
})

describe('组件库', () => {
  it('组件 id 唯一且数量充足', () => {
    const ids = blocks.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(blocks.length).toBeGreaterThanOrEqual(40)
  })

  it.each(blocks.map((b) => [b.id, b] as const))('%s 示例渲染符合约束', (id, block) => {
    expect(block.example.startsWith(`:::${id}`)).toBe(true)
    const html = render(block.example)
    expectWechatSafe(html)
    expect(html).not.toContain('未知组件')
    expect(html).not.toContain('渲染失败')
    expect(html).not.toContain(':::')
  })
})

describe('动图与 SVG 素材', () => {
  it('动图使用素材根地址生成绝对链接，并支持颜色变体', () => {
    const theme = getTheme('simple')
    const opts = { theme, primary: '#1e80ff', fontSize: 15, footnoteLinks: true, assetBase: 'https://cdn.example.com/x/' }
    const base = renderArticle(':::gif-follow\n:::', opts).html
    expect(base).toContain('src="https://cdn.example.com/x/materials/gif/follow.gif"')
    const green = renderArticle(':::gif-follow{color=green}\n:::', opts).html
    expect(green).toContain('materials/gif/follow-green.gif')
  })

  it('动图清单中的文件都存在', async () => {
    const fs = await import('node:fs')
    for (const b of blocks.filter((x) => x.category === 'gif')) {
      const html = render(b.example)
      const file = html.match(/materials\/gif\/([\w-]+\.gif)/)![1]
      expect(fs.existsSync(`public/materials/gif/${file}`), file).toBe(true)
    }
  })

  it('SVG 动画标签与属性保持正确大小写，且不含 id', () => {
    const html = render(':::svg-wave\n:::\n\n:::svg-gift-open\n惊喜\n:::')
    expect(html).toContain('<animateTransform')
    expect(html).toContain('attributeName=')
    expect(html).toContain('viewBox=')
    expect(html).toContain('begin="click"')
    expect(html).not.toMatch(/\sid=/)
  })
})

describe('整篇模板', () => {
  it.each(templates.map((t) => [t.id, t] as const))('%s 可渲染', (_id, tpl) => {
    expect(themes.some((t) => t.id === tpl.theme)).toBe(true)
    const html = render(tpl.content, tpl.theme)
    expectWechatSafe(html)
    expect(html).not.toContain('未知组件')
  })
})

describe('兼容检测', () => {
  const rules = (html: string) => lintHtml(html).map((i) => i.rule)

  it('发现文字下的渐变背景，忽略无文字的装饰渐变', () => {
    expect(rules('<section style="background: linear-gradient(90deg, #f00, #00f); color: #fff;">文字</section>')).toContain('gradient-on-text')
    expect(rules('<section style="background: radial-gradient(#f00, #00f);"><span>嵌套文字</span></section>')).toContain('gradient-on-text')
    expect(rules('<section style="height: 2px; background: linear-gradient(to right, transparent, #f00);"></section>')).toEqual([])
    // 文字在内层纯色卡片上，渐变只是外框
    expect(rules('<section style="padding: 2px; background: linear-gradient(#f00, #00f);"><section style="background: #fff;">文字</section></section>')).toEqual([])
  })

  it('发现过小的行高，忽略不含文字的 SVG 包裹', () => {
    expect(rules('<section style="font-size: 30px; line-height: 1;">01</section>')).toContain('low-line-height')
    expect(rules('<section style="font-size: 17px; line-height: 20px;">✓</section>')).toContain('low-line-height')
    expect(rules('<section style="line-height: 1;"><p style="line-height: 1.75;">正文</p></section>')).toEqual([])
    expect(rules('<section style="line-height: 0;"><svg viewBox="0 0 10 10"><text>SVG 文字</text></svg></section>')).toEqual([])
  })

  it('检查图片地址与外链', () => {
    const issues = lintHtml(
      '<img src="http://localhost:5178/materials/gif/follow.gif"><img src="img/a.png"><img src="https://picsum.photos/a.png">' +
        '<a href="https://example.com">外链</a><a href="https://mp.weixin.qq.com/s/abc">公众号文章</a>',
    )
    expect(issues.map((i) => i.rule).sort()).toEqual(['external-link', 'gif-not-public', 'local-image'])
    expect(issues[0].level).toBe('error')
  })

  const STYLE_RULES: LintRule[] = ['gradient-on-text', 'low-line-height']
  const styleIssues = (html: string) => lintHtml(html).filter((i) => STYLE_RULES.includes(i.rule))

  it.each(themes.map((t) => [t.id] as const))('主题 %s 下所有素材没有渐变文字背景和过小行高', (id) => {
    const found = [SAMPLE, ...blocks.map((b) => b.example)].flatMap((md) =>
      styleIssues(render(md, id)).map((i) => `${md.split('\n')[0]} → ${i.rule}：${i.snippet}`),
    )
    expect(found).toEqual([])
  })

  it.each(templates.map((t) => [t.id, t] as const))('模板 %s 没有渐变文字背景和过小行高', (_id, tpl) => {
    expect(styleIssues(render(tpl.content, tpl.theme))).toEqual([])
  })
})

describe('AI 技能包', async () => {
  const fs = await import('node:fs')
  const dirs = fs.readdirSync('skills').filter((d) => fs.existsSync(`skills/${d}/SKILL.md`))
  const known = new Map(blocks.map((b) => [b.id, Object.keys(parseAttrs(b.example.split('\n')[0].match(/(\{.*\})/)?.[1]))]))

  it('至少有一个技能包', () => {
    expect(dirs.length).toBeGreaterThan(0)
  })

  it.each(dirs)('%s 引用的素材 id 与参数都存在', (dir) => {
    const text = fs.readFileSync(`skills/${dir}/SKILL.md`, 'utf8')
    expect(text).toMatch(/^---\nname: [\w-]+\ndescription: .+\n---\n/)
    const wrong: string[] = []
    for (const [, id, attrs] of text.matchAll(/(?:`|:::)([a-z][a-z0-9]*(?:-[a-z0-9]+)+)(\{[^`\n]*\})?/g)) {
      const params = known.get(id)
      if (!params) {
        wrong.push(`未知素材 ${id}`)
        continue
      }
      for (const key of Object.keys(parseAttrs(attrs))) {
        if (!params.includes(key) && key !== 'color' && key !== 'width') wrong.push(`${id} 没有参数 ${key}`)
      }
    }
    expect(wrong).toEqual([])
  })

  it.each(dirs.filter((d) => fs.existsSync(`skills/${d}/example.md`)))('%s 示例文章可渲染且通过兼容检测', (dir) => {
    const html = render(fs.readFileSync(`skills/${dir}/example.md`, 'utf8'))
    expectWechatSafe(html)
    expect(html).not.toContain('未知组件')
    expect(html).not.toContain(':::')
    const issues = lintHtml(html).filter((i) => i.rule === 'gradient-on-text' || i.rule === 'low-line-height')
    expect(issues).toEqual([])
  })
})
