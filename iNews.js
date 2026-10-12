import { BasePage } from "./base.page";

export class iNews extends BasePage {
    constructor(page){
        super(page)

        this.header = page.locator('.container.topBar');
        this.footer = page.locator('.footerBody')
        this.kanal = page.locator('.nav__main #navbar-nav');
        this.search = page.getByPlaceholder('Search');
        this.kliksearch = page.locator('.icon-1.ic-search');

        this.headline = page.locator('.widgetNewsHeadline');
        this.loadmore = page.getByRole('button', {name : 'Load More'});
        
        this.latestnews = page.locator('.widgetListArticle.row').first().filter({has: page.locator('h3:has-text("Latest News")')});
        this.containerartikel = page.locator('.widgetListArticle.row .widgetListArticle__body')
        this.artikelheadline = page.getByLabel('article headline');
        this.hasilsearch = page.locator('.widgetListArticle__body')
        this.searchkey = page.locator('.searchKey');
    }
}