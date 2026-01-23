import { defineConfig } from 'vite'
import { readdirSync } from 'fs'
import { join } from 'path'

// Liste dynamique des fichiers HTML dans le dossier "pages"
const pages = {}
try {
  const files = readdirSync('./pages')
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '')
      pages[name] = join('pages', file)
    }
  })
} catch (err) {
  console.error("Erreur lecture dossier pages:", err)
}

export default defineConfig({
  base: '/crk-site/',
  root: './',
  build: {
    outDir: 'dist',
    assetsDir: 'bundled_assets',
    rollupOptions: {
      input: {
        main: './index.html',
        ...pages
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
