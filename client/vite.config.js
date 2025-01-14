import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000, // Increase the limit to suppress warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Example of splitting vendor libraries into separate chunks
          reactVendor: ['react', 'react-dom'], 
          utils: ['lodash', 'axios'], // Example for utility libraries
        },
      },
    },
  },
})
