import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) =>{
test.setTimeout(120000);
    let failedAssets = [];
  page.on('response', response => {
    const url = response.url();
    if ((url.endsWith('.woff2') || url.endsWith('.woff') || url.endsWith('.svg')) && !response.ok()) {
      failedAssets.push(url);
    }
  });

  await page.route('**/*', (route) => {
    const request = route.request();
    if (request.url().includes('googleads') || request.url().includes('doubleclick') || request.url().includes('googlesyndication')) {
      route.abort();
    } else {
      route.continue();
    }
  });

    console.log('Membuka halaman utama iNews...');
    await page.goto('https://www.inews.id/', { waitUntil: 'domcontentloaded' });
})

test('Fungsi Search', async ({ page }) => {
  const nyari = 'Prabowo';
  await page.getByPlaceholder('Search').fill(nyari)
  await page.locator('.btnSearch').click();
  await expect(page.locator('.searchKey')).toBeVisible({ timeout: 15000 });
  const totalartikel = await page.locator('.cardPlaylist').count();
  console.log(`Jumlah artikel ${totalartikel}`);
  await page.waitForTimeout(1500);
  for (let i = 0; i < totalartikel; i++){
  const judulartikel = page.locator('.cardTitle').nth(i);
  const namajudul = await judulartikel.innerText();
  console.log(`${i}/${totalartikel - 1} Judul Artikel : ${namajudul}`)
  expect(judulartikel).toContainText(nyari);
  }
})

test('Detail Artikel', async ({ page }) => {
   const nyari = 'Prabowo';
  await page.getByPlaceholder('Search').fill(nyari)
  await page.locator('.btnSearch').click();
  await expect(page.locator('.searchKey')).toBeVisible();
  await page.locator('.cardPlaylist').first().click();
  await page.waitForTimeout(1500);
})