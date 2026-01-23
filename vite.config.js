import { defineConfig } from 'vite'

export default defineConfig({
  base: '/crk-site/',
  root: './',
  build: {
    outDir: 'dist',
    assetsDir: 'bundled_assets',
    rollupOptions: {
      input: {
        main: './index.html',
        cookie_detail: './pages/cookie_detail.html',
        list: './pages/list.html',
        login: './pages/login.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
