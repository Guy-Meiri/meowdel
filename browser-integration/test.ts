import { test as base } from '@playwright/test';
import { type Network, useNetwork } from './fixtures/network.fixture';

export const test = base.extend<{ network: Network }>({
  network: [async ({ context }, use) => useNetwork(context, use), { auto: true }],
});

export { expect } from '@playwright/test';
