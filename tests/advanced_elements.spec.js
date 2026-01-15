import { test, expect } from '@playwright/test';
import { goToLandingPage, bufferUpload } from './helper';
import { getRandomArbitrary, getTimestamp } from './utilities'
import fs from 'fs';
import * as path from 'path'


test.describe('Advanced Elements', () => {
    let page;
    test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
        await goToLandingPage(page);
        await page.getByRole('navigation').getByText('Advanced Elements').click();
    });

    test('TC300 Timed Element', async() => {
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

    test('TC301 Dynamic Elements', async() => {
        //click on the dynamic element x times
        const dynClicks = getRandomArbitrary(2, 10);
        for (let i = 0; i < dynClicks; ++i) {
            await page.getByRole('button', { name: 'Add Element' }).click();
        }
        //the dynamic elements created equal the clicks
        await expect(page.locator('#dynamicContainer > div')).toHaveCount(dynClicks);
    });


    //FILE UPLOAD
    test('TC306.A File Upload - From Buffer', async() => {
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

    test.skip('TC306.B File Upload - From Directory', async() => {
        //wait for upload
        const uploadPromise = page.waitForEvent('filechooser');
        //click on upload
        await page.getByRole('button', { name: 'Choose File' }).click();
        const upload = await uploadPromise;
        //upload from local code base
        await upload.setFiles(path.join('./test-files/uploads', 'test_upload.txt'));
        //check file is uploaded
        await expect(page.locator('#fileResult')).toBeVisible();
        await expect(page.locator('#fileResult')).toContainText('Uploaded')
    });

    test('TC306.C File Upload - Cancel Upload', async() => {
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
    test('TC307.A File Download - To Buffer', async() => {
        //wait for download
        const downloadPromise = page.waitForEvent('download');
        //click on download
        await page.getByRole('button', { name: 'Download Sample File' }).click();
        const download = await downloadPromise;
        //download exists
        await expect(download).toBeTruthy();
        console.log(download.suggestedFilename());
    });

    test.skip('TC307.B File Download - To Directory', async() => {
        //wait for download
        const downloadPromise = page.waitForEvent('download');
        //click on download
        await page.getByRole('button', { name: 'Download Sample File' }).click();
        const download = await downloadPromise;
        //get a filename and timestamp
        const suggestName = download.suggestedFilename();
        const timestamp = getTimestamp();
        //save the file to local code base
        const downloadPath = path.join('./test-files/downloads', `${timestamp}${suggestName}`);
        await download.saveAs(downloadPath);
        //download exists
        expect(fs.existsSync(downloadPath)).toBe(true);
    });

});