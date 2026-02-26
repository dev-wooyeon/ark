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
      'server-only': path.resolve(__dirname, './src/__tests__/server-only.ts'),
    },
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**/*.{ts,tsx}',
        'src/styles/**/*.{ts,tsx}',
        'src/components/blog/**/*.{ts,tsx}',
        'src/components/layout/**/*.{ts,tsx}',
        'src/components/ui/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/__tests__/**',
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
