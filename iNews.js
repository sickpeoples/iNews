import { BasePage } from "./base.page";

export class iNews extends BasePage {
    constructor(page){
        super(page)

        this.header = page.locator('.container.topBar');
        this.footer = page.locator('.footerBody')
        this.kanal = page.locator('.nav__main #navbar-nav');
        this.container = page.locator('.container');
        this.search = page.getByPlaceholder('Search');
        this.kliksearch = page.locator('.icon-1.ic-search');

        this.widgetBacaJuga = page.locator('.bacaJuga');
        this.bodyartikel = page.locator('.bodyArticleWrapper');

        this.titleSubKanal = page.locator('.navLink.navLink-active');
        this.breadcrumbs = page.locator('.breadcrumb .lastPage');
        this.headline = page.locator('.widgetNewsHeadline a');
        this.loadmore = page.getByRole('button', {name : 'Load More'});
        
        this.latestnews = page.locator('.widgetListArticle.row').first().filter({has: page.locator('h3:has-text("Latest News")')});
        
        this.containerartikel = page.locator('.widgetListArticle.row .widgetListArticle__body')
        this.hasilsearch = page.locator('.widgetListArticle__body')
        this.searchkey = page.locator('.searchKey');
    }

    async JudulSubKanal(){
        return (await this.titleSubKanal.innerText()).toLowerCase();
    }
    async JudulBreadCrumb(){
        return (await this.breadcrumbs.innerText()).toLowerCase();
    }
}