import { Page, expect } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { ProductPage } from "../pages/ProductPage";

export async function setProductA(
  cartPage: CartPage,
  productPage: ProductPage,
) {
  await cartPage.waitForRecommendItems();
  await cartPage.clickFirstRecommendItem();
  await productPage.selectOption();
  await productPage.clickCartBtn();
  await productPage.addToCartCompletePopup.waitFor({
    state: "visible",
  });
  await productPage.clickViewCartBtn();
  await expect(cartPage.page).toHaveURL(/\/order\/cart\/?$/);
}

export async function setProductB(
  cartPage: CartPage,
  productPage: ProductPage,
) {
  await cartPage.waitForRecommendItems();
  await cartPage.clickSecondRecommendItem();
  await productPage.selectOption();
  await productPage.clickCartBtn();
  await productPage.addToCartCompletePopup.waitFor({
    state: "visible",
  });
  await productPage.clickViewCartBtn();
  await expect(cartPage.page).toHaveURL(/\/order\/cart\/?$/);
}
