import { test, expect } from "@playwright/test";
import { induk } from '../../Pages/Mobile/induk.js';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { Artikel } from "../../Pages/Mobile/artikel.js";

test('Welcome Page @smoke', async({ page }) => {
    const locator = new induk(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const header = locator.header;
    const kanal = locator.kanal;
    const card = locator.cardInewsTV;

    await expect(header).toBeVisible();
    await expect(kanal).toBeVisible();
    await expect(card.first()).toBeVisible();
    await expect(locator.headline.first()).toBeVisible();
    await expect(locator.topnews).toBeVisible();
    await expect(locator.daerah).toBeVisible();
    await expect(locator.bola).toBeVisible();
    await expect(locator.latest).toBeVisible();
    await expect(locator.popular.nth(1)).toBeVisible();
    await expect(locator.spesial.nth(1)).toBeVisible();
    await expect(locator.editor.nth(1)).toBeVisible();
    await expect(locator.video).toBeVisible();
    await expect(locator.photo).toBeVisible();
    await expect(locator.infographic).toBeVisible();
    await expect(locator.network).toBeVisible();
    await expect(locator.footer).toBeVisible();
});

test('Headline', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const headline = locator.headline;
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
});

test('Latest', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const latest = locator.latest;
    const judulL = await artikel.namaJudulDinamic(latest, artikel.judulL, 0);
    const thumbnailL = await artikel.namaThumbnailDinamic(latest, artikel.fotoL, 0);

    console.log(`nama judul : ${judulL} dan nama thumbnail ${thumbnailL}`);

    await latest.locator(artikel.fotoL).first().click({waitUntil: 'domcontentloaded'});
    
    const thumbnailD = await artikel.namaDetailThumbnail()
    const judulD = await artikel.judulD.innerText();

    await expect(judulD).toEqual(judulL);
    await expect(thumbnailD).toEqual(thumbnailL);

    console.log(`Nama Artikel dan Gambar Artikel cocok`);
});