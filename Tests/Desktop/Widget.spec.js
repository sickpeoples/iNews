import { test, expect } from "@playwright/test";
import { iNews } from '../../pages/desktop/iNews.js';
import { Artikel } from '../../pages/desktop/artikel.js';

test('Cek Semua Widget', async ({ page }) => {
    const locator = new iNews(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const semuaWidget = locator.SemuaWidget;

    await expect(semuaWidget.first()).toBeVisible();

    const totalWidget = await semuaWidget.count();

    console.log(`Total widget: ${totalWidget}`);

    for (let i = 0; i < totalWidget; i++) {
        const widget = semuaWidget.nth(i);

        const namaWidget = await widget.getAttribute('class');

        await expect.soft(widget,`Widget ${namaWidget} tidak terlihat`).toBeVisible({timeout: 3000});
    }
});

test('iNews Livestream', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const linkIframe = await locator.linkIframe();
    await page.goto(linkIframe, {waitUntil: 'domcontentloaded'});

    await expect(page.locator(artikel.ArtikelTV)).toBeVisible();
    await expect(page.locator(artikel.artikel).first()).toBeVisible();
    await expect(page.locator(artikel.thumbnail).first()).toBeVisible();
    await expect(page.locator(artikel.Livestream)).toBeVisible();

    const klikLivestream = await page.locator(artikel.Livestream);
    await klikLivestream.click();

    await expect(locator.Livestreaming).toBeVisible();
});

test('Daerah', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const daerah = await locator.Daerah;
    await expect(daerah).toBeVisible();

    const artikeldaerah = await daerah.locator(artikel.artikel);
    const locatorartikel = await artikel.locatorThumbnailDinamic(daerah, artikel.artikel, 0);
    const judulartikel = await artikel.ambilJudul(artikeldaerah, 0);
    const gambarartikel = await artikel.ambilGambar(artikeldaerah, 0);
    console.log(`judul ${judulartikel} dan gambar ${gambarartikel}`);

    await locatorartikel.click();

    const namagambardetail = await artikel.namaDetailThumbnail();
    await expect(artikel.detailjudul).toHaveText(judulartikel);
    await expect(namagambardetail).toContain(gambarartikel);
});

test('iNews Network', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const network = await locator.WidgetNetwork;
    await expect(network).toBeVisible();

    const artikelnetwork = await network.locator(artikel.artikel);
    const locatorartikel = await artikel.locatorThumbnailDinamic(network, artikel.artikel, 0);
    const judulartikel = await artikel.ambilJudul(artikelnetwork, 0);
    const gambarartikel = await artikel.ambilGambar(artikelnetwork, 0);
    console.log(`judul ${judulartikel} dan gambar ${gambarartikel}`);

    await locatorartikel.click();

    const namagambardetail = await artikel.namaDetailThumbnail();
    await expect(artikel.detailjudul).toHaveText(judulartikel);
    await expect(namagambardetail).toContain(gambarartikel);
});

//BREAKING NEWS

test('Spesial Bola', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const SB = locator.SpesialBola;
    await expect(SB).toBeVisible();

    const artikelSB = await SB.locator(artikel.artikel);
    const locatorartikel = await artikel.locatorThumbnailDinamic(SB, artikel.artikel, 0);
    const judulartikel = await artikel.ambilJudul(artikelSB, 0);
    const gambarartikel = await artikel.ambilGambar(artikelSB, 0);
    console.log(`judul ${judulartikel} dan gambar ${gambarartikel}`);

    await locatorartikel.click();

    await expect(locator.FrameOkeZone.locator(artikel.JudulSpesialBola)).toBeVisible();

    const namagambardetail = await artikel.namaThumbnailSpesialBola(locator.FrameOkeZone);
    const JudulSpesialBola = await locator.FrameOkeZone.locator(artikel.JudulSpesialBola);
    await expect(JudulSpesialBola).toHaveText(judulartikel);
    await expect(namagambardetail).toContain(gambarartikel);
});

