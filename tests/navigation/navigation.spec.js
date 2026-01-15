import { test, expect } from '@playwright/test';
import { goToLandingPage } from '../../helpers/test-helper';


test.describe('Navigation', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
        await goToLandingPage(page);
    });

    test('should only show active page', async() => {
        //static get all nav links from nav banner
        const navPages = [[page.getByRole('navigation').getByText('Home'), page.locator('#homePage')], 
        [page.getByRole('navigation').getByText('Login'), page.locator('#formsPage')], 
        [page.getByRole('navigation').getByText('Radio/Checkbox'), page.locator('#radioCheckboxPage')], 
        [page.getByRole('navigation').getByText('Table'), page.locator('#tablePage')], 
        [page.getByRole('navigation').getByText('API Testing'), page.locator('#apiPage')], 
        [page.getByRole('navigation').getByText('Advanced Elements'), page.locator('#advancedPage')], 
        [page.getByRole('navigation').getByText('Popular Sites'), page.locator('#popularPage')]];

        for (let nav = 0; nav < navPages.length-1; nav++) {
            //click on navigation
            await navPages[nav][0].click();
            //check page is visible
            await expect(navPages[nav][1]).toBeVisible()
            //all other pages remain hidden
            for (let page = 0; page < navPages.length-1; page++) {
                if (page != nav) {
                await expect(navPages[page][1]).toBeHidden()
                }
            }
        }
    });

});