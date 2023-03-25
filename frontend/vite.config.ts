import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import { vitePluginVueTSC } from './vite-plugin-vue-tsc';

const isDocker = process.env.IS_DOCKER_COMPOSE === '1';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    checker({
      // typescript: { tsconfigPath: './tsconfig.app.json' },
      vueTsc: { root: '.', tsconfigPath: './tsconfig.app.json' }, // doesn't work :(
      eslint: { lintCommand: 'eslint' },
    }),
    vitePluginVueTSC({ tsconfigPath: './tsconfig.app.json' }),
  ],
  resolve: {
  },
  server: isDocker ? {
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '/api': 'http://api:3000',
    },
  } : {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  css: {
    preprocessorOptions: {
    },
  },
});