//HOT NEWS

test('Popular News', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const PN = await locator.PopularNews;
    await expect(PN).toBeVisible();

    const artikelPN = await PN.locator(artikel.artikel);
    const locatorartikel = await artikel.locatorThumbnailDinamic(PN, artikel.artikel, 0);
    const judulartikel = await artikel.ambilJudul(artikelPN, 0);
    const gambarartikel = await artikel.ambilGambar(artikelPN, 0);
    console.log(`judul ${judulartikel} dan gambar ${gambarartikel}`);

    await locatorartikel.click();

    const namagambardetail = await artikel.namaDetailThumbnail();
    await expect(artikel.detailjudul).toHaveText(judulartikel);
    await expect(namagambardetail).toContain(gambarartikel);
});

test('iShort', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const iShort = await locator.iShort;
    await expect(iShort).toBeVisible();

    const videoiShort = await iShort.locator(artikel.VideoiShort).first();
    const JuduliShort = await artikel.namaJuduliShort(iShort, 0);

    await videoiShort.click();

    await expect(artikel.DetailJuduliShort.first()).toHaveText(JuduliShort);
});

test('Latest News', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const latest = locator.latestnews;
    await expect(latest).toBeVisible();

    const totalartikel = await latest.locator(artikel.artikel).count();
    console.log(`Total Artikel : ${totalartikel}`);
    
    const namajudul = await artikel.namaJudulDinamic(latest, artikel.artikel, 0);
    const namagambar = await artikel.namaThumbnailDinamic(latest, artikel.artikel, 0);

    const klikartikel = await artikel.locatorThumbnailDinamic(latest, artikel.artikel, 0);
    await klikartikel.click();

    const namagambardetail = await artikel.namaDetailThumbnail();

    await expect(artikel.detailjudul).toHaveText(namajudul);
    expect(namagambardetail).toContain(namagambar);
});

test('Berita di Sekitarmu', async ({ page, context }) => {
test.setTimeout(180000);

    const locator = new iNews(page);
    const artikel = new Artikel(page);

    await context.grantPermissions(
        ['geolocation'],
        { origin: 'https://www.inews.id' }
    );

    await context.setGeolocation({
        latitude: -6.2088,
        longitude: 106.8456
    });

    await locator.siapkanJaringan();

    const response = await locator.bukaHalamanSiapLokasi();
    expect(response.ok()).toBeTruthy();

    await expect(locator.widgetLokasi).toBeVisible();
    await locator.aktifkanLokasi();

    await expect(locator.beritaSekitar).toBeVisible({
        timeout: 30000
    });

    await expect(locator.artikelSekitar.first()).toBeVisible({
        timeout: 30000
    });

    const dataArtikel = await locator.ambilArtikelSekitar();

    expect(dataArtikel.length).toBeGreaterThan(0);

    console.log(`Total artikel: ${dataArtikel.length}`);

    for (const [i, data] of dataArtikel.entries()) {

        await test.step(`Artikel ${i + 1}: ${data.judul}`, async () => {

            expect(data.url).toBeTruthy();
            expect(data.judul).toBeTruthy();
            expect(data.thumbnail).toBeTruthy();

            const namaGambar = data.thumbnail
                .split('/')
                .pop()
                .split('?')[0]
                .toLowerCase();

            await page.goto(data.url, {
                waitUntil: 'domcontentloaded'
            });

            // Validasi judul
            await expect(artikel.detailjudul).toHaveText(data.judul);

            // Validasi thumbnail
            await expect(artikel.detailthumbnail).toHaveAttribute('src', /.+/);

            const gambarDetail = await artikel.namaDetailThumbnail();

            expect(gambarDetail).toContain(namaGambar);
        });
    } 
});

