export class BasePage {
    constructor(page) {
        this.page = page;
        this.failedAssets = [];
    }

    async siapkanJaringan() {
        this.page.on('response', response => {
            const url = response.url();
            if ((url.endsWith('.woff2') || url.endsWith('.svg')) && !response.ok()) {
                this.failedAssets.push(url);
            }
        });

        await this.page.route('**/*', (route) => {
            if (route.request().url().includes('googleads')) {
                route.abort();
            } else {
                route.continue();
            }
        });
    }
}