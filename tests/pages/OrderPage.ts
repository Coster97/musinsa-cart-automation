import { Page } from "@playwright/test";

export class OrderPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
}
