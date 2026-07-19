import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      'server-only': path.resolve(__dirname, './tests/support/server-only.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: [
      'blog/**/*.test.ts',
      'blog/**/*.test.tsx',
      'infra/**/*.test.ts',
      'infra/**/*.test.tsx',
      'resume/**/*.test.ts',
      'resume/**/*.test.tsx',
      'ui/**/*.test.ts',
      'ui/**/*.test.tsx',
      'site/**/*.test.ts',
      'site/**/*.test.tsx',
      'app/**/*.test.ts',
      'app/**/*.test.tsx',
      'styles/**/*.test.ts',
      'tooling/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'blog/**/*.{ts,tsx}',
        'infra/**/*.{ts,tsx}',
        'resume/**/*.{ts,tsx}',
        'ui/**/*.{ts,tsx}',
        'site/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}',
        'styles/**/*.{ts,tsx}',
      ],
      exclude: [
        'tests/support/**',
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
