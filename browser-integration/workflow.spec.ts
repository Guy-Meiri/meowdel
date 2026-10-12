import { expect, test } from './test';

test('generating adds the model result for the prompt to the workflow', async ({ network, page }) => {
  network.mock('GET /me', () => ({ json: { name: 'Dana', credits: 3 } }));
  network.mock('GET /results', () => ({ json: [] }));
  network.mock('POST /execute', () => ({
    json: { id: 'result-1', prompt: 'a cat in a tiny hat', imageUrl: 'https://media.meowdel.test/result-1.svg' },
  }));
  await page.goto('/');

  await page.getByLabel('Prompt').fill('a cat in a tiny hat');
  await page.getByRole('button', { name: 'Generate' }).click();

  const image = page.getByRole('list', { name: 'Your cats' }).getByRole('img', { name: 'a cat in a tiny hat' });
  await expect(image).toHaveAttribute('src', 'https://media.meowdel.test/result-1.svg');
  // A broken image has a naturalWidth of 0.
  await expect(image).not.toHaveJSProperty('naturalWidth', 0);
});
