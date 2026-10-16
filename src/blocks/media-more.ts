import type { BlockDef } from '../core/types'
import { SAMPLE_IMG, compact, esc, extractImages, html, lines, splitFirst, splitQA } from './_utils'

const picture = (image: { src: string; alt: string } | undefined, style = '') =>
  image ? html`<img src="${esc(image.src)}" alt="${esc(image.alt)}" style="display: block; width: 100%; max-width: 100%; margin: 0; box-sizing: border-box; ${style}">` : ''

/** 多组 Q:/A:；后续行保留为当前问题或答案的 Markdown。 */
function faqPairs(raw: string): { q: string; a: string }[] {
  const pairs: { q: string; a: string }[] = []
  let current: { q: string; a: string } | undefined
  let field: 'q' | 'a' = 'q'
  for (const line of raw.split(/\r?\n/)) {
    const marker = line.match(/^\s*(Q|A|问|答)\s*[:：]\s*(.*)$/i)
    if (marker) {
      if (/^(Q|问)$/i.test(marker[1])) {
        current = { q: marker[2], a: '' }
        pairs.push(current)
        field = 'q'
      } else if (current) {
        field = 'a'
        current.a += `${current.a ? '\n' : ''}${marker[2]}`
      }
    } else if (current) current[field] += `\n${line}`
  }
  return pairs.length ? pairs : raw.trim() ? [splitQA(raw)] : []
}

