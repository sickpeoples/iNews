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
});

test('Cek semua widget', async ({ page }) => {
    const semuaWidget = page.locator('[class^="widget"]');
    const totalWidget = await semuaWidget.count();
    console.log(`Total Widget yang akan dicek : ${totalWidget}`);
    for( let i = 0; i < totalWidget; i++){
    console.log(`${i}/${totalWidget - 1}`)
    await expect((semuaWidget).nth(i)).toBeVisible();
    }
});

test('iNews Livestream', async ({ page }) => {
    const frameTV = page.locator('iframe[title="Widget News TV"]');
    const linkIframe = await frameTV.getAttribute('src');
    await page.goto(linkIframe, { waitUntil: 'domcontentloaded' });

    const artikel = page.locator('.widgetNewsTV__body__listCard');
    const judul = page.locator('.cardTitle').first();
    const thumbnail = page.locator('.thumbCard').first();
    const Livestream = page.locator('.widgetNewsTV__news24Jam--container');

    await expect(artikel).toBeVisible();
    await expect(judul).toBeVisible();
    await expect(thumbnail).toBeVisible();
    await expect(Livestream).toBeVisible();
    await Livestream.click();

    const video = page.locator('#YTnewsContainer', { waitUntil: 'domcontentloaded'});
    await expect(video).toBeVisible();
});

test('Daerah', async ({ page }) => {
    const daerah = page.locator('.widgetListArticle.col').first();
    daerah 
    .filter({has: page.getByRole('heading', {name: 'Daerah'})})
    .filter({has: page.locator('.widgetListArticle__header__action')});
    await expect(daerah).toBeVisible();
    const artikel = page.locator('.widgetListArticle.col .widgetListArticle__body .cardArticle').first();
    await expect(artikel).toBeVisible();
    const judulartikel = artikel.filter({has: page.locator('.cardBody .cardTitle')});
    const judul = judulartikel.locator('.cardBody .cardTitle').first();
    const namajudul = await judul.innerText();

    const thumbnail = artikel.filter({has: page.locator('.cardImg img')})
    const gambarartikel = thumbnail.locator('.cardImg img').first();
    const linkthumbnail = await gambarartikel.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    await expect(judulartikel).toBeVisible();
    console.log(`nama judul: ${namajudul} dan nama gambar: ${namaFileGambar}`);
    await gambarartikel.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.headerTitle').first()).toHaveText(namajudul);
    const detailthumbnail = await page.locator('.headerImg img').first().getAttribute('src');
    expect(detailthumbnail).toContain(namaFileGambar);
});

test('iNews Network', async ({ page }) => {
    const network = page.locator('.mainBody .sideRight .widgetNewsNetwork');
    await expect(network).toBeVisible();
    const totalartikel = await page.locator('.mainBody .sideRight .widgetNewsNetwork .cardArticle a').count();
    console.log(`total artikel inews network: ${totalartikel}`);
    const linkurl = page.url();
    for (let i = 0; i < totalartikel; i++){
        await page.goto(linkurl, { waitUntil: 'domcontentloaded' });
        const artikel = page.locator('.mainBody .sideRight .widgetNewsNetwork .cardArticle a').nth(i);
        const judulartikel = page.locator('.mainBody .sideRight .widgetNewsNetwork .cardArticle .cardTitle').nth(i);
        const namajudul = await judulartikel.innerText();
        const thumbnail = page.locator('.mainBody .sideRight .widgetNewsNetwork .cardArticle .cardImg img').nth(i);
        const linkthumbnail = await thumbnail.getAttribute('src');
        const namathumbnail = linkthumbnail.split('/').pop().split('?')[0];
        console.log(`${i}/${totalartikel - 1} Judul Artikel : ${namajudul}`)
        await artikel.click();
        await page.waitForTimeout(1500);
        await expect(page.locator('.headerTitle').first()).toHaveText(namajudul);
        const detailthumbnail = await page.locator('.headerImg img').first().getAttribute('src');
        expect(detailthumbnail).toContain(namathumbnail);
    }
});

test('Breaking News', async ({ page }) => {

});

