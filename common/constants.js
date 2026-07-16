const BASE_URL = process.env.BASE_URL || 'https://www.daraz.lk';
const test = "",
const SELECTORS = {
  searchInput: 'input#q[name="q"]',
  cartBadge: '#topActionCartNumber',
  cartIcon: '#topActionCart',
  loginTrigger: '#anonLogin',
  accountTrigger: '#myAccountTrigger',
  languageSwitch: '#topActionSwitchLang',
  siteLogo: '.lzd-logo-content',
  addToCartBtn: 'button:has-text("Add to Cart")',
  dialogClose: '.next-dialog-close',
  cartDeleteBtn: '.automation-btn-delete',
  cartItemRow: '.cart-item-left',
  suggestList: 'div[class^="suggest-list"], [class*="search-box"] [class*="suggest"]',
  suggestItem: 'div[class^="suggest-list"] a, div[class^="suggest-list"] span',
  priceMin: 'input[placeholder="Min"]',
  priceMax: 'input[placeholder="Max"]',
  filterApplyBtn: '.ant-btn-primary',
  productLink: 'a[href*="/products/"]',
  loginError: '.nextera-feedback-error, .next-feedback-error, [class*="error"]',
};

const ROUTES = {
  home: '/',
  catalog: '/catalog/',
};

const TIMEOUTS = {
  default: 15000,
  navigation: 30000,
};

module.exports = { BASE_URL, SELECTORS, TIMEOUTS };
