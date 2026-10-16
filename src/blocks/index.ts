import { BLOCK_CATEGORIES, type BlockDef } from '../core/types'

/**
 * 组件注册表：自动收集本目录下所有 .ts 文件（_ 开头和 index 除外）。
 * 每个文件 default 导出一个 BlockDef 或 BlockDef 数组。
 * 新增组件只需新建文件或往已有分类文件里追加，详见 docs/CONTRIBUTING.md。
 */
const modules = import.meta.glob<{ default: BlockDef | BlockDef[] }>(['./*.ts', '!./index.ts', '!./_*.ts'], {
  eager: true,
})

const order = BLOCK_CATEGORIES.map((c) => c.id)

/** 同一分类内的排序：扩展素材在前，基础素材其次，节日素材最后 */
const filePriority = (path: string) => (path.includes('festival') ? 2 : path.includes('-more') ? 0 : 1)

export const blocks: BlockDef[] = Object.entries(modules)
  .flatMap(([path, m]) => (Array.isArray(m.default) ? m.default : [m.default]).map((b) => ({ b, p: filePriority(path) })))
  .sort((x, y) => order.indexOf(x.b.category) - order.indexOf(y.b.category) || x.p - y.p)
  .map((x) => x.b)

const byId = new Map(blocks.map((b) => [b.id, b]))

export function getBlock(id: string): BlockDef | undefined {
  return byId.get(id)
}

export const blockTags: string[] = Array.from(new Set(blocks.flatMap((b) => b.tags)))
