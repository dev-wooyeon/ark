import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'server-only': path.resolve(
        __dirname,
        './shared/testing/server-only.ts'
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: [
      'blog/**/*.test.ts',
      'blog/**/*.test.tsx',
      'platform/**/*.test.ts',
      'platform/**/*.test.tsx',
      'resume/**/*.test.ts',
      'resume/**/*.test.tsx',
      'search/**/*.test.ts',
      'search/**/*.test.tsx',
      'shared/**/*.test.ts',
      'shared/**/*.test.tsx',
      'site/**/*.test.ts',
      'site/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'styles/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'blog/**/*.{ts,tsx}',
        'platform/**/*.{ts,tsx}',
        'resume/**/*.{ts,tsx}',
        'search/**/*.{ts,tsx}',
        'shared/**/*.{ts,tsx}',
        'site/**/*.{ts,tsx}',
        'src/app/**/*.{ts,tsx}',
        'styles/**/*.{ts,tsx}',
      ],
      exclude: [
        'shared/testing/**',
        '**/*.types.ts',
        '**/index.ts',
        '**/index.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
    },
  },
});
