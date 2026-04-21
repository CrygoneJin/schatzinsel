const { test, expect } = require('@playwright/test');

// Hilfsfunktion: Spiel für Sail-Tests starten
// Progressive Disclosure Stufe 5, dann auf window._showSailDialog warten
async function startGameForSail(page) {
    await page.addInitScript(() => {
        localStorage.setItem('insel-grid', '[]');
        localStorage.setItem('insel-genesis-shown', '1');
        localStorage.removeItem('insel-player-name');
        localStorage.setItem('insel-blocks-placed', '5');
        localStorage.setItem('insel-unlocked-materials', '["qi","yin","yang","feuer","wasser","erde","holz"]');
        localStorage.setItem('insel-discovered-recipes', '["Qi"]');
        localStorage.setItem('insel-quests-done', '["Seed-Quest"]');
    });

    await page.goto('/');
    await page.fill('#player-name-input', 'Testpirat');
    await page.click('#start-button');
    await expect(page.locator('#game-canvas')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#intro-overlay')).not.toBeVisible({ timeout: 5000 });
    await page.waitForFunction(() => typeof window.questSystem === 'object', { timeout: 10000 });
    // Test-Hook muss exportiert sein (game.js: window._showSailDialog = showSailDialog)
    await page.waitForFunction(() => typeof window._showSailDialog === 'function', { timeout: 5000 });
}

test.describe('Sail-Dialog', () => {

    test('window._showSailDialog() öffnet Sail-Dialog', async ({ page }) => {
        await startGameForSail(page);

        await page.evaluate(() => window._showSailDialog());

        await expect(page.locator('#sail-dialog')).toBeVisible({ timeout: 3000 });
    });

    test('Sail-Dialog hat Destination-Buttons für Home, Lummerland, Dino-Bucht', async ({ page }) => {
        await startGameForSail(page);

        await page.evaluate(() => window._showSailDialog());
        await expect(page.locator('#sail-dialog')).toBeVisible({ timeout: 3000 });

        await expect(page.locator('.sail-dest[data-dest="home"]')).toBeVisible();
        await expect(page.locator('.sail-dest[data-dest="lummerland"]')).toBeVisible();
        await expect(page.locator('.sail-dest[data-dest="dinobucht"]')).toBeVisible();
    });

    test('#sail-cancel schließt den Sail-Dialog', async ({ page }) => {
        await startGameForSail(page);

        await page.evaluate(() => window._showSailDialog());
        await expect(page.locator('#sail-dialog')).toBeVisible({ timeout: 3000 });

        await page.locator('#sail-cancel').click();
        await expect(page.locator('#sail-dialog')).toHaveClass(/hidden/, { timeout: 2000 });
    });

    test('Sail-Dialog zeigt Archipel-Fortschritt "X von Y Inseln"', async ({ page }) => {
        await startGameForSail(page);

        await page.evaluate(() => window._showSailDialog());
        await expect(page.locator('#sail-dialog')).toBeVisible({ timeout: 3000 });

        const dialogText = await page.locator('#sail-dialog').textContent();
        expect(dialogText).toMatch(/\d+ von \d+/);
    });

});

test.describe('Insel-Navigation', () => {

    test('island:arrived BUS-Event nach Lummerland-Klick', async ({ page }) => {
        await startGameForSail(page);

        await page.evaluate(() => {
            window._testIslandArrived = null;
            window.INSEL_BUS.on('island:arrived', (data) => { window._testIslandArrived = data; });
        });

        await page.evaluate(() => window._showSailDialog());
        await expect(page.locator('#sail-dialog')).toBeVisible({ timeout: 3000 });
        await page.locator('.sail-dest[data-dest="lummerland"]').click();

        // sailToIsland hat 2000ms setTimeout vor dem emit
        await page.waitForFunction(() => window._testIslandArrived !== null, { timeout: 5000 });

        const arrived = await page.evaluate(() => window._testIslandArrived);
        expect(arrived.dest, 'Ziel muss "lummerland" sein').toBe('lummerland');
    });

    test('insel-current-island wird auf "lummerland" gesetzt', async ({ page }) => {
        await startGameForSail(page);

        await page.evaluate(() => window._showSailDialog());
        await expect(page.locator('#sail-dialog')).toBeVisible({ timeout: 3000 });
        await page.locator('.sail-dest[data-dest="lummerland"]').click();

        await page.waitForFunction(
            () => localStorage.getItem('insel-current-island') === 'lummerland',
            { timeout: 5000 }
        );

        const currentIsland = await page.evaluate(() => localStorage.getItem('insel-current-island'));
        expect(currentIsland).toBe('lummerland');
    });

    test('Heimat-Insel-Zustand wird bei Sail gespeichert (insel-archipel-home)', async ({ page }) => {
        await startGameForSail(page);

        await page.evaluate(() => {
            localStorage.removeItem('insel-archipel-home');
            localStorage.removeItem('insel-current-island');
        });

        await page.evaluate(() => window._showSailDialog());
        await expect(page.locator('#sail-dialog')).toBeVisible({ timeout: 3000 });
        await page.locator('.sail-dest[data-dest="lummerland"]').click();

        // saveIslandState('home') wird synchron vor dem setTimeout aufgerufen
        await page.waitForFunction(
            () => localStorage.getItem('insel-archipel-home') !== null,
            { timeout: 3000 }
        );

        const homeSnapshot = await page.evaluate(() => localStorage.getItem('insel-archipel-home'));
        expect(homeSnapshot, 'Heimat-Snapshot muss beim Sail gespeichert werden').not.toBeNull();
    });

});
