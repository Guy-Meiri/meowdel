import { aUser } from '../builders/user.builder';
import type { Network } from '../fixtures/network.fixture';

/** What the workflow loads every time: Dana, with no results yet. The network fixture registers these for every test. */
export const mockDefaults = (network: Network): void => {
  network.mockDefault('GET /me', () => ({ json: aUser() }));
  network.mockDefault('GET /results', () => ({ json: [] }));
};
