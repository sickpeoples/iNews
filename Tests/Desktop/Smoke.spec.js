import { test, expect } from '@playwright/test';
import { iNews } from '../../Pages/Desktop/iNews.js';
import { Artikel } from '../../Pages/Desktop/artikel.js';

test('Homepage menampilkan elemen utama @smoke @home', async ({ page }) => {
  const site = new iNews(page);
  await site.siapkanJaringan();
  await site.bukaHalaman();

  await expect(site.header).toBeVisible();
  await expect(site.headline).toBeVisible();
  await expect(site.latestnews).toBeVisible();
});

test('Detail artikel @smoke @artikel', async ({ page }) => {
  const site = new iNews(page);
  const artikel = new Artikel(page);
  await site.siapkanJaringan();
  await site.bukaHalaman();

  const judul = await artikel.namaJudulDinamic(site.headline, artikel.artikelheadline, 0);
  const thumbnail = artikel.locatorThumbnailDinamic(site.headline, artikel.artikelheadline, 0);
  await expect(thumbnail).toBeVisible();
  await thumbnail.click();

  await expect(artikel.detailjudul).toHaveText(judul);
  await expect(site.bodyartikel.locator(artikel.paragraf).first()).toBeVisible();
});

test('Pencarian menampilkan hasil @smoke @search', async ({ page }) => {
  const site = new iNews(page);
  const artikel = new Artikel(page);
  await site.siapkanJaringan();
  await site.bukaHalaman();

  const kataKunci = 'Prabowo';
  await expect(site.search).toBeVisible();
  await site.search.fill(kataKunci);
  await site.kliksearch.click();

  await expect(site.searchkey).toHaveText(kataKunci);
  await expect(site.hasilsearch.locator(artikel.artikelsearch).first()).toBeVisible();
});

test('Satu subkanal dapat dibuka @smoke @subkanal', async ({ page }) => {
  const site = new iNews(page);
  const artikel = new Artikel(page);
  await site.siapkanJaringan();
  await site.bukaHalaman();

  await site.kanal.locator(artikel.daftarkanal).nth(1).click();
  const linkSubkanal = await artikel.linkkanal(site.kanal, 1);
  await site.kanal.locator(artikel.daftarkanal).nth(1).click();

  expect(page.url()).toContain(linkSubkanal);
  await expect(site.titleSubKanal).toBeVisible();
});

test('Widget homepage tersedia @smoke @widget', async ({ page }) => {
  const site = new iNews(page);
  await site.siapkanJaringan();
  await site.bukaHalaman();

  await expect(site.SemuaWidget.first()).toBeVisible();
});
