import type { Page } from '@playwright/test';
import type { Network } from '../fixtures/network.fixture';
import { WorkflowDriver } from './workflow.driver';

/** Where a test enters the app. It opens pages and returns their drivers; pages are served through the test's network. */
export class AppDriver {
  constructor(
    private readonly page: Page,
    private readonly network: Network,
  ) {}

  /** Opens the workflow, once the user has loaded. Until then, Generate is disabled. */
  async openWorkflow(): Promise<WorkflowDriver> {
    const workflowDriver = new WorkflowDriver(this.page, this.network);
    await this.page.goto('/');
    await workflowDriver.get.credits().waitFor();
    return workflowDriver;
  }
}
