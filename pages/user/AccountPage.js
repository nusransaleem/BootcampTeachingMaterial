const { expect } = require('@playwright/test');
const { SELECTORS, TIMEOUTS } = require('../../common/constants');

class AccountPage {
  constructor(page) {
    this.page = page;
    this.accountTrigger = page.locator(SELECTORS.accountTrigger);
    this.loginTrigger = page.locator(SELECTORS.loginTrigger);
    this.logoutLink = page.getByRole('link', { name: /logout/i });
  }

  async openAccountMenu() {
    await this.accountTrigger.click();
  }

  async logout() {
    await this.openAccountMenu();
    await this.logoutLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.loginTrigger).toBeVisible({ timeout: TIMEOUTS.default });
  }

  async isLoggedIn() {
    return this.accountTrigger.isVisible();
  }
}

module.exports = { AccountPage };
