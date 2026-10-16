import { create } from 'zustand'

export type ToastKind = 'success' | 'warning' | 'error'

interface ToastState {
  message: string | null
  kind: ToastKind
  show: (message: string, kind?: ToastKind) => void
}

let timer: ReturnType<typeof setTimeout> | undefined

export const useToast = create<ToastState>((set) => ({
  message: null,
  kind: 'success',
  show: (message, kind = 'success') => {
    clearTimeout(timer)
    set({ message, kind })
    // 警告文字较长，多停留一会
    timer = setTimeout(() => set({ message: null }), kind === 'warning' ? 4500 : 2400)
  },
}))

export const toast = (message: string, kind?: ToastKind) => useToast.getState().show(message, kind)
