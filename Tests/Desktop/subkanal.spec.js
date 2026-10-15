import { test, expect } from "@playwright/test";
import { iNews } from '../../Pages/Desktop/iNews.js';
import { Artikel } from '../../Pages/Desktop/artikel.js';

test('Sub Kanal', async ({ page }) => {
    test.setTimeout(500000);
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const linkurl = page.url();

    const kanal = locator.kanal;
    const totalkanal = await kanal.locator(artikel.daftarkanal).count();
    
    for (let i = 1; i < totalkanal; i++){
    const indeksDilewati = [3, 10, 11];
        if (indeksDilewati.includes(i)) {
        continue;
    }

    await page.goto(linkurl);
    await page.waitForTimeout(3000);

    const klikkanal = kanal.locator(artikel.daftarkanal).nth(i);
    await klikkanal.click();
    
    const subkanalLocator = locator.kanal;
    await expect(subkanalLocator).toBeVisible();
    const totalsubkanal = await subkanalLocator.locator(artikel.daftarkanal).count();
    console.log(`total sub kanal ${totalsubkanal}`);

    for (let a = 1; a < totalsubkanal; a++){
        
        const kliksubkanal = locator.kanal.locator(artikel.daftarkanal).nth(a);
        const urlsubkanal = await artikel.linkkanal(locator.kanal, a);

        await kliksubkanal.click()

        const JudulBreadCrumb = await locator.JudulBreadCrumb();
        const titlesubkanal = await locator.JudulSubKanal();
        const JudulSubKanal = locator.titleSubKanal;

        await expect(JudulSubKanal).toBeVisible();
        await expect(page.url()).toContain(urlsubkanal);
        await expect(JudulBreadCrumb).toEqual(titlesubkanal);

        await page.goBack();
        await page.waitForLoadState('domcontentloaded');
        }
    }
});

test('Load More Sub Kanal', async ({ page }) => {
    test.setTimeout(1300000);
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    //const linkurl = page.url();

    const kanal = locator.kanal;
    //const totalkanal = await kanal.locator(artikel.daftarkanal).count();
    
    //for (let i = 1; i < totalkanal; i++){
    //const indeksDilewati = [3, 10, 11];
    //    if (indeksDilewati.includes(i)) {
    //    continue;
    //    }

    //await page.goto(linkurl);
    //await page.waitForTimeout(3000);

    const klikkanal = kanal.locator(artikel.daftarkanal).nth(1);
    await klikkanal.click();
    
    const subkanalLocator = locator.kanal;
    await expect(subkanalLocator).toBeVisible();
    const totalsubkanal = await subkanalLocator.locator(artikel.daftarkanal).count();
    console.log(`total sub kanal ${totalsubkanal}`);

    for (let a = 1; a < totalsubkanal; a++){
        
        const kliksubkanal = locator.kanal.locator(artikel.daftarkanal).nth(a);
        await kliksubkanal.click()

        const loadmore = locator.loadmore;
        await expect(loadmore).toBeVisible();

        const totalartikelawal = await locator.containerartikel.locator(artikel.artikel).count();
        console.log(`total artikel : ${totalartikelawal}`);

        await loadmore.click();
        await page.waitForTimeout(3000);
        await page.waitForLoadState('domcontentloaded');

        const totalartikelakhir = await locator.containerartikel.locator(artikel.artikel).count()
        expect(totalartikelakhir).toBeGreaterThan(totalartikelawal);
        console.log(`Total Artikel terakhir : ${totalartikelakhir}`);

        await page.goBack();
        await page.waitForLoadState('domcontentloaded');
    }
});

test('Detail Artikel Sub Kanal', async ({ page }) => {
test.setTimeout(300000);
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const kanal = locator.kanal;

    const klikkanal = kanal.locator(artikel.daftarkanal).nth(1);
    await klikkanal.click();
    
    const subkanalLocator = locator.kanal;
    await expect(subkanalLocator).toBeVisible();
    
    const totalsubkanal = await subkanalLocator.locator(artikel.daftarkanal).count();
    console.log(`total sub kanal ${totalsubkanal}`);

    for (let i = 0; i < totalsubkanal; i++){
        
        const kliksubkanal = locator.kanal.locator(artikel.daftarkanal).nth(i);
        await kliksubkanal.click()

        const indukLocator = locator.headline;
        const selectorArtikel = artikel.artikelheadline;

        const namajudul = await artikel.namaJudulDinamic(indukLocator, selectorArtikel, 0);
        const namaFileGambar = await artikel.namaThumbnailDinamic(indukLocator, selectorArtikel, 0);
        
        const klikartikel = await artikel.locatorJudulDinamic(indukLocator, selectorArtikel, 0);
        await klikartikel.click();

        const namaFileGambarDetail = await artikel.namaDetailThumbnail();

        await expect(artikel.detailjudul).toHaveText(namajudul);
        const apakahGambarCocok = namaFileGambarDetail.includes(namaFileGambar) || namaFileGambar.includes(namaFileGambarDetail);
        expect(apakahGambarCocok).toBeTruthy();

        await page.goBack();
        await page.waitForLoadState('domcontentloaded');
    }
})