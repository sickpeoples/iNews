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
            const url = route.request().url();
            
            const daftarIklan = [
                'googleads',
                'doubleclick.net',
                'googlesyndication.com',
                'googletagservices.com',
                'googletagmanager.com',
                'adservice.google'
            ];

            const apakahIniIklan = daftarIklan.some(keyword => url.includes(keyword));

            if (apakahIniIklan) {
                route.abort();
            } else {
                route.continue();
            }
        });
    }
    async bukaHalaman() {
    await this.page.goto('https://www.inews.id/', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
        });
    }
}