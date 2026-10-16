/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  // 相对路径，方便部署到 GitHub Pages 的任意子路径
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      // 两个页面：编辑器 index.html 与素材总览 gallery.html
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // 只打包编辑器核心；@codemirror/language-data 里的各语言包保持按需加载
          if (
            /@codemirror[\\/](view|state|language|commands|search|autocomplete|lint|lang-markdown|lang-html|lang-css|lang-javascript|theme-one-dark)[\\/]/.test(id) ||
            /@lezer[\\/](common|highlight|lr|markdown|html|css|javascript)[\\/]/.test(id) ||
            id.includes('@uiw')
          )
            return 'codemirror'
          if (id.includes('highlight.js')) return 'highlight'
          if (id.includes('markdown-it') || id.includes('entities') || id.includes('linkify') || id.includes('mdurl') || id.includes('uc.micro'))
            return 'markdown'
          if (id.includes('react') || id.includes('scheduler') || id.includes('zustand')) return 'react'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
})
