import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) =>{
test.setTimeout(120000);
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

test("Sub Kanal", async ({ page }) => {
    
    const semuakanal = page.locator('.nav__main ul#navbar-nav .navList a');
    await expect(semuakanal.first()).toBeVisible();
    
    const klikkanal = page.locator('.nav__main .container .navList a').nth(1);
    await klikkanal.click();

    const subKanal = page.locator('.nav__main ul#navbar-nav .navList a')
    await expect(subKanal.first()).toBeVisible();
    const jumlahsubKanal = await subKanal.count();
    console.log(`Jumlah Sub Kanal yang akan diuji: ${jumlahsubKanal}`);
    
    for (let i = 1; i < jumlahsubKanal; i++) {
    
    const kliksubkanal = page.locator('.nav__main .container .navList a').nth(i);
    const linksubkanal = await kliksubkanal.getAttribute('href');
    console.log(`[${i}/${jumlahsubKanal - 1}] Menguji klik kanal: ${linksubkanal}`);

    await kliksubkanal.click()
    const breadcrmbs = page.locator('.breadcrumb .lastPage');
    const titlebreadcrumbs = await breadcrmbs.innerText();
    console.log(`breadcrumbs adalah : ${titlebreadcrumbs}`);
    const titlejudul = page.locator('.titleSubKanal');
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    await expect(page).toHaveURL(linksubkanal);
    await expect(titlejudul).toContainText(titlebreadcrumbs);

    }
})

test('Load More Sub Kanal', async ({ page }) => {
    const semuakanal = page.locator('.nav__main ul#navbar-nav .navList a');
    await expect(semuakanal.first()).toBeVisible();
    
    const klikkanal = page.locator('.nav__main .container .navList a').nth(1);
    await klikkanal.click();

    const subKanal = page.locator('.nav__main ul#navbar-nav .navList a')
    await expect(subKanal.first()).toBeVisible();
    const jumlahsubKanal = await subKanal.count();
    console.log(`Jumlah Sub Kanal yang akan diuji: ${jumlahsubKanal}`);
    
    for (let i = 1; i < jumlahsubKanal; i++) {
    
    const kliksubkanal = page.locator('.nav__main .container .navList a').nth(i);
    const linksubkanal = await kliksubkanal.getAttribute('href');

    console.log(`[${i}/${jumlahsubKanal - 1}] Menguji klik kanal: ${linksubkanal}`);

    await kliksubkanal.click();
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible({ timeout: 15000 });
    const daftarartikel = page.locator('.widgetListArticle__body .cardArticle');
    await expect(daftarartikel.first()).toBeVisible();
    
    const titlejudul = page.locator('.titleSubKanal');
    const titleSubKanal = await titlejudul.innerText();

    const jumlahAwal = await daftarartikel.count()
    console.log(`Total Artikel ${titleSubKanal} Awal ${jumlahAwal}`)

    const loadmore = page.getByRole('button', {name : 'Load More'})
    await expect(loadmore).toBeVisible();
    await loadmore.click();

    await expect(daftarartikel.nth(jumlahAwal)).toBeVisible({ timeout: 15000 });
    
    const jumlahAkhir = await daftarartikel.count();
    console.log(`Jumlah artikel ${titleSubKanal} setelah Load More: ${jumlahAkhir}`);
    expect(jumlahAkhir).toBeGreaterThan(jumlahAwal);

  }
})

test('Detail Artikel Sub Kanal', async ({ page }) => {
    const semuakanal = page.locator('.nav__main ul#navbar-nav .navList a');
    await expect(semuakanal.first()).toBeVisible();
    
    const klikkanal = page.locator('.nav__main .container .navList a').nth(1);
    await klikkanal.click();

    const subKanal = page.locator('.nav__main ul#navbar-nav .navList a')
    await expect(subKanal.first()).toBeVisible();
    const jumlahsubKanal = await subKanal.count();
    console.log(`Jumlah Sub Kanal yang akan diuji: ${jumlahsubKanal}`);
    
    for (let i = 1; i < jumlahsubKanal; i++) {
    const kliksubkanal = page.locator('.nav__main .container .navList a').nth(i);
    const linksubkanal = await kliksubkanal.getAttribute('href');

    console.log(`[${i}/${jumlahsubKanal - 1}] Menguji klik kanal: ${linksubkanal}`);

    await kliksubkanal.click();
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    const thumbnail = page.locator('.cardArticle.headline1 .cardImg .thumbCard');
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    await expect(thumbnail).toBeVisible();

    const judul = page.locator('.cardArticle.headline1 .cardBody .cardTitle')
    const teksjudul = await judul.innerText();
    await expect(judul).toBeVisible();

    await thumbnail.click();
    await page.waitForTimeout(1500);
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
    }
})