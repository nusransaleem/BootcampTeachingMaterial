const { SELECTORS } = require('../../common/constants');

class Header {
  constructor(page) {
    this.page = page;
    this.cartBadge = page.locator(SELECTORS.cartBadge);
    this.accountTrigger = page.locator(SELECTORS.accountTrigger);
    this.loginTrigger = page.locator(SELECTORS.loginTrigger);
    this.languageSwitch = page.locator(SELECTORS.languageSwitch);
  }

  async getCartCount() {
    const text = await this.cartBadge.innerText({ timeout: 5000 }).catch(() => '0');
    return text.trim() || '0';
  }

  async openCart() {
    await this.cartBadge.click({ force: true });
    await this.page.waitForLoadState('load');
  }
}

module.exports = { Header };
