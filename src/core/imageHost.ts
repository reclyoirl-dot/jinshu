/**
 * 图床：浏览器直传，不经过任何中转服务器。
 * 七牛 / 阿里云的上传凭证在前端用 WebCrypto 现场签名，所以密钥只存在用户自己的浏览器里。
 */

export type ImageHostProvider = 'none' | 'github' | 'qiniu' | 'aliyun'

export interface GithubHostConfig {
  owner: string
  repo: string
  branch: string
  /** 仓库内的存放目录 */
  path: string
  token: string
}

export interface QiniuHostConfig {
  accessKey: string
  secretKey: string
  bucket: string
  /** 存储区域，见 QINIU_REGIONS */
  region: string
  /** 绑定的访问域名，例如 https://img.example.com */
  domain: string
  path: string
}

export interface AliyunHostConfig {
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  /** 地域，例如 oss-cn-hangzhou */
  region: string
  /** 可选的自定义域名；留空使用 bucket 默认域名 */
  domain: string
  path: string
}

export interface ImageHostConfig {
  provider: ImageHostProvider
  github: GithubHostConfig
  qiniu: QiniuHostConfig
  aliyun: AliyunHostConfig
}

export const DEFAULT_IMAGE_HOST: ImageHostConfig = {
  provider: 'none',
  github: { owner: '', repo: '', branch: 'main', path: 'images', token: '' },
  qiniu: { accessKey: '', secretKey: '', bucket: '', region: 'z0', domain: '', path: 'jinshu' },
  aliyun: { accessKeyId: '', accessKeySecret: '', bucket: '', region: 'oss-cn-hangzhou', domain: '', path: 'jinshu' },
}

/** 合并本地存储里的旧配置，保证新增字段有默认值 */
export function mergeImageHost(saved: Partial<ImageHostConfig> | undefined): ImageHostConfig {
  return {
    provider: saved?.provider ?? DEFAULT_IMAGE_HOST.provider,
    github: { ...DEFAULT_IMAGE_HOST.github, ...saved?.github },
    qiniu: { ...DEFAULT_IMAGE_HOST.qiniu, ...saved?.qiniu },
    aliyun: { ...DEFAULT_IMAGE_HOST.aliyun, ...saved?.aliyun },
  }
}

export const QINIU_REGIONS: { value: string; label: string; host: string }[] = [
  { value: 'z0', label: '华东-浙江', host: 'https://up-z0.qiniup.com' },
  { value: 'cn-east-2', label: '华东-浙江2', host: 'https://up-cn-east-2.qiniup.com' },
  { value: 'z1', label: '华北-河北', host: 'https://up-z1.qiniup.com' },
  { value: 'z2', label: '华南-广东', host: 'https://up-z2.qiniup.com' },
  { value: 'na0', label: '北美-洛杉矶', host: 'https://up-na0.qiniup.com' },
  { value: 'as0', label: '亚太-新加坡', host: 'https://up-as0.qiniup.com' },
]

export const IMAGE_HOST_NAMES: Record<ImageHostProvider, string> = {
  none: '未启用',
  github: 'GitHub',
  qiniu: '七牛云',
  aliyun: '阿里云 OSS',
}

const REQUIRED: { [K in Exclude<ImageHostProvider, 'none'>]: [keyof ImageHostConfig[K], string][] } = {
  github: [
    ['owner', '用户名'],
    ['repo', '仓库名'],
    ['branch', '分支'],
    ['token', 'Token'],
  ],
  qiniu: [
    ['accessKey', 'AccessKey'],
    ['secretKey', 'SecretKey'],
    ['bucket', '空间名称'],
    ['domain', '访问域名'],
  ],
  aliyun: [
    ['accessKeyId', 'AccessKey ID'],
    ['accessKeySecret', 'AccessKey Secret'],
    ['bucket', 'Bucket'],
    ['region', '地域'],
  ],
}

/** 图床不可用的原因；可用时返回 null */
export function imageHostProblem(cfg: ImageHostConfig): string | null {
  if (cfg.provider === 'none') return '还没有配置图床，请先在「主题 → 图床设置」里选择并填写'
  const conf = cfg[cfg.provider] as unknown as Record<string, string>
  const missing = REQUIRED[cfg.provider].filter(([k]) => !conf[k as string]?.trim()).map(([, label]) => label)
  return missing.length ? `${IMAGE_HOST_NAMES[cfg.provider]} 图床还缺少：${missing.join('、')}` : null
}

/* ---------- 工具函数 ---------- */

const trimSlash = (s: string) => s.trim().replace(/^\/+|\/+$/g, '')

const withProtocol = (domain: string) => {
  const d = domain.trim().replace(/\/+$/, '')
  return /^https?:\/\//i.test(d) ? d : `https://${d}`
}

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
}

export function extOf(file: { type: string; name?: string }): string {
  const fromName = file.name?.match(/\.([a-z0-9]{2,5})$/i)?.[1]?.toLowerCase()
  return MIME_EXT[file.type] ?? (fromName === 'jpeg' ? 'jpg' : fromName) ?? 'png'
}

