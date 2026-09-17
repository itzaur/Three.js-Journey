// vite.config.ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: [],
    exclude: [
      '@tanstack/start-server-core',
      '@tanstack/start-client-core', // Рекомендуется исключить и клиентское ядро
    ],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@sketches': '/sketches',
    },
  },
  plugins: [tanstackStart(), viteReact(), glsl()],
});
