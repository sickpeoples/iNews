export class BasePage {
    constructor(page) {
        this.page = page;
        this.failedAssets = [];
    }

async siapkanJaringan() {
    // Monitoring asset yang gagal
    this.page.on('response', response => {
        const url = response.url();

        if (
            /\.(woff2?|svg)(\?|$)/i.test(url) &&
            !response.ok()
        ) {
            this.failedAssets.push(url);
        }
    });

    // Domain layanan iklan
    const domainIklan = [
        'doubleclick.net',
        'googlesyndication.com',
        'googletagservices.com',
        'googleadservices.com',
        'adservice.google.com',
        'adservice.google.co.id',
        'mgid.com',
        'izooto.com',
        'google_vignette',
        'cm.g.doubleclick.net'
    ];

    await this.page.route('**/*', async route => {
        const url = route.request().url();

        let hostname;

        try {
            hostname = new URL(url).hostname.toLowerCase();
        } catch {
            await route.continue();
            return;
        }

        const apakahIklan = domainIklan.some(domain =>
            hostname === domain ||
            hostname.endsWith(`.${domain}`)
        );

        if (apakahIklan) {
            console.log(`ADS BLOCKED: ${url}`);
            await route.abort();
        } else {
            await route.continue();
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