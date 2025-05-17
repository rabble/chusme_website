import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Allows using vi, describe, it, etc. without imports in test files
    environment: 'miniflare', // Simulate Cloudflare Workers environment
    // Optional: environmentOptions for miniflare if needed
    // environmentOptions: {
    //   kvNamespaces: ["INVITES"],
    // },
    // Specify where your tests are located
    include: ['src/**/*.test.ts'],
  },
}); 