import { BasePage } from '../base.page.js';

export class iNews extends BasePage {
    constructor(page){
        super(page)

        this.header = page.locator('.container.topBar');
        this.footer = page.locator('.footerBody')
        this.kanal = page.locator('.nav__main #navbar-nav');
        this.container = page.locator('.container');
        this.search = page.getByPlaceholder('Search');
        this.kliksearch = page.locator('.icon-1.ic-search');

        this.widgetBacaJuga = page.locator('.bacaJuga a');
        this.bodyartikel = page.locator('.bodyArticleWrapper');

        this.titleSubKanal = page.locator('.navLink.navLink-active');
        this.breadcrumbs = page.locator('.breadcrumb .lastPage');
        this.headline = page.locator('.widgetNewsHeadline');
        this.loadmore = page.getByRole('button', {name : 'Load More'});
        
        this.latestnews = page.locator('.widgetListArticle.row').first().filter({has: page.locator('h3:has-text("Latest News")')});
        this.Daerah = page.locator('.widgetListArticle.col').first()
                        .filter({has: page.getByRole('heading', {name: 'Daerah'})})
                        .filter({has: page.locator('.widgetListArticle__header__action')});

        this.SemuaWidget = page.locator('section[class^="widget"]');
        this.WidgetNetwork = page.locator('.mainBody .sideRight .widgetNewsNetwork');
        this.SpesialBola = page.locator('.widgetListArticle.col')
                        .filter({has: page.locator('h3:has-text("Spesial Bola")')});

        this.frameTV = page.locator('iframe[title="Widget News TV"]');
        this.Livestreaming = page.locator('#YTnewsContainer');
        this.FrameOkeZone = page.frameLocator('#iframeList');
        this.PopularNews = page.locator('.widgetPopular');
        this.iShort = page.locator('.widget-v-video');

        this.widgetLokasi = page.locator('.widgetGeoLocation');
        this.toggleLokasi = this.widgetLokasi.locator('#btnToggleGeoLocation');
        this.konfirmasiLokasi = page.locator('.btn-toggle-yes');
        this.beritaSekitar = this.widgetLokasi.locator('.geo-location-active');
        this.artikelSekitar = this.beritaSekitar.locator('.cardArticle');
        this.editor = page.locator('.widgetListArticle.col')
                        .filter({has: page.locator('h3:has-text("Editor Choice")')});
        this.Photo = page.locator('#sideRightBottom2 .widgetMultimedia');
        this.Infographic = page.locator('#sideRightBottom3 .widgetMultimedia');
        this.opini = page.locator('#sideRightBottom4 .widgetOpini')

        this.containerartikel = page.locator('.widgetListArticle.row .widgetListArticle__body')
        this.hasilsearch = page.locator('.widgetListArticle__body')
        this.searchkey = page.locator('.searchKey');

        this.widgetVideo = page.locator('.widgetVideoHighlight');
        this.daftarVideo = this.widgetVideo.locator('.listPlayer');
        this.iframeVideo = this.widgetVideo.locator('.main-video-container iframe');
        this.judulVideo = this.widgetVideo.locator('.video-title');
        this.frameVideo = page.frameLocator('.widgetVideoHighlight .main-video-container iframe');
    }

    async JudulSubKanal(){
        return (await this.titleSubKanal.innerText()).toLowerCase();
    };
    async JudulBreadCrumb(){
        return (await this.breadcrumbs.innerText()).toLowerCase();
    };
    async linkIframe(){
        return await this.frameTV.getAttribute('src');
    }
    async bukaHalamanSiapLokasi() {
    const [response] = await Promise.all([
        this.page.waitForResponse(
            response => new URL(response.url()).pathname === '/load-aiml',
            { timeout: 30000 }
        ),
        this.bukaHalaman()
    ]);
    return response;
    }

    async aktifkanLokasi() {
    await this.toggleLokasi.click();
    await this.konfirmasiLokasi.click();
    }

    async ambilArtikelSekitar() {
    return await this.artikelSekitar.evaluateAll(cards =>
        cards.map(card => ({
            url: card.querySelector('a[href]')?.href,
            judul: card.querySelector('.cardTitle')?.textContent?.trim(),
            thumbnail: card.querySelector('.cardImg img')?.getAttribute('src')
        }))
        );
    }
    async pilihVideo(index) {
    const video = this.daftarVideo.nth(index);

    const judul = await video.getAttribute('data-title');
    const link = await video.getAttribute('data-link');

    await video.click();

    return { judul, link };
    }

    async statusVideo() {
    return await this.frameVideo.locator('video').evaluate(el => ({
        ada: true,
        berjalan: !el.paused && !el.ended,
        readyState: el.readyState,
        currentTime: el.currentTime
         }));
    }
}