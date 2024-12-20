import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['lucide-react', 'react-hot-toast', 'framer-motion'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'date-utils': ['date-fns'],
          'health-analysis': [
            './src/services/PersonalizedML.ts',
            './src/services/health-analysis.ts',
            './src/services/health-data.ts'
          ],
          'ai-services': [
            './src/services/ai.ts',
            './src/services/gemini.ts'
          ]
        }
      }
    }
  }
});
