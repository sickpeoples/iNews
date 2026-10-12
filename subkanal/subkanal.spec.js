import { test, expect } from "@playwright/test";
import { iNews } from "../iNews";
import { Artikel } from "../artikel";

test('Sub Kanal', async ({ page }) => {
    const locator = new iNews(page);
    const artikel = new Artikel(page);
    await locator.siapkanJaringan();
    await locator.bukaHalaman();
})