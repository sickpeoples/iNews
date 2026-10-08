import { test, expect } from '@playwright/test';
import { WelcomePage } from './wp-inews';

test('Welcome Page', async ({ page }) => {
    const wppage = new WelcomePage(page);
    await wppage.bukaHalaman();

    await expect(wppage.header).toBeVisible();
    await expect(wppage.header).toHaveScreenshot('Header-WP.png');
    await expect(wppage.headline).toBeVisible();
    await expect(wppage.latestnews).toBeVisible();
});

test('Headline', async ({ page }) => {
test.setTimeout(120000)
    const wppage = new WelcomePage(page);
    await wppage.bukaHalaman();

    await expect(wppage.headline).toBeVisible();
    const linkurl = page.url();
    const totalartikel = await wppage.artikel.count();

    console.log(`total artikel : ${totalartikel}`);
    for (let i = 0; i < totalartikel; i++){
    
    await page.goto(linkurl);

    const namajudulartikel = await wppage.namajudul(i);
    const hitunggambar = await wppage.hitungthumbnail(i);
    const namagambar = await wppage.namathumbnail(i);
    
    console.log(`${i}/${totalartikel - 1} sedang cek artikel ${namajudulartikel} dan gambar ${namagambar}`);

    await hitunggambar.click();
    await page.waitForTimeout(1500);

    const namaFileGambarDetail = await wppage.namadetailthumbnail();
    
    expect(namaFileGambarDetail).toContain(namagambar);
    expect(wppage.detailjudul).toHaveText(namajudulartikel);
    }
});

test('Latest News', async ({ page }) => {
    
})