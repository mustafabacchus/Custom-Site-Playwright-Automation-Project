import { test, expect } from '@playwright/test';
import { goToLandingPage, Login } from './helper';



test.describe('Login and Logout', () => {
  let page;
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
      await goToLandingPage(page);
  });

    test('TC100 Successful Login and Logout', async() => {
        //LOGIN - GOOD
        await Login(page, 'user', 'password')
        //Login result
        await expect(page.locator('#loginResult')).toHaveText('Login successful');
        //Banner text
        await expect(page.getByText('Logged in successfully')).toBeVisible();
        //Logout button is available
        await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
        
        //LOGOUT
        await page.getByRole('button', { name: 'Logout' }).click();
        //Login result
        await expect(page.getByText('Login successful')).toBeHidden();
        //Banner text
        await expect(page.getByText('Logged in successfully')).toBeHidden();
        //Logout button
        await expect(page.getByRole('button', { name: 'Logout' })).toBeHidden();
    });

    test('TC101 Unsuccessful Login', async() => {
        //LOGIN - BAD
        await Login(page, 'testuser', 'testpass')
        //Login result
        await expect(page.locator('#loginResult')).toHaveText('Invalid credentials');
        //Logout button is hidden
        await expect(page.getByRole('button', { name: 'Logout' })).toBeHidden();
    });

    test('TC102 Clear Fields', async() => {
        //Blank credentials
        await Login(page, 'cuser', 'cpass')
        //Clear form
        await page.getByRole('button', { name: 'Clear Form' }).click();
        //Check fields cleared
        await expect(page.getByRole('textbox', { name: 'Username:' })).toBeEmpty();
        await expect(page.getByRole('textbox', { name: 'Password:' })).toBeEmpty();
        await expect(page.locator('#loginResult')).toBeHidden();
    });


});