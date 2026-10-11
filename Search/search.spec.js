import { test, expect } from '@playwright/test';
import { iNews } from '../iNews';
import { Artikel } from '../artikel';

test('Fungsi Search', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.bukaHalaman();

    const nyari = 'Prabowo'

    await expect(locator.search).toBeVisible();
    await locator.search.fill(nyari);
    
    await locator.kliksearch.click();

    await expect(locator.searchkey).toHaveText(nyari);
    
    const indukSearch = locator.hasilsearch;
    await expect(indukSearch).toBeVisible();

    const total = await indukSearch.locator(artikel.artikelsearch).count();
    console.log(`ada ${total} artikel`);
    
    for (let i = 0; i < total; i++) {
        const namajudul = await artikel.namaJudulDinamic(indukSearch, artikel.artikelsearch, i);
        console.log(`${i}/${total - 1} judul artikel : ${namajudul}`);
        
        expect(namajudul.toLowerCase()).toContain(nyari.toLowerCase());
    }
});

test('Detail Artikel Search', async ({ page }) => {
    test.setTimeout(120000)
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.bukaHalaman();

    const nyari = 'Prabowo'
    await expect(locator.search).toBeVisible();
    await locator.search.fill(nyari);
    
    await locator.kliksearch.click();
    const linkurl = page.url();

    const indukSearch = locator.hasilsearch;
    await expect(indukSearch).toBeVisible();

    const total = await indukSearch.locator(artikel.artikelsearch).count();
    console.log(`ada ${total} artikel`);
    
    for (let i = 0; i < total; i++){
    await page.goto(linkurl);

    const namajudul = await artikel.namaJudulDinamic(indukSearch, artikel.artikelsearch, i);
    const namaFileGambar = await artikel.namaThumbnailDinamic(indukSearch, artikel.artikelsearch, i);
    
    const klikartikel = await artikel.locatorJudulDinamic(indukSearch, artikel.artikelsearch, i);
    await klikartikel.click();

    const namaFileGambarDetail = await artikel.namaDetailThumbnail();

    await expect(artikel.detailjudul).toHaveText(namajudul);
    const apakahGambarCocok = namaFileGambarDetail.includes(namaFileGambar) || namaFileGambar.includes(namaFileGambarDetail);
    expect(apakahGambarCocok).toBeTruthy();
    } 
});