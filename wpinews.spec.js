import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
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
    await page.goto('https://www.inews.id/');
})

test('Halaman Welcome Page', async ({ page }) => {
  
    await expect(page.getByLabel('logon').first()).toBeVisible();
    await expect(page.getByLabel('logon').nth(1)).toBeVisible();
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Latest News' }).first()).toBeVisible();
});

// Test Headline

test('Section Headline', async ({ page }) => {

    // kanal
    await expect(page.locator('.nav__main .container .navList').first()).toBeVisible();
    // widget headline
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    // cek thumbnail headline
    const thumbnail = page.locator('.headline1 img.thumbCard');
    const hlthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = hlthumbnail.split('/').pop().split('?')[0];
    await expect(thumbnail).toBeVisible();
    // cek judul headline
    const judul = page.locator('.headline1 .cardTitle');
    const teksjudul = await judul.innerText();
    await expect(judul).toBeVisible();
    // masuk detail artikel
    await thumbnail.click();
    // cek detail thumbnail
    const detailthumbnail = page.locator('.headerImg img')
    await expect(detailthumbnail).toBeVisible();
    const srcdetail = await detailthumbnail.getAttribute('src');
    await expect(srcdetail).toContain(namaFileGambar);
    //cek detail judul
    const detailjudul = page.locator('.headerTitle');
    await expect(detailjudul).toBeVisible();
    await expect(detailjudul).toContainText(teksjudul, { ignoreCase: true });
})

// Test Latest News

test('Section Latest News', async ({ page }) => {
    const sectionlatest = page.locator('section.widgetListArticle').filter({ has: page.getByRole('heading', { name: 'Latest News' }) }).first();
    await expect(sectionlatest).toBeVisible();

    const latestthumbnail = sectionlatest.locator('.cardArticle img.thumbCard').first();
    const ltthumbnail = await latestthumbnail.getAttribute('src');
    const ltnamaFileGambar = ltthumbnail.split('/').pop().split('?')[0];
    await expect(latestthumbnail).toBeVisible();

    const latestjudul = page.locator('.widgetListArticle.row .cardArticle .cardTitle').first();
    await expect(latestjudul).toBeVisible();
    const latestteksjudul = await latestjudul.innerText();

    await latestjudul.click();

    const ltdetailthumbnail = page.locator('.detailWrapper .headerImg img')
    await expect(ltdetailthumbnail).toBeVisible();
    const ltsrcdetail = await ltdetailthumbnail.getAttribute('src');
    await expect(ltsrcdetail).toContain(ltnamaFileGambar);

    const ltjudul = page.locator('.headerTitle');
    await expect(ltjudul).toBeVisible();
    await expect(ltjudul).toContainText(latestteksjudul);
})

test('Footer', async ({ page }) => {
    await expect(page.locator('.footerBody')).toBeVisible();
})