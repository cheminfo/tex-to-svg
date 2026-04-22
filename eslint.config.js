import { defineConfig } from 'eslint/config';
import { globals } from 'eslint-config-zakodium';
import react from 'eslint-config-zakodium/react';
import ts from 'eslint-config-zakodium/ts';
import unicorn from 'eslint-config-zakodium/unicorn';

export default defineConfig(
  ...ts,
  ...unicorn,
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/coverage',
      'backend/vitest.config.ts',
      'frontend/vite.config.ts',
    ],
  },
  {
    // Allow uppercase function calls (TypeBox Type.Object(), Type.String(), etc.)
    rules: {
      'new-cap': ['error', { capIsNew: false }],
    },
  },
  {
    files: ['backend/**'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    files: ['frontend/**'],
    extends: [...react],
  },
);
