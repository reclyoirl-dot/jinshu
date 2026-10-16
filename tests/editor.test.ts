import { createHmac } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { getBlock } from '../src/blocks'
import { blockAtLine, buildOpenLine, findBlocks, paramFields, stringifyAttrs } from '../src/core/blockSyntax'
import { parseAttrs } from '../src/core/render'
import {
  DEFAULT_IMAGE_HOST,
  imageHostProblem,
  makeKey,
  mergeImageHost,
  ossPolicy,
  qiniuToken,
  uploadImage,
  type ImageHostConfig,
} from '../src/core/imageHost'

describe('素材语法解析', () => {
  const src = [
    '---',
    'theme: simple',
    '---',
    '# 标题', // 4
    '',
    ':::title-numbered{no="01" sub="SUB"}', // 6
    '标题文字',
    ':::',
    '',
    '```md', // 10
    ':::title-pill',
    '代码块里的不算',
    ':::',
    '```',
    '',
    ':::card-border', // 16
    ':::title-pill{color=#ff0000}', // 17
    '嵌套',
    ':::',
    '正文',
    ':::', // 21
    '',
    ':::quote-big', // 23
    '没有闭合',
  ].join('\n')

  it('与渲染器一致地配对、支持嵌套并跳过代码块', () => {
    const blocks = findBlocks(src)
    expect(blocks.map((b) => [b.id, b.openLine, b.closeLine, b.depth])).toEqual([
      ['title-numbered', 6, 8, 0],
      ['card-border', 16, 21, 0],
      ['title-pill', 17, 19, 1],
      ['quote-big', 23, null, 0],
    ])
    expect(blocks[0].params).toEqual({ no: '01', sub: 'SUB' })
    expect(blocks[3].endLine).toBe(24)
  })

  it('找到光标所在的最内层素材', () => {
    expect(blockAtLine(src, 7)?.id).toBe('title-numbered')
    expect(blockAtLine(src, 18)?.id).toBe('title-pill')
    expect(blockAtLine(src, 20)?.id).toBe('card-border')
    expect(blockAtLine(src, 12)).toBeNull()
    expect(blockAtLine(src, 4)).toBeNull()
    expect(blockAtLine(src, 24)?.id).toBe('quote-big')
  })

  it('参数写回后可以被原样解析', () => {
    const entries: [string, string][] = [
      ['title', '他说"你好"'],
      ['sub', `it's "ok"`],
      ['color', '#ff6600'],
    ]
    const line = buildOpenLine('card-topbar', entries)
    expect(line).toBe(`:::card-topbar{title='他说"你好"' sub="it's ”ok”" color="#ff6600"}`)
    expect(parseAttrs(line.slice(line.indexOf('{')))).toEqual({ title: '他说"你好"', sub: `it's ”ok”`, color: '#ff6600' })
    expect(stringifyAttrs([])).toBe('')
  })

  it('参数字段：优先用声明，回退到示例推断，并总能设置颜色', () => {
    const declared = paramFields(getBlock('qx-true-false'), {})
    expect(declared.find((f) => f.key === 'answer')?.type).toBe('select')

    const inferred = paramFields(getBlock('b-ticket-stub'), { extra: '1' })
    expect(inferred.map((f) => f.key)).toEqual(['label', 'serial', 'note', 'color', 'extra'])
    expect(inferred.find((f) => f.key === 'color')?.type).toBe('color')

    const gif = paramFields(getBlock('gif-follow'), {})
    expect(gif[0]).toMatchObject({ key: 'color', type: 'select' })
    expect(gif.filter((f) => f.key === 'color')).toHaveLength(1)
  })
})

