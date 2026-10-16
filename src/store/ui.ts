import { create } from 'zustand'

export type StyleTab = 'materials' | 'themes' | 'templates'
export type MobileTab = 'style' | 'edit' | 'preview'

interface UiState {
  styleTab: StyleTab
  mobileTab: MobileTab
  /** 需要滚动到并高亮的设置分区（例如引导用户去配置图床） */
  focusSection: 'imageHost' | null
  setStyleTab: (tab: StyleTab) => void
  setMobileTab: (tab: MobileTab) => void
  clearFocusSection: () => void
}

/** 不需要持久化的界面状态 */
export const useUi = create<UiState>((set) => ({
  styleTab: 'materials',
  mobileTab: 'edit',
  focusSection: null,
  setStyleTab: (styleTab) => set({ styleTab }),
  setMobileTab: (mobileTab) => set({ mobileTab }),
  clearFocusSection: () => set({ focusSection: null }),
}))

/** 打开「主题 → 图床设置」 */
export const openImageHostSettings = () => useUi.setState({ styleTab: 'themes', mobileTab: 'style', focusSection: 'imageHost' })
