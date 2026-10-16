import { CircleCheck, CircleDashed, LockKeyhole } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IMAGE_HOST_NAMES, QINIU_REGIONS, imageHostProblem, type ImageHostProvider } from '../core/imageHost'
import { useStudio } from '../store'
import { useUi } from '../store/ui'
import { SectionTitle, Segmented, cx } from './ui'

const input =
  'h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </label>
  )
}

function Text({
  value,
  onChange,
  placeholder,
  secret,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  secret?: boolean
}) {
  return (
    <input
      className={input}
      type={secret ? 'password' : 'text'}
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      spellCheck={false}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

const Hint = ({ children }: { children: ReactNode }) => (
  <p className="m-0 text-[11px] leading-relaxed text-slate-400">{children}</p>
)

/** 主题面板里的「图床设置」：配置只保存在本机浏览器 */
export default function ImageHostSettings() {
  const cfg = useStudio((s) => s.imageHost)
  const { setImageHostProvider, updateImageHost } = useStudio.getState()
  const focus = useUi((s) => s.focusSection)
  const ref = useRef<HTMLElement>(null)
  const [flash, setFlash] = useState(false)

  // 从编辑器引导过来时，滚动到这里并闪一下
  useEffect(() => {
    if (focus !== 'imageHost') return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setFlash(true)
    useUi.getState().clearFocusSection()
    const t = setTimeout(() => setFlash(false), 1600)
    return () => clearTimeout(t)
  }, [focus])

  const problem = cfg.provider === 'none' ? null : imageHostProblem(cfg)
  const gh = cfg.github
  const qn = cfg.qiniu
  const oss = cfg.aliyun

  const clearSecrets = () => {
    updateImageHost('github', { token: '' })
    updateImageHost('qiniu', { secretKey: '' })
    updateImageHost('aliyun', { accessKeySecret: '' })
  }

  return (
    <section
      ref={ref}
      className={cx(
        'scroll-mt-4 space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow dark:border-white/10 dark:bg-slate-800',
        flash && 'ring-2 ring-brand',
      )}
    >
      <SectionTitle>图床设置</SectionTitle>
      <Segmented<ImageHostProvider>
        size="sm"
        value={cfg.provider}
        onChange={setImageHostProvider}
        options={(['none', 'github', 'qiniu', 'aliyun'] as const).map((p) => ({
          value: p,
          label: p === 'none' ? '不使用' : p === 'aliyun' ? '阿里云' : IMAGE_HOST_NAMES[p],
        }))}
      />

      <div className="flex gap-2 rounded-lg bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
        <LockKeyhole size={14} className="mt-px shrink-0" />
        <span>
          密钥<b>只保存在这台电脑的浏览器本地</b>，不会发送给锦书或任何第三方；上传时浏览器直接连接图床。
          请勿在公共电脑上填写，并尽量使用权限最小的密钥。
        </span>
      </div>

      {cfg.provider === 'none' && <Hint>配置图床后，可以在编辑器里直接粘贴截图、拖入图片或点工具栏「上传图片」，自动换成公网链接。</Hint>}

      {cfg.provider === 'github' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Row label="用户名 / 组织">
              <Text value={gh.owner} onChange={(owner) => updateImageHost('github', { owner })} placeholder="your-name" />
            </Row>
            <Row label="仓库名">
              <Text value={gh.repo} onChange={(repo) => updateImageHost('github', { repo })} placeholder="images" />
            </Row>
            <Row label="分支">
              <Text value={gh.branch} onChange={(branch) => updateImageHost('github', { branch })} placeholder="main" />
            </Row>
            <Row label="存放目录">
              <Text value={gh.path} onChange={(path) => updateImageHost('github', { path })} placeholder="images" />
            </Row>
          </div>
          <Row label="Token">
            <Text secret value={gh.token} onChange={(token) => updateImageHost('github', { token })} placeholder="github_pat_…" />
          </Row>
          <Hint>
            建议创建只授权这个仓库、权限为 Contents 读写的 Fine-grained Token。仓库需公开，图片通过 jsDelivr 加速：
            <code className="break-all text-slate-500">
              https://cdn.jsdelivr.net/gh/{gh.owner || '用户名'}/{gh.repo || '仓库'}@{gh.branch || 'main'}/…
            </code>
          </Hint>
        </div>
      )}

      {cfg.provider === 'qiniu' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Row label="AccessKey">
              <Text value={qn.accessKey} onChange={(accessKey) => updateImageHost('qiniu', { accessKey })} />
            </Row>
            <Row label="SecretKey">
              <Text secret value={qn.secretKey} onChange={(secretKey) => updateImageHost('qiniu', { secretKey })} />
            </Row>
            <Row label="空间名称">
              <Text value={qn.bucket} onChange={(bucket) => updateImageHost('qiniu', { bucket })} />
            </Row>
            <Row label="存储区域">
              <select className={input} value={qn.region} onChange={(e) => updateImageHost('qiniu', { region: e.target.value })}>
                {QINIU_REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Row>
          </div>
          <Row label="访问域名">
            <Text value={qn.domain} onChange={(domain) => updateImageHost('qiniu', { domain })} placeholder="https://img.example.com" />
          </Row>
          <Row label="存放目录">
            <Text value={qn.path} onChange={(path) => updateImageHost('qiniu', { path })} placeholder="jinshu" />
          </Row>
          <Hint>上传凭证在浏览器里现场签名。访问域名需已绑定到该空间，且空间为公开空间。</Hint>
        </div>
      )}

      {cfg.provider === 'aliyun' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Row label="AccessKey ID">
              <Text value={oss.accessKeyId} onChange={(accessKeyId) => updateImageHost('aliyun', { accessKeyId })} />
            </Row>
            <Row label="AccessKey Secret">
              <Text secret value={oss.accessKeySecret} onChange={(accessKeySecret) => updateImageHost('aliyun', { accessKeySecret })} />
            </Row>
            <Row label="Bucket">
              <Text value={oss.bucket} onChange={(bucket) => updateImageHost('aliyun', { bucket })} />
            </Row>
            <Row label="地域">
              <Text value={oss.region} onChange={(region) => updateImageHost('aliyun', { region })} placeholder="oss-cn-hangzhou" />
            </Row>
          </div>
          <Row label="自定义域名（可选）">
            <Text value={oss.domain} onChange={(domain) => updateImageHost('aliyun', { domain })} placeholder="留空使用 Bucket 默认域名" />
          </Row>
          <Row label="存放目录">
            <Text value={oss.path} onChange={(path) => updateImageHost('aliyun', { path })} placeholder="jinshu" />
          </Row>
          <Hint>
            需要在 Bucket 的「跨域设置」里允许当前网站来源与 POST 方法，Bucket 读写权限设为公共读。建议使用只有该 Bucket
            写入权限的 RAM 子账号密钥。
          </Hint>
        </div>
      )}

      {cfg.provider !== 'none' && (
        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-white/10">
          <span className={cx('inline-flex items-center gap-1 text-[11px]', problem ? 'text-slate-400' : 'text-emerald-600')}>
            {problem ? <CircleDashed size={13} /> : <CircleCheck size={13} />}
            {problem ? problem.replace(/^.*图床/, '') : '已就绪：粘贴或拖入图片即可上传'}
          </span>
          <button className="shrink-0 border-0 bg-transparent p-0 text-[11px] text-slate-400 hover:text-red-500" onClick={clearSecrets}>
            清除密钥
          </button>
        </div>
      )}
    </section>
  )
}
