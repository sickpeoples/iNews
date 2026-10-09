import { BasePage } from '../base.page';

export class Kanal extends BasePage {
    constructor(page) {
        super(page);

        this.kanal = page.locator('.nav__main .navList a');

    }
}