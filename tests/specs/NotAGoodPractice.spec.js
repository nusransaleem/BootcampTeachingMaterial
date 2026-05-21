/**
 * =============================================================================
 * TEACHING FILE ONLY — NotAGoodPractice.spec.js
 * =============================================================================
 *
 * Purpose: Show common test automation mistakes in one place so students can
 * compare this file with the real framework under pages/, data/, and specs/.
 *
 * This file is EXCLUDED from CI (playwright.config.js → testIgnore).
 *
 * Learning goals:
 *   1. See why hardcoded data and selectors are hard to maintain
 *   2. See why waitForTimeout() makes tests slow and flaky
 *   3. See why duplicating login/search steps in every test is a problem
 *   4. See why tests must not depend on other tests' state
 *
 * Good examples in this repo:
 *   - tests/specs/login.spec.js  + pages/user/LoginPage.js
 *   - tests/specs/search.spec.js + pages/common/SearchBar.js
 *   - data/users.json, data/products.json, common/constants.js
 * =============================================================================
 */

const { test, expect } = require('@playwright/test');

// -----------------------------------------------------------------------------
// BAD TEST 1: Hardcoded URL, credentials, and selectors
// GOOD: Use baseURL in playwright.config.js, users.json, LoginPage, constants.js
// -----------------------------------------------------------------------------
test('BAD-01: Login with everything hardcoded in the test', async ({ page }) => {
  await page.goto('https://www.daraz.lk/'); // BAD: URL repeated in every test
  await page.waitForTimeout(3000); // BAD: fixed sleep — use expect().toBeVisible() instead

  try {
    await page.locator('.popup-close').first().click(); // BAD: empty catch hides real failures
  } catch (e) {}

  await page.locator('#anonLogin').click(); // BAD: selector string in test — belongs in constants.js
  await page.locator('input[type="text"]').fill('codewaveautomation@gmail.com'); // BAD: password in source
  await page.locator('input[type="password"]').fill('CodeWaveTeste@001');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.waitForTimeout(5000); // BAD: might pass when slow, fail when fast

  await expect(page.locator('#myAccountTrigger')).toHaveText(/CodeWaveTester's account/i);

  // GOOD equivalent (one line in spec):
  //   await loginPage.login(userData.email, userData.password);
});

// -----------------------------------------------------------------------------
// BAD TEST 2: Copy-paste navigation and locators from test 1
// GOOD: HomePage.open() + SearchBar.search() — write once, reuse everywhere
// -----------------------------------------------------------------------------
test('BAD-02: Search with duplicated setup code', async ({ page }) => {
  await page.goto('https://www.daraz.lk/'); // BAD: same goto again
  await page.waitForTimeout(2000);
  await page.locator('input#q[name="q"]').fill('samsung galaxy'); // BAD: test data in test file
  await page.locator('input#q[name="q"]').press('Enter'); // BAD: same locator typed twice
  await page.waitForTimeout(4000);
  await expect(page.locator('body')).toContainText('items found for "samsung galaxy"', {
    ignoreCase: true,
  });

  // GOOD equivalent:
  //   await homePage.open();
  //   await searchBar.search(products.phones.search_key);
});

// -----------------------------------------------------------------------------
// BAD TEST 3: One huge test doing login + search + filter + add to cart
// GOOD: Split flows; reuse page objects; cart tests run serial with auth setup
// -----------------------------------------------------------------------------
test('BAD-03: One long test that does too many things', async ({ page }) => {
  await page.goto('https://www.daraz.lk/');
  await page.waitForTimeout(2000);

  // --- login block copy-pasted again (3rd time in this file) ---
  await page.locator('#anonLogin').click();
  await page.locator('input[type="text"]').fill('codewaveautomation@gmail.com');
  await page.locator('input[type="password"]').fill('CodeWaveTeste@001');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.waitForTimeout(6000);

  // --- search block ---
  await page.locator('input#q[name="q"]').fill('headphones');
  await page.locator('input#q[name="q"]').press('Enter');
  await page.waitForTimeout(5000);
  await page.locator('span:has-text("JBL")').first().click();
  await page.waitForTimeout(3000);
  await page.locator('a:has-text("700BT")').first().click(); // BAD: brittle product name
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await page.waitForTimeout(3000);
  await expect(page.getByText('Added to cart successfully!')).toBeVisible();

  // GOOD: cart.spec.js TC-07 uses ProductDetailsPage, serial mode, storageState
});

// -----------------------------------------------------------------------------
// BAD TEST 4: Magic numbers + .first() on generic class + manual URL assert
// GOOD: products.json min/max + ProductListingPage.filterByPrice() + expect(page).toHaveURL()
// -----------------------------------------------------------------------------
test('BAD-04: Price filter with magic numbers', async ({ page }) => {
  await page.goto('https://www.daraz.lk/');
  await page.waitForTimeout(1500);
  await page.locator('input[type="search"]').first().fill('smart watches'); // BAD: .first() — which search box?
  await page.locator('input[type="search"]').first().press('Enter');
  await page.waitForTimeout(5000);
  await page.locator('input[placeholder="Min"]').fill('5000'); // BAD: what is 5000? no comment, no data file
  await page.locator('input[placeholder="Max"]').fill('10000');
  await page.locator('.ant-btn-primary').click(); // BAD: many buttons share this class on page
  await page.waitForTimeout(3000);
  const url = page.url();
  expect(url.includes('price=5000-10000')).toBeTruthy(); // BAD: use Playwright expect(toHaveURL)

  // GOOD: see search.spec.js TC-05
});

// -----------------------------------------------------------------------------
// BAD TEST 5: Test assumes another test already logged the user in
// GOOD: Each test prepares its own state (beforeEach + login, or auth.setup.js)
// -----------------------------------------------------------------------------
test('BAD-05: Logout without logging in first', async ({ page }) => {
  // BAD: If BAD-03 did not run first, this test fails — tests must be independent
  await page.goto('https://www.daraz.lk/');
  await page.waitForTimeout(2000);
  await page.locator('#myAccountTrigger').click();
  await page.getByRole('link', { name: /logout/i }).click();
  await page.waitForTimeout(2000);
  await expect(page.locator('#anonLogin')).toBeVisible();

  // GOOD: auth.spec.js TC-16 logs in, then logs out in the SAME test
});

/**
 * QUICK REFERENCE — Bad vs Good in this project
 *
 * | Topic              | Bad (this file)        | Good (rest of repo)              |
 * |--------------------|------------------------|----------------------------------|
 * | URL                | page.goto(full URL)    | baseURL + homePage.open()        |
 * | Credentials        | strings in test        | data/users.json                  |
 * | Selectors          | inline strings         | common/constants.js              |
 * | Waits              | waitForTimeout(ms)     | expect(), waitForLoadState       |
 * | Reuse              | copy-paste blocks      | Page objects + helpers           |
 * | Test independence  | depends on BAD-03      | beforeEach / auth.setup.js       |
 * | Long tests         | one test, many steps   | one scenario per test            |
 */
