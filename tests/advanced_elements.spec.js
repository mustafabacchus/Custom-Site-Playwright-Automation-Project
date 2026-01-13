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
      const timed_element = await page.locator('#timedBox');
      //get the initial text
      let initial_text = await timed_element.textContent();
      //check if element changes x times
      const num_changes = getRandomArbitrary(2, 10)
      for (let i = 0; i < num_changes; ++i) {
          console.log(initial_text);
          //wait for the element to change
          await expect(timed_element).not.toHaveText(initial_text);
          //update with the new text
          initial_text = await timed_element.textContent();
      }
    });

    test('TC301 Dynamic Elements', async() => {
      //click on the dynamic element x times
      const dyn_clicks = getRandomArbitrary(2, 10);
      for (let i = 0; i < dyn_clicks; ++i) {
          await page.getByRole('button', { name: 'Add Element' }).click();
      }
      //the dynamic elements created equal the clicks
      await expect(page.locator('#dynamicContainer > div')).toHaveCount(dyn_clicks);
    });


    //FILE UPLOAD
    test('TC306.A File Upload - From Buffer', async() => {
      //wait for upload
      const upload_promise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: 'Choose File' }).click();
      const upload = await upload_promise;
      //upload from buffer
      bufferUpload(upload_promise, 'txt');
      //check file is uploaded
      await expect(page.locator('#fileResult')).toBeVisible();
      await expect(page.locator('#fileResult')).toContainText('Uploaded')
    });

    test.skip('TC306.B File Upload - From Directory', async() => {
      //wait for upload
      const upload_promise = page.waitForEvent('filechooser');
      //click on upload
      await page.getByRole('button', { name: 'Choose File' }).click();
      const upload = await upload_promise;
      //upload from local code base
      await upload.setFiles(path.join('./test-files/uploads', 'test_upload.txt'));
      //check file is uploaded
      await expect(page.locator('#fileResult')).toBeVisible();
      await expect(page.locator('#fileResult')).toContainText('Uploaded')
    });

    test('TC306.C File Upload - Cancel Upload', async() => {
      //wait for upload
      const upload_promise = page.waitForEvent('filechooser');
      //click on upload
      await page.getByRole('button', { name: 'Choose File' }).click();
      const upload = await upload_promise;
      //cancel upload
      await upload.setFiles([]);
      //check no file is uploaded
      await expect(page.locator('#fileResult')).toBeVisible();
      await expect(page.locator('#fileResult')).toContainText('No file selected');
    });


    //FILE DOWNLOAD
    test('TC307.A File Download - To Buffer', async() => {
      //wait for download
      const download_promise = page.waitForEvent('download');
      //click on download
      await page.getByRole('button', { name: 'Download Sample File' }).click();
      const download = await download_promise;
      //download exists
      await expect(download).toBeTruthy();
      console.log(download.suggestedFilename());
    });

    test.skip('TC307.B File Download - To Directory', async() => {
      //wait for download
      const download_promise = page.waitForEvent('download');
      //click on download
      await page.getByRole('button', { name: 'Download Sample File' }).click();
      const download = await download_promise;
      //get a filename and timestamp
      const suggest_name = download.suggestedFilename();
      const timestamp = getTimestamp();
      //save the file to local code base
      const download_path = path.join('./test-files/downloads', `${timestamp}${suggest_name}`);
      await download.saveAs(download_path);
      //download exists
      expect(fs.existsSync(download_path)).toBe(true);
    });

});