const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/home/HomePage');
const { LoginPage } = require('../../pages/user/LoginPage');
const { SettingsPage } = require('../../pages/user/SettingsPage');
const users = require('../../data/users.json');

test.describe('Auth & Language', () => {
  let homePage;
  let loginPage;
  let settingsPage;
  const userData = users.valid;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    settingsPage = new SettingsPage(page);
    await homePage.open();
  });

  test('TC-01: Verify successful user authentication with valid credentials', async () => {
    await loginPage.login(userData.email, userData.password);
    await expect(loginPage.accountTrigger).toHaveText(
      new RegExp(userData.displayName, 'i')
    );
  });

  test('TC-02: Verify multi-language support and UI localization', async ({ page }) => {
    await settingsPage.switchLanguage(userData.language);
    await expect(page.getByText(/Help & Support/i)).toBeVisible();
    await expect(page.getByText(/භාෂාව තෝරන්න/i)).toBeVisible();
  });

  test('TC-17: Verify language can be switched to Sinhala and back to English', async ({ page }) => {
    await settingsPage.switchLanguage('si');
    await expect(settingsPage.languageSwitch).toBeVisible();
    await settingsPage.switchLanguage('en');
    await expect(page.getByText(/Help & Support/i)).toBeVisible();
  });
});
