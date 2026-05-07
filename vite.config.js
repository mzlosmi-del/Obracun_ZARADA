import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('@remix-run/router') || id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('@vercel/analytics')) {
              return 'analytics';
            }
            if (id.includes('react-dom') || id.includes('react/') || id.endsWith('react') || id.includes('scheduler')) {
              return 'react';
            }
          }
        },
      },
    },
  },
  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger'],
  },
})
