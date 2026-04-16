const { test, expect } = require('@playwright/test');

// Hilfsfunktion: Big-Bang überspringen + Spiel starten
async function startGame(page) {
    await page.addInitScript(() => {
        localStorage.setItem('insel-grid', '[]');
        localStorage.setItem('insel-genesis-shown', '1');
        localStorage.removeItem('insel-player-name');
    });
    await page.goto('/');
    await page.fill('#player-name-input', 'Testpirat');
    await page.click('#start-button');
    await expect(page.locator('#game-canvas')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#intro-overlay')).not.toBeVisible({ timeout: 5000 });
    await page.waitForFunction(() => typeof window.questSystem === 'object', { timeout: 10000 });
}

test.describe('Easter Egg — Tetris (Konami-Code)', () => {

    test('Konami-Code öffnet Tetris-Modal', async ({ page }) => {
        await startGame(page);

        // Sicherstellen dass kein Modal vorhanden
        await expect(page.locator('#tetris-modal')).toHaveCount(0);

        // Konami-Code senden: ↑ ↑ ↓ ↓ ← → ← → b a
        const konami = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        for (const key of konami) {
            await page.keyboard.press(key);
        }

        // Tetris-Modal muss erscheinen
        await expect(page.locator('#tetris-modal')).toBeVisible({ timeout: 3000 });
    });

    test('Tetris-Modal enthält Canvas', async ({ page }) => {
        await startGame(page);

        const konami = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        for (const key of konami) {
            await page.keyboard.press(key);
        }

        await expect(page.locator('#tetris-modal')).toBeVisible({ timeout: 3000 });
        // Modal muss einen Canvas haben (Tetris-Spielfeld)
        const canvasCount = await page.locator('#tetris-modal canvas').count();
        expect(canvasCount, 'Tetris-Modal braucht mindestens einen Canvas').toBeGreaterThan(0);
    });

    test('Tetris-Modal schließt via Klick außerhalb', async ({ page }) => {
        await startGame(page);

        const konami = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        for (const key of konami) {
            await page.keyboard.press(key);
        }

        await expect(page.locator('#tetris-modal')).toBeVisible({ timeout: 3000 });

        // Klick auf den Hintergrund (nicht auf die Box)
        const modal = page.locator('#tetris-modal');
        const box = await modal.boundingBox();
        // Klick oben-links (außerhalb der zentrierten Spielbox)
        await page.mouse.click(box.x + 5, box.y + 5);

        await expect(page.locator('#tetris-modal')).toHaveCount(0, { timeout: 2000 });
    });

});

test.describe('Easter Egg — Snake (Wort-Trigger)', () => {

    test('"snake" tippen öffnet Snake-Modal', async ({ page }) => {
        await startGame(page);

        // Sicherstellen dass kein Modal vorhanden
        await expect(page.locator('#snake-modal')).toHaveCount(0);

        // "snake" Buchstabe für Buchstabe tippen
        await page.keyboard.type('snake');

        // Snake-Modal muss erscheinen
        await expect(page.locator('#snake-modal')).toBeVisible({ timeout: 3000 });
    });

    test('Snake-Modal enthält Canvas', async ({ page }) => {
        await startGame(page);

        await page.keyboard.type('snake');

        await expect(page.locator('#snake-modal')).toBeVisible({ timeout: 3000 });
        const canvasCount = await page.locator('#snake-modal canvas').count();
        expect(canvasCount, 'Snake-Modal braucht mindestens einen Canvas').toBeGreaterThan(0);
    });

    test('Snake-Modal schließt via Klick außerhalb', async ({ page }) => {
        await startGame(page);

        await page.keyboard.type('snake');
        await expect(page.locator('#snake-modal')).toBeVisible({ timeout: 3000 });

        const modal = page.locator('#snake-modal');
        const box = await modal.boundingBox();
        await page.mouse.click(box.x + 5, box.y + 5);

        await expect(page.locator('#snake-modal')).toHaveCount(0, { timeout: 2000 });
    });

});

test.describe('Dungeon-Dialog', () => {

    test('Dungeon-Dialog existiert im DOM', async ({ page }) => {
        await startGame(page);

        const dungeon = page.locator('#dungeon-dialog');
        await expect(dungeon).toHaveCount(1);
    });

    test('Dungeon hat 3 Ebenen (Bits, Kernel, Browser)', async ({ page }) => {
        await startGame(page);

        const levels = page.locator('#dungeon-dialog .dungeon-level');
        await expect(levels).toHaveCount(3);

        // Ebenen-Labels prüfen
        const levelData = await levels.evaluateAll(els =>
            els.map(el => el.getAttribute('data-level'))
        );
        expect(levelData).toContain('bits');
        expect(levelData).toContain('kernel');
        expect(levelData).toContain('browser');
    });

    test('Dungeon-Dialog schließen via Button', async ({ page }) => {
        await startGame(page);

        // Dungeon direkt öffnen (ohne Material-Crafting)
        await page.evaluate(() => {
            const dialog = document.getElementById('dungeon-dialog');
            dialog.classList.remove('hidden');
        });

        await expect(page.locator('#dungeon-dialog')).not.toHaveClass(/hidden/);

        // Schließen via Button
        await page.locator('#close-dungeon-dialog').click();
        await expect(page.locator('#dungeon-dialog')).toHaveClass(/hidden/, { timeout: 2000 });
    });

});
