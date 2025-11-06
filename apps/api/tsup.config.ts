import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'node20',
  platform: 'node',
  bundle: true,
  noExternal: [],
  esbuildOptions(options) {
    // Resolve path aliases
    options.alias = {
      '@': './src',
    };
  },
});