/** 生成存储路径：目录/20261016-153012-ab12.png */
export function makeKey(dir: string, file: { type: string; name?: string }, now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}`
  const rand = Math.random().toString(36).slice(2, 6)
  const prefix = trimSlash(dir)
  return `${prefix ? `${prefix}/` : ''}${stamp}-${rand}.${extOf(file)}`
}

export function bytesToBase64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin)
}

const toUrlSafe = (b64: string) => b64.replace(/\+/g, '-').replace(/\//g, '_')

const utf8Base64 = (s: string) => bytesToBase64(new TextEncoder().encode(s))

/** HMAC-SHA1，返回 base64 */
export async function hmacSha1Base64(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return bytesToBase64(new Uint8Array(sig))
}

async function readError(res: Response): Promise<string> {
  const text = await res.text().catch(() => '')
  try {
    const data = JSON.parse(text) as { message?: string; error?: string }
    return data.message || data.error || text
  } catch {
    // 阿里云返回 XML
    return text.match(/<Message>([^<]*)<\/Message>/)?.[1] || text || res.statusText
  }
}

type Fetch = typeof fetch

/** fetch 本身失败（没有响应）多半是跨域（CORS）没配好或网络问题 */
async function send(f: Fetch, url: string, init: RequestInit): Promise<Response> {
  try {
    return await f(url, init)
  } catch {
    throw new Error('网络请求失败，请检查网络或图床的跨域（CORS）设置')
  }
}

async function readBytes(file: Blob): Promise<Uint8Array> {
  if (typeof file.arrayBuffer === 'function') return new Uint8Array(await file.arrayBuffer())
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

/* ---------- GitHub ---------- */

async function uploadGithub(file: Blob & { name?: string }, c: GithubHostConfig, f: Fetch): Promise<string> {
  const key = makeKey(c.path, file)
  const owner = c.owner.trim()
  const repo = c.repo.trim()
  const branch = c.branch.trim() || 'main'
  const content = bytesToBase64(await readBytes(file))
  const res = await send(f, `https://api.github.com/repos/${owner}/${repo}/contents/${key.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${c.token.trim()}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `upload ${key.split('/').pop()} via jinshu`, content, branch }),
  })
  if (!res.ok) {
    const msg = await readError(res)
    if (res.status === 401) throw new Error('GitHub Token 无效或已过期')
    if (res.status === 404) throw new Error('找不到仓库，或 Token 没有该仓库的写入权限')
    throw new Error(`GitHub 返回 ${res.status}：${msg}`)
  }
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${key}`
}

/* ---------- 七牛云：表单上传 + 前端生成上传凭证 ---------- */

export async function qiniuToken(c: Pick<QiniuHostConfig, 'accessKey' | 'secretKey' | 'bucket'>, key: string, now = Date.now()) {
  const policy = JSON.stringify({ scope: `${c.bucket.trim()}:${key}`, deadline: Math.floor(now / 1000) + 3600 })
  const encoded = toUrlSafe(utf8Base64(policy))
  const sign = toUrlSafe(await hmacSha1Base64(c.secretKey.trim(), encoded))
  return `${c.accessKey.trim()}:${sign}:${encoded}`
}

async function uploadQiniu(file: Blob & { name?: string }, c: QiniuHostConfig, f: Fetch): Promise<string> {
  const key = makeKey(c.path, file)
  const host = QINIU_REGIONS.find((r) => r.value === c.region)?.host ?? QINIU_REGIONS[0].host
  const form = new FormData()
  form.append('token', await qiniuToken(c, key))
  form.append('key', key)
  form.append('file', file, key.split('/').pop())
  const res = await send(f, host, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`七牛返回 ${res.status}：${await readError(res)}`)
  const data = (await res.json()) as { key?: string }
  return `${withProtocol(c.domain)}/${data.key ?? key}`
}

/* ---------- 阿里云 OSS：PostObject 表单直传 ---------- */

export const normalizeOssRegion = (region: string) => {
  const r = region.trim().replace(/\.aliyuncs\.com$/, '')
  return r.startsWith('oss-') ? r : `oss-${r}`
}

export async function ossPolicy(c: Pick<AliyunHostConfig, 'bucket' | 'accessKeySecret'>, key: string, now = Date.now()) {
  const policy = utf8Base64(
    JSON.stringify({
      expiration: new Date(now + 3600_000).toISOString(),
      conditions: [{ bucket: c.bucket.trim() }, ['eq', '$key', key], ['content-length-range', 0, 50 * 1024 * 1024]],
    }),
  )
  return { policy, signature: await hmacSha1Base64(c.accessKeySecret.trim(), policy) }
}

async function uploadAliyun(file: Blob & { name?: string }, c: AliyunHostConfig, f: Fetch): Promise<string> {
  const key = makeKey(c.path, file)
  const endpoint = `https://${c.bucket.trim()}.${normalizeOssRegion(c.region)}.aliyuncs.com`
  const { policy, signature } = await ossPolicy(c, key)
  const form = new FormData()
  form.append('key', key)
  form.append('OSSAccessKeyId', c.accessKeyId.trim())
  form.append('policy', policy)
  form.append('Signature', signature)
  form.append('success_action_status', '200')
  if (file.type) form.append('Content-Type', file.type)
  // file 必须是最后一个字段
  form.append('file', file, key.split('/').pop())
  const res = await send(f, endpoint, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`阿里云 OSS 返回 ${res.status}：${await readError(res)}`)
  return `${c.domain.trim() ? withProtocol(c.domain) : endpoint}/${key}`
}

/** 上传一张图片，返回公网地址 */
export async function uploadImage(file: Blob & { name?: string }, cfg: ImageHostConfig, f: Fetch = fetch): Promise<string> {
  const problem = imageHostProblem(cfg)
  if (problem) throw new Error(problem)
  if (cfg.provider === 'github') return uploadGithub(file, cfg.github, f)
  if (cfg.provider === 'qiniu') return uploadQiniu(file, cfg.qiniu, f)
  return uploadAliyun(file, cfg.aliyun, f)
}
