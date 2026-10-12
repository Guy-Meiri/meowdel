import { expect, test } from './test';

// If the network rules break, every other test keeps passing, so they get tests of their own.

test('a request to any other host never leaves the machine', async ({ page }) => {
  const url = 'https://cataas.com/cat';
  const failed = page.waitForEvent('requestfailed', (request) => request.url() === url);

  await page.evaluate((otherHost) => fetch(otherHost).catch(() => undefined), url);

  // Chromium's error for a request a route aborted. One that went out and failed (CORS, DNS) reports differently.
  expect((await failed).failure()?.errorText).toBe('net::ERR_BLOCKED_BY_CLIENT.Inspector');
});
