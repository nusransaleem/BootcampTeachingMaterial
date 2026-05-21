const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/home/HomePage');
const { Header } = require('../../pages/common/Header');

test.describe('Homepage', () => {
  let homePage;
  let header;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    header = new Header(page);
    await homePage.open();
  });

  test('TC-10: Verify homepage loads with correct title and URL', async () => {
    await homePage.expectHomeLoaded();
  });

  test('TC-11: Verify key header elements are visible on homepage', async () => {
    await homePage.expectHeaderVisible();
  });

  test('TC-12: Verify guest user cart badge is empty or zero', async () => {
    const count = await header.getCartCount();
    expect(['0', '', ' ']).toContain(count.replace(/\s/g, '') || '0');
  });

  test('TC-13: Verify logo navigates back to homepage from catalog', async ({ page }) => {
    await page.goto('/catalog/?q=phone');
    await page.waitForLoadState('networkidle');
    await homePage.navigateHomeViaLogo();
    await homePage.expectHomeLoaded();
  });
});
