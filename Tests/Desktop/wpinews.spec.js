import { test, expect } from '@playwright/test';
import { iNews } from '../../Pages/Desktop/iNews.js';
import { Artikel } from '../../Pages/Desktop/artikel.js';

test('Welcome Page', async ({ page }) => {
test.setTimeout(120000);
    const locator = new iNews(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    await expect(locator.header).toBeVisible();
    await expect(locator.header).toHaveScreenshot('Header-WP.png');
    await expect(locator.headline).toBeVisible();
    await expect(locator.latestnews).toBeVisible();
});

test('Headline', async ({ page }) => {
test.setTimeout(120000);
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.headline;
    await expect(headline).toBeVisible();

    const linkurl = page.url();
    
    const totalartikel = await headline.locator(artikel.artikel).count();
    console.log(`Total Artikel Headline : ${totalartikel}`);
    
    for (let i = 0; i < totalartikel; i++){
    await page.goto(linkurl);
    const namajudul = await artikel.namaJudulDinamic(headline, artikel.artikel, i);
    const namagambar = await artikel.namaThumbnailDinamic(headline, artikel.artikel, i);
    console.log(`${namajudul}, ${namagambar}`);

    const klikartikel = await artikel.locatorThumbnailDinamic(headline, artikel.artikel, i);
    await klikartikel.click();

    const namagambardetail = await artikel.namaDetailThumbnail();

    await expect(artikel.detailjudul).toHaveText(namajudul);
    await expect(namagambardetail).toContain(namagambar);
    }
});

test('Latest News', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const latest = locator.latestnews;
    await expect(latest).toBeVisible();

    //const linkurl = page.url();
    const totalartikel = await latest.locator(artikel.artikel).count();
    console.log(`Total Artikel : ${totalartikel}`);

    //for (let i = 0; i < totalartikel; i++){

    //await page.goto(linkurl);
    
    const namajudul = await artikel.namaJudulDinamic(latest, artikel.artikel, 0);
    const namagambar = await artikel.namaThumbnailDinamic(latest, artikel.artikel, 0);

    const klikartikel = await artikel.locatorThumbnailDinamic(latest, artikel.artikel, 0);
    await klikartikel.click();

    const namagambardetail = await artikel.namaDetailThumbnail();

    await expect(artikel.detailjudul).toHaveText(namajudul);
    expect(namagambardetail).toContain(namagambar);

    //}
});

test('Footer', async ({ page }) => {
    const locator = new iNews(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    await expect(locator.footer).toBeVisible();
    await expect(locator.footer).toHaveScreenshot('WelcomePage-Footer.png');
});