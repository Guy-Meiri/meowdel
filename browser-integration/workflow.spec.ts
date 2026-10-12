import { expect, test } from '@playwright/test';

test('generating adds the model result for the prompt to the workflow', async ({ page }) => {
  await page.route('https://api.meowdel.test/me', (route) => route.fulfill({ json: { name: 'Dana', credits: 3 } }));
  await page.route('https://api.meowdel.test/results', (route) => route.fulfill({ json: [] }));
  await page.route('https://api.meowdel.test/execute', (route) =>
    route.fulfill({
      json: { id: 'result-1', prompt: 'a cat in a tiny hat', imageUrl: 'https://media.meowdel.test/result-1.svg' },
    }),
  );
  await page.goto('/');

  await page.getByLabel('Prompt').fill('a cat in a tiny hat');
  await page.getByRole('button', { name: 'Generate' }).click();

  const image = page.getByRole('list', { name: 'Your cats' }).getByRole('img', { name: 'a cat in a tiny hat' });
  await expect(image).toHaveAttribute('src', 'https://media.meowdel.test/result-1.svg');
});
