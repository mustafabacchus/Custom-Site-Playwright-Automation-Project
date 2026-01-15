import { test, expect } from '@playwright/test';
import { goToLandingPage, bufferUpload } from '../../helpers/test-helper';
import { getTimestamp } from '../../helpers/utilities';
import fs from 'fs';
import * as path from 'path';


test.describe('File Manipulation', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
        await goToLandingPage(page);
        await page.getByRole('navigation').getByText('Advanced Elements').click();
    });
    
    //FILE UPLOAD
    test('file upload from buffer', async() => {
        //wait for upload
        const uploadPromise = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'Choose File' }).click();
        const upload = await uploadPromise;
        //upload from buffer
        bufferUpload(uploadPromise, 'txt');
        //check file is uploaded
        await expect(page.locator('#fileResult')).toBeVisible();
        await expect(page.locator('#fileResult')).toContainText('Uploaded')
    });

    test.skip('file upload from super local directory', async() => {
        //wait for upload
        const uploadPromise = page.waitForEvent('filechooser');
        //click on upload
        await page.getByRole('button', { name: 'Choose File' }).click();
        const upload = await uploadPromise;
        //upload from local code base
        await upload.setFiles(path.join('./test-data/files/uploads', 'test_upload.txt'));
        //check file is uploaded
        await expect(page.locator('#fileResult')).toBeVisible();
        await expect(page.locator('#fileResult')).toContainText('Uploaded')
    });

    test('file upload is canceled', async() => {
        //wait for upload
        const uploadPromise = page.waitForEvent('filechooser');
        //click on upload
        await page.getByRole('button', { name: 'Choose File' }).click();
        const upload = await uploadPromise;
        //cancel upload
        await upload.setFiles([]);
        //check no file is uploaded
        await expect(page.locator('#fileResult')).toBeVisible();
        await expect(page.locator('#fileResult')).toContainText('No file selected');
    });


    //FILE DOWNLOAD
    test('download to buffer', async() => {
        //wait for download
        const downloadPromise = page.waitForEvent('download');
        //click on download
        await page.getByRole('button', { name: 'Download Sample File' }).click();
        const download = await downloadPromise;
        //download exists
        await expect(download).toBeTruthy();
        console.log(download.suggestedFilename());
    });


    test.skip('download to super local directory', async() => {
        //wait for download
        const downloadPromise = page.waitForEvent('download');
        //click on download
        await page.getByRole('button', { name: 'Download Sample File' }).click();
        const download = await downloadPromise;
        //get a filename and timestamp
        const suggestName = download.suggestedFilename();
        const timestamp = getTimestamp();
        //save the file to local code base
        const downloadPath = path.join('./test-data/files/downloads', `${timestamp}${suggestName}`);
        await download.saveAs(downloadPath);
        //download exists
        expect(fs.existsSync(downloadPath)).toBe(true);
    });
 });