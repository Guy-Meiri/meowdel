import type { User } from '../../src/api';

/** A signed-in user with credits to spend. */
export const aUser = (overrides: Partial<User> = {}): User => ({ name: 'Dana', credits: 3, ...overrides });
