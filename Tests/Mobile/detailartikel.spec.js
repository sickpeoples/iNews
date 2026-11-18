import { test, expect } from "@playwright/test";
import { induk } from '../../Pages/Mobile/induk.js';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { Artikel } from "../../Pages/Mobile/artikel.js";

test('Verify Halaman Artikel', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.artikel;
    const judulH = artikel.judulH;
    const judul = await artikel.namaJudulDinamic(headline, judulH, 0);
    const thumbnailH = artikel.fotoH;
    const thumbnail = await artikel.namaThumbnailDinamic(headline, thumbnailH, 0);

    await expect(headline.first()).toBeVisible();
    console.log(`nama judul : ${judul}`);
    console.log(`nama thumbnail : ${thumbnail}`);
        
    await headline.locator(thumbnailH).first().click({ waitUntil: 'domcontentloaded' });

    const paragraf = await locator.BodyArtikel.locator(artikel.paragraf);
    const thumbnailD = await artikel.namaDetailThumbnail()
    const judulD = await artikel.judulD.innerText();
    const linkparagraf = await locator.BodyArtikel.locator(artikel.LinkParagraf);
    const jumlahlink = await linkparagraf.count();

    const jumlahparagraf = await paragraf.count();

    await expect(paragraf.first()).toBeVisible();

    console.log(`Jumlah paragraf = ${jumlahparagraf}`);
    console.log(`Jumlah link = ${jumlahlink}`);

    await expect(judulD).toEqual(judul);
    await expect(thumbnailD).toEqual(thumbnail);
    await expect(jumlahparagraf).toBeGreaterThan(2);

    for(let i = 0; i < jumlahlink; i++){
        const kliklink = linkparagraf.nth(i)
        const namalink = await kliklink.innerText();
        console.log(`Nama Link Paragraf : ${namalink}`);

        await kliklink.click();

        const hasil = locator.hasilsearch;

        await expect(hasil).toHaveText(namalink, { ignoreCase: true });
        console.log(`Nama link dan paragraf sesuai`);

        await page.goBack();
    }
    console.log(`Nama Artikel dan Gambar Artikel cocok`);
});

test('Verify Share', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.artikel;
    const thumbnailH = artikel.fotoH;
        
    await headline.locator(thumbnailH).first().click({ waitUntil: 'domcontentloaded' });

    // Validasi Share Section
    await expect(locator.share).toBeVisible();

    const urlArtikel = page.url();

    const socialMedia = [
        {
            nama: 'WhatsApp',
            tombol: locator.sharewa,
            domain: /(?:api\.whatsapp\.com|web\.whatsapp\.com|wa\.me)/
        },
        {
            nama: 'Facebook',
            tombol: locator.sharefb,
            domain: /facebook\.com/
        },
        {
            nama: 'Twitter',
            tombol: locator.sharex,
            domain: /(?:twitter\.com|x\.com)/
        }
    ];

    for (const sosial of socialMedia) {
        console.log(`Mengecek share ${sosial.nama}`);

        // Tunggu popup dari tombol share
        const popupPromise = page.waitForEvent('popup');

        await sosial.tombol.click();

        const popup = await popupPromise;

        // Validasi domain platform
        await expect.soft(popup).toHaveURL(sosial.domain);

        // Validasi link artikel yang dibagikan
        const urlShare = decodeURIComponent(popup.url());
        const pathArtikel = new URL(urlArtikel).pathname;

        expect.soft(urlShare).toContain(pathArtikel);

        console.log(`Share ${sosial.nama} berhasil`);
        console.log(`URL Share: ${popup.url()}`);

        // Tutup popup tanpa meninggalkan artikel
        await popup.close();
        }
});

test('Baca Juga', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.artikel;
    const thumbnailH = artikel.fotoH;
        
    await headline.locator(thumbnailH).first().click({ waitUntil: 'domcontentloaded' });

    const bacajuga = locator.BacaJuga;
    const judul = artikel.JudulB;
    const thumbnail = artikel.ThumbnailB;

    await expect(bacajuga.first()).toBeVisible();

    const totalbacajuga = await bacajuga.count();

    console.log(`Total Widget Baca Juga : ${totalbacajuga}`);

    for(let i = 0; i < totalbacajuga; i++){
        
        const judulb = await artikel.namaJudulDinamic(bacajuga, judul, i);
        const thumbnailb = await artikel.namaThumbnailDinamic(bacajuga, thumbnail, i);

        console.log(`Nama judul : ${judulb} dan nama Gambar : ${thumbnailb}`);

        await bacajuga.nth(i).click({ waitUntil: 'domcontentloaded' });

        const fotod = await artikel.namaDetailThumbnail();
        const juduld = await artikel.judulD.innerText()

        await expect.soft(juduld).toEqual(judulb);
        await expect.soft(fotod).toEqual(thumbnailb);

        console.log(`Judul dan Thumbnail cocok`);
    }
});

