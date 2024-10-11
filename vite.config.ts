import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import federation from '@originjs/vite-plugin-federation';
import federationConfig from './federation.config';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const withPolling = env.HMR_POLLING === 'true';

  return {
    plugins: [
      react(),
      viteTsconfigPaths(),
      federation(federationConfig),
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
      coverage: {
        provider: 'v8',
        reporter: ['lcov', 'text', 'html'],
      },
      server: {
        deps: { inline: ['@hitachivantara/uikit-react-core', '@hitachi-genai/uikit-core'] },
      },
    },
    server: {
      host: true,
      strictPort: true,
      port: 3000,
      hmr: {
        port: 3001,
      },
      ...(withPolling
        ? {
            watch: {
              usePolling: true,
              interval: 1000,
            },
          }
        : {}),
    },
    preview: {
      port: 5001,
    },
  };
});
