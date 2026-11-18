import { test, expect } from "@playwright/test";
import { induk } from '../../Pages/Mobile/induk.js';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { Artikel } from "../../Pages/Mobile/artikel.js";

test('Verify Semua Widget', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const card = locator.cardInewsTV;

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
    await expect(locator.opini).toBeVisible();
});

test('iNews Livestreaming', async ({ page }) => {
    const locator = new induk(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    await expect(locator.InewsLive).toBeVisible();
    await expect(locator.cardInewsTV.first()).toBeVisible();
    await expect(locator.Livestream).toBeVisible();

    await locator.Livestream.click({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL('https://tv.inews.id/streaming');
});

test('Daerah', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const daerah = locator.daerah;
    await expect(daerah).toBeVisible();

    const thumbnail = daerah.locator(artikel.ThumbnailD);
    const judul = await artikel.namaJudulDinamic(daerah, artikel.JudulD, 0);
    const namathumbnail = await artikel.namaThumbnailDinamic(daerah, artikel.ThumbnailD, 0);

    console.log(`Nama Judul : ${judul} dan Nama Thumbnail : ${namathumbnail}`)

    await thumbnail.click({ waitUntil: 'domcontentloaded' });

    const detailthumbnail = await artikel.namaDetailThumbnail();

    await expect(artikel.judulD).toHaveText(judul);
    await expect(detailthumbnail).toEqual(namathumbnail);
    console.log(`Nama Judul dan Thumbnail Cocok`);
});

test('iNews Network', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const network = locator.network;
    await expect(network.first()).toBeVisible();

    const thumbnail = network.locator(artikel.ThumbnailN).first();
    const judul = await artikel.namaJudulDinamic(network, artikel.JudulN, 0);
    const namathumbnail = await artikel.namaThumbnailDinamic(network, artikel.ThumbnailN, 0);

    console.log(`Nama Judul : ${judul} dan Nama Gambar : ${namathumbnail}`);

    await thumbnail.click({ waitUntil: 'domcontentloaded' });

    const detailthumbnail = await artikel.namaDetailThumbnail();

    await expect(artikel.judulD).toHaveText(judul);
    await expect(detailthumbnail).toEqual(namathumbnail);
    console.log(`Nama Judul dan Thumbnail Cocok`);
});

test('Spesial Bola', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const spesialbola = locator.bola;
    const artikelSB = spesialbola.locator(artikel.artikelSB);
    await expect(spesialbola).toBeVisible();

    const judulSB = await artikel.namaJudulDinamic(artikelSB, artikel.JudulSB, 0);
    const thumbnailSB = await artikel.namaThumbnailDinamic(artikelSB, artikel.ThumbnailSB, 0);
    const thumbnail = artikelSB.locator(artikel.ThumbnailSB).first();

    console.log(`Nama Judul : ${judulSB} dan Nama Gambar : ${thumbnailSB}`)

    await thumbnail.click({ waitUntil : 'domcontentloaded' });

    const detailartikel = locator.DetailSB;
    const thumbnailD = await detailartikel.locator(artikel.ThumbnailDSB);
    const judulD = await detailartikel.locator(artikel.JudulDSB);
    const detailthumbnail = await artikel.namaDetailThumbnailSB(thumbnailD);

    await expect(judulD).toHaveText(judulSB);
    await expect(detailthumbnail).toEqual(thumbnailSB);
    console.log(`Nama Judul dan Thumbnail Cocok`);
});

test('Popular News', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const popular = locator.popular;
    await expect(popular).toBeVisible();

    const artikelP = locator.artikelP;
    const Judul = await artikel.namaJudulDinamic(artikelP, artikel.JudulP, 0);
    const NamaThumbnail = await artikel.namaThumbnailDinamic(artikelP, artikel.ThumbnailP, 0);
    const Thumbnail = artikelP.locator(artikel.ThumbnailP).first();

    console.log(`Nama Judul : ${Judul} dan Nama Gambar : ${NamaThumbnail}`);

    await Thumbnail.click({ waitUntil: 'domcontentloaded' });

    const detailthumbnail = await artikel.namaDetailThumbnail();

    await expect(artikel.judulD).toHaveText(Judul);
    await expect(detailthumbnail).toEqual(NamaThumbnail);
    console.log(`Nama Judul dan Thumbnail Cocok`);
});

test('Latest News', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const latest = locator.latest
    await expect(latest).toBeVisible();
    const artikelL = locator.ArtikelLatest;

    const thumbnail = artikelL.locator(artikel.fotoL).first();
    const Judul = await artikel.namaJudulDinamic(artikelL, artikel.judulL, 0);
    const NamaThumbnail = await artikel.namaThumbnailDinamic(artikelL, artikel.fotoL, 0);

    console.log(`Nama Judul : ${Judul} dan Nama Gambar : ${NamaThumbnail}`);

    await thumbnail.click({ waitUntil : 'domcontentloaded' });

    const detailthumbnail = await artikel.namaDetailThumbnail();

    await expect(artikel.judulD).toHaveText(Judul);
    await expect(detailthumbnail).toEqual(NamaThumbnail);
    console.log(`Nama Judul dan Thumbnail Cocok`);
});

test('Video Highlight', async ({ page }) => {
    const locator = new induk(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const video = locator.video;
    await expect(video).toBeVisible();

    const daftarvideo = locator.DaftarVideo.first();
    await expect(daftarvideo).toBeVisible();

    await expect(locator.iframevideo).toBeVisible();
    await expect(locator.iframevideo).toHaveAttribute('src',/youtube\.com\/embed\/|youtube-nocookie\.com\/embed\//);
});

test('Editor Choice', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const editor = locator.editor.nth(1);
    await expect(editor).toBeVisible();
    const artikelE = locator.ArtikelE;

    const judul = await artikel.namaJudulDinamic(artikelE, artikel.JudulE, 0);
    const thumbnail = artikelE.locator(artikel.ThumbnailE).first();
    const namathumbnail = await artikel.namaThumbnailDinamic(artikelE, artikel.ThumbnailE, 0);

    console.log(`Nama Judul : ${judul} dan Nama Gambar ${namathumbnail}`);

    await thumbnail.click({ waitUntil: 'domcontentloaded' });

    const detailthumbnail = await artikel.namaDetailThumbnail();

    await expect(artikel.judulD).toHaveText(judul);
    await expect(detailthumbnail).toEqual(namathumbnail);
    console.log(`Nama Judul dan Thumbnail Cocok`);
});

test('Photo', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    const photo = locator.photo;
    await expect(photo).toBeVisible();

    const Judul = await artikel.namaJudulDinamic(photo, artikel.JudulPhoto, 0);
    const Thumbnail = photo.locator(artikel.ThumbnailPhoto);
    const NamaThumbnail = await artikel.namaThumbnailDinamic(photo, artikel.ThumbnailPhoto, 0);

    console.log(`Nama Judul : ${Judul} dan Nama Gambar : ${NamaThumbnail}`);

    await Thumbnail.click({ waitUntil: 'domcontentloaded' });

    const DetailThumbnail = await artikel.namaDetailThumbnailSB(artikel.DetailThumbnail);

    await expect(artikel.DetailJudul).toHaveText(Judul);
    await expect(DetailThumbnail).toEqual(NamaThumbnail);

    console.log(`Judul dan Gambar Cocok`)
});

test('InfoGraphic', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    await expect(locator.infographic).toBeVisible();
});

test('Opini', async ({ page }) => {
    const locator = new induk(page);
    const artikel = new Artikel(page);

    await locator.siapkanJaringan();
    await locator.bukaHalaman();

    await expect(locator.opini).toBeVisible();
});