// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// //   build: {
// //     chunkSizeWarningLimit: 3000, // Increase the limit to suppress warnings
// //     rollupOptions: {
// //       output: {
// //         manualChunks: {
// //           // Example of splitting vendor libraries into separate chunks
// //           reactVendor: ['react', 'react-dom'], 
// //           utils: ['lodash', 'axios'], // Example for utility libraries
// //         },
// //       },
// //     },
// //   },
// // })
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     chunkSizeWarningLimit: 3000, // Increase the limit to suppress warnings
//     rollupOptions: {
//       external: ['react-hot-toast'], // Exclude react-hot-toast from the bundle
//       output: {
//         manualChunks: {
//           // Example of splitting vendor libraries into separate chunks
//           reactVendor: ['react', 'react-dom'],
//           utils: ['lodash', 'axios'], // Example for utility libraries
//         },
//       },
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      external: [], // Ensure no external dependencies like react-hot-toast are skipped
      output: {
        manualChunks: {
          reactVendor: ['react', 'react-dom'], // Only split React-related dependencies
        },
      },
    },
  },
});