test('Spesial Bola', async ({ page }) => {
    const spesialbola = page.locator('.widgetListArticle.col').filter({has: page.locator('h3:has-text("Spesial Bola")')})
    await expect(spesialbola).toBeVisible();
    const artikel = spesialbola.locator('.widgetListArticle__body .cardArticle').first();
    const judulartikel = artikel.locator('.cardTitle');
    const namajudul = await judulartikel.innerText();
    const thumbnail = artikel.locator('.cardImg img');
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = await linkthumbnail.split('/').pop().split('?')[0];
    console.log(`nama judul ${namajudul} dan nama gambar ${namaFileGambar}`);

    await thumbnail.click();
    await page.waitForTimeout(1500);
    const frameokezone = page.frameLocator('#iframeList');
    await expect(frameokezone.locator('.pc-title-detail')).toHaveText(namajudul);
    const detailthumbnail = frameokezone.locator('.pc-img-detail img');
    const detaillinkthumbnail = await detailthumbnail.getAttribute('src');
    expect(detaillinkthumbnail).toContain(namaFileGambar);
});

test('Hot News', async ({ page }) =>{
    await page.waitForTimeout(5000);
    const hotnews = page.locator('#topic-populer-row')
    await expect(hotnews).toBeVisible();
});

test('Popular News', async ({ page }) =>{
    const popular = page.locator('.widgetPopular');
    const linkurl = page.url();
    const totalartikel = await popular.locator('.cardArticle.cardPopular').count();
    console.log(`total artikel adalah : ${totalartikel}`);
    for (let i = 0; i < totalartikel; i++){
    await page.goto(linkurl);
    const judul = popular.locator('.cardTitle').nth(i);
    const namajudul = await judul.innerText();
    const thumbnail = popular.locator('.cardImg img').nth(i);
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    console.log(`${i}/${totalartikel - 1} cek artikel ${namajudul}`)
    await thumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.headerTitle').first()).toHaveText(namajudul);
    const detailthumbnail = await page.locator('.headerImg img').first().getAttribute('src');
    expect(detailthumbnail).toContain(namaFileGambar);
    }
});

test('Latest News', async ({ page }) => {
    const latest = page.locator('.widgetListArticle.row').filter({has: page.locator('h3:has-text("Latest News")')}).first();
    await expect(latest).toBeVisible();
    const totalartikel = await latest.locator('.cardArticle').count();
    const linkurl = page.url();
    for (let i = 0; i < totalartikel; i++){
    await page.goto(linkurl);
    const judul = latest.locator('.cardTitle').nth(i);
    const namajudul = await judul.innerText();
    const thumbnail = latest.locator('.cardImg img').nth(i);
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    console.log(`${i}/${totalartikel - 1} cek artikel ${namajudul}`)
    await thumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.headerTitle').first()).toHaveText(namajudul);
    const detailthumbnail = await page.locator('.headerImg img').first().getAttribute('src');
    expect(detailthumbnail).toContain(namaFileGambar);    
    }
});

test('Berita di Sekitarmu', async ({ page, context }) => {
    await context.grantPermissions(['geolocation'], { origin: 'https://www.inews.id' });
    await context.setGeolocation({ 
        latitude: -6.2088,   // Latitude Jakarta
        longitude: 106.8456  // Longitude Jakarta
    });
    console.log('Membersihkan cache lokal iNews...');
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const slider = page.locator('.slider');
    await slider.scrollIntoViewIfNeeded();
    await slider.click();
    await page.locator('.btn.btn-ai.btn-toggle-yes.btn-default').click()
    const beritadisekitar = page.locator('.geo-location-active');
    await expect(beritadisekitar).toBeVisible({timeout: 5000});
    const totalartikel = await beritadisekitar.locator('.cardArticle').count();
    const linkurl = page.url();
    for (let i = 0; i < totalartikel; i++){
    await page.goto(linkurl);
    const judul = beritadisekitar.locator('.cardTitle').nth(i);
    const namajudul = await judul.innerText();
    const thumbnail = beritadisekitar.locator('.cardImg img').nth(i);
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    console.log(`${i}/${totalartikel - 1} cek artikel ${namajudul}`)
    await thumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.headerTitle').first()).toHaveText(namajudul);
    const detailthumbnail = await page.locator('.headerImg img').first().getAttribute('src');
    expect(detailthumbnail).toContain(namaFileGambar);    
    }
});

