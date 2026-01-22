import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        cookie: './pages/cookie.html',
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
