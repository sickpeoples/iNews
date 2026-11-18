import { test, expect } from "@playwright/test";
import { induk } from '../../Pages/Mobile/induk.js';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { Artikel } from "../../Pages/Mobile/artikel.js";

test('Fungsi Search', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const locatorsearch = locator.Search.first();
    const search = locator.searchbar;
    const cari = 'prabowo';

    await expect(locatorsearch).toBeVisible();;

    await locatorsearch.click();

    await expect(search).toBeVisible();
    await search.fill(cari);
    await search.press('Enter')

    await expect(locator.hasilsearch).toBeVisible();
});

test('Verify Detail Artikel', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();
    
    const locatorsearch = locator.Search.first();
    const search = locator.searchbar;
    const cari = 'prabowo';

    await expect(locatorsearch).toBeVisible();;

    await locatorsearch.click();

    await expect(search).toBeVisible();
    await search.fill(cari);
    await search.press('Enter')

    await expect(locator.hasilsearch).toBeVisible();

    const locatorartikel = locator.artikelS;

    const judul = await artikel.namaJudulDinamic(locatorartikel, artikel.JudulS, 0);
    const thumbnail = await artikel.namaThumbnailDinamic(locatorartikel, artikel.ThumbnailS, 0);
    const klikartikel = locatorartikel.locator(artikel.JudulS).nth(0);

    await klikartikel.click();

    const thumbnailD = await artikel.namaDetailThumbnail();

    await expect(artikel.judulD).toHaveText(judul)
    await expect(thumbnailD).toEqual(thumbnail);
});