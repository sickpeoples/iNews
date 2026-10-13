export class Artikel{
    constructor(page){

        this.daftarkanal = '.navList a'

        this.artikel = '.cardArticle';
        this.artikelsearch = '.cardPlaylist'
        this.artikelheadline = 'article[aria-label="article headline"]';
        this.judul = '.cardTitle';
        this.thumbnail = '.cardImg img';

        this.paragraf = 'p';
        this.iconShare = '.iconShare';
        this.JudulBacaJuga = '.bacaJugaExcerpt';
        this.ThumbnailBacaJuga = 'img';

        this.Pagination = '.pagination .pageList';
        this.HalamanPagination = 'li.pageList a';

        this.Tags = '.tags .tagList a';

        this.ArtikelTV = '.widgetNewsTV__body__listCard';
        this.Livestream ='.widgetNewsTV__news24Jam--container';

        this.VideoiShort = '.widget-v-video-card';
        this.JuduliShort = '.widget-v-video-title';
        this.ThumbnailiShort = '.widget-v-video-img img';

        this.ArtikelOpini = '.cardOpini';
        this.JudulOpini = '.opini';
        this.ThumbnailOpini = 'img';

        this.DetailJuduliShort = page.locator('.ishort-title');

        this.JudulPhoto = page.locator('.title');
        this.ThumbnailPhoto = page.locator('.thumb.thumb-active img')

        this.JudulSpesialBola = page.locator('.pc-title-detail');
        this.ThumbnailSpesialBola = page.locator('.pc-img-detail img');

        this.detailthumbnail = page.locator('.headerImg img');
        this.detailjudul = page.locator('.headerTitle');
    };
    locatorJudulDinamic(indukLocator, selectorArtikel, index) {
        // Logika: Masuk ke induk -> cari artikel ke-i -> cari judulnya
        return indukLocator.locator(selectorArtikel).nth(index).locator(this.judul);
    };

    async namaJudulDinamic(indukLocator, selectorArtikel, index) {
        const locator = this.locatorJudulDinamic(indukLocator, selectorArtikel, index);
        return await locator.innerText();
    };
    locatorThumbnailDinamic(indukLocator, selectorArtikel, index) {
        return indukLocator.locator(selectorArtikel).nth(index).locator(this.thumbnail);
    };

    async namaThumbnailDinamic(indukLocator, selectorArtikel, index) {
        const locator = this.locatorThumbnailDinamic(indukLocator, selectorArtikel, index);
        const linkthumbnail = await locator.getAttribute('src');
        return linkthumbnail.split('/').pop().split('?')[0].trim().toLowerCase();
    };

    async namaDetailThumbnail() {
        const src = await this.detailthumbnail.getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    };

    async linkkanal(indukLocator, index) {
        return indukLocator.locator(this.daftarkanal).nth(index).getAttribute('href');
    };

    async ambilJudul(indukLocator, index){
        return await indukLocator.locator(this.judul).nth(index).innerText();
    };

    async ambilGambar(induklocator, index){
        const locator = induklocator.locator(this.thumbnail).nth(index);
        const linkthumbnail = await locator.getAttribute('src');
        return linkthumbnail.split('/').pop().split('?')[0].trim().toLowerCase();
    };

    async ambilJudulBacaJuga(indukLocator){
        return await indukLocator.locator(this.JudulBacaJuga).innerText();
    };

    async ambilGambarBacaJUga(indukLocator){
        const locator = indukLocator.locator(this.ThumbnailBacaJuga);
        const linkthumbnail = await locator.getAttribute('src')
        return linkthumbnail.split('/').pop().split('?')[0].trim().toLowerCase();
    };
    locatorHalaman(indukLocator, nomor) {
        return indukLocator.locator(this.HalamanPagination).getByText(String(nomor), { exact: true });    
    };

    async ambilLinkTags(indukLocator, index){
        return indukLocator.locator(this.Tags).nth(index).getAttribute('href');

    };

    async namaThumbnailSpesialBola(indukLocator) {
        const locator = await indukLocator.locator(this.ThumbnailSpesialBola)
        const src = await locator.getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    };

    async namaJuduliShort(indukLocator, index){
        return await indukLocator.locator(this.JuduliShort).nth(index).innerText();
    }
    
    async namaPhotoThumbnail(index) {
        const src = await this.ThumbnailPhoto.nth(index).getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    };

    async namaOpiniThumbnail(indukLocator, index) {
        const src = await indukLocator.locator(this.ThumbnailOpini).nth(index).getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    };

    async namaOpiniJudul(indukLocator, index) {
        const locator = await indukLocator.locator(this.JudulOpini).nth(index);
        return await locator.innerText();
    };
}