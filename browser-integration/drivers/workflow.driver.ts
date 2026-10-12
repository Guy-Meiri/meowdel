import type { Locator, Page } from '@playwright/test';
import type { ModelResult } from '../../src/api';
import type { Network } from '../fixtures/network.fixture';
import { mockExecute } from '../mocks/execute.mock';

/** The workflow: the credits in the header, the prompt form, and the model's results so far. */
export class WorkflowDriver {
  constructor(
    private readonly page: Page,
    private readonly network: Network,
  ) {}

  readonly given = {
    /** Execute returns `result` for its prompt, and rejects any other. */
    executeReturns: (result: ModelResult): ModelResult => mockExecute(this.network, result),
  };

  readonly when = {
    generate: async (prompt: string): Promise<void> => {
      await this.page.getByLabel('Prompt').fill(prompt);
      await this.get.generateButton().click();
    },
  };

  readonly get = {
    credits: (): Locator => this.page.getByRole('banner').getByText(/credits?$/),
    generateButton: (): Locator => this.page.getByRole('button', { name: 'Generate' }),
    /** The image of the model result made from exactly `prompt`. */
    modelResult: (prompt: string): Locator =>
      this.page.getByRole('list', { name: 'Your cats' }).getByRole('img', { name: prompt, exact: true }),
  };
}
