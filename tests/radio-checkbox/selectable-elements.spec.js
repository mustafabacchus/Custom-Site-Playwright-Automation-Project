import { test, expect } from '@playwright/test';
import { goToLandingPage } from '../../helpers/test-helper';


test.describe('Select Element', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
        await goToLandingPage(page);
        await page.getByRole('navigation').getByText('Radio/Checkbox').click();
    });

    test('confirm selectable element has no selection or defaulted', async() => {
        //radio
        // default - no selection
        await expect(page.locator('radioResult')).toBeHidden();
        await page.locator('input[type="radio"][name="color"]').last().locator('xpath=following::button[1]').click();
        await expect(page.locator('#radioResult')).toBeVisible();
        await expect(page.locator('#radioResult')).toHaveText('No radio selected');

        //checkbox
        // default - no selection
        await expect(page.locator('checkboxResult')).toBeHidden();
        await page.locator('//h3[text()="Checkboxes"]/following::button[1]').last().click();
        await expect(page.locator('#checkboxResult')).toBeVisible();
        await expect(page.locator('#checkboxResult')).toHaveText('No checkboxes selected');
    });

    test('radio is selectable and user can confirm selection', async() => {
        //get all radios in the group
        const radioGroupColor = await page.locator(`input[type="radio"][name="${'color'}"]`).all();
        //check for correct number of radios
        await expect(radioGroupColor.length).toBe(3);
        await expect(page.locator('#radioResult')).toBeHidden();
        for (const color of radioGroupColor) {
            //click on each one
            await color.check();
            await expect(color).toBeChecked();
            const value = await color.getAttribute('value');
            //ui user selection verification
            await page.locator('input[type="radio"][name="color"]').last().locator('xpath=following::button[1]').click();
            await expect(page.locator('#radioResult')).toBeVisible();
            await expect(page.locator('#radioResult')).toContainText(value);
            console.log(`Clicked: ${value}`);
        }
    });

    test('checkbox is selectable and user can confirm selections', async() => {
        //get all checkboxes
        const checkboxes = await page.locator(`input[type="checkbox"]`).all();
        //check for correct number of checkboxes
        await expect(checkboxes.length).toBe(3);
        await expect(page.locator('#checkboxResult')).toBeHidden();
        let values = [];
        for (const checkbox of checkboxes) {
            //click on each one
            await checkbox.check();
            await expect(checkbox).toBeChecked();
            //each checkbox is checked without uncheck
            values.push(await checkbox.getAttribute('value'));
            //ui user selection verification for all checked boxes
            await page.locator('//h3[text()="Checkboxes"]/following::button[1]').last().click();
            await expect(page.locator('#checkboxResult')).toBeVisible();
            for (const value of values) {
                await expect(page.locator('#checkboxResult')).toContainText(value);
            }
            console.log(`Checked Values: ${values}`);
        }
    });

});


