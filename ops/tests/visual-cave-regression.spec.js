// === VISUAL REGRESSION — „caves overall"-Bug (2026-04-24) ===
//
// Bug-Report (Till): Auf main lief das Spiel mit Grid voll von 🕳️ cave-Emojis.
// Alle 147 Unit-Tests waren grün — aber kein Test hat das „so sieht es aus"
// geprüft. Diese Spec schließt genau diese Lücke.
//
// Root-Cause: Auto-Merge-Kette yin²→strange→cave (+ yang²→charm→mountain).
// Grid voll yin/yang kollabiert im ersten Chain-Merge komplett zu cave/mountain.
// Fix: Pauli-Selbst-Upgrade-Regeln raus aus MERGE_RULES (nur noch via Recipe).
//
// Was dieser Test prüft:
//   1. Unit-Level: checkMerge(grid voll yin) muss null liefern (kein Kollaps).
//   2. Unit-Level: gleich für yang, strange, charm, electron.
//   3. Visuell: Stress-Test mit Grid voll yin → Canvas-Pixel-Sampling zeigt
//      hell/beige (Sand + yin) und NICHT dunkel/cave-Farben.
//
// Der Pixel-Sampling-Ansatz ist robuster als Screenshot-Diff für diesen
// spezifischen Bug (kein Baseline nötig, OS-unabhängig, Font-Rendering-
// unabhängig).

const { test, expect } = require('@playwright/test');

// WICHTIG: addInitScript MUSS vor goto() aufgerufen werden.
// Zusätzlich IndexedDB ('insel-backup') leeren, damit PR #494's IDB-Restore
// keinen alten State aus vorherigen Tests zurückholt.
async function setupFresh(page) {
    await page.addInitScript(() => {
        localStorage.setItem('insel-grid', '[]');
        localStorage.setItem('insel-player-name', 'T');
        localStorage.setItem('insel-genesis-shown', '1');
        localStorage.removeItem('insel-projekte');
        // IDB killen (Snapshot-Backup von S103-1)
        try { indexedDB.deleteDatabase('insel-backup'); } catch (e) {}
    });
}

async function setupWithGrid(page, grid) {
    await page.addInitScript((serialized) => {
        const projekte = { '~autosave~': { grid: JSON.parse(serialized), date: '2026-04-24', auto: true } };
        localStorage.setItem('insel-projekte', JSON.stringify(projekte));
        localStorage.setItem('insel-grid', '[]');
        localStorage.setItem('insel-player-name', 'T');
        localStorage.setItem('insel-genesis-shown', '1');
        try { indexedDB.deleteDatabase('insel-backup'); } catch (e) {}
    }, JSON.stringify(grid));
}

async function launchGame(page) {
    await page.goto('/');
    // Intro Start-Button kann noch aufpoppen oder schon übersprungen sein
    const nameInput = page.locator('#player-name-input');
    if (await nameInput.count() > 0 && await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('T');
        await page.click('#start-button');
    }
    await expect(page.locator('#game-canvas')).toBeVisible({ timeout: 20000 });
    await page.waitForFunction(
        () => window.INSEL_AUTOMERGE && typeof window.INSEL_AUTOMERGE.checkMerge === 'function',
        { timeout: 15000 }
    );
    // Overlay-fade + paar Frames
    await page.waitForTimeout(800);
}

