import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
let failedAssets = [];
  page.on('response', response => {
    const url = response.url();
    if ((url.endsWith('.woff2') || url.endsWith('.woff') || url.endsWith('.svg')) && !response.ok()) {
      failedAssets.push(url);
    }
  });

  await page.route('**/*', (route) => {
    const request = route.request();
    if (request.url().includes('googleads') || request.url().includes('doubleclick') || request.url().includes('googlesyndication')) {
      route.abort();
    } else {
      route.continue();
    }
  });

    console.log('Membuka halaman utama iNews...');
    await page.goto('https://www.inews.id/', { waitUntil: 'domcontentloaded' });
})

test('Headline Kanal', async ({ page }) => {
  test.setTimeout(200000);

    const semuakanal = page.locator('.nav__main ul#navbar-nav .navList a');
    await expect(semuakanal.first()).toBeVisible();

    const jumlahKanal = await semuakanal.count();
    console.log(`Total menu kanal yang akan diuji: ${jumlahKanal}`);
    for (let i = 1; i < jumlahKanal; i++) {
    
    
    await page.goto('https://www.inews.id/', { waitUntil: 'domcontentloaded' })
    const klikkanal = page.locator('.nav__main .container .navList a').nth(i);
    const linkkanal = await klikkanal.getAttribute('href');
    console.log(`[${i}/${jumlahKanal - 1}] Menguji klik kanal: ${linkkanal}`);

    const terlihat = await klikkanal.isVisible();

    if (!terlihat) {            
            await page.locator('.icon-4.ic-dropdown-kanal').click();
            
            await page.waitForTimeout(500);
        }

    await klikkanal.click()
    await expect(page).toHaveURL(linkkanal);
    }
})

test("Load More", async ({ page }) => {

    const semuakanal = page.locator('.nav__main ul#navbar-nav .navList a');
    await expect(semuakanal.first()).toBeVisible();
    
    const klikkanal = page.locator('.nav__main .container .navList a').nth(1);
    await klikkanal.click();

    const daftarartikel = page.locator('.widgetListArticle__body .cardArticle');
    await expect(daftarartikel.first()).toBeVisible();

    const jumlahAwal = await daftarartikel.count()
    console.log(`Total Artikel Awal ${jumlahAwal}`)

    const loadmore = page.getByRole('button', {name : 'Load More'})
    await expect(loadmore).toBeVisible();
    await loadmore.click();

    expect(daftarartikel.nth(jumlahAwal)).toBeVisible();

    await page.waitForTimeout(1500);
    
    const jumlahAkhir = await daftarartikel.count();
    console.log(`Jumlah artikel setelah Load More: ${jumlahAkhir}`);
    expect(jumlahAkhir).toBeGreaterThan(jumlahAwal);
})

test("Detail Artikel Kanal", async ({ page }) => {
    const klikkanal = page.locator('.nav__main .container .navList a').nth(1);
    await klikkanal.click();

    const artikel = page.locator('.widgetNewsHeadline');
    await expect(artikel).toBeVisible();

    const thumbnail = page.locator('.cardArticle.headline1 .cardImg .thumbCard');
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    await expect(thumbnail).toBeVisible();

    const judul = page.locator('.cardArticle.headline1 .cardBody .cardTitle')
    const teksjudul = await judul.innerText();
    await expect(judul).toBeVisible();

    await thumbnail.click();

    const detailthumbnail = page.locator('.headerImg img');
    expect(detailthumbnail).toBeVisible;
    const srcdetail = await detailthumbnail.getAttribute('src');
    const namaFileGambarDetail = srcdetail.split('/').pop().split('?')[0];
    expect(namaFileGambarDetail).toContain(namaFileGambar);
    console.log(`Gambar headline adalah : ${namaFileGambar} dan Gambar Detail adalah : ${namaFileGambarDetail}`)

    const detailjudul = page.locator('.headerTitle');
    await expect(detailjudul).toBeVisible();
    const detailteksjudul = await detailjudul.innerText();
    await expect(detailjudul).toContainText(teksjudul, { ignoreCase: true });
    console.log(`Judul headline adalah : ${teksjudul} dan Judul Detail Artikel adalah : ${detailteksjudul}`)
  })