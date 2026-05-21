const { expect } = require('@playwright/test');
const { SELECTORS } = require('../../common/constants');
const { Header } = require('../common/Header');

class CartPage {
  constructor(page) {
    this.page = page;
    this.header = new Header(page);
    this.deleteBtn = page.locator(SELECTORS.cartDeleteBtn);
    this.removeConfirmBtn = page.locator('button:has-text("REMOVE")');
    this.cartItemRows = page.locator(SELECTORS.cartItemRow);
  }

  async dismissOverlay() {
    const backdrop = this.page.locator('.next-overlay-backdrop');
    if (await backdrop.isVisible({ timeout: 2000 }).catch(() => false)) {
      await backdrop.click({ force: true });
    }
  }

  async open() {
    await this.dismissOverlay();
    await this.header.cartBadge.click({ force: true });
    await this.page.waitForLoadState('load');
  }

  async removeItem(productName) {
    await this.open();
    const itemRow = this.page.locator(SELECTORS.cartItemRow, { hasText: productName });
    await itemRow.locator('input[type="checkbox"]').first().click();
    await this.deleteBtn.first().click();
    await this.removeConfirmBtn.click();
    await this.page.waitForLoadState('load');
  }

  async expectProductInCart(productName) {
    await this.open();
    await expect(this.page.locator(SELECTORS.cartItemRow, { hasText: productName })).toBeVisible();
  }

  async expectCartHasItems() {
    await this.open();
    await expect(this.cartItemRows.first()).toBeVisible();
  }

  async removeFirstItem() {
    await this.open();
    await this.cartItemRows.first().locator('input[type="checkbox"]').click();
    await this.deleteBtn.first().click();
    await this.removeConfirmBtn.click();
    await this.page.waitForLoadState('load');
  }

  async getItemCount() {
    return this.cartItemRows.count();
  }
}

module.exports = { CartPage };
