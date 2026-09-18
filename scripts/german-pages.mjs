import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export const germanPageRoutes = [
  'pricing', 'privacy', 'impressum', 'legal-notice', 'factory-simulation-faq'
];

// Pages has no server-side SPA rewrites. Publish entry HTML for known routes
// (HTTP 200), plus the SPA fallback for any other clean URL.
export function germanPagesPlugin() {
  let config;
  return {
    name: 'german-pages-entrypoints',
    apply: 'build',
    configResolved(resolvedConfig) { config = resolvedConfig; },
    async closeBundle() {
      if (config.env.VITE_SITE_VARIANT !== 'de') return;
      const output = resolve(config.root, config.build.outDir);
      const entry = resolve(output, 'index.html');
      await copyFile(entry, resolve(output, '404.html'));
      for (const route of germanPageRoutes) {
        const directory = resolve(output, route);
        await mkdir(directory, { recursive: true });
        await copyFile(entry, resolve(directory, 'index.html'));
      }
    }
  };
}
