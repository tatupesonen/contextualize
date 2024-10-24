import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(), // For React in the popup
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        contentScript: './src/contentScript.ts', 
        background: "./src/background.ts"
      },
      output: {
        entryFileNames: '[name].js', // Keep file names clear (popup.js, background.js)
      },
    },
  },
});