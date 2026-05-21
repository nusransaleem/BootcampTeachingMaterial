const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/home/HomePage');
const { LoginPage } = require('../../pages/user/LoginPage');
const { AccountPage } = require('../../pages/user/AccountPage');
const users = require('../../data/users.json');

test.describe('Authentication', () => {
  let homePage;
  let loginPage;
  let accountPage;
  const validUser = users.valid;
  const invalidUser = users.invalid;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);
    await homePage.open();
  });

  test('TC-14: Verify login modal displays email and password fields', async () => {
    await loginPage.openLoginModal();
    await loginPage.expectLoginFormVisible();
  });

  test('TC-15: Verify login fails with invalid credentials', async () => {
    await loginPage.loginWithInvalidCredentials(invalidUser.email, invalidUser.password);
  });

  test('TC-16: Verify user can logout and return to guest state', async () => {
    await loginPage.login(validUser.email, validUser.password);
    await expect(loginPage.accountTrigger).toHaveText(new RegExp(validUser.displayName, 'i'));
    await accountPage.logout();
    await expect(loginPage.loginTrigger).toBeVisible();
  });
});
