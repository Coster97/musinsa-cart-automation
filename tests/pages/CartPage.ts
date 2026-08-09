import { expect, Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly goToLoginPageBtn: Locator; //로그인하러 가기 버튼
  readonly pageAlert: Locator; //페이지 공통 얼럿, 팝업

  readonly promotionPopup: Locator; //프로모션 팝업
  readonly promotionCloseBtn: Locator; //프로모션 팝업 닫기 버튼

  readonly categoryTab: Locator; //카테고리 탭

  readonly item: Locator; //상품
  readonly usedItem: Locator; //USED 상품

  readonly brandName: Locator; //브랜드 이름
  readonly itemOption: Locator; //상품 옵션
  readonly itemPrice: Locator; //상품 금액
  readonly itemDiscountPrice: Locator; //상품 할인 금액

  readonly likeBtn: Locator; //좋아요 버튼
  readonly likePath: Locator; //좋아요 상태 확인 경로

  readonly itemSelectDeleteBtn: Locator; //선택 삭제 버튼
  readonly allCheckBox: Locator; //전체 선택 체크박스
  readonly brandGroupCheckBox: Locator; //브랜드 그룹 체크박스
  readonly itemCheckBoxes: Locator; //페이지 내 모든 체크박스
  readonly brandGroupItemCheckBoxes: Locator; //브랜드 그룹 하위 체크박스

  readonly optionChangeBtn: Locator; //옵션 변경 버튼
  readonly useCouponBtn: Locator; //쿠폰 사용 버튼

  readonly noSelectionPurchaseBtn: Locator; //아이템 미선택 상태 구매하기 버튼
  readonly noItemSelectedMessage: Locator; //상품 선택 안내 얼럿 메시지
  readonly noItemSelectedConfirmBtn: Locator; //상품 선택 안내 얼럿 '확인' 버튼

  readonly itemDeleteMessage: Locator; //아이템 삭제 안내 얼럿 메시지
  readonly itemDeleteConfirmBtn: Locator; //아이템 삭제 안내 얼럿 '확인'버튼

  readonly purchaseAmountSection: Locator; //구매 금액 영역
  readonly purchaseProductPrice: Locator; //구매 상품 금액
  readonly purchaseDiscountPrice: Locator; //구매 상품 할인 금액
  readonly purchaseDeliveryPrice: Locator; //구매 상품 배송 금액
  readonly purchaseTotalPrice: Locator; //총 구매 금액
  readonly expectBenefitPrice: Locator; //적립혜택 예상 금액

  readonly purchaseBtn: Locator; //구매하기 버튼

  constructor(page: Page) {
    this.page = page;
    this.goToLoginPageBtn = page.getByRole("button", {
      name: "로그인하러 가기",
    });
    this.pageAlert = page.getByRole("dialog");

    this.promotionPopup = page
      .locator('iframe[title="Modal Message"]')
      .contentFrame()
      .getByText("무신사 삼성카드 무신사머니 포인트 최대 10% 적립");
    this.promotionCloseBtn = page
      .locator('iframe[title="Modal Message"]')
      .contentFrame()
      .getByRole("button", { name: "닫기" });
    this.categoryTab = page.locator('span[data-mds="TabTextItem"]');
    this.item = page.locator("div[class*='GoodsSelector__ItemWrapper']");
    this.usedItem = this.item.filter({
      has: page.locator('[data-spc-code*="used"]'),
    });
    this.brandName = page.locator('[class*="BrandGroup__BrandTitle"]').nth(0);
    this.itemOption = page
      .locator('div[class*="GoodsItem__GoodsOption"]')
      .nth(0);
    this.itemPrice = page
      .locator('div[class*="GoodsItem__GoodsPriceWrap"]')
      .nth(0)
      .locator("span")
      .nth(0);
    this.itemDiscountPrice = page
      .locator('div[class*="GoodsItem__GoodsPriceWrap"]')
      .nth(0)
      .locator("span")
      .nth(1);
    this.itemSelectDeleteBtn = page.getByRole("button", {
      name: "선택 삭제",
      exact: true,
    });
    this.itemDeleteMessage = this.pageAlert.getByText(
      "상품을 삭제하시겠습니까?",
      { exact: true },
    );
    this.itemDeleteConfirmBtn = this.pageAlert.getByRole("button", {
      name: "삭제하기",
    });
    this.allCheckBox = page.getByRole("checkbox", { name: "전체 선택" });
    this.itemCheckBoxes = page.locator("button[aria-checked]");
    this.brandGroupCheckBox = page
      .locator('div[class*="BrandGroup__CheckboxContainer"]')
      .nth(0)
      .locator("button[aria-checked]");
    this.brandGroupItemCheckBoxes = page
      .locator('div[class*="GoodsSelector__ItemWrapper"]')
      .nth(0)
      .locator("button[aria-checked]");
    this.likeBtn = this.item.nth(0).getByRole("button", { name: "좋아요" });
    this.likePath = this.likeBtn.locator('path[data-mds="NewIcLike"]');
    this.optionChangeBtn = page
      .getByRole("button", {
        name: "옵션 변경",
        exact: true,
      })
      .nth(0);
    this.useCouponBtn = page
      .locator('div[class*="CartStatusButton"]')
      .locator("button")
      .nth(1);
    this.noSelectionPurchaseBtn = page.getByRole("button", {
      name: "구매하기",
      exact: true,
    });
    this.noItemSelectedMessage = this.pageAlert.getByText(
      "주문할 상품을 선택해 주세요.",
      { exact: true },
    );
    this.noItemSelectedConfirmBtn = this.pageAlert.getByRole("button", {
      name: "확인",
    });
    this.purchaseAmountSection = page.locator(
      'div[class*="PurchaseAmount__Wrapper"]',
    );
    this.purchaseProductPrice = page
      .locator('dl[class*="DefinitionItem__Container"]')
      .filter({ hasText: "상품 금액" })
      .locator("dd");
    this.purchaseDiscountPrice = page
      .locator('dl[class*="DefinitionItem__Container"]')
      .filter({ hasText: "할인 금액" })
      .locator("dd");
    this.purchaseDeliveryPrice = page
      .locator('dl[class*="DefinitionItem__Container"]')
      .filter({ hasText: "배송비" })
      .locator("dd");
    this.purchaseTotalPrice = page
      .locator('div[class*="PurchaseAmount__TotalPrice"]')
      .locator('div[class*="PurchaseAmount__SavePercent"]')
      .locator("span")
      .nth(1);
    this.expectBenefitPrice = page
      .locator('dl[class*="DefinitionItem__Container"]')
      .filter({ hasText: "적립혜택 예상" })
      .locator("dd");
    this.purchaseBtn = page
      .locator('div[class*="CTA__PaymentButton"]')
      .locator("button");
  }

  async clickLoginBtn() {
    await this.goToLoginPageBtn.click();
  }
  async closePromotionPopup() {
    try {
      if (await this.promotionPopup.isVisible()) {
        await this.promotionCloseBtn.click();
      }
    } catch {
      // 팝업이 없으면 아무것도 하지 않음
    }
  }

  async categoryItemCount() {
    const total = await this.item.count();
    const used = await this.usedItem.count();
    return { total, used };
  }
  async clickAllCheckBox() {
    await this.allCheckBox.click();
  }
  async clickBGCheckBox() {
    await this.brandGroupCheckBox.click();
  }
  async checkedBgName() {
    const checkedBg = this.page
      .locator('div[class*="GoodsSelector__BrandSection"]')
      .filter({ has: this.page.locator('button[aria-checked="true"]') });

    const checkedBgName = checkedBg.locator(this.brandName).allInnerTexts();
    return checkedBgName;
  }
  async isSelectAllChecked(checkBoxCategory: Locator): Promise<boolean> {
    return (await checkBoxCategory.getAttribute("aria-checked")) === "true";
  }
  async areCheckboxStatesSynchronized(
    checkBoxCategory: Locator,
    checkbox: Locator,
  ): Promise<boolean> {
    const selectAllStatus = await checkBoxCategory.getAttribute("aria-checked");

    const itemStatuses = await checkbox.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-checked")),
    );
    return (
      itemStatuses.length > 0 &&
      itemStatuses.every((itemStatus) => itemStatus === selectAllStatus)
    );
  }
  async checkLikeStatus(): Promise<boolean> {
    const status = await this.likePath.getAttribute("class");
    if (status?.includes("fill-red")) {
      return true;
    } else if (status?.includes("fill-gray-500")) {
      return false;
    }
    throw new Error("좋아요 상태를 확인할 수 없습니다.");
  }
  async clickLikeBtn() {
    await this.likeBtn.click();
  }
  async clickOptionChangeBtn() {
    await this.optionChangeBtn.click();
  }
  async clickUseCouponBtn() {
    await this.useCouponBtn.click();
  }
  async clickNoSelectionPurchaseBtn() {
    await this.noSelectionPurchaseBtn.click();
  }
  async clickNoItemSelectedAlert_confirm() {
    await this.noItemSelectedConfirmBtn.click();
  }
  async clickItemSelectDeleteBtn() {
    await this.itemSelectDeleteBtn.click();
  }
  async clickItemSelectConfirmBtn() {
    await this.itemDeleteConfirmBtn.click();
  }
  async verifyPurchaseAmount(
    itemPrice: string,
    itemDiscountPrice: string,
  ): Promise<void> {
    const expectedItemPrice = Number(itemPrice.replace(/[^\d]/g, ""));
    const expectedDiscountPrice = Number(
      itemDiscountPrice.replace(/[^\d]/g, ""),
    );
    const actualItemPrice = Number(
      (await this.purchaseProductPrice.innerText()).replace(/[^\d]/g, ""),
    );
    const actualDeliveryPrice = await this.purchaseDeliveryPrice.innerText();
    const actualTotalPrice = Number(
      (await this.purchaseTotalPrice.innerText()).replace(/[^\d]/g, ""),
    );
    const actualDiscountPrice = actualItemPrice - actualTotalPrice;

    expect(actualItemPrice).toBe(expectedItemPrice);
    expect(actualDiscountPrice).toBe(expectedItemPrice - expectedDiscountPrice);
    expect(actualDeliveryPrice).toBe("무료배송");
    expect(actualTotalPrice).toBe(expectedDiscountPrice);
  }
  async clickPurchaseBtn() {
    await this.purchaseBtn.click();
  }
}
