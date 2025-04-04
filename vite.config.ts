import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

/**
 * Vite Configuration
 * 
 * Configures the build tool with:
 * - React plugin for JSX support
 * - Path aliases for easier imports (@/ points to src/)
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});