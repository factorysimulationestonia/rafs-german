import { test, expect } from '@playwright/test';

const pages = [
  ['/', 'Smarte Simulationen.'],
  ['/pricing/', 'Ihre Angaben. Unsere Ingenieurarbeit.'],
  ['/privacy/', 'Datenschutz'],
  ['/impressum/', 'Impressum'],
  ['/legal-notice/', 'Rechtliche Hinweise'],
  ['/factory-simulation-faq/', 'FAQ zur Fertigungssimulation']
];

for (const [route, heading] of pages) {
  test(`direct load and hard refresh: ${route}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const path = `/rafs-german${route}`;
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(heading);
    await expect(page).toHaveURL(new RegExp(`${path}$`));

    // A fresh browser context handles direct load; disable cache for hard reload.
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    const refreshed = await page.reload();
    expect(refreshed.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(heading);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    expect(errors).toEqual([]);
  });
}

test('client navigation, contact anchor, and browser history', async ({ page }) => {
  await page.goto('/rafs-german/');
  await page.evaluate(() => { window.__routingDocument = 'same-document'; });
  await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Preise', exact: true }).click();
  await expect(page.locator('h1')).toContainText('Ihre Angaben.');
  await expect(page).toHaveURL(/\/rafs-german\/pricing\/$/);
  expect(await page.evaluate(() => window.__routingDocument)).toBe('same-document');
  await page.getByRole('link', { name: 'Phase 1 anfragen' }).click();
  await expect(page.locator('#kontakt')).toBeInViewport();
  await page.goBack();
  await expect(page.locator('h1')).toContainText('Ihre Angaben.');
});
