import { Page, Locator, expect } from "@playwright/test";

export class CouponPopup {
  readonly page: Page;
  readonly pageAlert: Locator;

  readonly couponListSection: Locator;

  readonly coupon: Locator;
  readonly couponRadioBtn: Locator;
  readonly couponName: Locator;
  readonly couponPrice: Locator;
  readonly couponExpirationDate: Locator;
  readonly couponCancelBtn: Locator;
  readonly couponApplyBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageAlert = page.getByRole("dialog");
    this.couponListSection = page.locator(
      'div[class*="UsableCouponList__Container"]',
    );
    this.coupon = this.couponListSection.locator("label").nth(0);
    this.couponRadioBtn = this.coupon.locator('button[role="radio"]');
    this.couponName = this.coupon.locator(
      'p[class*="CouponItem__CouponTitle"]',
    );
    this.couponPrice = this.coupon.locator("p").nth(0);
    this.couponExpirationDate = this.coupon.locator(
      'span[class*="CouponItemExpiredDate__ExpiredDateText"]',
    );
    this.couponCancelBtn = this.coupon.getByRole("button", {
      name: "취소",
      exact: true,
    });
    this.couponApplyBtn = this.pageAlert.getByRole("button", {
      name: "적용하기",
      exact: true,
    });
  }

  async usableCouponCount(): Promise<number> {
    const couponLabels = this.couponListSection.locator("label");

    // 최소 첫 번째 쿠폰이 렌더링될 때까지 대기
    await expect(couponLabels.first()).toBeVisible();

    return await couponLabels.count();
  }
  async clickCoupon() {
    await this.couponRadioBtn.click();
  }
  async clickCouponCancelBtn() {
    await this.couponCancelBtn.click();
  }
  async checkSelectedCouponPrice(couponPriceText: string): Promise<string> {
    const price = couponPriceText?.match(/[\d,]+/)?.[0].replace(/,/g, "");
    return price ?? "";
  }
  async clickCouponApplyBtn() {
    await this.couponApplyBtn.click();
  }
  async verifyCouponDiscountPrice(
    previousPrice: string,
    couponPrice: string,
    currentPrice: string,
  ): Promise<void> {
    const beforePrice = Number(previousPrice.replace(/[^\d]/g, ""));
    const discountPrice = Number(couponPrice.replace(/[^\d]/g, ""));
    const actualPrice = Number(currentPrice.replace(/[^\d]/g, ""));

    const expectedPrice = beforePrice - discountPrice;

    expect(actualPrice).toBe(expectedPrice);
  }
}
