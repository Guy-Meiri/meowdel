import type { BrowserContext, Request, Route } from '@playwright/test';

/** The app's API in tests (see .env.test). Nothing answers at this host; tests do, with `network.mock`. */
export const API_ORIGIN = 'https://api.meowdel.test';

/** An API endpoint, as `METHOD /path`: `'GET /results'`. */
export type Endpoint = `${'GET' | 'POST' | 'PUT' | 'DELETE'} /${string}`;
/** Answers one request. */
export type Respond = (request: Request) => Parameters<Route['fulfill']>[0];

export interface Network {
  /** Answers `endpoint` for the rest of the test. */
  mock: (endpoint: Endpoint, respond: Respond) => void;
}

/**
 * Answers the app's API calls with the test's mocks. A call nobody mocked falls back to the network, as it did before
 * this fixture, and fails there because the host doesn't exist.
 */
export const useNetwork = async (context: BrowserContext, use: (network: Network) => Promise<void>): Promise<void> => {
  const mocks = new Map<string, Respond>();

  await context.route(`${API_ORIGIN}/**`, (route) => {
    const request = route.request();
    const endpoint = `${request.method()} ${new URL(request.url()).pathname}`;
    const respond = mocks.get(endpoint);
    return respond ? route.fulfill(respond(request)) : route.fallback();
  });

  await use({ mock: (endpoint, respond) => void mocks.set(endpoint, respond) });
};
