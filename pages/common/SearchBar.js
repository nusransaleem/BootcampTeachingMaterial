const { SELECTORS } = require('../../common/constants');

class SearchBar{
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator(SELECTORS.searchInput);
    this.suggestList = page.locator(SELECTORS.suggestList);
    this.suggestItems = page.locator(SELECTORS.suggestItem);
  }

  async search(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('load');
  }

  async typeForSuggestions(keyword) {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    await this.suggestList.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async clear() {
    await this.searchInput.clear();
  }

  getCurrentValue() {
    return this.searchInput.inputValue();
  }
}

module.exports = { SearchBar };
