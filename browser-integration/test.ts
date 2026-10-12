import { test as base } from '@playwright/test';
import type { User } from '../src/api';
import { aUser } from './builders/user.builder';
import { AppDriver } from './drivers/app.driver';
import { type Network, useNetwork } from './fixtures/network.fixture';
import { mockUser } from './mocks/user.mock';

/** Signs in `aUser(overrides)` instead of Dana. Call it before opening a page. */
type SignIn = (overrides?: Partial<User>) => User;

export const test = base.extend<{ network: Network; signIn: SignIn; appDriver: AppDriver }>({
  network: [async ({ baseURL, context }, use) => useNetwork(context, baseURL, use), { auto: true }],
  signIn: async ({ network }, use) => use((overrides) => mockUser(network, aUser(overrides))),
  appDriver: async ({ network, page }, use) => use(new AppDriver(page, network)),
});

export { expect } from '@playwright/test';
