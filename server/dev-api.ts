import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import type { ModelResult, User } from '../src/api';

/**
 * The API, for `pnpm dev` only: an in-memory user and results, and a "model" that answers every prompt with a random
 * cat from cataas.com. Restarting the dev server resets it. Tests never reach this; they answer the API themselves.
 */
export const devApi = (): Plugin => ({
  name: 'meowdel-dev-api',
  configureServer(server) {
    const user: User = { name: 'Dana', credits: 5 };
    const results: ModelResult[] = [];

    server.middlewares.use('/api', async (request, response) => {
      const endpoint = `${request.method} ${request.url}`;
      if (endpoint === 'GET /me') return send(response, 200, user);
      if (endpoint === 'GET /results') return send(response, 200, results);
      if (endpoint === 'POST /execute') {
        if (user.credits === 0) return send(response, 402, { error: 'No credits left' });
        const { prompt } = await readJson<{ prompt: string }>(request);
        const id = crypto.randomUUID();
        const result = { id, prompt, imageUrl: `https://cataas.com/cat?width=400&height=400&id=${id}` };
        results.unshift(result);
        user.credits -= 1;
        return send(response, 200, result);
      }
      send(response, 404, { error: `No route for ${endpoint}` });
    });
  },
});

const send = (response: ServerResponse, status: number, body: unknown) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
};

const readJson = async <T>(request: IncomingMessage): Promise<T> => {
  let body = '';
  for await (const chunk of request) body += chunk;
  return JSON.parse(body);
};
