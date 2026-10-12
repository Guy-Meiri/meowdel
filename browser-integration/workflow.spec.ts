import { aModelResult } from './builders/model-result.builder';
import { aUser } from './builders/user.builder';
import { expect, test } from './test';

test('generating adds the model result for the prompt to the workflow', async ({ network, page }) => {
  const result = aModelResult({ prompt: 'a cat in a tiny hat' });
  network.mock('GET /me', () => ({ json: aUser() }));
  network.mock('GET /results', () => ({ json: [] }));
  network.mock('POST /execute', () => ({ json: result }));
  await page.goto('/');

  await page.getByLabel('Prompt').fill('a cat in a tiny hat');
  await page.getByRole('button', { name: 'Generate' }).click();

  const image = page.getByRole('list', { name: 'Your cats' }).getByRole('img', { name: 'a cat in a tiny hat' });
  await expect(image).toHaveAttribute('src', result.imageUrl);
  // A broken image has a naturalWidth of 0.
  await expect(image).not.toHaveJSProperty('naturalWidth', 0);
});
