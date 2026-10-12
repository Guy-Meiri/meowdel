import fs from 'node:fs';
import type { BrowserContext } from '@playwright/test';

/** Where model results' images live in tests. Every path serves the same test cat. */
export const MEDIA_ORIGIN = 'https://media.meowdel.test';
const TEST_CAT = fs.readFileSync(new URL('../assets/test-cat.svg', import.meta.url));

/** Serves the test cat for every path on {@link MEDIA_ORIGIN}, so images load offline. */
export const mockMedia = async (context: BrowserContext): Promise<void> => {
  await context.route(`${MEDIA_ORIGIN}/**`, (route) => route.fulfill({ contentType: 'image/svg+xml', body: TEST_CAT }));
};
