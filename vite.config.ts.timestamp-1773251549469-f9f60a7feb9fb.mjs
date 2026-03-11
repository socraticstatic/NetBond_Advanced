// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-*.png", "robots.txt", "sitemap.xml", "_headers", ".htaccess", "vercel.json"],
      manifest: false,
      // Use our custom manifest.json
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // 5MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5
                // 5 minutes
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ],
  base: "./",
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    reportCompressedSize: false,
    // Disable to speed up build
    chunkSizeWarningLimit: 500,
    // Stricter limit
    sourcemap: false,
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/scheduler/")) {
            return "react";
          }
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run")) {
            return "router";
          }
          if (id.includes("node_modules/chart.js") || id.includes("node_modules/react-chartjs-2")) {
            return "charts";
          }
          if (id.includes("node_modules/@dnd-kit")) {
            return "dnd";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "motion";
          }
          if (id.includes("node_modules/lucide-react")) {
            if (id.includes("activity") || id.includes("settings") || id.includes("chevron") || id.includes("x")) {
              return "icons-common";
            }
            if (id.includes("bar-chart") || id.includes("trending") || id.includes("alert") || id.includes("clock")) {
              return "icons-monitoring";
            }
            if (id.includes("network") || id.includes("router") || id.includes("cloud") || id.includes("server")) {
              return "icons-network";
            }
            return "icons-other";
          }
          if (id.includes("node_modules/zustand")) {
            return "store";
          }
          if (id.includes("/src/components/monitoring/")) {
            if (id.includes("/charts/") || id.includes("/metrics/")) {
              return "monitoring-charts";
            }
            if (id.includes("/mobile/")) {
              return "monitoring-mobile";
            }
            return "monitoring";
          }
          if (id.includes("/src/components/wizard/")) {
            return "wizard";
          }
          if (id.includes("/src/components/network-designer/")) {
            return "network-designer";
          }
          if (id.includes("/src/components/configure/")) {
            return "configure";
          }
          if (id.includes("/src/components/control-center/")) {
            return "control-center";
          }
          if (id.includes("/src/components/group")) {
            return "groups";
          }
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
    // Enable more aggressive minification
  },
  server: {
    fs: {
      strict: true
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand"
    ],
    exclude: [
      "chart.js",
      "react-chartjs-2",
      "framer-motion",
      // Let this be dynamically imported
      "@dnd-kit/core",
      "@dnd-kit/sortable"
    ]
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    // Remove unused imports
    treeShaking: true
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnaWNvbi0qLnBuZycsICdyb2JvdHMudHh0JywgJ3NpdGVtYXAueG1sJywgJ19oZWFkZXJzJywgJy5odGFjY2VzcycsICd2ZXJjZWwuanNvbiddLFxuICAgICAgbWFuaWZlc3Q6IGZhbHNlLCAvLyBVc2Ugb3VyIGN1c3RvbSBtYW5pZmVzdC5qc29uXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyx3b2ZmMn0nXSxcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDUgKiAxMDI0ICogMTAyNCwgLy8gNU1CXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdnb29nbGUtZm9udHMtY2FjaGUnLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1IC8vIDEgeWVhclxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcLy4qXFwuc3VwYWJhc2VcXC5jb1xcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnTmV0d29ya0ZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnc3VwYWJhc2UtYXBpLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNSAvLyA1IG1pbnV0ZXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbmV0d29ya1RpbWVvdXRTZWNvbmRzOiAxMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ21vZHVsZSdcbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICBiYXNlOiAnLi8nLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSwgLy8gRGlzYWJsZSB0byBzcGVlZCB1cCBidWlsZFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBTdHJpY3RlciBsaW1pdFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcbiAgICAgICAgICAvLyBDb3JlIFJlYWN0IC0ga2VlcCBzbWFsbCBhbmQgc2VwYXJhdGVcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC8nKSB8fCBcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1kb20vJykgfHwgXG4gICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvc2NoZWR1bGVyLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3JlYWN0JztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gUmVhY3QgUm91dGVyIC0gc2VwYXJhdGUgY2h1bmtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXInKSB8fCBcbiAgICAgICAgICAgICAgaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AcmVtaXgtcnVuJykpIHtcbiAgICAgICAgICAgIHJldHVybiAncm91dGVyJztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ2hhcnQuanMgLSBvbmx5IGxvYWQgd2hlbiBuZWVkZWRcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9jaGFydC5qcycpIHx8IFxuICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LWNoYXJ0anMtMicpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NoYXJ0cyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIERuRCBLaXQgLSBvbmx5IGZvciBjb250cm9sIGNlbnRlclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0BkbmQta2l0JykpIHtcbiAgICAgICAgICAgIHJldHVybiAnZG5kJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBGcmFtZXIgTW90aW9uIC0gc2VwYXJhdGUgY2h1bmtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnbW90aW9uJztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gTHVjaWRlIEljb25zIC0gc3BsaXQgYnkgdXNhZ2UgZnJlcXVlbmN5XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvbHVjaWRlLXJlYWN0JykpIHtcbiAgICAgICAgICAgIC8vIENvbW1vbiBpY29ucyB1c2VkIGV2ZXJ5d2hlcmVcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnYWN0aXZpdHknKSB8fCBpZC5pbmNsdWRlcygnc2V0dGluZ3MnKSB8fCBcbiAgICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnY2hldnJvbicpIHx8IGlkLmluY2x1ZGVzKCd4JykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdpY29ucy1jb21tb24nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTW9uaXRvcmluZyBzcGVjaWZpYyBpY29uc1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdiYXItY2hhcnQnKSB8fCBpZC5pbmNsdWRlcygndHJlbmRpbmcnKSB8fCBcbiAgICAgICAgICAgICAgICBpZC5pbmNsdWRlcygnYWxlcnQnKSB8fCBpZC5pbmNsdWRlcygnY2xvY2snKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2ljb25zLW1vbml0b3JpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTmV0d29yayBzcGVjaWZpYyBpY29uc1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCduZXR3b3JrJykgfHwgaWQuaW5jbHVkZXMoJ3JvdXRlcicpIHx8IFxuICAgICAgICAgICAgICAgIGlkLmluY2x1ZGVzKCdjbG91ZCcpIHx8IGlkLmluY2x1ZGVzKCdzZXJ2ZXInKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2ljb25zLW5ldHdvcmsnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICdpY29ucy1vdGhlcic7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFp1c3RhbmQgLSBzbWFsbCwgY2FuIGJlIHdpdGggbWFpbiBidW5kbGVcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy96dXN0YW5kJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnc3RvcmUnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvLyBGZWF0dXJlLWJhc2VkIGNodW5rcyAtIG1vcmUgZ3JhbnVsYXJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvY29tcG9uZW50cy9tb25pdG9yaW5nLycpKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9jaGFydHMvJykgfHwgaWQuaW5jbHVkZXMoJy9tZXRyaWNzLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnbW9uaXRvcmluZy1jaGFydHMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvbW9iaWxlLycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnbW9uaXRvcmluZy1tb2JpbGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICdtb25pdG9yaW5nJztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvc3JjL2NvbXBvbmVudHMvd2l6YXJkLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3dpemFyZCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy9jb21wb25lbnRzL25ldHdvcmstZGVzaWduZXIvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnbmV0d29yay1kZXNpZ25lcic7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy9jb21wb25lbnRzL2NvbmZpZ3VyZS8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICdjb25maWd1cmUnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvY29tcG9uZW50cy9jb250cm9sLWNlbnRlci8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICdjb250cm9sLWNlbnRlcic7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy9jb21wb25lbnRzL2dyb3VwJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnZ3JvdXBzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gS2VlcCBjb25uZWN0aW9uIGNvbXBvbmVudHMgd2l0aCBtYWluIGJ1bmRsZSBhcyB0aGV5J3JlIHVzZWQgZnJlcXVlbnRseVxuICAgICAgICAgIC8vIE90aGVyIHZlbmRvciBjb2RlXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XSdcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIEVuYWJsZSBtb3JlIGFnZ3Jlc3NpdmUgbWluaWZpY2F0aW9uXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IHRydWVcbiAgICB9XG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsIFxuICAgICAgJ3JlYWN0LWRvbScsIFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ3p1c3RhbmQnXG4gICAgXSxcbiAgICBleGNsdWRlOiBbXG4gICAgICAnY2hhcnQuanMnLCBcbiAgICAgICdyZWFjdC1jaGFydGpzLTInLFxuICAgICAgJ2ZyYW1lci1tb3Rpb24nLCAvLyBMZXQgdGhpcyBiZSBkeW5hbWljYWxseSBpbXBvcnRlZFxuICAgICAgJ0BkbmQta2l0L2NvcmUnLFxuICAgICAgJ0BkbmQta2l0L3NvcnRhYmxlJ1xuICAgIF1cbiAgfSxcbiAgZXNidWlsZDoge1xuICAgIGxvZ092ZXJyaWRlOiB7ICd0aGlzLWlzLXVuZGVmaW5lZC1pbi1lc20nOiAnc2lsZW50JyB9LFxuICAgIC8vIFJlbW92ZSB1bnVzZWQgaW1wb3J0c1xuICAgIHRyZWVTaGFraW5nOiB0cnVlXG4gIH1cbn0pKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9B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
