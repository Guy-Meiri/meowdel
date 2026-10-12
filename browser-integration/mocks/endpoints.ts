import type { ModelResult, User } from '../../src/api';

/** Every API endpoint tests can answer, with the body the app reads from a successful response. */
export interface Endpoints {
  'GET /me': User;
  'GET /results': ModelResult[];
  'POST /execute': ModelResult;
}
