import { defineConfig, mergeConfig } from 'vite';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test/setup.js',
      include: ['test/**/*.spec.js'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'test/', '*.config.js'],
      },
    },
  })
);
