import { BasePage } from '../base.page';

export class WelcomePage extends BasePage {
    constructor(page) {
        super(page);

        this.header = page.locator('.container.topBar');
        this.headline = page.locator('.widgetNewsHeadline');
        this.latestnews = page.locator('.widgetListArticle.row').first().filter({has: page.locator('h3:has-text("Latest News")')});
        this.artikel = this.headline.getByLabel('article headline')
        this.thumbnail = this.headline.locator('.cardImg img');
        this.judul = this.headline.locator('.cardTitle');
        this.detailthumbnail = page.locator('.headerImg img');
        this.detailjudul = page.locator('.headerTitle');
    }

    hitungthumbnail(index){
        return this.thumbnail.nth(index);
    }
    async namathumbnail(index){
        const totalthumbnail = this.hitungthumbnail(index);
        const linkthumbnail = await totalthumbnail.getAttribute('src');
        return linkthumbnail.split('/').pop().split('?')[0];
    }
    async namadetailthumbnail(){
        const src = await this.detailthumbnail.getAttribute('src');
        return src;
    }
    async judulartikel(index){
        return this.judul.nth(index);
    }
    async namajudul(index){
        const namaartikel = await this.judulartikel(index);
        return await namaartikel.innerText();
    }
}