test.describe('Cave-Bug Regression — Pauli-Kaskade darf Grid nicht überschwemmen', () => {

    test('Unit: Grid voll yin → KEIN Auto-Merge (früher: alle zu cave)', async ({ page }) => {
        await setupFresh(page);
        await launchGame(page);

        const result = await page.evaluate(() => {
            const grid = Array.from({ length: 28 }, () => Array(18).fill('yin'));
            let step = 0, dirty = true;
            const am = window.INSEL_AUTOMERGE;
            while (dirty && step < 20) {
                dirty = false;
                for (let r = 0; r < grid.length; r++) {
                    for (let c = 0; c < grid[r].length; c++) {
                        const m = am.checkMerge(grid, r, c, grid.length, grid[0].length);
                        if (m) {
                            for (const [mr, mc] of m.cells) grid[mr][mc] = m.result;
                            dirty = true;
                        }
                    }
                }
                step++;
            }
            const counts = {};
            for (const row of grid) for (const cell of row) {
                const k = cell === null ? 'null' : cell;
                counts[k] = (counts[k] || 0) + 1;
            }
            return counts;
        });

        // Vor dem Fix: result.cave === 504 (alle Zellen kaskadierten)
        // Nach dem Fix: result.yin === 504 (stabil, kein Kollaps)
        expect(result.cave, 'Keine spontanen Höhlen im yin-Grid!').toBeUndefined();
        expect(result.yin, 'yin bleibt yin, kein Pauli-Auto-Upgrade').toBe(504);
    });

    test('Unit: Grid voll yang → KEIN Auto-Merge (Symmetrie-Check)', async ({ page }) => {
        await setupFresh(page);
        await launchGame(page);

        const result = await page.evaluate(() => {
            const grid = Array.from({ length: 28 }, () => Array(18).fill('yang'));
            let step = 0, dirty = true;
            const am = window.INSEL_AUTOMERGE;
            while (dirty && step < 20) {
                dirty = false;
                for (let r = 0; r < grid.length; r++) {
                    for (let c = 0; c < grid[r].length; c++) {
                        const m = am.checkMerge(grid, r, c, grid.length, grid[0].length);
                        if (m) {
                            for (const [mr, mc] of m.cells) grid[mr][mc] = m.result;
                            dirty = true;
                        }
                    }
                }
                step++;
            }
            const counts = {};
            for (const row of grid) for (const cell of row) {
                const k = cell === null ? 'null' : cell;
                counts[k] = (counts[k] || 0) + 1;
            }
            return counts;
        });

        expect(result.mountain, 'Keine spontanen Berge im yang-Grid!').toBeUndefined();
        expect(result.yang, 'yang bleibt yang, kein Pauli-Auto-Upgrade').toBe(504);
    });

    test('Unit: Gen2-Materialien (strange/charm/electron) kaskadieren NICHT', async ({ page }) => {
        await setupFresh(page);
        await launchGame(page);

        const result = await page.evaluate(() => {
            const results = {};
            for (const mat of ['strange', 'charm', 'electron']) {
                const grid = Array.from({ length: 10 }, () => Array(10).fill(mat));
                const am = window.INSEL_AUTOMERGE;
                const m = am.checkMerge(grid, 5, 5, 10, 10);
                results[mat] = m ? m.result : null;
            }
            return results;
        });

        expect(result.strange, 'strange×strange darf nicht zu cave werden').toBe(null);
        expect(result.charm, 'charm×charm darf nicht zu mountain werden').toBe(null);
        expect(result.electron, 'electron×electron darf nicht zu muon werden').toBe(null);
    });

    test('Visuell: Nach voller Grid-Saturierung zeigt Canvas kein Cave-Meer', async ({ page }) => {
        // Laufendes Spiel, Grid im localStorage voll yin, Canvas darf nach
        // Load nicht überwiegend dunkel sein. Wenn Cave-Kaskade wieder käme,
        // würde der Chain-Merge-Loop (checkAutomerge 500ms-setTimeout) beim
        // ersten Impuls sofort das ganze Grid kippen.
        //
        // Baseline-Guard: ~80% dunkle Pixel vor Fix, <30% nach Fix.
        const grid = Array.from({ length: 28 }, () => Array(18).fill('yin'));
        await setupWithGrid(page, grid);
        await launchGame(page);
        // Zeit für Decay + Chain-Merges. Tao-Decay läuft alle 1000ms.
        await page.waitForTimeout(3500);

        const sample = await page.evaluate(() => {
            const c = document.getElementById('game-canvas');
            const ctx = c.getContext('2d');
            const x0 = c.width * 0.15;
            const y0 = c.height * 0.15;
            const w = c.width * 0.7;
            const h = c.height * 0.7;
            let dark = 0, total = 0;
            for (let i = 0; i < 400; i++) {
                const x = Math.floor(x0 + Math.random() * w);
                const y = Math.floor(y0 + Math.random() * h);
                const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
                const lum = (r + g + b) / 3;
                // cave-Farbe #4A4A4A (lum ~74), cave border #2C2C2C (lum ~44).
                // Sand #F5DEB3 ~214.
                if (lum < 100) dark++;
                total++;
            }
            return { dark, total, darkRatio: dark / total };
        });

        expect(
            sample.darkRatio,
            `Zu viele dunkle Pixel (${sample.dark}/${sample.total}) — Cave-Kollaps-Regression?`
        ).toBeLessThan(0.3);
    });

    test('Visuell: Fresh Home-Insel (Baseline, no spontaneous cave)', async ({ page }) => {
        await setupFresh(page);
        await launchGame(page);
        await page.waitForTimeout(1500);

        const sample = await page.evaluate(() => {
            const c = document.getElementById('game-canvas');
            const ctx = c.getContext('2d');
            const x0 = c.width * 0.15;
            const y0 = c.height * 0.15;
            const w = c.width * 0.7;
            const h = c.height * 0.7;
            let dark = 0, total = 0;
            for (let i = 0; i < 300; i++) {
                const x = Math.floor(x0 + Math.random() * w);
                const y = Math.floor(y0 + Math.random() * h);
                const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
                const lum = (r + g + b) / 3;
                if (lum < 100) dark++;
                total++;
            }
            return { dark, total, darkRatio: dark / total };
        });

        expect(sample.darkRatio, 'Fresh Home-Insel: dunkel-Ratio zu hoch').toBeLessThan(0.25);
    });
});
