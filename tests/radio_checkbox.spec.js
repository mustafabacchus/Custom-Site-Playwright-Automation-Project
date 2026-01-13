import { test, expect } from '@playwright/test';
import { goToLandingPage } from './helper';

test.describe('Radio and Checkbox', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
        await goToLandingPage(page);
        await page.getByRole('navigation').getByText('Radio/Checkbox').click();
    });

    test('TC301 Dynamic Elements', async() => {
        const radio_color = await page.locator(`input[type="radio"][name="${'color'}"]`).all();
        console.log(radio_color.length)
    });

});


