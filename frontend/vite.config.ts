import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ftl from 'vite-plugin-fluent-js-ftl'
import checker from 'vite-plugin-checker';
import { vitePluginVueTSC } from './vite-plugin-vue-tsc';

const isDocker = process.env.IS_DOCKER_COMPOSE === '1';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ftl(),
    vue(),
    checker({
      // typescript: { tsconfigPath: './tsconfig.json' },
      // vueTsc: { root: '.', tsconfigPath: './tsconfig.json' }, // doesn't work :(
      eslint: { lintCommand: 'eslint src --ext .vue,.js,.cjs,.mjs,.ts,.cts,.mts --ignore-path .gitignore' },
    }),
    vitePluginVueTSC({ tsconfigPath: './tsconfig.json' }),
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
