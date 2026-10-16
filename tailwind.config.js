/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  // 关闭 preflight：预览区要尽量接近公众号的浏览器默认样式，不能被全局 reset 干扰
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#07c160', dark: '#06ad56' },
      },
    },
  },
  plugins: [],
}