const blocks: BlockDef[] = [
  {
    id: 'it-magazine-cover', name: '留白杂志封面', category: 'imagetext', tags: ['文艺', '旅游', '潮流'],
    example: `:::it-magazine-cover{issue="VOL. 07" label="慢游手记"}\n![山间晨雾与远处的村落](${SAMPLE_IMG('it-magazine-morning')})\n把周末，交给山野\n沿着溪流走进村庄，让风声代替闹钟，收集一个不用赶路的清晨。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const { first, rest } = splitFirst(text)
      return html`
        <section style="margin: 1.6em 0; color: #333; overflow-wrap: anywhere;">
          <section style="display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 9px; border-bottom: 2px solid ${ctx.color.main}; margin-bottom: 10px;">
            <span style="font-size: 12px; letter-spacing: 2px; color: ${ctx.color.main};">${esc(params.label ?? '生活特刊')}</span>
            <span style="font-size: 12px; color: #999; margin-left: 12px;">${esc(params.issue ?? 'VOL. 01')}</span>
          </section>
          ${picture(images[0], 'height: 236px; object-fit: cover;')}
          <section style="margin: ${images[0] ? '-30px' : '0'} 14px 0; padding: 14px 16px; background: ${ctx.color.tint(0.94)}; border-bottom: 4px solid ${ctx.color.main}; position: relative;">
            <section style="font-size: ${ctx.fontSize * 1.45}px; line-height: 1.5; font-weight: bold; letter-spacing: 1px;">${ctx.renderInline(first)}</section>
            ${rest && html`<section style="margin-top: 8px; font-size: ${ctx.fontSize * 0.92}px; line-height: 1.8; color: #666;">${compact(ctx.render(rest), 'margin: 0;')}</section>`}
          </section>
        </section>`
    },
  },
  {
    id: 'it-trio-collage', name: '一日三景拼贴', category: 'imagetext', tags: ['清新', '旅游', '文艺'],
    example: `:::it-trio-collage{label="WEEKEND WALK"}\n![树影下的街角](${SAMPLE_IMG('it-trio-street')})\n![转角花店](${SAMPLE_IMG('it-trio-flower')})\n![午后的窗边](${SAMPLE_IMG('it-trio-window')})\n一条小街，三次心动\n从花店走到咖啡馆，最好的路线，是允许自己随时停下。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const { first, rest } = splitFirst(text)
      return html`
        <section style="margin: 1.5em 0; overflow-wrap: anywhere;">
          <section style="display: flex; align-items: stretch;">
            ${images[0] && html`<section style="flex: 3; min-width: 0;">${picture(images[0], 'height: 238px; object-fit: cover; border-radius: 28px 0 0 0;')}</section>`}
            ${images.length > 1 && html`<section style="flex: 2; min-width: 0; margin-left: 7px;">
              ${picture(images[1], 'height: 115px; object-fit: cover;')}
              ${images[2] && html`<section style="margin-top: 8px;">${picture(images[2], 'height: 115px; object-fit: cover; border-radius: 0 0 28px 0;')}</section>`}
            </section>`}
          </section>
          <section style="margin-top: 14px; font-size: 12px; letter-spacing: 2px; color: ${ctx.color.main};">● ${esc(params.label ?? 'LIFE IN FRAMES')}</section>
          <section style="margin-top: 6px; font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; color: #333;">${ctx.renderInline(first)}</section>
          ${rest && html`<section style="margin-top: 6px; color: #666; font-size: ${ctx.fontSize * 0.92}px; line-height: 1.8;">${compact(ctx.render(rest), 'margin: 0;')}</section>`}
        </section>`
    },
  },
  {
    id: 'it-numbered-caption', name: '编号观察札记', category: 'imagetext', tags: ['编号', '教程', '简约'],
    example: `:::it-numbered-caption{no="03" label="光线观察"}\n![窗前的一束自然光](${SAMPLE_IMG('it-numbered-light')})\n让光，成为画面的主角\n将主体放在窗边，关掉顶灯。柔和的侧光能保留纹理，也让日常物件有了故事。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const { first, rest } = splitFirst(text)
      return html`
        <section style="margin: 1.5em 0; overflow-wrap: anywhere;">
          ${picture(images[0], 'border-radius: 6px;')}
          <section style="display: flex; margin-top: 16px; align-items: flex-start;">
            <section style="flex: 0 0 54px; min-width: 0; font-size: 36px; line-height: 1.3; font-weight: bold; color: ${ctx.color.main};">${esc(params.no ?? '01')}</section>
            <section style="flex: 1; min-width: 0; border-left: 1px solid ${ctx.color.tint(0.65)}; padding-left: 14px;">
              <section style="font-size: 12px; color: #999; letter-spacing: 2px;">${esc(params.label ?? '观察札记')}</section>
              <section style="margin-top: 4px; font-size: ${ctx.fontSize * 1.1}px; font-weight: bold; color: #333;">${ctx.renderInline(first)}</section>
              ${rest && html`<section style="margin-top: 6px; color: #666; font-size: ${ctx.fontSize * 0.92}px; line-height: 1.8;">${compact(ctx.render(rest), 'margin: 0;')}</section>`}
            </section>
          </section>
        </section>`
    },
  },
  {
    id: 'it-portrait-quote', name: '圆像人物引言', category: 'imagetext', tags: ['文艺', '引用', '对话'],
    example: `:::it-portrait-quote{author="林小满" role="植物观察者"}\n![林小满的日常肖像](${SAMPLE_IMG('it-portrait-lin')})\n照顾一盆植物，也是练习照顾自己的生活。慢一点，才听得见新叶舒展的声音。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      return html`
        <section style="margin: 1.8em 0; padding: 20px 18px; border-top: 1px solid ${ctx.color.tint(0.6)}; border-bottom: 1px solid ${ctx.color.tint(0.6)}; background: ${ctx.color.tint(0.96)}; text-align: center; overflow-wrap: anywhere;">
          ${images[0] && html`<section style="width: 82px; max-width: 100%; padding: 5px; margin: 0 auto; box-sizing: border-box; border: 1px solid ${ctx.color.tint(0.5)}; border-radius: 50%;">${picture(images[0], 'height: 70px; object-fit: cover; border-radius: 50%;')}</section>`}
          <section style="margin-top: 12px; color: ${ctx.color.main}; font-size: 30px; line-height: 1.3;">❝</section>
          <section style="margin: 8px 0 16px; font-size: ${ctx.fontSize * 1.05}px; color: #333; line-height: 1.9;">${compact(ctx.render(text), 'margin: 0;')}</section>
          <section style="width: 24px; height: 2px; margin: 0 auto 12px; background: ${ctx.color.main};"></section>
          <section style="color: ${ctx.color.shade(0.15)}; font-size: 14px; font-weight: bold;">${esc(params.author ?? '分享者')}</section>
          ${params.role && html`<section style="margin-top: 4px; font-size: 12px; color: #999; letter-spacing: 1px;">${esc(params.role)}</section>`}
        </section>`
    },
  },
  {
    id: 'it-date-journal', name: '日历角标图记', category: 'imagetext', tags: ['清新', '旅游', '文艺'],
    example: `:::it-date-journal{day="16" month="十月 · OCT"}\n![公园里渐黄的树叶](${SAMPLE_IMG('it-journal-october')})\n今天，去公园读一会儿书\n带一本薄书，找一张长椅。读累了就抬头，树叶正替秋天写下一封长信。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const { first, rest } = splitFirst(text)
      return html`
        <section style="margin: 1.5em 0; border: 1px solid #eee; border-radius: 2px 18px 2px 2px; overflow: hidden; background: #fff; overflow-wrap: anywhere;">
          ${picture(images[0], 'height: 205px; object-fit: cover;')}
          <section style="display: flex; justify-content: flex-end; padding-right: 14px; margin-top: ${images[0] ? '-28px' : '12px'}; position: relative;">
            <section style="padding: 9px 12px; max-width: 55%; background: ${ctx.color.main}; color: #fff; text-align: center; border: 3px solid #fff; box-shadow: 0 3px 8px ${ctx.color.alpha(0.16)};">
              <section style="font-size: 30px; font-weight: bold; line-height: 1.3;">${esc(params.day ?? '01')}</section>
              <section style="font-size: 12px; margin-top: 4px;">${esc(params.month ?? '今日')}</section>
            </section>
          </section>
          <section style="padding: 8px 18px 20px;">
            <section style="font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; line-height: 1.6; color: #333;">${ctx.renderInline(first)}</section>
            ${rest && html`<section style="margin-top: 8px; font-size: ${ctx.fontSize * 0.92}px; color: #666; line-height: 1.8;">${compact(ctx.render(rest), 'margin: 0;')}</section>`}
          </section>
        </section>`
    },
  },
  {
    id: 'it-side-story', name: '右图城市侧记', category: 'imagetext', tags: ['简约', '旅游', '美食'],
    example: `:::it-side-story{label="街角发现" foot="步行十分钟的快乐"}\n![街角面包店的橱窗](${SAMPLE_IMG('it-side-bakery')})\n刚出炉的早晨\n推开街角的木门，麦香和阳光一起涌来。买一只可颂，把今天过得蓬松一点。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const { first, rest } = splitFirst(text)
      return html`
        <section style="margin: 1.5em 0; padding: 16px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; overflow-wrap: anywhere;">
          <section style="display: flex; align-items: center;">
            <section style="flex: 1; min-width: 0; padding-right: ${images[0] ? '16' : '0'}px;">
              <section style="font-size: 12px; letter-spacing: 1px; color: ${ctx.color.main};">${esc(params.label ?? '城市侧记')}</section>
              <section style="font-size: ${ctx.fontSize * 1.2}px; font-weight: bold; color: #333; line-height: 1.5; margin-top: 7px;">${ctx.renderInline(first)}</section>
              ${rest && html`<section style="margin-top: 8px; font-size: ${ctx.fontSize * 0.9}px; line-height: 1.8; color: #666;">${compact(ctx.render(rest), 'margin: 0;')}</section>`}
            </section>
            ${images[0] && html`<section style="flex: 0 0 38%; min-width: 0;">${picture(images[0], 'height: 168px; object-fit: cover; border-radius: 60px 60px 3px 3px;')}</section>`}
          </section>
          ${params.foot && html`<section style="margin-top: 14px; padding-top: 9px; border-top: 1px dashed ${ctx.color.tint(0.65)}; color: #999; font-size: 12px; letter-spacing: 1px;">↗ ${esc(params.foot)}</section>`}
        </section>`
    },
  },
  {
    id: 'it-gallery-frame', name: '双线艺廊画框', category: 'imagetext', tags: ['文艺', '简约', '怀旧'],
    example: `:::it-gallery-frame{label="日常收藏 · 008"}\n![窗外光影映在白墙上](${SAMPLE_IMG('it-frame-shadow')})\n光在墙上，画了一扇窗\n午后三点，一场只展出二十分钟的光影展。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const { first, rest } = splitFirst(text)
      return html`
        <section style="margin: 1.8em 0; padding: 7px; border: 2px solid ${ctx.color.shade(0.25)}; box-sizing: border-box; background: #fff; overflow-wrap: anywhere;">
          <section style="border: 1px solid ${ctx.color.tint(0.55)}; padding: 16px;">
            ${picture(images[0])}
            <section style="margin-top: 16px; font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px;">${esc(params.label ?? '日常收藏')}</section>
            <section style="margin-top: 6px; font-size: ${ctx.fontSize * 1.1}px; font-weight: bold; color: #333; line-height: 1.6;">${ctx.renderInline(first)}</section>
            ${rest && html`<section style="margin-top: 6px; font-size: ${ctx.fontSize * 0.9}px; color: #999; line-height: 1.8;">${compact(ctx.render(rest), 'margin: 0;')}</section>`}
          </section>
        </section>`
    },
  },
  {
    id: 'it-album-duo', name: '图集双页序章', category: 'imagetext', tags: ['文艺', '旅游', '简约'],
    example: `:::it-album-duo{no="02" label="城市漫游图集"}\n![河岸的清晨](${SAMPLE_IMG('it-album-river')})\n![夜幕里的桥](${SAMPLE_IMG('it-album-bridge')})\n沿河而行，遇见城市的两面\n一面是晨风，一面是灯火；同一条河，藏着不同的温柔。\n:::`,
    render: ({ params, raw, ctx }) => {
      const { images, text } = extractImages(raw)
      const { first, rest } = splitFirst(text)
      return html`
        <section style="margin: 1.6em 0; overflow-wrap: anywhere;">
          <section style="display: flex; align-items: baseline; border-bottom: 1px solid ${ctx.color.main}; padding-bottom: 10px;">
            <span style="font-size: 26px; font-weight: bold; letter-spacing: 4px; color: ${ctx.color.main};">图集</span>
            <span style="flex: 1; min-width: 0; margin: 0 10px; font-size: 12px; letter-spacing: 1px; color: #999;">${esc(params.label ?? 'PHOTO ALBUM')}</span>
            <span style="max-width: 25%; font-size: 20px; color: ${ctx.color.tint(0.35)};">${esc(params.no ?? '01')}</span>
          </section>
          <section style="display: flex; margin-top: 12px;">
            ${images.slice(0, 2).map((image, i) => html`
              <section style="flex: 1; min-width: 0; ${i ? 'margin-left: 8px; padding-top: 22px;' : ''}">
                ${picture(image, 'height: 172px; object-fit: cover;')}
                <section style="margin-top: 6px; color: #999; font-size: 12px; line-height: 1.6;">0${i + 1} / ${esc(image.alt)}</section>
              </section>`)}
          </section>
          <section style="margin-top: 14px; font-size: ${ctx.fontSize * 1.1}px; color: #333; font-weight: bold;">${ctx.renderInline(first)}</section>
          ${rest && html`<section style="margin-top: 6px; font-size: ${ctx.fontSize * 0.92}px; color: #666; line-height: 1.8;">${compact(ctx.render(rest), 'margin: 0;')}</section>`}
        </section>`
    },
  },
  {
    id: 'qx-avatar-interview', name: '双人头像访谈', category: 'qa', tags: ['对话', '文艺', '通用'],
    example: ':::qx-avatar-interview{ask="编" reply="林" asker="编辑" guest="林小满 · 花店主理人"}\nQ: 为什么想在小街上开一家花店？\nA: 想给匆忙的人留一个停顿。哪怕只是进来闻一闻花香，也算给今天放了一个小假。\n:::',
    render: ({ params, raw, ctx }) => {
      const { q, a } = splitQA(raw)
      return html`
        <section style="margin: 1.5em 0; overflow-wrap: anywhere;">
          <section style="display: flex; align-items: flex-start;">
            <span style="flex: 0 0 34px; width: 34px; padding: 7px 0; text-align: center; background: #f2f3f5; color: #666; border-radius: 50%; font-size: 14px; line-height: 20px;">${esc(params.ask ?? '问')}</span>
            <section style="flex: 1; min-width: 0; margin-left: 10px;">
              <section style="font-size: 12px; color: #999; margin-bottom: 5px;">${esc(params.asker ?? '提问者')}</section>
              <section style="padding: 10px 14px; border-left: 2px solid ${ctx.color.main}; background: ${ctx.color.tint(0.95)}; font-size: ${ctx.fontSize}px; color: #333; line-height: 1.8;">${ctx.renderInline(q)}</section>
            </section>
          </section>
          <section style="display: flex; align-items: flex-start; margin-top: 16px;">
            <section style="flex: 1; min-width: 0; margin-right: 10px;">
              <section style="font-size: 12px; color: ${ctx.color.main}; text-align: right; margin-bottom: 5px;">${esc(params.guest ?? '分享者')}</section>
              <section style="padding: 10px 14px; border: 1px solid ${ctx.color.tint(0.7)}; border-radius: 12px 0 12px 12px; color: #555; font-size: ${ctx.fontSize * 0.95}px; line-height: 1.8;">${compact(ctx.render(a), 'margin: 0;')}</section>
            </section>
            <span style="flex: 0 0 34px; width: 34px; padding: 7px 0; text-align: center; background: ${ctx.color.main}; color: #fff; border-radius: 50%; font-size: 14px; line-height: 20px;">${esc(params.reply ?? '答')}</span>
          </section>
        </section>`
    },
  },
  {
    id: 'qx-knowledge-card', name: '字母衬底知识卡', category: 'qa', tags: ['教育', '科技', '简约'],
    example: ':::qx-knowledge-card{label="一分钟知识"}\nQ: 为什么树荫下会出现圆形光斑？\nA: 叶片间的小孔就像天然的小孔成像装置，把太阳的形状投到地面上。下次散步时，试着找一找这些微小的太阳。\n:::',
    render: ({ params, raw, ctx }) => {
      const { q, a } = splitQA(raw)
      return html`
        <section style="margin: 1.5em 0; padding: 18px 20px; border-radius: 4px; background: ${ctx.color.tint(0.94)}; border-bottom: 3px solid ${ctx.color.main}; overflow-wrap: anywhere;">
          <section style="display: flex; align-items: center;">
            <span style="font-size: 40px; line-height: 1.3; font-weight: bold; color: ${ctx.color.tint(0.6)};">Q</span>
            <span style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px; margin-left: 10px;">${esc(params.label ?? '知识补给站')}</span>
          </section>
          <section style="margin-top: -9px; padding-left: 18px; font-size: ${ctx.fontSize * 1.15}px; line-height: 1.7; color: #333; font-weight: bold;">${ctx.renderInline(q)}</section>
          <section style="height: 1px; background: ${ctx.color.tint(0.75)}; margin: 14px 0;"></section>
          <section style="color: #555; font-size: ${ctx.fontSize * 0.95}px; line-height: 1.9;">${compact(ctx.render(a), 'margin: 0;')}</section>
        </section>`
    },
  },
  {
    id: 'qx-expanded-answer', name: '展开式问题条', category: 'qa', tags: ['简约', '教程', '通用'],
    example: ':::qx-expanded-answer{label="使用指南"}\nQ: 如何把一篇长文排得更好读？\nA: 先按内容转折拆分章节，每段只讲一个重点。再留出段间空白，让小标题像路标一样，引导读者轻松往下读。\n:::',
    render: ({ params, raw, ctx }) => {
      const { q, a } = splitQA(raw)
      return html`
        <section style="margin: 1.5em 0; overflow-wrap: anywhere;">
          <section style="font-size: 12px; color: #999; letter-spacing: 2px; margin-bottom: 8px;">${esc(params.label ?? '常见问题')}</section>
          <section style="display: flex; align-items: flex-start; padding: 12px 14px; background: ${ctx.color.tint(0.92)}; border-radius: 4px;">
            <span style="flex-shrink: 0; margin-right: 10px; color: ${ctx.color.main}; font-size: 16px; line-height: 1.7;">⌄</span>
            <section style="flex: 1; min-width: 0; font-size: ${ctx.fontSize}px; color: #333; font-weight: bold; line-height: 1.7;">${ctx.renderInline(q)}</section>
          </section>
          <section style="margin: 12px 10px 0 24px; padding: 0 0 4px 16px; border-left: 2px solid ${ctx.color.tint(0.65)};">
            <section style="font-size: 12px; color: ${ctx.color.main}; margin-bottom: 5px;">解答</section>
            <section style="font-size: ${ctx.fontSize * 0.95}px; line-height: 1.9; color: #666;">${compact(ctx.render(a), 'margin: 0;')}</section>
          </section>
        </section>`
    },
  },
  {
    id: 'qx-faq-list', name: '多组编号 FAQ', category: 'qa', tags: ['编号', '教程', '通用'],
    example: ':::qx-faq-list{title="出发前，你可能想问"}\nQ: 城市漫步需要提前预约吗？\nA: 本次路线为自由步行，无需预约，选一个晴朗的周末即可出发。\n\nQ: 建议预留多长时间？\nA: 约两小时。给沿途的小店和风景留一点停下来的时间。\n\nQ: 下雨天可以去吗？\nA: 可以把路线缩短为书店与展馆两站，带伞慢行，也有另一番趣味。\n:::',
    render: ({ params, raw, ctx }) => html`
      <section style="margin: 1.5em 0; overflow-wrap: anywhere;">
        <section style="display: flex; align-items: baseline; padding-bottom: 12px; border-bottom: 2px solid ${ctx.color.main};">
          <span style="font-size: 24px; font-weight: bold; color: ${ctx.color.main}; margin-right: 12px;">FAQ</span>
          <span style="flex: 1; min-width: 0; color: #333; font-size: ${ctx.fontSize}px; font-weight: bold;">${esc(params.title ?? '你关心的问题')}</span>
        </section>
        ${faqPairs(raw).map((pair, i) => html`
          <section style="padding: 16px 0; border-bottom: 1px dashed ${ctx.color.tint(0.65)};">
            <section style="display: flex; align-items: baseline;">
              <span style="flex: 0 0 34px; color: ${ctx.color.main}; font-size: 20px; font-weight: bold;">${String(i + 1).padStart(2, '0')}</span>
              <section style="flex: 1; min-width: 0; font-weight: bold; font-size: ${ctx.fontSize}px; color: #333; line-height: 1.7;">${ctx.renderInline(pair.q.trim().replace(/\n+/g, ' '))}</section>
            </section>
            <section style="margin: 8px 0 0 34px; color: #666; font-size: ${ctx.fontSize * 0.95}px; line-height: 1.8;">${compact(ctx.render(pair.a.trim()), 'margin: 0 0 0.4em;')}</section>
          </section>`)}
      </section>`,
  },
  {
    id: 'qx-choice-quiz', name: '随堂四选一', category: 'qa', tags: ['教育', '校园', '教程'],
    example: ':::qx-choice-quiz{no="01" answer="B" explain="先明确想表达什么，再决定如何呈现，能让每一张图片都服务于内容。"}\n制作一篇图文推送，最适合先做哪一步？\nA: 给所有图片加滤镜\nB: 明确主题与阅读顺序\nC: 选尽可能多的字体\nD: 把每句话都加粗\n:::',
    params: [{ key: 'no', label: '题号', type: 'text', placeholder: '01' }, { key: 'answer', label: '正确答案', type: 'select', options: [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }, { value: 'C', label: 'C' }, { value: 'D', label: 'D' }] }, { key: 'explain', label: '解析', type: 'text' }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => {
      const stem: string[] = []
      const options: { key: string; text: string }[] = []
      for (const line of lines(raw)) {
        const match = line.match(/^([A-D])\s*[:：.、)）]\s*(.*)$/i)
        if (match) options.push({ key: match[1].toUpperCase(), text: match[2] })
        else if (options.length) options[options.length - 1].text += `\n${line}`
        else stem.push(line)
      }
      const answer = params.answer?.trim().toUpperCase()
      return html`
        <section style="margin: 1.5em 0; padding: 16px; border: 1px solid ${ctx.color.tint(0.65)}; border-radius: 12px; box-shadow: 0 4px 0 ${ctx.color.tint(0.9)}; overflow-wrap: anywhere;">
          <section style="font-size: 12px; color: ${ctx.color.main}; letter-spacing: 2px;">随堂练习 / ${esc(params.no ?? '01')}</section>
          <section style="margin: 10px 0 14px; font-size: ${ctx.fontSize * 1.08}px; font-weight: bold; color: #333; line-height: 1.7;">${ctx.renderInline(stem.join(' '))}</section>
          ${options.map(option => html`
            <section style="display: flex; align-items: flex-start; margin-top: 8px; padding: 9px 12px; background: #f7f8fa; border-radius: 6px;">
              <span style="flex: 0 0 24px; font-size: 14px; color: ${ctx.color.main}; font-weight: bold; line-height: 1.8;">${option.key}</span>
              <section style="flex: 1; min-width: 0; font-size: ${ctx.fontSize * 0.95}px; color: #555; line-height: 1.8;">${ctx.renderInline(option.text.replace(/\n+/g, ' '))}</section>
            </section>`)}
          ${answer && html`<section style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed ${ctx.color.tint(0.65)};">
            <section style="font-size: 13px; font-weight: bold; color: ${ctx.color.main};">参考答案：${esc(answer)}</section>
            ${params.explain && html`<section style="margin-top: 6px; font-size: ${ctx.fontSize * 0.9}px; line-height: 1.8; color: #666;">${esc(params.explain)}</section>`}
          </section>`}
        </section>`
    },
  },
  {
    id: 'qx-true-false', name: '对错判断实验室', category: 'qa', tags: ['教育', '教程', '简约'],
    example: ':::qx-true-false{answer="false"}\nQ: 排版时，强调的文字越多，重点就越清楚。\nA: 强调需要有取舍。只突出关键词，并通过留白与层级建立节奏，读者才更容易找到真正的重点。\n:::',
    params: [{ key: 'answer', label: '正确答案', type: 'select', options: [{ value: 'true', label: '对' }, { value: 'false', label: '错' }] }, { key: 'color', label: '主色', type: 'color' }],
    render: ({ params, raw, ctx }) => {
      const { q, a } = splitQA(raw)
      // 未提供或未知值保持待判断状态；支持 true/false、对/错、✓/✗。
      const value = params.answer?.trim().toLowerCase()
      const verdict = value && ['true', '对', '正确', '✓'].includes(value) ? true
        : value && ['false', '错', '错误', '✗'].includes(value) ? false : undefined
      return html`
        <section style="margin: 1.5em 0; border: 1px solid ${ctx.color.tint(0.65)}; overflow-wrap: anywhere;">
          <section style="padding: 16px 18px;">
            <section style="font-size: 12px; color: #999; letter-spacing: 2px;">判断一下 / TRUE OR FALSE</section>
            <section style="margin-top: 10px; font-size: ${ctx.fontSize * 1.08}px; line-height: 1.8; color: #333; font-weight: bold;">${ctx.renderInline(q)}</section>
            <section style="display: flex; margin-top: 16px;">
              ${[true, false].map((correct, i) => html`
                <section style="flex: 1; min-width: 0; padding: 9px 5px; text-align: center; border: 1px solid ${verdict === correct ? ctx.color.main : '#e5e5e5'}; background: ${verdict === correct ? ctx.color.tint(0.9) : '#fff'}; color: ${verdict === correct ? ctx.color.shade(0.15) : '#999'}; ${i ? 'margin-left: 10px;' : ''}">
                  <span style="font-size: 22px; vertical-align: middle;">${correct ? '✓' : '✗'}</span>
                  <span style="font-size: 13px; margin-left: 7px;">${correct ? '正确' : '错误'}${verdict === correct ? ' · 答案' : ''}</span>
                </section>`)}
            </section>
          </section>
          ${a && html`<section style="padding: 13px 18px; background: ${ctx.color.tint(0.96)}; border-top: 1px dashed ${ctx.color.tint(0.65)}; font-size: ${ctx.fontSize * 0.95}px; color: #666; line-height: 1.8;">
            <section style="font-size: 12px; color: ${ctx.color.main}; margin-bottom: 5px;">一起想一想</section>
            ${compact(ctx.render(a), 'margin: 0;')}
          </section>`}
        </section>`
    },
  },
]

export default blocks
