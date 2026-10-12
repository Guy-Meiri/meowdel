import { aModelResult } from './builders/model-result.builder';
import { AppDriver } from './drivers/app.driver';
import { expect, test } from './test';

test('generating adds the model result for the prompt to the workflow', async ({ network, page }) => {
  const prompt = 'a cat in a tiny hat';
  const appDriver = new AppDriver(page, network);
  const workflowDriver = await appDriver.openWorkflow();
  const result = workflowDriver.given.executeReturns(aModelResult({ prompt }));

  await workflowDriver.when.generate(prompt);

  await expect(workflowDriver.get.modelResult(prompt)).toHaveAttribute('src', result.imageUrl);
  // A broken image has a naturalWidth of 0.
  await expect(workflowDriver.get.modelResult(prompt)).not.toHaveJSProperty('naturalWidth', 0);
});

test('with no credits left, Generate is disabled', async ({ network, page, signIn }) => {
  signIn({ credits: 0 });
  const appDriver = new AppDriver(page, network);
  const workflowDriver = await appDriver.openWorkflow();

  await expect(workflowDriver.get.credits()).toHaveText('Dana · 0 credits');
  await expect(workflowDriver.get.generateButton()).toBeDisabled();
});
