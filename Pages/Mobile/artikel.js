export class Artikel{
    constructor(page){
//Headline
    this.fotoH = '.headline-img img';
    this.judulH = '.headline-title';
    
    //Search

    this.ThumbnailS = '.article-img img'
    this.JudulS = '.article-title'

//Body

    //Latest
        this.fotoL = '.article-img.artikel-img img';
        this.judulL = '.title-artikel.article-title';

    //Daerah
        this.ThumbnailD = '.headline-img.artikel-img img';
        this.JudulD = '.title-hot.headline-title';

    //iNews Network
        this.ThumbnailN = 'img';
        this.JudulN = '.title-news';

    //Spesial Bola
        this.artikelSB = '.article-list a';
        this.JudulSB = '.title-artikel.article-title';
        this.ThumbnailSB = '.article-img img';
        this.ThumbnailDSB = '.pc-img-detail img';
        this.JudulDSB = 'h1.pc-title-detail';

    //Popular News
        this.ThumbnailP ='.article-img img';
        this.JudulP = '.title-artikel.article-title';

    //Editor Choice
        this.ThumbnailE = '.article-img img';
        this.JudulE = '.title-artikel.article-title';

    //Photo
        this.ThumbnailPhoto = '.photo.icon-photo img';
        this.JudulPhoto = '.title-photo';

        this.DetailJudul = page.locator('.title-section .title');
        this.DetailThumbnail = page.locator('.main-photo img');

//Artikel Kanal
    this.kanalArtikel = '.article.artikel.list-article';

//Load More
    this.LoadMore = '.load-more-btn';

//Detail Artikel
    this.paragraf = 'p';
    this.LinkParagraf = 'strong a[href]';
    this.fotoD = page.locator('.detail-image-wrap img');
    this.judulD = page.locator('.title-section.plr-0 .title');
    
    //Baca Juga
    this.ThumbnailB = '.wrap-bacajuga img';
    this.JudulB = '.baca-juga-title';

    //Pagination
    this.Pagination = '.pagination';
    this.Halaman = '.pagination .page-numbers .btn-page';
    this.NextPage = '.pagination .right-btn';
    this.PreviousPage = '.pagination .left-btn';

    //Tags
    this.Tag = '.tag-wrap a';

    //Related News
    this.JudulR = '.title-artikel'
    this.ThumbnailR = '.artikel-img img'
    
    
    };
    locatorJudulDinamic(indukLocator, judul, index) {
        // Logika: Masuk ke induk -> cari artikel ke-i -> cari judulnya
        return indukLocator.locator(judul).nth(index);
    };

    async namaJudulDinamic(indukLocator, judul, index) {
        const locator = this.locatorJudulDinamic(indukLocator, judul, index);
        return await locator.innerText();
    };
    locatorThumbnailDinamic(indukLocator, foto, index ) {
        return indukLocator.locator(foto).nth(index);
    };

    async namaThumbnailDinamic(indukLocator, foto, index) {
        const locator = this.locatorThumbnailDinamic(indukLocator, foto, index);
        const linkthumbnail = await locator.getAttribute('src');
        return linkthumbnail.split('/').pop().split('?')[0].trim().toLowerCase();
    };

    async namaDetailThumbnail() {
        const src = await this.fotoD.getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    };
    
    locatorHalaman(page, nomor) {
    return page.locator(this.Halaman).filter({
        hasText: new RegExp(`^${nomor}$`)
        });
    };

    async namaDetailThumbnailSB(thumbnail) {
        const src = await thumbnail.getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    }
}