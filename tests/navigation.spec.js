import { test, expect } from '@playwright/test';
import { goToLandingPage, Login } from './helper';


test.describe('Main Navigation Banner', () => {
  let page;
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
      await goToLandingPage(page);
  });

    test('TC200 Navigation Links', async() => {
      //Static get all nav links and pages
      const nav_pages = [[page.getByRole('navigation').getByText('Home'), page.locator('#homePage')], 
        [page.getByRole('navigation').getByText('Login'), page.locator('#formsPage')], 
        [page.getByRole('navigation').getByText('Radio/Checkbox'), page.locator('#radioCheckboxPage')], 
        [page.getByRole('navigation').getByText('Table'), page.locator('#tablePage')], 
        [page.getByRole('navigation').getByText('API Testing'), page.locator('#apiPage')], 
        [page.getByRole('navigation').getByText('Advanced Elements'), page.locator('#advancedPage')], 
        [page.getByRole('navigation').getByText('Popular Sites'), page.locator('#popularPage')]];

      let nav = 0;
      while (nav < nav_pages.length-1) {
        //click on navigation
        await nav_pages[nav][0].click();
        //check page is visible
        await expect(nav_pages[nav][1]).toBeVisible()
        let page = 0;
        while (page < nav_pages.length-1) {
          //all other pages remain hidden
          if (page != nav) {
            await expect(nav_pages[page][1]).toBeHidden()
          }
          page += 1;
        }
        nav += 1;
      }
    });

});