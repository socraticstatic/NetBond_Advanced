import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  base: './',
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react';
          }
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run')) {
            return 'router';
          }
          if (id.includes('node_modules/chart.js') ||
              id.includes('node_modules/react-chartjs-2')) {
            return 'charts';
          }
          if (id.includes('node_modules/@dnd-kit')) {
            return 'dnd';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          if (id.includes('node_modules/zustand')) {
            return 'store';
          }
          if (id.includes('/src/components/monitoring/')) {
            if (id.includes('/charts/') || id.includes('/metrics/')) {
              return 'monitoring-charts';
            }
            if (id.includes('/mobile/')) {
              return 'monitoring-mobile';
            }
            return 'monitoring';
          }
          if (id.includes('/src/components/wizard/')) {
            return 'wizard';
          }
          if (id.includes('/src/components/network-designer/')) {
            return 'network-designer';
          }
          if (id.includes('/src/components/configure/')) {
            return 'configure';
          }
          if (id.includes('/src/components/control-center/')) {
            return 'control-center';
          }
          if (id.includes('/src/components/group')) {
            return 'groups';
          }
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  },
  server: {
    fs: {
      strict: true
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand'
    ],
    exclude: [
      'chart.js',
      'react-chartjs-2',
      'framer-motion',
      '@dnd-kit/core',
      '@dnd-kit/sortable'
    ]
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    treeShaking: true
  }
}));
