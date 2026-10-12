import type { ModelResult } from '../../src/api';
import type { Network } from '../fixtures/network.fixture';

/**
 * Execute returns `result` for its prompt. Any other prompt is rejected, as the server rejects a bad request, so a test
 * that passes proves the app sent the prompt.
 */
export const mockExecute = (network: Network, result: ModelResult): ModelResult => {
  network.mockDefault('POST /execute', (request) => {
    const { prompt } = request.postDataJSON() as { prompt: string };
    if (prompt !== result.prompt) {
      return { status: 400, json: { error: `Execute got "${prompt}", not "${result.prompt}".` } };
    }
    return { json: result };
  });
  return result;
};
