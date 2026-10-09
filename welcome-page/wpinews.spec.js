import { test, expect } from '@playwright/test';
import { WelcomePage } from './wp-inews';

test('Welcome Page', async ({ page }) => {
test.setTimeout(120000);
    const wppage = new WelcomePage(page);
    await wppage.bukaHalaman();

    await expect(wppage.header).toBeVisible();
    await expect(wppage.header).toHaveScreenshot('Header-WP.png');
    await expect(wppage.headline).toBeVisible();
    await expect(wppage.latestnews).toBeVisible();
});

test('Headline', async ({ page }) => {
test.setTimeout(120000);
    const wppage = new WelcomePage(page);
    await wppage.bukaHalaman();

    await expect(wppage.headline).toBeVisible();
    const linkurl = page.url();
    const totalartikel = await wppage.artikelheadline.count();

    console.log(`total artikel : ${totalartikel}`);
    for (let i = 0; i < totalartikel; i++){
    
    await page.goto(linkurl);

    const namajudulartikel = await wppage.namaJudulDinamic(wppage.headline, i);
    const klikgambar = await wppage.locatorThumbnailDinamic(wppage.headline, i);
    const namagambar = await wppage.namaThumbnailDinamic(wppage.headline, i);
    
    console.log(`${i}/${totalartikel - 1} sedang cek artikel ${namajudulartikel} dan gambar ${namagambar}`);

    await klikgambar.click();
    await page.waitForTimeout(1500);

    const namaFileGambarDetail = await wppage.namaDetailThumbnail();
    
    expect(namaFileGambarDetail).toContain(namagambar);
    expect(wppage.detailjudul).toHaveText(namajudulartikel);
    }
});

test('Latest News', async ({ page }) => {
test.setTimeout(120000);
    const latest = new WelcomePage(page);
    await latest.bukaHalaman();

    const artikellatest = latest.latestnews.locator(latest.artikel);
    const totalartikel = await artikellatest.count();
    await expect(latest.latestnews).toBeVisible();
    console.log(`Total Artikel Latest News : ${totalartikel}`);
    
    const linkurl = page.url();

    for (let i = 0; i < totalartikel; i++){
    await page.goto(linkurl);
    const namajudul = await latest.namaJudulDinamic(latest.latestnews, i);
    const namagambar = await latest.namaThumbnailDinamic(latest.latestnews, i);
    console.log(`Nama judul : ${namajudul} dan Nama gambar ${namagambar}`);

    const klikgambar = await latest.locatorThumbnailDinamic(latest.latestnews, i);
    await klikgambar.click();

    const namaDetailThumbnail = await latest.namaDetailThumbnail();
    await expect(latest.detailjudul).toHaveText(namajudul);
    expect(namaDetailThumbnail).toContain(namagambar);
    }
});

test('Footer', async ({ page }) => {
    const footer = new WelcomePage(page);
    await footer.bukaHalaman();

    await expect(footer.footer).toBeVisible();
    await expect(footer.footer).toHaveScreenshot('WelcomePage-Footer.png');
});