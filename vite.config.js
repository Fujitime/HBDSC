import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  // Enable Vue plugin
  plugins: [vue()],

  // Set up aliasing for simpler imports (optional)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // e.g., allows import from "@/components/Component.vue"
    },
  },

  // Configure server settings
  server: {
    port: 3000, // Change to your preferred port
    strictPort: true, // If true, Vite will fail if port 3000 is not available
    open: true, // Automatically open browser on server start

    // CORS & Proxy settings (if applicable)
    cors: true, // Enable CORS if necessary for external APIs
    // If you're working with an API and need to avoid CORS errors, you can set up a proxy here
    // proxy: {
    //   '/api': {
    //     target: 'https://api.example.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },

  // Additional build options
  build: {
    outDir: 'dist', // Output directory for the build
    sourcemap: true, // Enable source maps for easier debugging
  },
});