describe('图床', () => {
  const file = (type = 'image/png', name = 'image.png') => new File([new Uint8Array([137, 80, 78, 71])], name, { type })

  it('检查配置是否完整', () => {
    expect(imageHostProblem(DEFAULT_IMAGE_HOST)).toContain('还没有配置图床')
    const cfg: ImageHostConfig = { ...DEFAULT_IMAGE_HOST, provider: 'github' }
    expect(imageHostProblem(cfg)).toBe('GitHub 图床还缺少：用户名、仓库名、Token')
    expect(imageHostProblem({ ...cfg, github: { ...cfg.github, owner: 'a', repo: 'b', token: 't' } })).toBeNull()
  })

  it('合并旧版本的配置', () => {
    const merged = mergeImageHost({ provider: 'qiniu', qiniu: { accessKey: 'ak' } as ImageHostConfig['qiniu'] })
    expect(merged.provider).toBe('qiniu')
    expect(merged.qiniu.accessKey).toBe('ak')
    expect(merged.qiniu.region).toBe('z0')
    expect(merged.github.branch).toBe('main')
  })

  it('生成存储路径', () => {
    const key = makeKey('/img/', file('image/jpeg', 'a.jpeg'), new Date(2026, 9, 16, 9, 5, 7))
    expect(key).toMatch(/^img\/20261016-090507-[a-z0-9]{1,4}\.jpg$/)
    expect(makeKey('', file('', 'x.webp'))).toMatch(/^\d{8}-\d{6}-\w+\.webp$/)
  })

  it('七牛上传凭证与官方算法一致', async () => {
    const token = await qiniuToken({ accessKey: 'ak', secretKey: 'sk', bucket: 'bkt' }, 'a/b.png', 1_700_000_000_000)
    const [ak, sign, encoded] = token.split(':')
    expect(ak).toBe('ak')
    const policy = JSON.parse(Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    expect(policy).toEqual({ scope: 'bkt:a/b.png', deadline: 1_700_003_600 })
    const expected = createHmac('sha1', 'sk').update(encoded).digest('base64').replace(/\+/g, '-').replace(/\//g, '_')
    expect(sign).toBe(expected)
  })

  it('阿里云 OSS Policy 签名与官方算法一致', async () => {
    const { policy, signature } = await ossPolicy({ bucket: 'bkt', accessKeySecret: 'secret' }, 'x/y.png', 0)
    const decoded = JSON.parse(Buffer.from(policy, 'base64').toString())
    expect(decoded.conditions).toContainEqual({ bucket: 'bkt' })
    expect(decoded.conditions).toContainEqual(['eq', '$key', 'x/y.png'])
    expect(signature).toBe(createHmac('sha1', 'secret').update(policy).digest('base64'))
  })

  it('GitHub 上传后返回 jsDelivr 地址', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 201 }))
    const cfg: ImageHostConfig = {
      ...DEFAULT_IMAGE_HOST,
      provider: 'github',
      github: { owner: 'me', repo: 'pics', branch: 'main', path: 'images', token: 'tok' },
    }
    const url = await uploadImage(file(), cfg, fetchMock)
    expect(url).toMatch(/^https:\/\/cdn\.jsdelivr\.net\/gh\/me\/pics@main\/images\/\d{8}-\d{6}-\w+\.png$/)
    const [reqUrl, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(reqUrl).toMatch(/^https:\/\/api\.github\.com\/repos\/me\/pics\/contents\/images\//)
    expect(init.method).toBe('PUT')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok')
    expect(JSON.parse(init.body as string)).toMatchObject({ branch: 'main', content: 'iVBORw==' })
  })

  it('上传失败时给出可读的原因', async () => {
    const cfg: ImageHostConfig = {
      ...DEFAULT_IMAGE_HOST,
      provider: 'github',
      github: { owner: 'me', repo: 'pics', branch: 'main', path: '', token: 'bad' },
    }
    await expect(uploadImage(file(), cfg, async () => new Response('{"message":"Bad credentials"}', { status: 401 }))).rejects.toThrow(
      'Token 无效',
    )
    await expect(uploadImage(file(), DEFAULT_IMAGE_HOST)).rejects.toThrow('还没有配置图床')
  })
})
