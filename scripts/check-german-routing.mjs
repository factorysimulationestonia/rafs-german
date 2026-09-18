import assert from 'node:assert/strict';
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

const temporaryModule = fileURLToPath(new URL(`.routing-check-${process.pid}.mjs`, import.meta.url));
try {
  const result = await build({
    entryPoints: ['src/GermanSite.jsx'], bundle: true, write: false,
    format: 'esm', platform: 'node', packages: 'external',
    define: { 'import.meta.env': '{}' }
  });
  await writeFile(temporaryModule, result.outputFiles[0].text);
  const { default: GermanSite } = await import(pathToFileURL(temporaryModule));
  globalThis.window = { location: { origin: 'https://example.github.io' } };
  const props = {
    basePath: '/rafs-german/', isDedicatedSite: true,
    assetPath: (path) => `/rafs-german${path}`, contactEndpoint: '',
    privacyDetails: { title: 'Datenschutz', intro: '', sections: [] },
    t: { team: [], faq: { title: 'FAQ', intro: [], items: [] } }
  };
  const makeRouter = (path, overrides = {}) => createMemoryRouter(
    [{ path: '*', element: React.createElement(GermanSite, { ...props, ...overrides }) }],
    { basename: '/rafs-german', initialEntries: [path] }
  );
  const render = (router) => renderToStaticMarkup(React.createElement(RouterProvider, { router }));
  for (const [route, expected] of [
    ['/', 'id="kontakt"'], ['/pricing/', 'Festpreis: 990 €'],
    ['/pricing', 'Festpreis: 990 €'], ['/privacy/', 'Datenschutz'],
    ['/impressum/', 'Anbieter'], ['/legal-notice/', 'Rechtliche Hinweise'],
    ['/factory-simulation-faq/', 'FAQ']
  ]) {
    const router = makeRouter(`/rafs-german${route}`);
    const html = render(router);
    assert.ok(html.includes(expected), `Direct route ${route}`);
    assert.ok(html.includes('href="/rafs-german/pricing/"'));
    assert.ok(!html.includes('/rafs-german/rafs-german/'));
    router.dispose();
  }
  const router = makeRouter('/rafs-german/pricing/');
  assert.equal((render(router).match(/class="de2-button de2-button--dark" href="\/rafs-german\/?#kontakt"/g) || []).length, 3);
  await router.navigate('/#kontakt');
  assert.ok(render(router).includes('id="kontakt"'));
  assert.equal(router.state.location.hash, '#kontakt');
  await router.navigate(-1);
  assert.ok(render(router).includes('Festpreis: 990 €'));
  router.dispose();
  const combined = makeRouter('/rafs-german/de/pricing/', { isDedicatedSite: false });
  assert.ok(render(combined).includes('href="/rafs-german/de/#kontakt"'));
  combined.dispose();
  assert.match(await readFile('vite.config.js', 'utf8'), /base: '\/rafs-german\/'/);
  assert.match(await readFile('.github/workflows/deploy.yml', 'utf8'), /cp dist\/index\.html dist\/404\.html/);
  console.log('Passed: direct routes, basename, pricing contact links, navigation/back, combined German route, and Pages fallback configuration.');
} finally {
  await unlink(temporaryModule).catch(() => {});
}
