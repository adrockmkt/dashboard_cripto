import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/cripto-dashboard/' : '/',
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      port: 8080,
    },
    allowedHosts: [
      '*.manusvm.computer',
    ],
  },
  optimizeDeps: {
    include: [
      'i18next',
      'react-i18next',
      '@tanstack/react-virtual',
      'jspdf',
      'jspdf-autotable'
    ],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }

          if (id.includes("@tanstack")) {
            return "query-vendor";
          }

          if (id.includes("recharts") || id.includes("d3-")) {
            return "charts-vendor";
          }

          if (id.includes("@radix-ui")) {
            return "ui-vendor";
          }

          if (id.includes("html2canvas")) {
            return "html2canvas-vendor";
          }

          if (id.includes("jspdf")) {
            return "jspdf-vendor";
          }

          if (id.includes("lightweight-charts") || id.includes("react-ts-tradingview-widgets")) {
            return "trading-vendor";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'copy-sw',
      closeBundle() {
        copyFileSync('public/sw.js', 'dist/sw.js');
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
