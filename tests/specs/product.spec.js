const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/home/HomePage');
const { SearchBar } = require('../../pages/common/SearchBar');
const { ProductListingPage } = require('../../pages/product/ProductListingPage');
const { ProductDetailsPage } = require('../../pages/product/ProductDetailsPage');
const products = require('../../data/products.json');

test.describe('Product Details', () => {
  let homePage;
  let searchBar;
  let listingPage;
  let productDetails;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchBar = new SearchBar(page);
    listingPage = new ProductListingPage(page);
    productDetails = new ProductDetailsPage(page);
    await homePage.open();
  });

  test('TC-23: Verify product detail page shows Add to Cart button', async () => {
    const { search_key } = products.headphones;
    await searchBar.search(search_key);
    await productDetails.openFirstProductFromListing();
    await expect(productDetails.addToCartBtn).toBeVisible();
  });

  test('TC-24: Verify navigating to product updates URL to product page', async ({ page }) => {
    const { search_key } = products.phones;
    await searchBar.search(search_key);
    await productDetails.openFirstProductFromListing();
    expect(productDetails.isOnProductPage()).toBeTruthy();
    await expect(page).toHaveURL(/\/products\//);
  });

  test('TC-25: Verify product detail page shows Buy Now option', async () => {
    const { search_key } = products.laptops;
    await searchBar.search(search_key);
    await productDetails.openFirstProductFromListing();
    await expect(productDetails.buyNowBtn).toBeVisible();
  });
});