test('Video Highlights', async ({ page }) => {
    const daftarVideo = page.locator('.listPlayer');
    const videoPertama = daftarVideo.first();
    
    await expect(videoPertama).toBeVisible();
    await videoPertama.click();

    const elemenIframe = page.locator('.main-video-container iframe');
    await expect(elemenIframe).toBeVisible({ timeout: 10000 });
    console.log('Iframe Video berhasil dimuat.');

    const frameVideo = page.frameLocator('.main-video-container iframe');
    
    await expect(async () => {
        const statusVideo = await frameVideo.locator('video').evaluate((el) => {
            return {
                ada: true,
                berjalan: !el.paused,
                readyState: el.readyState
            };
        }).catch(() => ({ ada: false })); 

        expect(statusVideo.ada).toBeTruthy();
    }).toPass({ timeout: 15000, intervals: [1000] });

    console.log('Video berhasil dimuat dan siap diputar oleh sistem!');
});

test('Editor Choice', async ({ page }) => {
    
    const editor = page.locator('.widgetListArticle.col').filter({has: page.locator('h3:has-text("Editor Choice")')});
    await expect(editor).toBeVisible();
    const totalartikel = await editor.locator('.cardArticle').count();
    console.log(`total artikel : ${totalartikel}`);
    const linkurl = page.url();
    
    for (let i = 0; i < totalartikel; i++){
    await page.goto(linkurl);
    const judulartikel = editor.locator('.cardTitle').nth(i);
    const namajudul = await judulartikel.innerText();
    const thumbnail = editor.locator('.cardImg img').nth(i);
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    
    console.log(`nama judul: ${namajudul} dan nama gambar ${namaFileGambar}`)
    console.log(`${i}/${totalartikel - 1} sedang mengecek ${namajudul}`);
    
    await thumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.headerTitle').first()).toHaveText(namajudul);
    const detailthumbnail = await page.locator('.headerImg img').first().getAttribute('src');
    expect(detailthumbnail).toContain(namaFileGambar);
    }
})

test('Photo', async ({ page }) => {
    const photo = page.locator('#sideRightBottom2');
    const widgetPhoto = photo.locator('.widgetMultimedia');
    const seeall = photo.locator('.widget__footer');
    await expect(widgetPhoto).toBeVisible({ timeout: 15000 });
    await expect(seeall).toBeVisible({ timeout: 15000});
    const totalphoto = await photo.locator('.cardArticle').count();
    console.log(`total poto : ${totalphoto}`);
    const linkurl = page.url();

    for (let i = 0; i < totalphoto; i++){
    await page.goto(linkurl);
    const judulartikel = photo.locator('.cardTitle').nth(i);
    const namajudul = await judulartikel.innerText();
    const thumbnail = photo.locator('.cardImg img').nth(i);
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    
    console.log(`nama judul: ${namajudul} dan nama gambar ${namaFileGambar}`)

    await thumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.title').first()).toHaveText(namajudul);
    const totalphoto = page.locator('.thumb.thumb-active').count();
    for (let a = 0; a < totalphoto; a++){
    const poto = page.locator('.thumb.thumb-active img').nth(a);
    const linkpoto = await poto.getAttribute('src');
    expect(linkpoto).toContain(namaFileGambar);
        }
    }
    await page.goto(linkurl);
    await seeall.click();
    const detailphoto = page.locator('.widget__header');
    await expect(detailphoto).toBeVisible();
    const detailartikelpoto = page.locator('.cardArticle').first();
    const detailjudulartikel = detailartikelpoto.locator('.cardTitle');
    const namajuduldetail = await detailjudulartikel.innerText();
    const detailthumbnail = detailartikelpoto.locator('.cardImg img').first();
    const detaillinkthumbnail = await detailthumbnail.getAttribute('src');
    const detailnamaFileGambar = detaillinkthumbnail.split('/').pop().split('?')[0];
    await detailthumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.title').first()).toHaveText(namajuduldetail);
    const detailpoto = page.locator('.img-container img').first();
    const detaillinkpoto = await detailpoto.getAttribute('src');
    expect(detaillinkpoto).toContain(detailnamaFileGambar);
})

