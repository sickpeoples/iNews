export class Artikel{
    constructor(page){

        this.artikel = '.cardArticle';
        this.artikelsearch = '.cardPlaylist'
        this.artikelheadline = '.widgetNewsHeadline'
        this.judul = '.cardTitle';
        this.thumbnail = '.cardImg img';

        this.detailthumbnail = page.locator('.headerImg img');
        this.detailjudul = page.locator('.headerTitle');
    }
    locatorJudulDinamic(indukLocator, selectorArtikel, index) {
        // Logika: Masuk ke induk -> cari artikel ke-i -> cari judulnya
        return indukLocator.locator(selectorArtikel).nth(index).locator(this.judul);
    }

    async namaJudulDinamic(indukLocator, selectorArtikel, index) {
        const locator = this.locatorJudulDinamic(indukLocator, selectorArtikel, index);
        return await locator.innerText();
    }
    locatorThumbnailDinamic(indukLocator, selectorArtikel, index) {
        return indukLocator.locator(selectorArtikel).nth(index).locator(this.thumbnail);
    }

    async namaThumbnailDinamic(indukLocator, selectorArtikel, index) {
        const locator = this.locatorThumbnailDinamic(indukLocator, selectorArtikel, index);
        const linkthumbnail = await locator.getAttribute('src');
        return linkthumbnail.split('/').pop().split('?')[0].trim().toLowerCase();
    }

    async namaDetailThumbnail() {
        const src = await this.detailthumbnail.getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    }
}