import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: { 'process.env.NODE_ENV': '"production"', '__VUE_PROD_DEVTOOLS__': 'true' },
  build: {
    lib: {
      entry: 'src/delivery-stepper-mount.js',
      formats: ['iife'],
      name: 'AVDeliveryStepperBundle',
      fileName: () => 'delivery-stepper.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
})
