import { test, expect } from '@playwright/test';
import { Kanal } from './kanal';
import { WelcomePage  } from '../welcome-page/wp-inews';

test('Kanal', async ({ page }) => {
    const kanal = new Kanal(page);
    const artikel = new WelcomePage(page);
    await kanal.bukaHalaman();
})