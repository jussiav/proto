import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: './',
  define: {
    'process.env.NODE_ENV': '"production"',
    '__VUE_PROD_DEVTOOLS__': 'true',
  },
  ...(command === 'build' && {
    build: {
      lib: {
        entry: 'src/auction-insights-mount.js',
        formats: ['iife'],
        name: 'AuctionInsightsMounted',
        fileName: () => 'auction-insights.js',
      },
      outDir: 'dist',
    },
  }),
}))
