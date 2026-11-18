import { test, expect } from "@playwright/test";
import { induk } from '../../Pages/Mobile/induk.js';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { Artikel } from "../../Pages/Mobile/artikel.js";

test('Kanal', async ({ page }) => {
    const locator = new induk(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const kanal = locator.kanal;
    const semua = locator.AllKanal;
    const jumlah = await semua.count();

    console.log(`total kanal : ${jumlah}`);
    await expect(kanal).toBeVisible();

    for(let i = 1; i < jumlah; i++){
        const linkkanal = await locator.linkkanal(i);
        console.log(`Sedang mengecek link : ${linkkanal}`);

        await semua.nth(i).click({ waituntil: 'domcontentloaded' });

        await expect(page).toHaveURL(linkkanal);

        await page.goBack();
    }
});

test('Load More', async ({ page }) => {
    test.setTimeout(120000);

    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const kanal = locator.kanal;
    const semua = locator.AllKanal;
    const jumlah = await semua.count();

    console.log(`total kanal : ${jumlah}`);
    await expect(kanal).toBeVisible();

    for(let i = 1; i < jumlah; i++){
        const linkkanal = await locator.linkkanal(i);
        console.log(`Sedang mengecek link : ${linkkanal}`);

        await semua.nth(i).click({ waituntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);

        const listartikel = page.locator(artikel.kanalArtikel);
        const jumlahartikel = await listartikel.count();

        console.log(`jumlah artikel awal : ${jumlahartikel}`);

        const loadmore = page.locator(artikel.LoadMore);

        await loadmore.click();
        await page.waitForTimeout(3000);

        const jumlahartikelakhir = await listartikel.count();
        console.log(`jumlah artikel akhir : ${jumlahartikelakhir}`);
        await expect.soft(jumlahartikelakhir).toBeGreaterThan(jumlahartikel);

        await page.goBack();
    }
});

test('Detail Artikel', async ({ page }) =>{
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const kanal = locator.kanal;
    const semua = locator.AllKanal;
    const jumlah = await semua.count();

    console.log(`total kanal : ${jumlah}`);
    await expect(kanal).toBeVisible();

    //for(let i = 1; i < jumlah; i++){
        const linkkanal = await locator.linkkanal(1);
        console.log(`Sedang mengecek link : ${linkkanal}`);

        await semua.nth(1).click({ waituntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);        

        const headline = locator.artikel;
        const judulH = artikel.judulH;
        const judul = await artikel.namaJudulDinamic(headline, judulH, 0);
        const thumbnailH = artikel.fotoH;
        const thumbnail = await artikel.namaThumbnailDinamic(headline, thumbnailH, 0);

        await expect(headline.first()).toBeVisible();
        console.log(`nama judul : ${judul}`);
        console.log(`nama thumbnail : ${thumbnail}`);
        
        await headline.locator(thumbnailH).first().click({ waitUntil: 'domcontentloaded' });

        const thumbnailD = await artikel.namaDetailThumbnail()
        const judulD = await artikel.judulD.innerText();

        await expect(judulD).toEqual(judul);
        await expect(thumbnailD).toEqual(thumbnail);
        console.log(`Nama Artikel dan Gambar Artikel cocok`);
    //}
});