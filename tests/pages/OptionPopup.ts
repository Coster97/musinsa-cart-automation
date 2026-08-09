import { Page, Locator, expect } from "@playwright/test";

export class OptionPopup {
  readonly page: Page;
  readonly pageAlert: Locator; //페이지 공통 얼럿, 팝업

  readonly optionChangeModal: Locator; //옵션 변경 팝업
  readonly optionDropdownHeader: Locator; //옵션 변경 팝업 헤더
  readonly optionDropdownList: Locator; //옵션 리스트

  readonly option: Locator; //옵션
  readonly optionName: Locator; //옵션명

  readonly optionQuantitySection: Locator; //옵션 수량 영역
  readonly optionQuantity: Locator; //옵션 수량
  readonly optionQuantity_minusBtn: Locator; //옵션 수량 마이너스 버튼
  readonly optionQuantity_plusBtn: Locator; //옵션 수량 플러스 버튼
  readonly productTotalPrice: Locator; //옵션*수량 가격

  readonly optionChageCancelBtn: Locator; //옵션 변경 취소 버튼
  readonly optionChageConfirmBtn: Locator; //옵션 변경하기 버튼

  constructor(page: Page) {
    this.page = page;
    this.pageAlert = page.getByRole("dialog");

    this.optionChangeModal = this.pageAlert.locator(
      'div[class*="OptionChangeOverlay"]',
    );
    this.optionDropdownHeader = page
      .locator('div[data-mds="DropdownTriggerBox"]')
      .nth(0);
    this.optionDropdownList = page.locator(
      'div[data-mds="StaticDropdownMenuContent"]',
    );
    this.option = page
      .locator('div[data-mds="StaticDropdownMenuItem"]:not([data-disabled])')
      .nth(0);
    this.optionName = this.option.locator('span[data-mds="Typography"]').nth(0);

    this.optionQuantitySection = page.locator(
      'div[class*="QuantityCard__CardInfo-sc"]',
    );
    this.optionQuantity = page.locator('input[data-mds="StepperItemCount"]');
    this.optionQuantity_minusBtn = page.locator(
      'button[data-mds="StepperItemMinus"]',
    );
    this.optionQuantity_plusBtn = page.locator(
      'button[data-mds="StepperItemPlus"]',
    );
    this.productTotalPrice = this.optionQuantitySection.locator(
      'span[data-mds="Typography"]',
    );
    this.optionChageCancelBtn = page
      .locator("div[class*=OptionChangeOverlay__ButtonList]")
      .getByRole("button", { name: "취소" });
    this.optionChageConfirmBtn = page
      .locator("div[class*=OptionChangeOverlay__ButtonList]")
      .getByRole("button", { name: "변경하기" });
  }

  async clickDropdownHeader() {
    await this.optionDropdownHeader.click();
  }
  async clickOption() {
    await this.option.click();
  }
  async clickQuantity_minusBtn() {
    await this.optionQuantity_minusBtn.click();
  }
  async clickQuantity_plusBtn() {
    await this.optionQuantity_plusBtn.click();
  }
  async verifyQuantityChange(btn: string, count: number): Promise<void> {
    const beforeQuantity = Number(await this.optionQuantity.inputValue());
    let expectedQuantity = 0;
    if (btn == "-") {
      for (let i = 0; i < count; i++) {
        await this.optionQuantity_minusBtn.click();
      }
      expectedQuantity = beforeQuantity - count;
    } else if (btn == "+") {
      for (let i = 0; i < count; i++) {
        await this.optionQuantity_plusBtn.click();
      }
      expectedQuantity = beforeQuantity + count;
    }
    await expect(this.optionQuantity).toHaveValue(String(expectedQuantity));
  }
  async verifyQuantityPrice(
    price: string,
    previousCount: number,
    currentCount: string,
  ): Promise<void> {
    const previousTotalPrice = Number(price.replace(/[^\d]/g, ""));
    const unitPrice = previousTotalPrice / previousCount;
    const expectedPrice = unitPrice * Number(currentCount);
    const actualPrice = Number(
      (await this.productTotalPrice.innerText()).replace(/[^\d]/g, ""),
    );

    expect(actualPrice).toBe(expectedPrice);
  }
  async clickCancelBtn() {
    await this.optionChageCancelBtn.click();
  }
  async clickConfirmBtn() {
    await this.optionChageConfirmBtn.click();
  }
}