test('Pagination', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const daftarartikel = locator.artikelT;
    await expect(daftarartikel.first()).toBeVisible();

    const totalartikel = await daftarartikel.count();

    let Pagination = false;

for (let i = 0; i < totalartikel; i++) {

    const klikartikel = await daftarartikel.nth(i);
    const linkartikel = await klikartikel.getAttribute('href');

    await klikartikel.click();
    await page.waitForLoadState('domcontentloaded');

    const jumlahPagination = await page.locator(artikel.Pagination).count();

    if (jumlahPagination > 0) {
        console.log(`Pagination DITEMUKAN pada artikel: ${linkartikel}`);

        Pagination = true;

        const urlHalamanSatu = page.url();

        // Ambil tombol halaman 2
        const tombolHalamanDua = artikel.locatorHalaman(page, 2);

        await expect(tombolHalamanDua).toBeVisible();
        await expect(tombolHalamanDua).toBeEnabled();

        // Klik halaman 2
        await tombolHalamanDua.click();
        await page.waitForLoadState('domcontentloaded');

        // Validasi navigasi
        await expect(page).not.toHaveURL(urlHalamanSatu);
        await expect(page).toHaveURL(/\/2(?:[?#]|$)/);

        console.log(`Halaman 1: ${urlHalamanSatu}`);
        console.log(`Halaman 2: ${page.url()}`);
        console.log('Pagination mobile berhasil');

        break;

    } else {
        console.log('Tidak ada pagination. Kembali ke daftar artikel...');

        await page.goBack({ waitUntil: 'domcontentloaded' });

        await expect(daftarartikel.first()).toBeVisible();

        console.log('URL setelah kembali:', page.url());
        console.log('Jumlah artikel:', await daftarartikel.count());
    }
}

expect(Pagination, 'Tidak ditemukan artikel dengan pagination').toBe(true);
});

test(`Verify Tags`, async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.artikel;
    const thumbnailH = artikel.fotoH;
        
    await headline.locator(thumbnailH).first().click({ waitUntil: 'domcontentloaded' });
    
    const tags = page.locator(artikel.Tag);
    await expect(tags.first()).toBeVisible();
    
    const jumlahtags = await tags.count();

    console.log(`Jumlah Tags : ${jumlahtags}`);

    for(let i = 0; i < jumlahtags; i++){
        
        const linktag = await tags.nth(i).getAttribute('href');

        await tags.nth(i).click();

        await expect(page).toHaveURL(linktag);

        await page.goBack();
    };
});

test('Related News', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.artikel;
    const thumbnailH = artikel.fotoH;
        
    await headline.locator(thumbnailH).first().click({ waitUntil: 'domcontentloaded' });

    const related = locator.Related.nth(2);
    const artikelR = locator.artikelR;
    const judulR = await artikel.namaJudulDinamic(artikelR, artikel.JudulR, 0);
    const thumbnailR = await artikel.namaThumbnailDinamic(artikelR, artikel.ThumbnailR, 0);
    const klikartikel = artikelR.locator(artikel.ThumbnailR).nth(0);

    await expect(related).toBeVisible();
    await expect(artikelR).toBeVisible();
    console.log(`Nama judul : ${judulR} dan Nama Gambar : ${thumbnailR}`);

    await klikartikel.click({ waitUntil: 'domcontentloaded' });

    const thumbnailD = await artikel.namaDetailThumbnail();
    await expect(artikel.judulD).toHaveText(judulR);
    await expect(thumbnailD).toEqual(thumbnailR);

    console.log(`Nama dan Gambar cocok`);
});

test('Latest News', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.artikel;
    const thumbnailH = artikel.fotoH;
        
    await headline.locator(thumbnailH).first().click({ waitUntil: 'domcontentloaded' });

    const artikelL = locator.ArtikelL.nth(0);
    await expect(artikelL).toBeVisible();

    const judulL = await artikel.namaJudulDinamic(artikelL, artikel.judulL, 0);
    const thumbnail = await artikel.namaThumbnailDinamic(artikelL, artikel.fotoL, 0);
    const klikartikel = artikelL.locator(artikel.fotoL).nth(0);

    await klikartikel.click({ waitUntil: 'domcontentloaded' });

    const thumbnailD = await artikel.namaDetailThumbnail();

    await expect(artikel.judulD).toHaveText(judulL)
    await expect(thumbnailD).toEqual(thumbnail);
});