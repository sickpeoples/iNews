import { test, expect } from "@playwright/test";
import { iNews } from '../../Pages/Desktop/iNews.js';
import { Artikel } from '../../Pages/Desktop/artikel.js';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';

test('Semua Fitur @all', async ({ page }) =>{
const locator = new iNews(page);
const artikel = new Artikel(page);

await locator.siapkanJaringan();
await locator.bukaHalaman();

const headline = locator.headline;
await expect(headline).toBeVisible();
})