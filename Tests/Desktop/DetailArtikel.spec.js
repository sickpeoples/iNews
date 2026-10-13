import { test, expect } from "@playwright/test";
import { iNews } from '../../pages/desktop/iNews.js';
import { Artikel } from '../../pages/desktop/artikel.js';

test('Detail Artikel', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    locator.siapkanJaringan();
    locator.bukaHalaman();

    const headline = locator.headline;
    const artikelheadline = artikel.artikelheadline;

    const judulArtikel = await artikel.namaJudulDinamic(headline, artikelheadline, 0);
    const thumbnailArtikel = await artikel.namaThumbnailDinamic(headline, artikelheadline, 0);
    const klikArtikel = await artikel.locatorThumbnailDinamic(headline, artikelheadline, 0);
    console.log(`judul ${judulArtikel} dan thumbnail ${thumbnailArtikel}`);

    await klikArtikel.click();
    
    const detailthumbnail = await artikel.namaDetailThumbnail();
    await expect(artikel.detailjudul).toHaveText(judulArtikel);
    await expect(detailthumbnail).toEqual(thumbnailArtikel);

    await expect(locator.header).toHaveScreenshot('Header-DetailArtikel.png');
    
    const paragraf = await locator.bodyartikel.locator(artikel.paragraf).count();
    await expect(paragraf).toBeGreaterThan(2);
});

test('Icon Share', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    locator.siapkanJaringan();
    locator.bukaHalaman({ waitUntil: 'domcontentloaded' });

    const headline = locator.headline;
    const artikelheadline = artikel.artikelheadline;

    const klikArtikel = await artikel.locatorThumbnailDinamic(headline, artikelheadline, 0);
    await klikArtikel.click();

    const iconShare = await locator.container.locator(artikel.iconShare).nth(1);
    await expect(iconShare).toBeVisible();
});

test('Baca Juga', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.headline;
    const artikelheadline = artikel.artikelheadline;

    const klikArtikel = await artikel.locatorThumbnailDinamic(headline, artikelheadline, 0);
    await klikArtikel.click();

    const bacajuga = locator.bodyartikel.locator(locator.widgetBacaJuga).nth(0);

    const judul = await artikel.ambilJudulBacaJuga(bacajuga, 0);
    const thumbnail = await artikel.ambilGambarBacaJUga(bacajuga, 0);

    await expect(bacajuga).toBeVisible();
    console.log(`judul ${judul} dan gambar ${thumbnail}`);

    await bacajuga.click();

    await expect(artikel.detailjudul).toBeVisible();

    const DetailGambar = await artikel.namaDetailThumbnail();

    await expect(artikel.detailjudul).toHaveText(judul);
    await expect(DetailGambar).toContain(thumbnail);
});

test('Pagination', async ({ page }) => {
        const locator = new iNews(page);
        const artikel = new Artikel(page);
        await locator.siapkanJaringan();
        await locator.bukaHalaman();

        const daftarArtikel = locator.headline;
        await expect(daftarArtikel.first()).toBeVisible();

        const totalArtikel = await daftarArtikel.count();

        let Pagination = false;
        
        for (let i = 0; i < totalArtikel; i++){

            const klikartikel = await daftarArtikel.nth(i);
            const linkartikel = await klikartikel.getAttribute('href');
            
            await klikartikel.click();
            await page.waitForLoadState('domcontentloaded');

            const jumlahPagination = await page.locator(artikel.Pagination).count();
        if (jumlahPagination > 0){
            console.log(`Pagination DITEMUKAN pada artikel: ${linkartikel}`);
            Pagination = true;

            const urlHalamanSatu = page.url();
            
            const tombolHalamanDua = await artikel.locatorHalaman(locator.container, 2);

            await expect(tombolHalamanDua).toBeVisible();
            await expect(tombolHalamanDua).toBeEnabled();

            await tombolHalamanDua.click();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).not.toHaveURL(urlHalamanSatu);
        
            break; 

            } else {
                console.log(`Tidak ada pagination. Kembali ke daftar artikel...`);
                await page.goBack({waitUntil: 'domcontentloaded'});

                await expect(daftarArtikel.first()).toBeVisible();
                console.log('URL setelah kembali:', page.url());
                console.log('Jumlah artikel setelah kembali:', await daftarArtikel.count());
            }
        }
});

test('Fungsi Tags', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const daftarArtikel = locator.headline;
    
    await daftarArtikel.first().click();
    
    const tags = await locator.container.locator(artikel.Tags);
    await expect(tags.first()).toBeVisible();

    const totaltags = await tags.count();

    for (let i = 0; i < totaltags; i++){
    
        const linktags = await artikel.ambilLinkTags(locator.container, i);
        const kliktags = await tags.nth(i);

        await kliktags.click();

        await expect(page).toHaveURL(linktags);
        await page.goBack({waitUntil: 'domcontentloaded'});
    }
});

test('Related News', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const daftarArtikel = locator.headline;
    
    await daftarArtikel.first().click();

    const RelatedNews = await locator.hasilsearch;
    await expect(RelatedNews).toBeVisible();
    const klikartikel = await artikel.locatorThumbnailDinamic(RelatedNews, artikel.artikel, 0);
    
    const namagambarrelated = await artikel.namaThumbnailDinamic(RelatedNews, artikel.artikel, 0);
    const namajudulrelated = await artikel.namaJudulDinamic(RelatedNews, artikel.artikel, 0);
    console.log(`judul ${namajudulrelated} dan gambar ${namagambarrelated}`);

    await klikartikel.click();

    const DetailGambar = await artikel.namaDetailThumbnail();
    await expect(artikel.detailjudul).toHaveText(namajudulrelated);
    await expect(DetailGambar).toContain(namagambarrelated);
});

test('Latest News', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const daftarArtikel = locator.headline;
    
    await daftarArtikel.first().click();

    const LatestNews = await locator.hasilsearch;
    await expect(LatestNews).toBeVisible();
    const klikartikel = await artikel.locatorThumbnailDinamic(LatestNews, artikel.artikel, 0);
    
    const namagambarlatest = await artikel.namaThumbnailDinamic(LatestNews, artikel.artikel, 0);
    const namajudullatest = await artikel.namaJudulDinamic(LatestNews, artikel.artikel, 0);
    console.log(`judul ${namajudullatest} dan gambar ${namagambarlatest}`);

    await klikartikel.click();

    const DetailGambar = await artikel.namaDetailThumbnail();
    await expect(artikel.detailjudul).toHaveText(namajudullatest);
    await expect(DetailGambar).toContain(namagambarlatest);
})