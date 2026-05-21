const { SELECTORS } = require('../../common/constants');

class SettingsPage {
  constructor(page) {
    this.page = page;
    this.languageSwitch = page.locator(SELECTORS.languageSwitch);
  }

  async switchLanguage(langCode) {
    await this.languageSwitch.click({ force: true });
    await this.page.locator(`[data-lang="${langCode}"]`).click({ force: true });
    await this.page.waitForLoadState('load');
  }
}

module.exports = { SettingsPage };
