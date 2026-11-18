import { BasePage } from '../base.page.js';

export class induk extends BasePage {
    constructor(page){
        super(page)
        
    //Header
        this.header = page.locator('.header-top');

        //Kanal
        this.kanal = page.locator('.header-bottom .kanal-list');
        this.AllKanal = this.kanal.locator('.kanal-item a')

        //Search
        this.Search = page.locator('.icon-search')
        this.searchbar = page.locator('.search-bar')
        this.hasilsearch = page.locator('.filter-section .title');
        this.kliksearch = page.locator('.search-btn');
        this.artikelS = page.locator('.article-list')

    //iFrame
        this.widgetTV = page.frameLocator('.widget-inewstv iframe[title="live stream inews"]');
        this.cardInewsTV = this.widgetTV.locator('.right-group a.card');
        this.InewsLive = this.widgetTV.locator('.container-box');
        this.Livestream = this.widgetTV.locator('.bottom-cont .bottom')
        
    //Body
        this.headline = page.locator('.headline');
        this.daerah = page.locator('.article-wp.md-p').filter({ hasText: 'Daerah' });
        this.bola = page.locator('.article-wp').filter({ hasText: 'Spesial Bola' });
        this.latest = page.locator('.article-wp').filter({ hasText: 'Latest News' });
        this.spesial = page.locator('.article-wp').filter({ hasText: 'Spesial News' });
        this.popular = page.locator('.article-wp').filter({ hasText: 'Popular News' }).nth(1);
        this.photo = page.locator('.photo-cont').filter({ hasText: `photo` });
        this.infographic = page.locator('.photo-cont').filter({ hasText: `infographic` });
        this.network = page.locator('.inews-network-cont a');

        //iframe spesial bola
        this.DetailSB = page.frameLocator('#iframeList');

        //Popular News
        this.artikelP = this.popular.locator('.article-list a')

        //Top News
        this.topnews = page.locator('.article-wp').filter({ hasText: 'Top News' });
        this.artikelT = this.topnews.locator('.list-artikel.article-list a');

        //Latest News
        this.ArtikelLatest = this.latest.locator('.list-artikel.article-list.list-article a');

        //Widget
        this.opini = page.locator('.opini-cont');

        //Video Highlights
        this.video = page.locator('.video-highlights-cont');
        this.DaftarVideo = this.video.locator('.bottom-list');
        this.JudulVideo = this.video.locator('.title-video');
        this.iframevideo = this.video.locator('.top-yt iframe')

        //Editor Choice
        this.editor = page.locator('.article-wp').filter({ hasText: `Editor's Choice` });
        this.ArtikelE = this.editor.locator('.article-list a');

    //Kanal
        this.artikel = page.locator('.wrap-all');
        this.namakanal = page.locator('.title-list-news.article-header');
        this.breadcrumbs = page.locator('a[aria-label="breadcrumbs"].active');

    //Detail Artikel
        this.Judul = page.locator('.wrap-all');
        this.BodyArtikel = page.locator('.detail-artikel.bodyText');
        
        //Baca Juga
        this.BacaJuga = page.locator('.box-bacajuga');

        //Share Section
        this.likesection = page.locator('#like-comment-section');
        this.share = this.likesection.locator('.right-wrap');

        this.sharewa = this.share.locator('[data-network="whatsapp"]');
        this.sharefb = this.share.locator('[data-network="facebook"]');
        this.sharex = this.share.locator('[data-network="twitter"]');

        this.sharelink = this.share.locator('a[aria-label="link"]');
        this.copied = this.share.locator('#copied');

        //Related News
        this.Related = page.locator('.list-news-mb.md-p');
        this.artikelR = this.Related.locator('.list-artikel');

        //Latest News
        this.LatestD = page.locator('#latest-news-detail')
        this.ArtikelL = this.LatestD.locator('.list-artikel a');

    //Footer
        this.footer = page.locator('.footer-cont');
    }
      
    async linkkanal(index) {
        return this.AllKanal.nth(index).getAttribute('href');
    };
}