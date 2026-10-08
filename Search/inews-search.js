import { BasePage } from '../base.page';

export class InewsSearch extends BasePage {
    constructor(page) {
        super(page);
        
        this.search = page.getByPlaceholder('Search');
        this.kliksearch = page.locator('.icon-1.ic-search');
        this.searchkey = page.locator('.searchKey');
        this.totalartikel = page.locator('.cardPlaylist');
        this.judulartikel = page.locator('.cardTitle');
        this.thumbnailartikel = page.locator('.cardImg img');
        this.detailjudulartikel = page.locator('.headerTitle');
        this.detailthumbnailartikel = page.locator('.headerImg img');
    }

    async bukaHalaman() {
        await this.page.goto('https://www.inews.id/');
    }
    locatorjudul(index){
        return this.judulartikel.nth(index);
    }
    async teksjudul(index){
        const locatorartikel = this.locatorjudul(index);
        return await locatorartikel.innerText();
    }
    thumbnail(index){
        return this.thumbnailartikel.nth(index);
    }
    async namafilethumbnail(index){
        const locatorthumbnail = this.thumbnail(index);
        const src = await locatorthumbnail.getAttribute('src');
        return src.split('/').pop().split('?')[0];
    }
    async namafiledetail(index){
        const src = await this.detailthumbnailartikel.getAttribute('src');
        return src.split('/').pop().split('?')[0];
    }
}