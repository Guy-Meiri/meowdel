import type { Page } from '@playwright/test';
import { API_ORIGIN } from './fixtures/network.fixture';
import { expect, test } from './test';

const statusOf = (page: Page, path: string): Promise<number> =>
  page.evaluate((url) => fetch(url).then((response) => response.status), `${API_ORIGIN}${path}`);

// If the network rules break, every other test keeps passing, so they get tests of their own.

test('an API call without a mock gets a 404 and is recorded to fail the test', async ({ network, page }) => {
  await page.goto('/');

  expect(await statusOf(page, '/never-mocked')).toBe(404);
  // The network fixture fails any test whose list isn't empty when it ends.
  expect(network.takeUnmocked()).toEqual(['GET /never-mocked']);
});

test("a test's mock wins over a default registered later", async ({ network, page }) => {
  network.mock('GET /results', () => ({ status: 418 }));
  network.mockDefault('GET /results', () => ({ status: 200 }));
  await page.goto('/');

  expect(await statusOf(page, '/results')).toBe(418);
});

test('a request to any other host never leaves the machine', async ({ page }) => {
  const url = 'https://cataas.com/cat';
  const failed = page.waitForEvent('requestfailed', (request) => request.url() === url);

  await page.evaluate((otherHost) => fetch(otherHost).catch(() => undefined), url);

  // Chromium's error for a request a route aborted. One that went out and failed (CORS, DNS) reports differently.
  expect((await failed).failure()?.errorText).toBe('net::ERR_BLOCKED_BY_CLIENT.Inspector');
});
