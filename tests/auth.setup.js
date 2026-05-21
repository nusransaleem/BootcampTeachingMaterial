const { test: setup, expect } = require('@playwright/test');
const { HomePage } = require('../pages/home/HomePage');
const { LoginPage } = require('../pages/user/LoginPage');
const users = require('../data/users.json');

setup('authenticate test user', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const { email, password } = users.valid;

  await homePage.open();
  await loginPage.login(email, password);
  await expect(loginPage.accountTrigger).toBeVisible();

  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
