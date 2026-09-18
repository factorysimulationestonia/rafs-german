import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/routing',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { channel: 'chrome', headless: true },
  projects: [
    { name: 'vite-development', use: { baseURL: 'http://localhost:5173' } },
    { name: 'github-pages-artifact', use: { baseURL: 'http://127.0.0.1:4179' } }
  ],
  webServer: [
    {
      command: 'npm run dev:de -- --host localhost --port 5173 --strictPort',
      url: 'http://localhost:5173/rafs-german/',
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'node scripts/serve-pages-test.mjs',
      url: 'http://127.0.0.1:4179/rafs-german/',
      reuseExistingServer: false
    }
  ]
});
