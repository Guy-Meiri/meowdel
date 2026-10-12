import type { User } from '../../src/api';
import type { Network } from '../fixtures/network.fixture';

/** The signed-in user is `user`, instead of Dana from the defaults. */
export const mockUser = (network: Network, user: User): User => {
  network.mockDefault('GET /me', () => ({ json: user }));
  return user;
};
