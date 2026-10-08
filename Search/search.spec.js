import { test, expect } from '@playwright/test';
import { InewsSearch } from './inews-search';

test('Fungsi Search', async ({ page }) => {
    const search = new InewsSearch(page);
    await search.bukaHalaman();

    const nyari = 'Prabowo'

    await expect(search.search).toBeVisible();
    await search.search.fill(nyari);
    
    await search.kliksearch.click();

    await expect(search.searchkey).toHaveText(nyari);
    const total = await search.totalartikel.count();
    console.log(`ada ${total} artikel`);
    
    for (let i = 0; i < total; i++){
    const namajudul = await search.teksjudul(i);
    console.log(`${i}/${total - 1} judul artikel : ${namajudul}`);

    const locatorjudul = search.locatorjudul(i);
    await expect(locatorjudul).toContainText(nyari);

    }
});

test('Detail Artikel Search', async ({ page }) => {
    test.setTimeout(120000)
    const search = new InewsSearch(page);
    await search.bukaHalaman();

    const nyari = 'Prabowo'
    await expect(search.search).toBeVisible();
    await search.search.fill(nyari);
    
    await search.kliksearch.click();
    const linkurl = page.url();

    const total = await search.totalartikel.count();
    console.log(`ada ${total} artikel`);
    
    for (let i = 0; i < total; i++){
    await page.goto(linkurl);
    const namajudul = await search.teksjudul(i);
    console.log(`${i}/${total - 1} judul artikel : ${namajudul}`);

    const namaFileGambar = await search.namafilethumbnail(i);
    console.log(`nama judul : ${namajudul} dan nama gambar ${namaFileGambar}`);

    await search.locatorjudul(i).click();

    const namaFileGambarDetail = await search.namafiledetail();

    await expect(search.detailthumbnailartikel).toBeVisible();

    await expect(search.detailjudulartikel).toHaveText(namajudul);
    const apakahGambarCocok = namaFileGambarDetail.includes(namaFileGambar) || namaFileGambar.includes(namaFileGambarDetail);
    expect(apakahGambarCocok).toBeTruthy();
    }  
})