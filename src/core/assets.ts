/**
 * 素材（GIF 等）的根地址。公众号粘贴时会从这个地址抓取图片并转存，
 * 所以它必须是公网可访问的地址：
 *   1. 构建时设置 VITE_ASSET_BASE（例如 jsDelivr：https://cdn.jsdelivr.net/gh/<用户>/<仓库>@main/public/）
 *   2. 否则使用当前站点地址（部署到 GitHub Pages 后即可用）
 */
export function defaultAssetBase(): string {
  const env = import.meta.env.VITE_ASSET_BASE as string | undefined
  if (env) return withSlash(env)
  if (typeof location !== 'undefined' && /^https?:/.test(location.href)) {
    return withSlash(new URL(import.meta.env.BASE_URL || './', location.href).href)
  }
  return './'
}

export function withSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

/** 本地地址公众号无法访问，界面上需要提醒 */
export function isLocalAsset(base: string): boolean {
  return !/^https?:/.test(base) || /^https?:\/\/(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.|\[::1\])/.test(base)
}
