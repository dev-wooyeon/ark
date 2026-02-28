import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(
        __dirname,
        './src/shared/testing/server-only.ts'
      ),
    },
    coverage: {
      provider: 'v8',
      include: [
        'src/core/**/*.{ts,tsx}',
        'src/domains/**/*.{ts,tsx}',
        'src/features/**/*.{ts,tsx}',
        'src/shared/**/*.{ts,tsx}',
        'src/styles/**/*.{ts,tsx}',
        'src/components/visualization/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/shared/testing/**',
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
