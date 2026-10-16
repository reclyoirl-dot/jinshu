import { Check, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { FONT_SIZES, PRESET_COLORS } from '../config'
import { defaultAssetBase } from '../core/assets'
import { renderArticle } from '../core/render'
import { useStudio } from '../store'
import { themes } from '../themes'
import { useResolvedStyle } from '../useRendered'
import ImageHostSettings from './ImageHostSettings'
import { SectionTitle, Segmented, Switch, Thumb, cx } from './ui'

const THEME_SAMPLE = '## 标题样式\n\n正文内容，**重点强调**与`行内代码`。\n\n> 引用文字的样子'

const input =
  'h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100'

export default function ThemePanel() {
  const style = useResolvedStyle()
  const themeId = useStudio((s) => s.themeId)
  const custom = useStudio((s) => s.primary)
  const accountName = useStudio((s) => s.accountName)
  const assetBase = useStudio((s) => s.assetBase)
  const { setTheme, setPrimary, setFontSize, setFootnoteLinks, setAccountName, setAssetBase } = useStudio.getState()

  const samples = useMemo(
    () =>
      Object.fromEntries(
        themes.map((t) => [
          t.id,
          renderArticle(THEME_SAMPLE, {
            theme: t,
            primary: t.id === style.theme.id ? style.primary : t.defaults.primary,
            fontSize: t.defaults.fontSize,
            footnoteLinks: false,
          }).html,
        ]),
      ),
    [style.theme.id, style.primary],
  )

  return (
    <div className="space-y-5 p-4">
      <section className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-800">
        <div>
          <SectionTitle
            extra={
              custom && (
                <button className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-xs text-brand" onClick={() => setPrimary(null)}>
                  <RotateCcw size={12} /> 主题默认
                </button>
              )
            }
          >
            主色
          </SectionTitle>
          <div className="grid grid-cols-7 gap-2">
            {PRESET_COLORS.map((c) => {
              const active = style.primary.toLowerCase() === c
              return (
                <button
                  key={c}
                  title={c}
                  onClick={() => setPrimary(c)}
                  className={cx(
                    'flex aspect-square items-center justify-center rounded-full border-0 p-0 transition-transform hover:scale-110',
                    active && 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800',
                  )}
                  style={{ background: c, ['--tw-ring-color' as string]: c }}
                >
                  {active && <Check size={14} color="#fff" strokeWidth={3} />}
                </button>
              )
            })}
            <label
              className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-full"
              title="自定义颜色"
              style={{ background: 'conic-gradient(#f5455c, #ff8a00, #ffd400, #07c160, #1e80ff, #7c5cff, #f5455c)' }}
            >
              <input type="color" value={style.primary} onChange={(e) => setPrimary(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
              <span className="h-3 w-3 rounded-full bg-white" />
            </label>
          </div>
        </div>

        <div>
          <SectionTitle>正文字号</SectionTitle>
          <Segmented
            size="sm"
            value={String(style.fontSize)}
            options={FONT_SIZES.map((n) => ({ value: String(n), label: `${n}px` }))}
            onChange={(v) => setFontSize(Number(v))}
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span>
            <span className="block text-sm text-slate-700 dark:text-slate-200">外链转文末参考链接</span>
            <span className="block text-[11px] text-slate-400">公众号正文不支持外部链接</span>
          </span>
          <Switch checked={style.footnoteLinks} onChange={setFootnoteLinks} />
        </label>

        <div>
          <SectionTitle>预览中的公众号名称</SectionTitle>
          <input className={input} value={accountName} onChange={(e) => setAccountName(e.target.value)} maxLength={20} />
        </div>

        <div>
          <SectionTitle>动图素材地址</SectionTitle>
          <input
            className={input}
            value={assetBase ?? ''}
            placeholder={defaultAssetBase()}
            onChange={(e) => setAssetBase(e.target.value)}
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
            公众号会从这个地址抓取 GIF。留空则使用当前站点；也可以用 jsDelivr：
            <code className="break-all text-slate-500">https://cdn.jsdelivr.net/gh/用户名/仓库@main/public/</code>
          </p>
        </div>
      </section>

      <ImageHostSettings />

      <section>
        <SectionTitle>全局主题 · {themes.length}</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => {
            const active = t.id === themeId
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cx(
                  'group relative block overflow-hidden rounded-xl border-0 bg-white p-0 text-left shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800',
                  active ? 'ring-2 ring-brand' : 'ring-slate-200/80 dark:ring-white/10',
                )}
              >
                <div className="h-[118px] overflow-hidden bg-white px-2.5 pt-1">
                  <Thumb html={samples[t.id]} zoom={0.55} />
                </div>
                <div className="flex items-center gap-1.5 border-t border-slate-100 px-2.5 py-2 dark:border-white/10">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.defaults.primary }} />
                  <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{t.name}</span>
                  {active && <Check size={14} className="ml-auto shrink-0 text-brand" />}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
