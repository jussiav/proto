import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: { 'process.env.NODE_ENV': '"production"', '__VUE_PROD_DEVTOOLS__': 'true' },
  build: {
    lib: {
      entry: 'src/gallery-mount.js',
      formats: ['iife'],
      name: 'GalleryMounted',
      fileName: () => 'gallery.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
})