test('Infographic', async ({ page }) => {
    const Infographic = page.locator('#sideRightBottom3');
    const widgetInfographic = Infographic.locator('.widgetMultimedia');
    const seeall = Infographic.locator('.widget__footer');
    await expect(widgetInfographic).toBeVisible({ timeout: 15000 });
    await expect(seeall).toBeVisible({ timeout: 15000});
    const totalInfographic = await Infographic.locator('.cardArticle').count();
    console.log(`total Infographic : ${totalInfographic}`);
    const linkurl = page.url();

    for (let i = 0; i < totalInfographic; i++){
    await page.goto(linkurl);
    const judulartikel = Infographic.locator('.cardTitle').nth(i);
    const namajudul = await judulartikel.innerText();
    const thumbnail = Infographic.locator('.cardImg img').nth(i);
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    
    console.log(`nama judul: ${namajudul} dan nama gambar ${namaFileGambar}`)

    await thumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.title').first()).toHaveText(namajudul);
    const totalInfographic = page.locator('.thumb.thumb-active').count();
    for (let a = 0; a < totalInfographic; a++){
    const potoInfographic = page.locator('.thumb.thumb-active img').nth(a);
    const linkpotoInfographic = await potoInfographic.getAttribute('src');
    expect(linkpotoInfographic).toContain(namaFileGambar);
        }
    }
    await page.goto(linkurl);
    await seeall.click();
    const detailInfographic = page.locator('.widget__header');
    await expect(detailInfographic).toBeVisible();
    const detailartikelInfographic = page.locator('.cardArticle').first();
    const detailjudulartikel = detailartikelInfographic.locator('.cardTitle');
    const namajuduldetail = await detailjudulartikel.innerText();
    const detailthumbnail = detailartikelInfographic.locator('.cardImg img').first();
    const detaillinkthumbnail = await detailthumbnail.getAttribute('src');
    const detailnamaFileGambar = detaillinkthumbnail.split('/').pop().split('?')[0].replace('_thumb', '');
    await detailthumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.title').first()).toHaveText(namajuduldetail);
    const detailpoto = page.locator('.img-container img').first();
    const detaillinkpoto = await detailpoto.getAttribute('src');
    expect(detaillinkpoto).toContain(detailnamaFileGambar);
})

test('Opini', async ({ page }) => {
    const opini = page.locator('#sideRightBottom4');
    const widgetOpini = opini.locator('.widgetOpini');
    await expect(widgetOpini).toBeVisible({ timeout: 15000 });
    const totalopini = await opini.locator('.cardOpini').count();
    console.log(`total opini : ${totalopini}`);
    const linkurl = page.url();

    for (let i = 0; i < totalopini; i++){
    await page.goto(linkurl);
    const judulartikel = opini.locator('.opini').nth(i);
    const namajudul = await judulartikel.innerText();
    const thumbnail = opini.locator('.cardOpini img').nth(i);
    const linkthumbnail = await thumbnail.getAttribute('src');
    const namaFileGambar = linkthumbnail.split('/').pop().split('?')[0];
    
    console.log(`nama judul: ${namajudul} dan nama gambar ${namaFileGambar}`)

    await thumbnail.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.headerTitle').first()).toHaveText(namajudul);
    const detailthumbnail = await page.locator('.headerImg img').first().getAttribute('src');
    expect(detailthumbnail).toContain(namaFileGambar);
    }
})

test('Stories', async ({ page }) => {
    const stories = page.locator('#sideRightBottom5');
    await expect(stories).toBeVisible();
    const ceritalain = stories.locator('.buttonPosition').filter({has: stories.getByRole('button', {name: 'Cerita Lainnya'})})
    await expect(ceritalain).toBeVisible();
})