import { type BrowserContext, expect, type Request, type Route } from '@playwright/test';
import { mockMedia } from '../mocks/media.mock';

/** The app's API in tests (see .env.test). Nothing answers at this host; tests do, with `network.mock`. */
export const API_ORIGIN = 'https://api.meowdel.test';

/** An API endpoint, as `METHOD /path`: `'GET /results'`. */
export type Endpoint = `${'GET' | 'POST' | 'PUT' | 'DELETE'} /${string}`;
/** Answers one request. */
export type Respond = (request: Request) => Parameters<Route['fulfill']>[0];

export interface Network {
  /** Answers `endpoint` for the rest of the test. */
  mock: (endpoint: Endpoint, respond: Respond) => void;
  /**
   * For the network rules' own test: returns the unmocked calls so far and forgets them, so they don't fail the test
   * when it ends. Any other test should mock the call instead.
   */
  takeUnmocked: () => string[];
}

/**
 * Answers or blocks every request the browser makes. The app's own files load as usual. API calls get the test's mocks,
 * the third parties in mocks/ get theirs, and anything else is aborted, so no test reaches the internet. An API call
 * with no mock gets a 404, and fails the test when it ends. Calls after the test body ends, as a closing page may
 * make, don't count.
 */
export const useNetwork = async (
  context: BrowserContext,
  baseURL: string | undefined,
  use: (network: Network) => Promise<void>,
): Promise<void> => {
  if (!baseURL) throw new Error('The network fixture needs `use.baseURL` to tell the app from everything else.');
  const appOrigin = new URL(baseURL).origin;
  const mocks = new Map<string, Respond>();
  const unmocked = new Set<string>();
  let isTestRunning = true;

  // Playwright tries the routes registered last first, so the ones below answer before this aborts the rest.
  await context.route(
    (url) => url.origin !== appOrigin,
    (route) => route.abort('blockedbyclient'),
  );
  await mockMedia(context);
  await context.route(`${API_ORIGIN}/**`, (route) => {
    const request = route.request();
    const endpoint = `${request.method()} ${new URL(request.url()).pathname}`;
    const respond = mocks.get(endpoint);
    if (respond) return route.fulfill(respond(request));
    if (isTestRunning) unmocked.add(endpoint);
    return route.fulfill({ status: 404, body: `No mock for ${endpoint}` });
  });

  await use({
    mock: (endpoint, respond) => void mocks.set(endpoint, respond),
    takeUnmocked: () => {
      const calls = [...unmocked];
      unmocked.clear();
      return calls;
    },
  });

  isTestRunning = false;
  expect([...unmocked], 'API calls without a mock. Mock them in the test.').toEqual([]);
};
