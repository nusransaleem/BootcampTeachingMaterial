const { expect } = require('@playwright/test');
const { SELECTORS, TIMEOUTS } = require('../../common/constants');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginTrigger = page.locator(SELECTORS.loginTrigger);
    this.emailInput = page.locator('input[type="text"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginBtn = page.getByRole('button', { name: 'LOGIN' });
    this.accountTrigger = page.locator(SELECTORS.accountTrigger);
  }

  async openLoginModal() {
    await this.loginTrigger.click();
  }

  async submitCredentials(email, password) {
    await this.openLoginModal();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  async isLoggedIn() {
    return this.accountTrigger.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async login(email, password) {
    if (await this.isLoggedIn()) return;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await this.submitCredentials(email, password);
        await expect(this.accountTrigger).toBeVisible({ timeout: TIMEOUTS.default });
        return;
      } catch (error) {
        if (attempt === 1) throw error;
        await this.page.goto('/');
        await this.page.waitForLoadState('load');
      }
    }
  }

  async loginWithInvalidCredentials(email, password) {
    await this.submitCredentials(email, password);
    await expect(this.accountTrigger).not.toBeVisible({ timeout: 5000 });
    await expect(this.loginTrigger).toBeVisible();
  }

  async expectLoginFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginBtn).toBeVisible();
  }
}

module.exports = { LoginPage };
