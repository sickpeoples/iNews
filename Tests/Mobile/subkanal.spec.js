import { test, expect } from "@playwright/test";
import { induk } from '../../Pages/Mobile/induk.js';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { Artikel } from "../../Pages/Mobile/artikel.js";

test('Verify Sub Kanal', async ({ page }) => {
    test.setTimeout(120000);
    
    const locator = new induk(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const homepage = await page.url();
    const kanal = locator.AllKanal;
    const jumlahkanal = await kanal.count();

    //console.log(`Jumlah Kanal : ${jumlahkanal}`);

    //for(let i = 1; i < jumlahkanal; i++){
        //console.log(`Sedang mengecek kanal : ${i}/${jumlahkanal - 1}`)
        await kanal.nth(1).click({ waituntil: 'domcontentloaded'});
        const subkanal = locator.AllKanal;
        const jumlahsubkanal = await subkanal.count();

        for(let a = 2; a < jumlahsubkanal; a++){
            console.log(`Sedang mengecek subkanal : ${a}/${jumlahsubkanal - 1}`)
            const linksubkanal = await locator.linkkanal(a);

            await subkanal.nth(a).click({ waituntil: 'domcontentloaded'});
            
            const breadcrumbs = await locator.breadcrumbs.innerText();

            await expect(page).toHaveURL(linksubkanal);

            await expect(locator.namakanal.first()).toHaveText(breadcrumbs);
            await page.goBack();
        //}
    }
});

test('Load More', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const kanal = locator.AllKanal;

    await kanal.nth(1).click({ waituntil: 'domcontentloaded'});
    const subkanal = locator.AllKanal;
    const jumlahsubkanal = await subkanal.count();

    for(let a = 2; a < jumlahsubkanal; a++){
        console.log(`Sedang mengecek subkanal : ${a}/${jumlahsubkanal - 1}`)

        await subkanal.nth(a).click({ waituntil: 'domcontentloaded'});
            
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

test('Detail Artikel', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const kanal = locator.AllKanal;


    await kanal.nth(1).click({ waituntil: 'domcontentloaded'});
    const subkanal = locator.AllKanal;
    const jumlahsubkanal = await subkanal.count();

    for(let a = 2; a < jumlahsubkanal; a++){
        console.log(`Sedang mengecek subkanal : ${a}/${jumlahsubkanal - 1}`)

        await subkanal.nth(a).click({ waituntil: 'domcontentloaded'});
        
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

        await page.goBack();
    }
});