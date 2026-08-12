import { Page, Locator } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly optionDropdown: Locator;
  readonly cartBtn: Locator;
  readonly addToCartCompletePopup: Locator;
  readonly viewCartBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.optionDropdown = page.locator('[data-mds="StaticDropdownMenu"]');
    this.cartBtn = page.locator('button[data-button-name="장바구니담기"]');
    this.addToCartCompletePopup = page.locator(
      `div[class*="UILayerPopup__PopupContainer"]`,
    );
    this.viewCartBtn = this.addToCartCompletePopup.locator(
      'a[data-button-name="장바구니 바로가기"][data-mds="Button"]',
    );
  }

  async selectOption() {
    await this.optionDropdown.first().waitFor({
      state: "visible",
    });
    const optionCount = await this.optionDropdown.count();

    for (let i = 0; i < optionCount; i++) {
      const dropdown = this.optionDropdown.nth(i);

      // 해당 옵션의 드롭다운 열기
      await dropdown.locator('[data-mds="DropdownTriggerBox"]').click();

      // 해당 드롭다운의 옵션들
      const optionItems = dropdown.locator(
        '[data-mds="StaticDropdownMenuItem"]',
      );

      const optionItemCount = await optionItems.count();

      for (let j = 0; j < optionItemCount; j++) {
        const item = optionItems.nth(j);

        if (await item.isEnabled()) {
          await item.click();
          break;
        }
      }
    }
  }

  async clickCartBtn() {
    await this.cartBtn.click();
  }

  async clickViewCartBtn() {
    await this.viewCartBtn.click();
  }
}
