import { aModelResult } from './builders/model-result.builder';
import { mockExecute } from './mocks/execute.mock';
import { expect, test } from './test';

test('generating adds the model result for the prompt to the workflow', async ({ network, page }) => {
  const prompt = 'a cat in a tiny hat';
  const result = mockExecute(network, aModelResult({ prompt }));
  await page.goto('/');

  await page.getByLabel('Prompt').fill(prompt);
  await page.getByRole('button', { name: 'Generate' }).click();

  const image = page.getByRole('list', { name: 'Your cats' }).getByRole('img', { name: prompt, exact: true });
  await expect(image).toHaveAttribute('src', result.imageUrl);
  // A broken image has a naturalWidth of 0.
  await expect(image).not.toHaveJSProperty('naturalWidth', 0);
});

test('with no credits left, Generate is disabled', async ({ page, signIn }) => {
  signIn({ credits: 0 });
  await page.goto('/');

  // Wait for the user first: Generate is also disabled while they load.
  await expect(page.getByText('0 credits')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generate' })).toBeDisabled();
});
