import { test, expect } from '@playwright/test';
import { iNews } from '../iNews';
import { Artikel } from '../artikel';

test('Kanal', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const linkurl = page.url();

    const kanal = locator.kanal;
    const totalkanal = await kanal.locator(artikel.daftarkanal).count();
    console.log(`total kanal adalah : ${totalkanal}`);
    
    for (let i = 1; i < totalkanal; i++ ){
    await page.goto(linkurl);
    
    const srckanal = await artikel.linkkanal(kanal, i);
    console.log(`link nya adalah ${srckanal}`);

    const klikkanal = locator.kanal.locator(artikel.daftarkanal).nth(i);
    klikkanal.click();
    
    await expect(page).toHaveURL(srckanal);
    }
});

test('Load More', async ({ page }) => {
    test.setTimeout(120000);
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const linkurl = page.url();
    
    const kanal = locator.kanal;
    const totalkanal = await kanal.locator(artikel.daftarkanal).count();
    console.log(`total kanal adalah : ${totalkanal}`);
    
    for (let i = 1; i < totalkanal; i++ ){
    if (i === 10) {
        continue;
    }
    
    await page.goto(linkurl);
    
    const srckanal = await artikel.linkkanal(kanal, i);
    console.log(`link nya adalah ${srckanal}`);

    const klikkanal = locator.kanal.locator(artikel.daftarkanal).nth(i);
    await klikkanal.click();
    
    await expect(page.url()).toContain(srckanal);
    
    const loadmore = locator.loadmore;
    await expect(loadmore).toBeVisible();

    const totalartikelawal = await locator.containerartikel.locator(artikel.artikel).count();
    console.log(`total artikel : ${totalartikelawal}`);

    await loadmore.click();
    await page.waitForTimeout(3000);

    const totalartikelakhir = await locator.containerartikel.locator(artikel.artikel).count()
    expect(totalartikelakhir).toBeGreaterThan(totalartikelawal);
    console.log(`Total Artikel terakhir : ${totalartikelakhir}`);
    }
});

test('Detail Artikel Kanal', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();
    
    const kanal = locator.kanal;
    const srckanal = await artikel.linkkanal(kanal, 1)
    const klikkanal = kanal.locator(artikel.daftarkanal).nth(1);

    await klikkanal.click();
    await expect(page.url()).toContain(srckanal);
    
    const indukLocator = locator.headline;
    const selectorArtikel = artikel.artikelheadline;

    const artikelnews = indukLocator.getByLabel(selectorArtikel).first();
    await expect(artikelnews).toBeVisible();

    const judul = await artikel.ambilJudul(artikelnews);
    const thumbnail = await artikel.ambilGambar(artikelnews);
    console.log(`Nama judul ${judul} dan Nama gambar ${thumbnail}`);

    await artikelnews.click();
    
    const detailjudul = await artikel.detailjudul;
    await expect(detailjudul).toHaveText(judul);
    
    const detailthumbnail = await artikel.namaDetailThumbnail();
    await expect(detailthumbnail).toContain(thumbnail);

});