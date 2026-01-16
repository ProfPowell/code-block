import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/code-block.js',
      formats: ['es'],
      fileName: () => 'code-block.js'
    },
    rollupOptions: {
      // Bundle highlight.js - don't externalize
      external: [],
      output: {
        globals: {}
      }
    }
  },
  server: {
    open: '/demo/index.html'
  }
})
