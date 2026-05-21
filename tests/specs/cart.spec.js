const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/home/HomePage');
const { Header } = require('../../pages/common/Header');
const { SearchBar } = require('../../pages/common/SearchBar');
const { LoginPage } = require('../../pages/user/LoginPage');
const { ProductDetailsPage } = require('../../pages/product/ProductDetailsPage');
const { CartPage } = require('../../pages/cart/CartPage');
const { getCartBadgeExpectedCount } = require('../../util/helpers');
const products = require('../../data/products.json');

test.describe('Cart Management Flow', () => {
  test.describe.configure({ mode: 'serial', timeout: 90000 });

  let homePage;
  let header;
  let searchBar;
  let loginPage;
  let productDetails;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    header = new Header(page);
    searchBar = new SearchBar(page);
    loginPage = new LoginPage(page);
    productDetails = new ProductDetailsPage(page);
    cartPage = new CartPage(page);

    await homePage.open();
    await expect(loginPage.accountTrigger).toBeVisible();
  });

  test('TC-07: Verify Add to Cart functionality and cart badge update', async () => {
    const { search_key } = products.headphones;
    const beforeCount = await header.getCartCount();

    await searchBar.search(search_key);
    await productDetails.openFirstProductFromListing();
    await productDetails.addToCart();

    await expect(productDetails.successMessage).toBeVisible();
    await productDetails.dismissSuccessDialog();
    await expect(header.cartBadge).toHaveText(
      getCartBadgeExpectedCount(beforeCount, 1)
    );
  });

  test('TC-08: Verify cart persistence after page reload', async ({ page }) => {
    await expect(header.cartBadge).not.toHaveText('0');
    await page.reload();
    await page.waitForLoadState('load');
    await expect(header.cartBadge).not.toHaveText('0');
  });

  test('TC-09: Verify item removal and cart total update', async () => {
    const beforeCount = await header.getCartCount();
    if (beforeCount === '0' || beforeCount === '') {
      const { search_key } = products.headphones;
      await searchBar.search(search_key);
      await productDetails.openFirstProductFromListing();
      await productDetails.addToCart();
      await productDetails.dismissSuccessDialog();
    }
    const countBeforeRemove = await header.getCartCount();
    await cartPage.removeFirstItem();
    await expect(header.cartBadge).toHaveText(
      getCartBadgeExpectedCount(countBeforeRemove, -1),
      { timeout: 10000 }
    );
  });

  test('TC-26: Verify cart badge increases after adding a product', async () => {
    const { search_key } = products.bottles;
    const beforeCount = await header.getCartCount();

    await searchBar.search(search_key);
    await productDetails.openFirstProductFromListing();
    await productDetails.addToCart();
    await productDetails.dismissSuccessDialog();

    await expect(header.cartBadge).toHaveText(
      getCartBadgeExpectedCount(beforeCount, 1)
    );
  });
});
