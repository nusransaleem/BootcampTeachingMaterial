const { expect } = require('@playwright/test');
const { SELECTORS, TIMEOUTS } = require('../common/constants');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
    await this.closePopup();
  }

  async waitForPageReady() {
    await this.page.waitForLoadState('load');
  }

  async closePopup() {
    try {
      const closeBtn = this.page.locator('.popup-close, .close-btn').first();
      if (await closeBtn.isVisible({ timeout: 5000 })) {
        await closeBtn.click();
      }
    } catch {
      // No popup to dismiss
    }
  }

  async expectVisible(locator, options = {}) {
    await expect(locator).toBeVisible({ timeout: TIMEOUTS.default, ...options });
  }
}

module.exports = { BasePage, SELECTORS, TIMEOUTS };
