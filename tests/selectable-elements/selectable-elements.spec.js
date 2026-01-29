import { test, expect } from '@playwright/test';
import { goToLandingPage } from '../../helpers/test-helper';


test.describe('Select Element', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
        await goToLandingPage(page);
        await page.getByRole('navigation').getByText('Radio/Checkbox').click();
    });

    test('confirm radio default selection', async() => {
        //radio
        //default - no selection
        await expect(page.locator('#radioResult')).toBeHidden();
        //confirm selection on the ui
        await page.locator('//*[@id="radioCheckboxPage"]/button[1]').click();
        await expect(page.locator('#radioResult')).toBeVisible();
        await expect(page.locator('#radioResult')).toHaveText('No radio selected');
     });

    test('confirm checkbox default selection', async() => {
        //checkbox
        //default - no selection
        await expect(page.locator('#checkboxResult')).toBeHidden();
        //confirm selection on the ui
        await page.locator('//*[@id="radioCheckboxPage"]/button[2]').click();
        await expect(page.locator('#checkboxResult')).toBeVisible();
        await expect(page.locator('#checkboxResult')).toHaveText('No checkboxes selected');
    });

    test('confirm dropdown default selection', async() => {
        //dropdown
        //default - 1st option
        await expect(page.locator('#dropdownResult')).toBeHidden();
        //confirm selection on the ui
        await page.locator('//*[@id="radioCheckboxPage"]/button[3]').click();
        await expect(page.locator('#dropdownResult')).toBeVisible();
        const first_option = await page.locator('select#dropdown option:first-child').getAttribute('value');
        await expect(page.locator('#dropdownResult')).toHaveText(`Selected: ${first_option}`);

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
            await page.locator('//*[@id="radioCheckboxPage"]/button[1]').click();
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
            //each checkbox is checked without unchecking it
            values.push(await checkbox.getAttribute('value'));
            //ui user selection verification for all checked boxes
            await page.locator('//*[@id="radioCheckboxPage"]/button[2]').click();
            await expect(page.locator('#checkboxResult')).toBeVisible();
            for (const value of values) {
                await expect(page.locator('#checkboxResult')).toContainText(value);
            }
            console.log(`Checked Values: ${values}`);
        }
    });

    test('option from dropdown is selectable and user can confirm selection', async() => {
        //get the dropdown and its options
        const dropdown = page.locator('#dropdown');
        const options = dropdown.locator('option');
        //check for expected options
        await expect(options).toHaveCount(3);
        await expect(page.locator('#dropdownResult')).toBeHidden();
        //select each option
        for (let i = 0; i < await options.count(); i++) {
            const value = await options.nth(i).getAttribute('value');
            await dropdown.selectOption(value);
            await expect(dropdown).toHaveValue(value);
            //ui user can verify option selected
            await page.locator('//*[@id="radioCheckboxPage"]/button[3]').click();
            await expect(page.locator('#dropdownResult')).toBeVisible();
            await expect(page.locator('#dropdownResult')).toContainText(value);
            console.log(`Dropdown Selected: ${value}`);
        }
    });
        

});


