import { test, expect } from '@playwright/test';
import { goToLandingPage, Login } from './helper';


test.describe('Navigation Banner', () => {
  let page;
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
      await goToLandingPage(page);
  });

    test('TC200 Navigation Links', async() => {
        
    });
});