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

test('Detail Artikel', async({ page }) => {
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    // cek thumbnail headline
    const thumbnail = page.locator('.headline1 img.thumbCard');
    const hlthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = hlthumbnail.split('/').pop().split('?')[0];
    await expect(thumbnail).toBeVisible();
    // cek judul headline
    const judul = page.locator('.headline1 .cardTitle');
    const teksjudul = await judul.innerText();
    await expect(judul).toBeVisible();
    // masuk detail artikel
    await thumbnail.click();
    // cek header icon
    const header = page.locator('.container.topBar');
    await expect(header).toHaveScreenshot('ikon-header-win32.png');
    // cek icon
    const logo1 = page.getByLabel('logon').first();
    const logo2 = page.getByLabel('logon').nth(1);
    const logo3 = page.locator('.app-gateway')
    await expect(logo1).toHaveScreenshot('ikon-inews-header-win32.png');
    await expect(logo2).toHaveScreenshot('ikon-tv-header-win32.png');
    await expect(logo3).toHaveScreenshot('ikon-getinews-header-win32.png');
    // cek search
    const search = page.locator('.searchForm')
    await expect(search).toHaveScreenshot('form-search-header-win32.png');
    // cek dark mode
    const darkmode = page.locator('#theme-toggle');
    await expect(darkmode).toHaveScreenshot('ikon-darkmode-header-win32.png');
    // cek login
    const login = page.locator('#login');
    await expect(login).toHaveScreenshot('ikon-login-header-win32.png');
    // cek network
    const network = page.locator('.networkNav');
    await expect(network).toHaveScreenshot('ikon-network-header-win32.png');
    // cek burgerbtn
    const burger = page.getByLabel('burger-btn');
    await expect(burger).toHaveScreenshot('ikon-burger-header-win32.png');
    // cek paragraph
    const paragraf = await page.locator('p').count();
    expect(paragraf).toBeGreaterThan(2);
    // cek detail thumbnail
    const detailthumbnail = page.locator('.headerImg img')
    await expect(detailthumbnail).toBeVisible();
    const srcdetail = await detailthumbnail.getAttribute('src');
    expect(srcdetail).toContain(namaFileGambar);
    //cek detail judul
    const detailjudul = page.locator('.headerTitle');
    await expect(detailjudul).toBeVisible();
    await expect(detailjudul).toContainText(teksjudul, { ignoreCase: true });
})

test('Icon Share', async ({ page }) => {
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    // cek thumbnail headline
    const thumbnail = page.locator('.headline1 img.thumbCard');
    await expect(thumbnail).toBeVisible();
    // masuk detail artikel
    await thumbnail.click();
    // cek icon share
    await expect(page.locator('.iconShare').nth(1)).toBeVisible();
    await expect(page.locator('.headerImg img')).toBeVisible();
})

test('Widget Baca Juga', async ({ page }) => {
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    // cek thumbnail headline
    const thumbnail = page.locator('.headline1 img.thumbCard');
    await expect(thumbnail).toBeVisible();
    // masuk detail artikel
    await thumbnail.click();
    // cek widget baca juga
    const bacajuga = page.locator('.bacaJugaExcerpt').first();
    const judulbacajuga = await bacajuga.innerText();
    expect(bacajuga).toBeVisible;
    await bacajuga.click();

    await page.waitForTimeout(1500)
    let judulArtikel = '';
    if (await page.locator('.headerTitle').count() > 0) {
        judulArtikel = await page.locator('.headerTitle').innerText();
    } else if (await page.locator('.ishort-title').count() > 0) {
        judulArtikel = await page.locator('.ishort-title').first().innerText();
    } else {
        throw new Error('Elemen judul artikel tidak ditemukan di halaman ini!');
    }
    expect(judulArtikel.trim()).toEqual(judulbacajuga.trim());
    console.log(`Judul Widget Baca Juga ${judulbacajuga} dan Judul Detail Widget Baca Juga ${judulArtikel}`);
})

