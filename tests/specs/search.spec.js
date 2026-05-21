const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/home/HomePage');
const { SearchBar } = require('../../pages/common/SearchBar');
const { ProductListingPage } = require('../../pages/product/ProductListingPage');
const products = require('../../data/products.json');

test.describe('Search Tests', () => {
  let homePage;
  let searchBar;
  let listingPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchBar = new SearchBar(page);
    listingPage = new ProductListingPage(page);
    await homePage.open();
  });

  test('TC-03: Verify product search accuracy for specific keywords', async () => {
    const { search_key } = products.phones;
    await searchBar.search(search_key);
    await expect(listingPage.resultsMessage()).toContainText(
      `items found for "${search_key}"`,
      { ignoreCase: true }
    );
  });

  test('TC-04: Verify search auto-suggestion relevance and visibility', async () => {
    const { search_key } = products.suggest;
    await searchBar.typeForSuggestions(search_key);
    await expect(searchBar.suggestList.first()).toBeVisible();
  });

  test('TC-05: Verify search results filtering by price range', async ({ page }) => {
    const { search_key, min_price, max_price } = products.watches;
    await searchBar.search(search_key);
    await listingPage.filterByPrice(min_price, max_price);
    const priceRegex = new RegExp(`price=${min_price}-${max_price}`);
    await expect(page).toHaveURL(priceRegex);
  });

  test('TC-06: Verify search results filtering by brand selection', async ({ page }) => {
    const { search_key, brand } = products.laptops;
    await searchBar.search(search_key);
    await listingPage.filterByBrand(brand);
    await expect(page).toHaveURL(/ppath=/);
    await expect(listingPage.filteredBySection()).toContainText(brand);
  });

  test('TC-18: Verify search URL contains the query parameter', async ({ page }) => {
    const { search_key } = products.bottles;
    await searchBar.search(search_key);
    await expect(page).toHaveURL(new RegExp(`q=${encodeURIComponent(search_key).replace(/%20/g, '(\\+|%20)')}`, 'i'));
  });

  test('TC-19: Verify search results display product listing items', async () => {
    const { search_key } = products.phones;
    await searchBar.search(search_key);
    const count = await listingPage.getProductCardCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-20: Verify no results message for invalid search keyword', async () => {
    const { search_key } = products.invalid;
    await searchBar.search(search_key);
    await expect(listingPage.resultsMessage()).toContainText(/0 items found/i);
  });

  test('TC-21: Verify search suggestion text includes typed keyword', async () => {
    const { search_key } = products.suggest;
    await searchBar.typeForSuggestions(search_key);
    await expect(searchBar.suggestList.first()).toContainText(search_key, { ignoreCase: true });
  });

  test('TC-22: Verify user can run consecutive searches with different keywords', async ({ page }) => {
    await searchBar.search(products.phones.search_key);
    await expect(page).toHaveURL(/q=samsung/i);
    await homePage.navigateHomeViaLogo();
    await searchBar.search(products.bottles.search_key);
    await expect(page).toHaveURL(/q=water/i);
    await expect(listingPage.resultsMessage()).toContainText(/water bottle/i);
  });
});
