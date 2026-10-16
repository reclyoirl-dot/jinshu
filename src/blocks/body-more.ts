import type { BlockDef } from '../core/types'
import { compact, esc, extractImages, html, lines, SAMPLE_IMG, splitFirst } from './_utils'

/** 空行分段，兼容 Windows 换行。 */
const paragraphs = (raw: string) => raw.trim().split(/\r?\n\s*\r?\n/).filter(Boolean)

/** 只在第一个冒号分割，保留说明里的时间、网址。 */
function pair(line: string): { key: string; value: string } {
  const i = line.search(/[:：]/)
  return i > 0
    ? { key: line.slice(0, i).trim(), value: line.slice(i + 1).trim() }
    : { key: line, value: '' }
}

const blocks: BlockDef[] = [
  {
    id: 'b-tape-note',
    name: '胶带手记',
    category: 'body',
    tags: ['清新', '文艺', '可爱'],
    example: ':::b-tape-note{label="给周末留白"}\n把手机调成静音，去附近的花店走走。\n\n不必安排满满当当，**发呆也是一件正经事**。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 2em 10px; padding: 1px 18px 18px; background: ${ctx.color.tint(0.92)};
        box-shadow: 1px 5px 12px rgba(0,0,0,0.07); transform: rotate(-0.6deg); color: #444;
        font-size: ${ctx.fontSize}px; line-height: 1.9; overflow-wrap: anywhere;">
        <section style="width: 76px; height: 23px; margin: -11px auto 16px; transform: rotate(-3deg);
          background: repeating-linear-gradient(100deg, ${ctx.color.alpha(0.22)} 0, ${ctx.color.alpha(0.22)} 5px, ${ctx.color.alpha(0.12)} 5px, ${ctx.color.alpha(0.12)} 10px);"></section>
        <section style="font-size: 12px; letter-spacing: 2px; color: ${ctx.color.shade(0.2)}; margin-bottom: 10px;">✎ ${esc(params.label ?? '日常手记')}</section>
        ${compact(ctx.render(raw))}
      </section>`,
  },
  {
    id: 'b-folded-card',
    name: '折角收藏卡',
    category: 'body',
    tags: ['简约', '文艺', '通用'],
    example: ':::b-folded-card{label="值得收藏"}\n慢慢建立自己的生活秩序：读几页书，做一顿饭，把重要的人放在心上。\n\n那些不起眼的小事，最终会组成你喜欢的日子。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.4em 0; background: ${ctx.color.tint(0.94)}; color: #444;
        font-size: ${ctx.fontSize}px; line-height: 1.85; overflow-wrap: anywhere;">
        <section style="width: 26px; height: 26px; margin-left: auto;
          background: linear-gradient(45deg, ${ctx.color.tint(0.65)} 50%, #fff 50%);"></section>
        <section style="padding: 0 20px 20px;">
          <section style="font-size: 12px; color: ${ctx.color.shade(0.15)}; letter-spacing: 2px; margin-bottom: 10px;">${esc(params.label ?? '收藏这一页')}</section>
          ${compact(ctx.render(raw))}
          <section style="width: 28px; border-bottom: 2px solid ${ctx.color.main}; margin-top: 16px;"></section>
        </section>
      </section>`,
  },
  {
    id: 'b-ticket-stub',
    name: '周末入场票根',
    category: 'body',
    tags: ['怀旧', '旅游', '文艺'],
    example: ':::b-ticket-stub{label="生活入场券" serial="NO. 0618" note="凭好心情入场"}\n一场不用赶路的旅行\n沿着河岸散步，在老街买一杯热茶。\n\n目的地不必很远，能听见自己的心就好。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="margin: 1.4em 0; border: 1px solid ${ctx.color.tint(0.65)}; border-radius: 12px;
          background: #fff; color: #444; font-size: ${ctx.fontSize}px; line-height: 1.85; overflow-wrap: anywhere;">
          <section style="padding: 18px 20px;">
            <section style="font-size: 12px; letter-spacing: 3px; color: ${ctx.color.main}; margin-bottom: 10px;">${esc(params.label ?? '日常入场券')}</section>
            <section style="font-size: ${ctx.fontSize * 1.25}px; font-weight: bold; color: #333; margin-bottom: 10px;">${ctx.renderInline(first)}</section>
            ${compact(ctx.render(rest))}
          </section>
          <section style="border-top: 1px dashed ${ctx.color.tint(0.5)}; padding: 12px 20px; background: ${ctx.color.tint(0.96)}; border-radius: 0 0 12px 12px;">
            <section style="font-size: 12px; color: ${ctx.color.shade(0.2)}; letter-spacing: 2px;">${esc(params.serial ?? 'NO. 0001')}</section>
            <section style="font-size: 12px; color: #999; margin-top: 3px;">${esc(params.note ?? '愿你尽兴而归')}</section>
          </section>
        </section>`
    },
  },
  {
    id: 'b-stat-ledger',
    name: '大字数据账本',
    category: 'body',
    tags: ['商务', '企业', '科技'],
    example: ':::b-stat-ledger{title="把改变写成数字"}\n98%：试读者完成了本期阅读计划\n3 倍：共读小组的月均交流次数增长\n21 天：从第一本书开始，养成阅读习惯\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.5em 0; border-top: 3px solid ${ctx.color.main}; overflow-wrap: anywhere;">
        <section style="padding: 12px 0 4px; font-size: 12px; letter-spacing: 2px; color: #666;">${esc(params.title ?? '数字里的进展')}</section>
        ${lines(raw).map((line) => {
          const { key, value } = pair(line)
          return html`
            <section style="padding: 16px 0; border-bottom: 1px solid #eee;">
              <section style="font-size: 38px; line-height: 1.3; font-weight: 800; letter-spacing: -1px; color: ${ctx.color.main}; font-family: Arial, sans-serif;">${ctx.renderInline(key)}</section>
              ${value && html`<section style="margin-top: 7px; font-size: ${ctx.fontSize * 0.92}px; line-height: 1.7; color: #666;">${ctx.renderInline(value)}</section>`}
            </section>`
        })}
      </section>`,
  },
  {
    id: 'b-checklist',
    name: '今日完成清单',
    category: 'body',
    tags: ['简约', '教程', '教育'],
    example: ':::b-checklist{title="出发前，检查这三件事"}\n带上水杯，把轻装出行留给自己\n确认车次与集合地点，提前十分钟到达\n下载离线地图，为山里的弱信号留个后手\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.4em 0; padding: 18px; border: 1px solid #eee; border-radius: 10px; overflow-wrap: anywhere;">
        <section style="font-size: ${ctx.fontSize * 1.05}px; font-weight: bold; color: #333; margin-bottom: 12px;">${esc(params.title ?? '把小事一一做好')}</section>
        ${lines(raw).map((line, i) => html`
          <section style="display: flex; align-items: flex-start; padding: 10px 0; ${i ? 'border-top: 1px solid #eee;' : ''}">
            <span style="flex: 0 0 22px; height: 22px; line-height: 22px; text-align: center; margin: 2px 10px 0 0;
              border-radius: 6px; background: ${ctx.color.tint(0.88)}; color: ${ctx.color.shade(0.15)}; font-size: 14px;">✓</span>
            <section style="flex: 1; min-width: 0; color: #555; font-size: ${ctx.fontSize}px; line-height: 1.8;">${ctx.renderInline(line.replace(/^(?:[-*]\s+(?:\[[ xX]\]\s*)?|✓\s*)/, ''))}</section>
          </section>`)}
      </section>`,
  },
  {
    id: 'b-pros-cons',
    name: '两面观察对比',
    category: 'body',
    tags: ['简约', '教程', '商务'],
    example: ':::b-pros-cons{pros="值得选择" cons="需要考虑"}\n轻便易携带，适合每天通勤\n纸张平整，钢笔书写也不易洇墨\n\n内页不可替换，需要整本归档\n封面较软，建议搭配保护套使用\n:::',
    render: ({ params, raw, ctx }) => {
      const [pros = '', ...cons] = paragraphs(raw)
      return html`
        <section style="display: flex; margin: 1.4em 0; border: 1px solid #eee; border-radius: 8px; overflow: hidden; overflow-wrap: anywhere;">
          ${[pros, cons.join('\n\n')].map((part, i) => html`
            <section style="flex: 1; min-width: 0; padding: 14px 12px; background: ${i ? '#fafafa' : ctx.color.tint(0.94)}; ${i ? 'border-left: 1px solid #eee;' : ''}">
              <section style="font-size: 12px; color: ${i ? '#666' : ctx.color.shade(0.2)}; letter-spacing: 1px; margin-bottom: 12px; font-weight: bold;">${i ? '−' : '＋'} ${esc(i ? params.cons ?? '需要留意' : params.pros ?? '可取之处')}</section>
              ${lines(part).map((line) => html`<section style="font-size: ${ctx.fontSize * 0.92}px; line-height: 1.8; color: #555; margin-top: 10px;">${ctx.renderInline(line)}</section>`)}
            </section>`)}
        </section>`
    },
  },
  {
    id: 'b-step-cards',
    name: '行动步骤卡组',
    category: 'body',
    tags: ['教程', '编号', '教育'],
    example: ':::b-step-cards{title="三步整理阅读笔记"}\n先写下最触动你的那句话，不急着摘录整页。\n用自己的话解释它，再补上一个生活中的例子。\n把笔记放回主题目录，让下次的自己更容易找到。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.4em 0; overflow-wrap: anywhere;">
        <section style="color: #333; font-weight: bold; font-size: ${ctx.fontSize * 1.05}px; margin-bottom: 14px;">${esc(params.title ?? '从这一步开始')}</section>
        ${lines(raw).map((line, i) => html`
          <section style="display: flex; align-items: flex-start; margin-top: 10px; border: 1px solid ${ctx.color.tint(0.75)}; border-radius: 4px;">
            <section style="flex: 0 0 44px; box-sizing: border-box; padding: 15px 4px; text-align: center; color: ${ctx.color.main}; font-size: 24px; font-weight: bold; line-height: 1.3; font-family: Georgia, serif;">${String(i + 1).padStart(2, '0')}</section>
            <section style="flex: 1; min-width: 0; padding: 14px 12px; border-left: 1px solid ${ctx.color.tint(0.8)}; background: ${ctx.color.tint(0.97)}; color: #555; font-size: ${ctx.fontSize}px; line-height: 1.8;">${ctx.renderInline(line.replace(/^\d+[.)、]\s*/, ''))}</section>
          </section>`)}
      </section>`,
  },
  {
    id: 'b-centered-quote',
    name: '留白金句',
    category: 'body',
    tags: ['文艺', '引用', '简约'],
    example: ':::b-centered-quote{author="林间手记"}\n把日子过慢一点，\n让喜欢的事物有时间发生。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 2em 0; padding: 24px 16px; text-align: center; border-top: 1px solid ${ctx.color.tint(0.65)}; border-bottom: 1px solid ${ctx.color.tint(0.65)}; overflow-wrap: anywhere;">
        <section style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 8px; margin-bottom: 18px;">◆</section>
        ${lines(raw).map((line) => html`<section style="font-size: ${ctx.fontSize * 1.55}px; font-weight: bold; color: #333; line-height: 1.7; letter-spacing: 1px; font-family: 'Songti SC', SimSun, serif;">${ctx.renderInline(line)}</section>`)}
        ${params.author && html`<section style="font-size: 12px; color: #999; letter-spacing: 2px; margin-top: 20px;">—— ${esc(params.author)}</section>`}
      </section>`,
  },
  {
    id: 'b-magazine-dropcap',
    name: '杂志开篇首字',
    category: 'body',
    tags: ['文艺', '简约', '通用'],
    example: ':::b-magazine-dropcap{label="城市慢读 · 卷首"}\n**晨光**沿着窗沿缓缓移动，街角的面包店刚刚开门。我们沿河走了一小段路，才发现这座熟悉的城市，仍藏着许多未曾留意的风景。\n\n有时候，重新认识生活，只需要比平时走慢一点。\n:::',
    render: ({ params, raw, ctx }) => {
      const [first = '', ...rest] = paragraphs(raw)
      let decorated = false
      // 在已转义的行内 HTML 中装饰首个文字，保留开头加粗、链接及实体。
      const lead = ctx.renderInline(first).replace(/(^|>)([^<]+)/g, (match, prefix: string, text: string) => {
        if (decorated || !text.trim()) return match
        decorated = true
        return prefix + text.replace(/^(\s*)(&(?:#\d+|#x[\da-f]+|[a-z]+);|[^\s])/iu, (_, space: string, letter: string) =>
          html`${space}<span style="float: left; font-size: 40px; line-height: 1.3; margin: 0 9px 0 0; padding-bottom: 3px; color: ${ctx.color.main}; font-family: 'Songti SC', SimSun, serif; font-weight: bold;">${letter}</span>`,
        )
      })
      return html`
        <section style="margin: 1.5em 0; color: #444; font-size: ${ctx.fontSize}px; line-height: 1.95; overflow-wrap: anywhere;">
          <section style="font-size: 12px; color: #999; letter-spacing: 2px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 16px;">${esc(params.label ?? '生活观察 · 卷首')}</section>
          <section style="display: flow-root;">${lead}</section>
          <section style="clear: both;">${rest.map((p) => compact(ctx.render(p), 'margin: 0.9em 0 0;'))}</section>
        </section>`
    },
  },
  {
    id: 'b-vertical-poem',
    name: '竖笺诗词',
    category: 'body',
    tags: ['古风', '文艺'],
    example: ':::b-vertical-poem{title="山居小记" author="山月" seal="闲"}\n竹影轻摇窗下月\n茶烟微拢案头书\n半山风过无人语\n一盏清欢便是家\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.8em 0; padding: 20px 14px; background: ${ctx.color.tint(0.96)}; border-top: 1px solid ${ctx.color.tint(0.65)}; border-bottom: 1px solid ${ctx.color.tint(0.65)}; overflow-wrap: anywhere;">
        <section style="text-align: right; font-family: 'Songti SC', SimSun, serif; font-size: ${ctx.fontSize * 1.2}px; color: ${ctx.color.shade(0.25)}; letter-spacing: 3px; margin-bottom: 18px;">${esc(params.title ?? '闲笺')}</section>
        <section style="display: flex; flex-direction: row-reverse; flex-wrap: wrap; justify-content: center; color: #555;">
          ${lines(raw).map((line) => html`
            <section style="writing-mode: vertical-rl; text-orientation: upright; height: 13em; max-width: 100%; box-sizing: border-box; margin: 0 4px 12px; padding: 0 5px;
              border-left: 1px solid ${ctx.color.tint(0.8)}; font-size: ${ctx.fontSize}px; line-height: 1.9; letter-spacing: 3px; overflow-wrap: anywhere; font-family: 'Songti SC', SimSun, serif;">${ctx.renderInline(line)}</section>`)}
        </section>
        <section style="text-align: right; font-size: 12px; color: #999; margin-top: 4px;">
          ${params.author && html`<span style="margin-right: 10px;">${esc(params.author)}</span>`}
          <span style="display: inline-block; padding: 2px 4px; border: 1px solid ${ctx.color.main}; color: ${ctx.color.main}; font-family: SimSun, serif;">${esc(params.seal ?? '记')}</span>
        </section>
      </section>`,
  },
  {
    id: 'b-gradient-frame',
    name: '流光渐变描边',
    category: 'body',
    tags: ['色彩', '科技', '清新'],
    example: ':::b-gradient-frame{label="灵感正在发生"}\n好点子往往来自一次偶然的停顿。为尚未成形的想法留一点空间，让它慢慢长成自己的模样。\n\n今天，先把那个念头写下来。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.4em 0; padding: 2px; border-radius: 16px;
        background: linear-gradient(125deg, ${ctx.color.main}, ${ctx.color.tint(0.9)} 48%, ${ctx.color.tint(0.4)}); overflow-wrap: anywhere;">
        <section style="padding: 19px; border-radius: 14px; background: #fff; color: #555; font-size: ${ctx.fontSize}px; line-height: 1.85;">
          <section style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px; margin-bottom: 12px;">✦ ${esc(params.label ?? '灵感备忘')}</section>
          ${compact(ctx.render(raw))}
        </section>
      </section>`,
  },
  {
    id: 'b-offset-stack',
    name: '叠页档案卡',
    category: 'body',
    tags: ['怀旧', '文艺', '编号'],
    example: ':::b-offset-stack{no="07" label="散步档案"}\n今天的发现\n老街尽头多了一家二手书店，老板把新到的诗集摆在窗边。\n\n离开时买了一张明信片，准备寄给很久没见的朋友。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="margin: 1.6em 0; padding: 0 0 8px 8px; background: ${ctx.color.tint(0.75)}; overflow-wrap: anywhere;">
          <section style="margin-left: -8px; margin-right: 8px; padding: 18px; border: 1px solid ${ctx.color.tint(0.5)}; background: #fff;">
            <section style="display: flex; align-items: flex-start; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid #eee;">
              <section style="flex: 1; min-width: 0; color: #999; font-size: 12px; letter-spacing: 2px; line-height: 1.8;">${esc(params.label ?? '生活档案')}</section>
              <span style="max-width: 40%; margin-left: 12px; color: ${ctx.color.main}; font-size: 24px; font-family: Georgia, serif; line-height: 1.3;">${esc(params.no ?? '01')}</span>
            </section>
            <section style="font-size: ${ctx.fontSize * 1.1}px; font-weight: bold; color: #333; margin-bottom: 10px;">${ctx.renderInline(first)}</section>
            <section style="color: #555; font-size: ${ctx.fontSize}px; line-height: 1.85;">${compact(ctx.render(rest))}</section>
          </section>
        </section>`
    },
  },
  {
    id: 'b-sidebar-label',
    name: '侧签重点批注',
    category: 'body',
    tags: ['商务', '简约', '教程'],
    example: ':::b-sidebar-label{label="编辑观察" sub="关于长期主义"}\n持续记录，比一次写得完美更重要。\n\n把目标拆成每天能做的一件小事，进步才会从口号变成日常。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.4em 0; border-left: 5px solid ${ctx.color.main}; padding: 2px 0 2px 16px; overflow-wrap: anywhere;">
        <span style="display: inline-block; max-width: 100%; box-sizing: border-box; padding: 3px 10px; background: ${ctx.color.tint(0.87)}; color: ${ctx.color.shade(0.2)}; font-size: 12px; letter-spacing: 1px;">${esc(params.label ?? '重点批注')}</span>
        ${params.sub && html`<section style="margin-top: 9px; font-size: ${ctx.fontSize * 1.05}px; font-weight: bold; color: #333;">${esc(params.sub)}</section>`}
        <section style="margin-top: 8px; color: #555; font-size: ${ctx.fontSize}px; line-height: 1.85;">${compact(ctx.render(raw))}</section>
      </section>`,
  },
  {
    id: 'b-personal-letter',
    name: '寄给你的短信',
    category: 'body',
    tags: ['文艺', '怀旧', '对话'],
    example: ':::b-personal-letter{to="亲爱的老朋友" from="阿禾" date="十月的一个傍晚"}\n最近好吗？路过我们常去的咖啡馆，发现门口的桂花又开了。\n\n等你有空，我们再坐一下午。不赶时间，也不急着说再见。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.6em 0; padding: 7px; border: 1px solid ${ctx.color.tint(0.7)};
        background: repeating-linear-gradient(135deg, ${ctx.color.tint(0.65)} 0, ${ctx.color.tint(0.65)} 8px, #fff 8px, #fff 16px); overflow-wrap: anywhere;">
        <section style="padding: 20px 16px; background: #fff; color: #555; font-size: ${ctx.fontSize}px; line-height: 1.95;">
          <section style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 3px; margin-bottom: 20px;">一封短信 · 见字如面</section>
          <section style="font-family: 'Songti SC', SimSun, serif; color: #333; margin-bottom: 14px;">${esc(params.to ?? '亲爱的朋友')}：</section>
          ${compact(ctx.render(raw), 'margin: 0.8em 0;')}
          <section style="text-align: right; margin-top: 20px; font-size: ${ctx.fontSize}px; color: ${ctx.color.shade(0.2)};">${esc(params.from ?? '惦念你的人')}</section>
          ${params.date && html`<section style="text-align: right; margin-top: 4px; font-size: 12px; color: #999;">${esc(params.date)}</section>`}
        </section>
      </section>`,
  },
  {
    id: 'b-marker-paragraph',
    name: '荧光阅读划线',
    category: 'body',
    tags: ['简约', '教育', '通用'],
    example: ':::b-marker-paragraph{label="这段话，记下来"}\n不必等到准备万全才开始。每一次认真尝试，都在为下一次积攒勇气。\n\n把注意力放在今天能完成的小事上，你就已经走在路上了。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.5em 0; padding: 4px 6px; overflow-wrap: anywhere;">
        <section style="font-size: 12px; color: #999; letter-spacing: 1px; margin-bottom: 10px;">${esc(params.label ?? '阅读划线')}</section>
        ${paragraphs(raw).map((p) => html`
          <section style="margin-top: 10px; font-size: ${ctx.fontSize * 1.08}px; color: #333; line-height: 2.15;">
            <span style="padding: 2px 0; box-shadow: inset 0 -0.6em 0 ${ctx.color.tint(0.7)};
              box-decoration-break: clone; -webkit-box-decoration-break: clone;">${ctx.renderInline(p.replace(/\r?\n/g, ' '))}</span>
          </section>`)}
      </section>`,
  },
  {
    id: 'b-info-summary',
    name: '一页信息摘要',
    category: 'body',
    tags: ['简约', '商务', '通用'],
    example: ':::b-info-summary{label="活动速览"}\n周六的湖边读书会\n时间：周六 14:00—16:00\n地点：湖畔书屋 · 二楼露台\n携带：一本最近在读的书，以及想分享的一句话\n报名：在本文留言区写下「一起读书」\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="margin: 1.4em 0; border: 1px solid ${ctx.color.tint(0.65)}; border-radius: 6px; overflow: hidden; overflow-wrap: anywhere;">
          <section style="padding: 16px; background: ${ctx.color.tint(0.92)};">
            <section style="font-size: 12px; color: ${ctx.color.shade(0.15)}; letter-spacing: 2px; margin-bottom: 7px;">${esc(params.label ?? '一页速览')}</section>
            <section style="font-size: ${ctx.fontSize * 1.18}px; font-weight: bold; color: #333; line-height: 1.6;">${ctx.renderInline(first)}</section>
          </section>
          <section style="padding: 4px 16px;">
            ${lines(rest).map((line, i) => {
              const { key, value } = pair(line)
              return html`
                <section style="display: flex; align-items: flex-start; padding: 12px 0; ${i ? 'border-top: 1px solid #eee;' : ''} font-size: ${ctx.fontSize * 0.92}px; line-height: 1.8;">
                  <section style="flex: 0 0 28%; min-width: 0; padding-right: 12px; box-sizing: border-box; color: #999;">${ctx.renderInline(key)}</section>
                  <section style="flex: 1; min-width: 0; color: #444;">${ctx.renderInline(value)}</section>
                </section>`
            })}
          </section>
        </section>`
    },
  },
  {
    id: 'b-price-offer',
    name: '好物专享价签',
    category: 'body',
    tags: ['电商', '色彩', '简约'],
    example: ':::b-price-offer{price="69" original="89" unit="元 / 本" badge="读者专享" note="优惠至本周日，数量有限"}\n把四季装进口袋\n轻巧随身的周计划手账，附赠四枚季节书签。\n\n从这一页开始，记录属于自己的日常。\n:::',
    render: ({ params, raw, ctx }) => {
      const { first, rest } = splitFirst(raw)
      return html`
        <section style="margin: 1.5em 0; border: 1px solid ${ctx.color.tint(0.5)}; border-radius: 10px; overflow: hidden; overflow-wrap: anywhere;">
          <section style="padding: 18px;">
            <span style="display: inline-block; max-width: 100%; padding: 3px 8px; box-sizing: border-box; background: ${ctx.color.tint(0.9)}; color: ${ctx.color.shade(0.2)}; font-size: 12px; letter-spacing: 1px;">${esc(params.badge ?? '本期好物')}</span>
            <section style="margin-top: 12px; font-weight: bold; font-size: ${ctx.fontSize * 1.2}px; color: #333; line-height: 1.6;">${ctx.renderInline(first)}</section>
            <section style="margin-top: 8px; font-size: ${ctx.fontSize * 0.92}px; color: #666; line-height: 1.85;">${compact(ctx.render(rest))}</section>
          </section>
          <section style="padding: 14px 18px; border-top: 1px dashed ${ctx.color.tint(0.55)}; background: ${ctx.color.tint(0.96)};">
            <section style="color: ${ctx.color.main}; line-height: 1.5;">
              <span style="font-size: 36px; font-weight: 800; font-family: Arial, sans-serif;">${esc(params.price ?? '69')}</span>
              <span style="font-size: 12px; margin-left: 6px;">${esc(params.unit ?? '元')}</span>
            </section>
            ${params.original && html`<section style="margin-top: 4px; font-size: 12px; color: #999;">日常价 <span style="text-decoration: line-through;">${esc(params.original)}</span></section>`}
            ${params.note && html`<section style="font-size: 12px; color: #666; margin-top: 10px; line-height: 1.7;">${esc(params.note)}</section>`}
          </section>
        </section>`
    },
  },
  {
    id: 'b-author-bio',
    name: '作者小名片',
    category: 'body',
    tags: ['文艺', '简约', '通用'],
    example: `:::b-author-bio{name="阿禾" role="城市漫游者 · 生活记录者"}\n![阿禾的头像](${SAMPLE_IMG('b-author-bio-ahe')})\n在街巷里寻找故事，在一餐一饭里收集灵感。\n\n写作，也散步。愿每次见面，都能带给你一点生活的亮光。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const avatar = params.avatar ?? images[0]?.src ?? ''
      const safeAvatar = /^https?:\/\//i.test(avatar) ? avatar : ''
      return html`
        <section style="margin: 1.6em 0; padding: 18px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; overflow-wrap: anywhere;">
          <section style="display: flex; align-items: center;">
            ${safeAvatar
              ? html`<img src="${esc(safeAvatar)}" alt="${esc(images[0]?.alt ?? params.name ?? '作者头像')}" style="display: block; flex: 0 0 58px; width: 58px; height: 58px; max-width: 58px; margin: 0 14px 0 0; border-radius: 50%; object-fit: cover; box-sizing: border-box; border: 3px solid ${ctx.color.tint(0.85)};">`
              : html`<span style="display: inline-block; flex: 0 0 58px; height: 58px; line-height: 58px; margin-right: 14px; border-radius: 50%; text-align: center; font-size: 24px; color: ${ctx.color.main}; background: ${ctx.color.tint(0.9)};">✎</span>`}
            <section style="flex: 1; min-width: 0;">
              <section style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px; margin-bottom: 3px;">关于作者</section>
              <section style="font-size: ${ctx.fontSize * 1.15}px; font-weight: bold; color: #333; line-height: 1.6;">${esc(params.name ?? '作者')}</section>
              ${params.role && html`<section style="font-size: 12px; color: #999; margin-top: 2px; line-height: 1.7;">${esc(params.role)}</section>`}
            </section>
          </section>
          <section style="margin-top: 14px; font-size: ${ctx.fontSize * 0.92}px; color: #666; line-height: 1.85;">${compact(ctx.render(text))}</section>
        </section>`
    },
  },
]

export default blocks
