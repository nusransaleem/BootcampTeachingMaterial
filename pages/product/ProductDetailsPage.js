const { SELECTORS } = require('../../common/constants');

class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
    this.buyNowBtn = page.getByRole('button', { name: /buy now/i });
    this.successMessage = page.getByText('Added to cart successfully!');
    this.dialogClose = page.locator(SELECTORS.dialogClose);
  }

  async openProduct(productName) {
    await this.page.locator(`a:has-text("${productName}")`).first().click();
    await this.page.waitForLoadState('load');
  }

  async openFirstProductFromListing() {
    await this.page.locator(SELECTORS.productLink).first().click();
    await this.page.waitForLoadState('load');
  }

  async addToCart() {
    await this.addToCartBtn.click();
    await this.page.waitForLoadState('load');
  }

  async dismissSuccessDialog() {
    if (await this.dialogClose.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.dialogClose.click();
    }
  }

  isOnProductPage() {
    return /\/products\//i.test(this.page.url());
  }
}

module.exports = { ProductDetailsPage };
