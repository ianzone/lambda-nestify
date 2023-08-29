import { resolve } from 'path';
// @ts-ignore  https://github.com/vitejs/vite/issues/11552
import { loadEnv } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
// @ts-ignore
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  server: {
    port: parseInt(loadEnv(mode, process.cwd(), 'DEV_').DEV_PORT),
  },
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      tsCompiler: 'swc',
    }),
  ],
  optimizeDeps: {
    // Vite does not work well with optional dependencies,
    // mark them as ignored for now
    exclude: ['@nestjs/microservices', '@nestjs/websockets', 'class-transformer/storage'],
  },
}));