test('Pagination Detail Artikel', async ({ page }) => {

    const daftarArtikel = page.locator('.widgetNewsHeadline a');
    await expect(daftarArtikel.first()).toBeVisible();

    const totalArtikel = await daftarArtikel.count();
    console.log(`Ditemukan ${totalArtikel} artikel untuk dicek.`);

    let paginationDitemukan = false;

    for (let i = 0; i < totalArtikel; i++) {
        console.log(`\nMengecek artikel ke-${i + 1}...`);

        const klikArtikel = page.locator('.widgetNewsHeadline .cardArticle.headline1 a').nth(i);
        const linkArtikel = await klikArtikel.getAttribute('href');
        
        await klikArtikel.click();
        await page.waitForLoadState('domcontentloaded');

        const jumlahPagination = await page.locator('.pagination .pageList').count();
    if (jumlahPagination > 0) {
            console.log(`Pagination DITEMUKAN pada artikel: ${linkArtikel}`);
            paginationDitemukan = true;

            const urlHalamanSatu = page.url();
            
            const tombolHalamanDua = page.locator('.pagination a').getByText('2', { exact: true });
            
            await tombolHalamanDua.scrollIntoViewIfNeeded();

            await expect(tombolHalamanDua).toBeVisible();
            await expect(tombolHalamanDua).toBeEnabled();
            
            console.log('Tombol pagination terdeteksi aktif dan bisa diklik. Mengeksekusi klik...');

            await tombolHalamanDua.click();
            await page.waitForLoadState('domcontentloaded');

            await expect(page).not.toHaveURL(urlHalamanSatu);
            
            console.log(`Berhasil! Artikel berpindah halaman ke: ${page.url()}`);
            
            break; 

        } else {
            console.log(`Tidak ada pagination. Kembali ke daftar artikel...`);
        }
    }
})

test('Fungsi Tags', async ({ page }) => {
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    // cek thumbnail headline
    const thumbnail = page.locator('.headline1 img.thumbCard');
    await expect(thumbnail).toBeVisible();
    // masuk detail artikel
    await thumbnail.click();
    const urlArtikel = page.url();
    // cek tags
    const tags = page.locator('.tags');
    await expect(tags).toBeVisible();
    const totaltags = await page.locator('.tags .tagList').count();
    await page.waitForTimeout(1500);
    console.log(`total tags yang harus dicek ${totaltags}`);

    for (let i = 1; i < totaltags; i++) {
    await page.goto(urlArtikel, { waitUntil: 'domcontentloaded' });
    const kliktags = page.locator('.tags .tagList a').nth(i)
    const linktags = await kliktags.getAttribute('href');

    console.log(`[${i}/${totaltags - 1}] Menguji klik tags: ${linktags}`);

    await kliktags.click();
    await expect(page).toHaveURL(linktags);
    }
})

test('Related News', async ({ page }) =>{
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    // cek thumbnail headline
    const thumbnail = page.locator('.headline1 img.thumbCard');
    await expect(thumbnail).toBeVisible();
    // masuk detail artikel
    await thumbnail.click();
    // related news
    await expect(page.locator('.widgetListArticle__body')).toBeVisible();
    const relatedthumbnail = page.locator('.widgetListArticle__body .cardArticle .cardImg img').first();
    const linkthumbnail = await relatedthumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    const relatedjudul = page.locator('.widgetListArticle__body .cardArticle .cardTitle').first();
    const teksjudul = await relatedjudul.innerText();
    await relatedthumbnail.click();
    const detailthumbnail = page.locator('.headerImg img');
    const linkdetailthumbnail = await detailthumbnail.getAttribute('src');
    expect (linkdetailthumbnail).toContain(namaFileGambar);
    const detailjudul = page.locator('.headerTitle');
    expect (detailjudul).toHaveText(teksjudul);
})

test('Latest News', async ({ page }) => {
    await expect(page.locator('.widgetNewsHeadline')).toBeVisible();
    // cek thumbnail headline
    const thumbnail = page.locator('.headline1 img.thumbCard');
    await expect(thumbnail).toBeVisible();
    // masuk detail artikel
    await thumbnail.click();
    // latest news
    await expect(page.locator('#latestNews .widgetListArticle__body')).toBeVisible();
    const relatedthumbnail = page.locator('#latestNews .widgetListArticle__body .cardArticle .cardImg img').first();
    const linkthumbnail = await relatedthumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    const relatedjudul = page.locator('#latestNews .widgetListArticle__body .cardArticle .cardTitle').first();
    const teksjudul = await relatedjudul.innerText();
    await relatedthumbnail.click();
    const detailthumbnail = page.locator('.headerImg img');
    const linkdetailthumbnail = await detailthumbnail.getAttribute('src');
    expect (linkdetailthumbnail).toContain(namaFileGambar);
    const detailjudul = page.locator('.headerTitle');
    expect (detailjudul).toHaveText(teksjudul);
})

test('tes logo', async ({ page }) => {
    const logo1 = page.getByLabel('logon').first();
    const logo2 = page.getByLabel('logon').nth(1);
    await expect(logo1).toHaveScreenshot('ikon-inews-header.png');
    await expect(logo2).toHaveScreenshot('ikon-tv-header.png');
})