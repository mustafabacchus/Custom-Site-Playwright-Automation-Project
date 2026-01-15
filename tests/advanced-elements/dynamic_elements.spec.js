import { test, expect } from '@playwright/test';
import { goToLandingPage } from '../../helpers/test-helper';
import { getRandomArbitrary } from '../../helpers/utilities';


test.describe('Dynamic Elements', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
        await goToLandingPage(page);
        await page.getByRole('navigation').getByText('Advanced Elements').click();
    });

    test('timed box is updated', async() => {
        const timedBox = await page.locator('#timedBox');
        //get the initial text
        let initialText = await timedBox.textContent();
        //check if element changes x times
        const numChanges = getRandomArbitrary(2, 10)
        for (let i = 0; i < numChanges; ++i) {
            console.log(initialText);
            //wait for the element to change
            await expect(timedBox).not.toHaveText(initialText);
            //update with the new text
            initialText = await timedBox.textContent();
        }
    });

    test('dynamic elements are added', async() => {
        //click on the dynamic element x times
        const dynClicks = getRandomArbitrary(2, 10);
        for (let i = 0; i < dynClicks; ++i) {
            await page.getByRole('button', { name: 'Add Element' }).click();
        }
        //the dynamic elements created equal the clicks
        await expect(page.locator('#dynamicContainer > div')).toHaveCount(dynClicks);
    });




});