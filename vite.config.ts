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
