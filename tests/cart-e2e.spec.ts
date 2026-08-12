import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { OptionPopup } from "./pages/OptionPopup";
import { CouponPopup } from "./pages/CouponPopup";
import { OrderPage } from "./pages/OrderPage";
import { ProductPage } from "./pages/ProductPage";
import { setProductA, setProductB } from "./helpers/cart-setting";

test("무신사 장바구니 핵심 플로우", async ({ page }) => {
  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);
  const optionPopup = new OptionPopup(page);
  const couponPopup = new CouponPopup(page);
  const orderPage = new OrderPage(page);
  const productPage = new ProductPage(page);

  let itemOption = "";
  let itemPrice = "";
  let itemDiscountPrice = "";
  let optionInfo = "";
  let optionQuantity = "";
  let couponDiscountPrice = "";

  await test.step("장바구니 진입 동작 검증", async () => {
    //CART-002: 장바구니 진입
    await cartPage.goto();
    await expect(homePage.page).toHaveURL(/\/order\/cart\/?$/);
    console.log("1. 장바구니 버튼 확인 및 장바구니 진입에 성공하였습니다. ✅");
  });

  await test.step("미로그인 > 빈 장바구니 페이지 노출 상태 검증", async () => {
    //CART-012: 빈 장바구니 확인
    await expect(
      cartPage.page.getByText("장바구니에 담은 상품이 없습니다."),
    ).toBeVisible();
    //CART-013: 로그인하러 가기 버튼 노출 확인
    await expect(cartPage.goToLoginPageBtn).toBeVisible();
    //CART-015: 빈 장바구니인 경우 카테고리 탭 미노출 확인
    await expect(cartPage.categoryTab).toBeHidden();
    //CART-125: 빈 장바구니인 경우 구매금액 영역 미노출 확인
    await expect(cartPage.purchaseAmountSection).toBeHidden();
    console.log(
      "2. 미로그인 > 빈 장바구니 노출 상태가 정상적으로 확인되었습니다. ✅",
    );
  });

  await test.step("테스트를 위한 장바구니 내 상품 세팅", async () => {
    await setProductA(cartPage, productPage);
    await setProductB(cartPage, productPage);
    console.log("3. 테스트를 위한 상품 세팅을 성공하였습니다. ✅");
  });

  await test.step("미로그인 > 구매하기 시도 시 동작 검증", async () => {
    //CART-179: 미로그인 상태에서 구매하기 클릭
    await cartPage.clickPurchaseBtn();
    await expect(cartPage.loginAlert).toBeVisible();

    //CART-181: 로그인 얼럿 확인 선택
    await cartPage.loginConfirm.click();
    //CART-014: 로그인 페이지 진입 완료
    await expect(homePage.page).toHaveURL(/\/login/);
    console.log(
      "4. 미로그인 > 구매 시도 시 로그인 안내 팝업 노출 및 로그인 페이지 이동을 확인하였습니다. ✅",
    );
  });

  await test.step("로그인 후 장바구니로 리다이렉트 동작 검증", async () => {
    await page.pause();
    //CART-003: 로그인 완료 후 리다이렉트로 장바구니 복귀
    await expect(homePage.page).toHaveURL(/\/order\/cart\/?$/);
    await expect(homePage.logoutBtn).toBeVisible();
    console.log("5. 로그인 완료 후, 장바구니로 리다이렉트 성공하였습니다. ✅");
  });

  await test.step("카테고리 탭 노출 검증", async () => {
    await cartPage.closePromotionPopup();

    const count = await cartPage.categoryItemCount();

    //CART-015: 전체, USED 탭 노출 확인
    //CART-016: 상품 개수가  '전체 n', 'USED n' 형식으로 노출 확인
    await expect(
      cartPage.categoryTab.getByText(`전체 ${count.total}`, { exact: true }),
    ).toBeVisible();

    if (count.used > 0) {
      await expect(
        cartPage.categoryTab.getByText(`USED ${count.used}`, { exact: true }),
      ).toBeVisible();
    } else {
      await expect(
        cartPage.categoryTab.getByText(`USED`, { exact: true }),
      ).toBeVisible();
    }
    console.log(
      `6. 고정 카테고리탭 노출을 확인하였습니다. ✅
    전체 ${count.total} / USED ${count.used}`,
    );
  });

  await test.step("상품 좋아요 기능 검증", async () => {
    //CART-042: 좋아요 노출 확인
    await expect(cartPage.likeBtn).toBeVisible();
    //CART-043: 좋아요 활성화 상태 확인
    const before = await cartPage.checkLikeStatus();
    //CART-049: 좋아요 버튼 클릭
    await cartPage.clickLikeBtn();
    //CART-043: 좋아요 클릭 후, 좋아요 활성화 상태 확인
    await expect.poll(() => cartPage.checkLikeStatus()).toBe(!before);
    console.log(
      `7. 첫번째 상품의 좋아요 상태를 ${before}에서 ${await cartPage.checkLikeStatus()}로 변경 성공하였습니다. ✅`,
    );
  });

  await test.step("전체 선택 체크박스 기능 검증", async () => {
    //CART-063: 전체 선택 체크박스 노출 확인
    await expect(cartPage.allCheckBox).toBeVisible();
    //CART-064~065: 전체 선택 선택 시, 전체 선택/해제 확인
    for (let i = 0; i < 2; i++) {
      const beforeStatus = await cartPage.isSelectAllChecked(
        cartPage.allCheckBox,
      );
      await cartPage.clickAllCheckBox();
      await expect
        .poll(() => cartPage.isSelectAllChecked(cartPage.allCheckBox))
        .not.toBe(beforeStatus);
      await expect
        .poll(() =>
          cartPage.areCheckboxStatesSynchronized(
            cartPage.allCheckBox,
            cartPage.itemCheckBoxes,
          ),
        )
        .toBe(true);
    }
    console.log("8. 전체 선택 체크박스 활성화/비활성화에 성공했습니다. ✅");
  });

  await test.step("선택한 상품 없는 상태에서 구매 불가 검증", async () => {
    const checkStatus = await cartPage.isSelectAllChecked(cartPage.allCheckBox);

    if (checkStatus) {
      await cartPage.clickAllCheckBox();
      await expect
        .poll(() => cartPage.isSelectAllChecked(cartPage.allCheckBox))
        .not.toBe(checkStatus);
    }

    //CART-174: 상품 미선택 상태에서 구매하기 버튼 노출 상태 확인
    await expect(cartPage.noSelectionPurchaseBtn).toBeVisible();
    //CART-176: 상품 미선택 상태에서 구매하기 버튼 클릭 시, 얼럿 노출 확인
    await cartPage.noSelectionPurchaseBtn.click();
    await expect(cartPage.pageAlert).toBeVisible();
    await expect(cartPage.noItemSelectedMessage).toBeVisible();
    //CART-178: 상품 선택 안내 얼럿 확인 누를 시, 얼럿 닫힘 확인
    await cartPage.noItemSelectedConfirmBtn.click();
    await expect(cartPage.pageAlert).toBeHidden();
    console.log("9. 상품 미선택 상태에서 구매 불가 동작을 확인하였습니다. ✅");
  });

  await test.step("브랜드 그룹 체크박스 기능 검증", async () => {
    //CART-073: 브랜드그룹 체크박스 노출 확인
    await expect(cartPage.brandGroupCheckBox).toBeVisible();
    //CART-074~075: 브랜드그룹 체크박스 선택 시, 하위 상품 선택/해제 확인
    const beforeStatus = await cartPage.isSelectAllChecked(
      cartPage.brandGroupCheckBox,
    );
    await cartPage.clickBGCheckBox();
    await expect
      .poll(() => cartPage.isSelectAllChecked(cartPage.brandGroupCheckBox))
      .not.toBe(beforeStatus);
    await expect
      .poll(() =>
        cartPage.areCheckboxStatesSynchronized(
          cartPage.brandGroupCheckBox,
          cartPage.brandGroupItemCheckBoxes,
        ),
      )
      .toBe(true);
    console.log("10. 첫번째 브랜드 그룹 체크박스 활성화에 성공하였습니다. ✅");
  });

  await test.step("선택 삭제 버튼 기능 검증", async () => {
    //삭제 대상 그룹 및 아이템 확인
    const deleteBrandGroupName = await cartPage.checkedBgName();

    //CART-068: 선택 삭제 버튼 노출 확인
    await expect(cartPage.itemSelectDeleteBtn).toBeVisible();
    //CART-070: 선택 삭제 버튼 클릭 시 얼럿 노출 확인
    await cartPage.itemSelectDeleteBtn.click();
    await expect(cartPage.itemDeleteMessage).toBeVisible();
    //CART-072: 선택 삭제 확인 얼럿에서 '삭제하기' 클릭 후 상품 삭제 확인
    await cartPage.itemDeleteConfirmBtn.click();

    for (const brandName of deleteBrandGroupName) {
      await expect(
        cartPage.brandName.filter({ hasText: brandName }),
      ).toHaveCount(0);
    }
    console.log("11. 선택된 상품 선택 삭제를 성공하였습니다. ✅");
  });

  await test.step("상품 필수 정보 노출 검증", async () => {
    //CART-032: 상품 옵션 노출 확인
    await expect(cartPage.itemOption).toBeVisible();

    itemOption = await cartPage.itemOption.innerText();

    //CART-033: 상품 금액 노출 확인
    await expect(cartPage.itemPrice).toBeVisible();

    itemPrice = await cartPage.itemPrice.innerText();

    //CART-034: 상품 할인 적용 금액 노출 확인
    if ((await cartPage.itemDiscountPrice.count()) > 0) {
      await expect(cartPage.itemDiscountPrice).toBeVisible();
      itemDiscountPrice = await cartPage.itemDiscountPrice.innerText();
    }
    console.log(
      `12. 상품 필수 정보 노출을 확인하였습니다. ✅
    상품 옵션: ${itemOption} / 상품 가격: ${itemPrice} / 상품 할인 가격: ${itemDiscountPrice}`,
    );
  });

  await test.step("상품 옵션 변경 > 옵션 변경 검증", async () => {
    //CART-083: 옵션 변경 버튼 노출 확인
    await expect(cartPage.optionChangeBtn).toBeVisible();
    //CART-084: 옵션 변경 버튼 클릭 시 팝업 노출 확인
    await cartPage.clickOptionChangeBtn();
    await expect(optionPopup.optionChangeModal).toBeVisible();

    //CART-087: 옵션 팝업 > 헤더 클릭 시 옵션 리스트 확인
    await optionPopup.clickDropdownHeader();
    await expect(optionPopup.optionDropdownList).toBeVisible();

    //CART-099: 옵션 리스트 > 옵션 정보 노출 확인
    await expect(optionPopup.optionName).toBeVisible();

    //CART-091: 옵션 리스트 > 옵션 선택 후 팝업 내 적용 확인
    optionInfo = (await optionPopup.optionName.innerText()).trim();

    await optionPopup.clickOption();
    await expect(optionPopup.optionDropdownHeader).toHaveText(optionInfo);
    console.log(
      `13. 상품 옵션 변경 팝업에서 옵션 변경에 성공하였습니다. ✅
    기존 옵션: ${itemOption} / 변경 옵션: ${optionInfo}`,
    );
  });

  await test.step("상품 옵션 변경 > 상품 수량 변경 검증", async () => {
    //CART-092: 옵션 팝업 내 수량 조절 영역 노출 확인
    await expect(optionPopup.optionQuantitySection).toBeVisible();

    const previousPrice =
      itemDiscountPrice === "" ? itemPrice : itemDiscountPrice;
    const previousQuantity = Number(
      await optionPopup.optionQuantity.inputValue(),
    );

    //CART-094: 옵션 수량 조절 영역 > + 버튼 클릭 기능 확인
    await expect(optionPopup.optionQuantity_plusBtn).toBeVisible();
    await optionPopup.verifyQuantityChange("+", 2);
    //CART-093: 옵션 수량 조절 영역 > - 버튼 클릭 기능 확인
    await expect(optionPopup.optionQuantity_minusBtn).toBeVisible();
    await optionPopup.verifyQuantityChange("-", 1);

    optionQuantity = await optionPopup.optionQuantity.inputValue();

    //CART-095: 옵션 및 수량에 맞게 팝업 내 상품 금액 반영 확인
    await optionPopup.verifyQuantityPrice(
      previousPrice,
      previousQuantity,
      optionQuantity,
    );
    const changedPrice = await optionPopup.productTotalPrice.innerText();
    console.log(`14. 상품 수량 변경 및 상품 금액 변경에 성공하였습니다. ✅
    기존 수량: ${previousQuantity} / 기존 금액: ${previousPrice}
    변경 수량: ${optionQuantity} / 변경 금액: ${changedPrice}`);
  });

  await test.step("상품 옵션 변경 > 장바구니 내 변경사항 적용 검증", async () => {
    //CART-098: 옵션 팝업 > 활성화된 변경하기 버튼 클릭
    await expect(optionPopup.optionChageConfirmBtn).toBeVisible();
    await expect(optionPopup.optionChageConfirmBtn).toBeEnabled();
    await optionPopup.clickConfirmBtn();
    await expect(optionPopup.pageAlert).toBeHidden();

    itemOption = await cartPage.itemOption.innerText();
    itemPrice = await cartPage.itemPrice.innerText();
    itemDiscountPrice = await cartPage.itemDiscountPrice.innerText();

    //CART-099: 변경한 옵션 및 수량이 장바구니 상품에 정상 반영 확인
    expect(itemOption).toContain(`${optionInfo}`);
    expect(itemOption).toContain(`${optionQuantity}개`);
    console.log(`15. 상품 옵션 변경 적용에 성공하였습니다. ✅
    변경 옵션: ${itemOption}`);
  });

  await test.step("상품 쿠폰 사용 > 쿠폰 리스트 및 쿠폰 필수 정보 노출 검증", async () => {
    //CART-105: 쿠폰 사용 버튼 노출 확인
    await expect(cartPage.useCouponBtn).toBeVisible();
    //CART-109: 쿠폰 사용 버튼 클릭 시 팝업 노출 확인
    await cartPage.clickUseCouponBtn();
    await expect(couponPopup.pageAlert).toBeVisible();
    //CART-112: 사용 가능 쿠폰 리스트 노출 확인
    await expect(couponPopup.couponListSection).toBeVisible();
    const couponCount = await couponPopup.usableCouponCount();
    //CART-113: 쿠폰 필수 정보 노출 확인
    await expect(couponPopup.couponRadioBtn).toBeVisible();
    await expect(couponPopup.couponName).toBeVisible();
    await expect(couponPopup.couponPrice).toBeVisible();
    await expect(couponPopup.couponExpirationDate).toBeVisible();
    couponDiscountPrice = await couponPopup.checkSelectedCouponPrice(
      await couponPopup.couponPrice.innerHTML(),
    );

    console.log(`16. 쿠폰 리스트 및 쿠폰 필수 정보 확인을 성공하였습니다. ✅`);
  });

  await test.step("상품 쿠폰 사용 > 쿠폰 선택 동작 검증", async () => {
    //CART-114: 쿠폰 클릭 시 선택 활성화 및 취소 버튼 노출 확인
    await couponPopup.clickCoupon();
    await expect(couponPopup.couponCancelBtn).toBeVisible();
    console.log(
      `17. 쿠폰 선택 시 쿠폰 사용 '취소' 버튼 노출을 확인하였습니다. ✅`,
    );
  });

  await test.step("상품 쿠폰 사용 > 쿠폰 적용 확인 검증", async () => {
    //CART-117: 쿠폰 적용하기 버튼 노출 확인
    await expect(couponPopup.couponApplyBtn).toBeVisible();
    //CART-118: 쿠폰 적용하기 버튼 클릭 시 팝업 닫힘 및 쿠폰 적용가 확인
    await couponPopup.clickCouponApplyBtn();
    await expect(couponPopup.pageAlert).toBeHidden();
    await couponPopup.verifyCouponDiscountPrice(
      itemDiscountPrice,
      couponDiscountPrice,
      await cartPage.itemDiscountPrice.innerText(),
    );
    itemDiscountPrice = await cartPage.itemDiscountPrice.innerText();
    console.log(`18. 쿠폰 정상 적용에 성공하였습니다. ✅
    기존 상품 금액: ${itemPrice} / 쿠폰 할인: ${couponDiscountPrice}원 / 쿠폰 할인가 ${itemDiscountPrice}`);
  });

  await test.step("구매 금액 항목 검증", async () => {
    await cartPage.item.locator("button").nth(0).click();
    //CART-125: 구매 금액 영역 필수 항목 확인
    await expect(cartPage.purchaseAmountSection).toBeVisible();
    await expect(cartPage.purchaseProductPrice).toBeVisible();
    await expect(cartPage.purchaseDiscountPrice).toBeVisible();
    await expect(cartPage.purchaseDeliveryPrice).toBeVisible();
    await expect(cartPage.purchaseTotalPrice).toBeVisible();
    await expect(cartPage.expectBenefitPrice).toBeVisible();
    //CART-127, CART-129, CART-132, CART-134: 각 필수 항목 금액 반영 확인
    await cartPage.verifyPurchaseAmount(itemPrice, itemDiscountPrice);
    console.log("19. 구매 금액 영역 및 필수 항목 검증에 성공하였습니다. ✅");
  });
  await test.step("구매하기 버튼 클릭 > 주문서 페이지 이동 동작 검증", async () => {
    //CART-183: 구매하기 버튼 클릭 시 주문서 페이지 이동 확인
    await cartPage.clickPurchaseBtn();
    await expect(orderPage.page).toHaveURL(/\/order\/order-form\/?$/);
    console.log("20. 주문서 페이지로 이동 성공하였습니다. ✅");
  });
});