test('Video Highlights', async ({ page }) => {
    const locator = new iNews(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    await expect(locator.daftarVideo.first()).toBeVisible();

    const video = await locator.pilihVideo(0);

    await expect(locator.judulVideo).toHaveText(video.judul);

    await expect(locator.iframeVideo).toBeVisible({timeout: 15000});

    await expect(locator.iframeVideo).toHaveAttribute('src',/youtube\.com\/embed\/|youtube-nocookie\.com\/embed\//);

    console.log(`Iframe YouTube ditampilkan: ${video.judul}`);
});

test('Editor Choice', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const editor = locator.editor;
    await expect(editor).toBeVisible();

    const totalartikel = await editor.locator(artikel.artikel).count();
    console.log(`Total Artikel : ${totalartikel}`);
    
    const namajudul = await artikel.namaJudulDinamic(editor, artikel.artikel, 0);
    const namagambar = await artikel.namaThumbnailDinamic(editor, artikel.artikel, 0);

    const klikartikel = await artikel.locatorThumbnailDinamic(editor, artikel.artikel, 0);
    await klikartikel.click();

    const namagambardetail = await artikel.namaDetailThumbnail();

    await expect(artikel.detailjudul).toHaveText(namajudul);
    expect(namagambardetail).toContain(namagambar);
});

test('Photo', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    
    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const photo = locator.Photo;
    await expect(photo).toBeVisible();

    const totalartikel = await photo.locator(artikel.artikel).count();
    console.log(`Total Artikel : ${totalartikel}`);
    
    const namajudul = await artikel.namaJudulDinamic(photo, artikel.artikel, 0);
    const namagambar = await artikel.namaThumbnailDinamic(photo, artikel.artikel, 0);

    const klikartikel = await artikel.locatorThumbnailDinamic(photo, artikel.artikel, 0);
    await klikartikel.click();

    const totalphoto = await artikel.ThumbnailPhoto.count();

    for (let i = 0; i < totalphoto; i++){
    const namaDetailThumbnailPhoto = await artikel.namaPhotoThumbnail(i);
    await expect(artikel.JudulPhoto).toHaveText(namajudul);
    await expect(namaDetailThumbnailPhoto).toContain(namagambar);
    }
});

test('InfoGraphic', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    
    await locator.siapkanJaringan();
    await locator.bukaHalaman();
    
    const Infographic = locator.Infographic;
    await expect(Infographic).toBeVisible();

    const totalartikel = await Infographic.locator(artikel.artikel).count();
    console.log(`Total Artikel : ${totalartikel}`);
    
    const namajudul = await artikel.namaJudulDinamic(Infographic, artikel.artikel, 0);
    const namagambar = await artikel.namaThumbnailDinamic(Infographic, artikel.artikel, 0);

    const klikartikel = await artikel.locatorThumbnailDinamic(Infographic, artikel.artikel, 0);
    await klikartikel.click();

    const totalphoto = await artikel.ThumbnailPhoto.count();

    for (let i = 0; i < totalphoto; i++){
    const namaDetailThumbnailPhoto = await artikel.namaPhotoThumbnail(i);
    await expect(artikel.JudulPhoto).toHaveText(namajudul);
    await expect(namaDetailThumbnailPhoto).toContain(namagambar);
    }
});

test('Opini', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    
    await locator.siapkanJaringan();
    await locator.bukaHalaman();
    
    const opini = locator.opini;
    await expect(opini).toBeVisible();

    const totalartikel = await opini.locator(artikel.ArtikelOpini).count();
    console.log(`Total Artikel : ${totalartikel}`);
    
    const namajudul = await artikel.namaOpiniJudul(opini, 0);
    const namagambar = await artikel.namaOpiniThumbnail(opini, 0);

    const klikartikel = await opini.locator(artikel.ThumbnailOpini).nth(0);
    await klikartikel.click();

    const namaDetailThumbnailPhoto = await artikel.namaDetailThumbnail();
    await expect(artikel.detailjudul).toHaveText(namajudul);
    await expect(namaDetailThumbnailPhoto).toContain(namagambar);
});