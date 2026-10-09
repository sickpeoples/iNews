import { BasePage } from '../base.page';

export class WelcomePage extends BasePage {
    constructor(page) {
        super(page);

        this.header = page.locator('.container.topBar');
        this.headline = page.locator('.widgetNewsHeadline');
        this.latestnews = page.locator('.widgetListArticle.row').first().filter({has: page.locator('h3:has-text("Latest News")')});
        this.artikelheadline = page.getByLabel('article headline');
        this.footer = page.locator('.footerBody')
        
        this.artikel = '.cardArticle';
        this.thumbnail = '.cardImg img';
        this.judul = '.cardTitle';
        
        this.detailthumbnail = page.locator('.headerImg img');
        this.detailjudul = page.locator('.headerTitle');
    }
    locatorJudulDinamic(indukLocator, index) {
        // Logika: Masuk ke induk -> cari artikel ke-i -> cari judulnya
        return indukLocator.locator(this.artikel).nth(index).locator(this.judul);
    }

    async namaJudulDinamic(indukLocator, index) {
        const locator = this.locatorJudulDinamic(indukLocator, index);
        return await locator.innerText();
    }
    locatorThumbnailDinamic(indukLocator, index) {
        return indukLocator.locator(this.artikel).nth(index).locator(this.thumbnail);
    }

    async namaThumbnailDinamic(indukLocator, index) {
        const locator = this.locatorThumbnailDinamic(indukLocator, index);
        const linkthumbnail = await locator.getAttribute('src');
        return linkthumbnail.split('/').pop().split('?')[0].trim().toLowerCase();
    }

    async namaDetailThumbnail() {
        const src = await this.detailthumbnail.getAttribute('src');
        return src.split('/').pop().split('?')[0].trim().toLowerCase();
    }
}