import { test, expect } from '@playwright/test';

export async function goToLandingPage(page) {
    await page.goto('http://localhost:8888/');
    await expect(page).toHaveTitle('Automation Practice Site');
}

export async function Login(page, user, pass) {
    await page.getByRole('navigation').getByText('Login').click();
    await page.getByRole('textbox', { name: 'Username:' }).fill(user);
    await page.getByRole('textbox', { name: 'Password:' }).fill(pass);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#loginResult')).toBeVisible();
}

export async function bufferUpload(uploadPromise, fileType) {
	const file_type = fileType;
	const content = "test upload file.";
	const buffer = Buffer.from(content);
	const upload = await uploadPromise;
	await upload.setFiles({
        name: `${'event_upload.'}${fileType}`, 
        mimeType: 'text/plain',
        buffer: buffer,
	});
}