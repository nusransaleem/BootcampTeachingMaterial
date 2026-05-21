const { SELECTORS } = require('../../common/constants');

class ProductListingPage {
  constructor(page) {
    this.page = page;
    this.priceMin = page.locator(SELECTORS.priceMin);
    this.priceMax = page.locator(SELECTORS.priceMax);
    this.filterApplyBtn = page.locator(SELECTORS.filterApplyBtn);
    this.productCards = page.locator(SELECTORS.productLink);
  }

  resultsMessage() {
    return this.page.locator('body');
  }

  async filterByBrand(brand) {
    await this.page.locator(`span:has-text("${brand}")`).first().click();
    await this.page.waitForLoadState('load');
  }

  async filterByPrice(minPrice, maxPrice) {
    await this.priceMin.fill(minPrice);
    await this.priceMax.fill(maxPrice);
    await this.filterApplyBtn.click();
    await this.page.waitForLoadState('load');
  }

  filteredBySection() {
    return this.page.getByText('Filtered By:').locator('..');
  }

  async getProductCardCount() {
    return this.productCards.count();
  }
}

module.exports = { ProductListingPage };
