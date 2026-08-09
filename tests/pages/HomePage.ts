import { Page, Locator } from "playwright-core";

export class HomePage {
  readonly page: Page;
  readonly cartBtn: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBtn = page.getByRole("link", {
      name: "장바구니 페이지로 이동",
    });
    this.logoutBtn = page.getByRole("link", { name: "로그아웃" });
  }

  async goto() {
    await this.page.goto("https://www.musinsa.com/");
  }
  async clickCartBtn() {
    await this.cartBtn.click();
  }
}
