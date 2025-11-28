import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'code-block.js'),
      name: 'CodeBlock',
      fileName: 'code-block',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Don't externalize highlight.js - bundle it in
      external: [],
      output: {
        globals: {}
      }
    }
  },
  server: {
    open: '/demo.html'
  }
});
