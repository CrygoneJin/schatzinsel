// === AUTOMERGE TESTS — Baryon-Triplet + Rule-Order ===
// S99: Proton (uud) + Neutron (udd) als Triplet-Merge.
// Prüft: Feynman-Gate gegen Rule-Order-Kollisionen
// (Wu-Xing-Metal, Pair-Merges Yang+Yin→Qi, Yang×Yang→Charm).

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const WORLD = path.resolve(__dirname, '../../src/world');

function createBrowserContext() {
    const context = {
        window: {},
        console,
        Map,
        Set,
        Array,
        Object,
        Number,
        String,
        Error,
    };
    context.window = context;
    return context;
}

function loadScript(filePath, context) {
    const code = fs.readFileSync(filePath, 'utf-8');
    vm.runInNewContext(code, context, { filename: filePath });
}

// Mini-Grid-Helper: 5x5 Grid mit gezielten Platzierungen
function makeGrid(rows, cols, placements) {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (const [r, c, mat] of placements) {
        grid[r][c] = mat;
    }
    return grid;
}

describe('INSEL_AUTOMERGE — Baryon-Triplets', () => {
    let ctx;
    let checkMerge;

    beforeEach(() => {
        ctx = createBrowserContext();
        loadScript(path.join(WORLD, 'automerge.js'), ctx);
        checkMerge = ctx.INSEL_AUTOMERGE.checkMerge;
    });

    // === Baryon-Bildung ===

    // AUDIT 2026-04-24: Baryon-Grid-Triplet entfernt (Till-Bug „protons
    // spawned everywhere"). Yang+Yang+Yin formt KEIN Proton mehr im
    // Grid-Match — nur noch via Craft-Recipe (siehe recipes.test.js).
    // Stattdessen: Pair-Merge Yang+Yin→Qi greift normal.

    it('Yang+Yang+Yin (clustered) → Qi (Pair-Merge, NICHT Proton-Triplet)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'yang'],
            [2, 3, 'yang'],
            [3, 2, 'yin'],
        ]);
        const result = checkMerge(grid, 3, 2, 5, 5);
        assert.ok(result, 'Pair-Merge Yang+Yin→Qi erwartet');
        assert.notEqual(result.result, 'proton', 'Grid-Triplet für Baryonen ist deaktiviert');
        assert.equal(result.result, 'qi');
    });

    it('Yang+Yin+Yin (clustered) → Qi oder Strange, aber NICHT Neutron', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'yin'],
            [2, 3, 'yin'],
            [3, 2, 'yang'],
        ]);
        const result = checkMerge(grid, 3, 2, 5, 5);
        assert.ok(result);
        assert.notEqual(result.result, 'neutron', 'Grid-Triplet für Baryonen ist deaktiviert');
    });

    it('Diagonale Yang-Yin-Yang: Pair-Merges erlaubt, aber NICHT Proton-Triplet', () => {
        const grid = makeGrid(5, 5, [
            [1, 1, 'yang'],
            [2, 2, 'yin'],
            [1, 3, 'yang'],
        ]);
        const result = checkMerge(grid, 2, 2, 5, 5);
        if (result) {
            assert.notEqual(result.result, 'proton');
        }
    });

    // === Nicht-Kollision mit Wu-Xing-Metal ===

    it('fire+wood+water → metal (Wu-Xing, NICHT Baryon)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'fire'],
            [2, 3, 'wood'],
            [3, 2, 'water'],
        ]);
        const result = checkMerge(grid, 3, 2, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'metal', 'RGB-Farbneutralität → Metall');
    });

    // === Nicht-Kollision mit Gen2/Gen3 ===

    it('charm+charm+strange produziert KEIN Baryon', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'charm'],
            [2, 3, 'charm'],
            [3, 2, 'strange'],
        ]);
        const result = checkMerge(grid, 3, 2, 5, 5);
        // charm+strange Pair-Merge → antimatter ist erlaubt
        // Aber KEIN Proton/Neutron!
        if (result) {
            assert.notEqual(result.result, 'proton');
            assert.notEqual(result.result, 'neutron');
        }
    });

    it('charm+charm+yin produziert KEIN Baryon (nur Gen1-Yang/Yin zählt)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'charm'],
            [2, 3, 'charm'],
            [3, 2, 'yin'],
        ]);
        const result = checkMerge(grid, 3, 2, 5, 5);
        if (result) {
            assert.notEqual(result.result, 'proton');
            assert.notEqual(result.result, 'neutron');
        }
    });

    // === Rule-Order nach Baryon-Entfernung (2026-04-24) ===
    // Pair-Merges greifen jetzt sofort, keine Triplet-Priorität mehr für Baryonen.
    // Wu-Xing-Triplet (fire+wood+water→metal) hat weiterhin Priorität.

    it('Yang+Yang+Yin: Pair Yang+Yin→Qi greift (nicht mehr Proton)', () => {
        const grid = makeGrid(5, 5, [
            [2, 1, 'yang'],
            [2, 3, 'yang'],
            [2, 2, 'yin'],
        ]);
        const result = checkMerge(grid, 2, 2, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'qi', 'Yang+Yin→Qi greift normal');
    });

    it('Yang+Yin+Yin: Pair Yang+Yin→Qi oder Yin²→Strange, NICHT Neutron', () => {
        const grid = makeGrid(5, 5, [
            [2, 1, 'yin'],
            [2, 3, 'yin'],
            [2, 2, 'yang'],
        ]);
        const result = checkMerge(grid, 2, 2, 5, 5);
        assert.ok(result);
        assert.notEqual(result.result, 'neutron', 'Baryon-Triplet deaktiviert');
    });

    // === Einzel-Pair darf noch funktionieren ===

    it('Yang+Yin allein (kein drittes Quark) → Qi (Pair-Merge intakt)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'yang'],
            [2, 3, 'yin'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'qi');
    });

    // AUDIT 2026-04-24 (Till-Bug „caves spawned everywhere"):
    // Pauli-Selbst-Upgrade-Regeln (yin², yang², charm², strange², …)
    // wurden aus Auto-Merge entfernt — sie verursachten Chain-Kaskaden,
    // die das Grid mit cave/mountain fluteten. Weg nur noch via Recipe.
    it('Yang+Yang allein → KEIN Auto-Merge zu Charm (Pauli-Kaskade deaktiviert)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'yang'],
            [2, 3, 'yang'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.equal(result, null, 'Gen1→Gen2 nur via Recipe, nicht via Auto-Merge');
    });

    it('Yin+Yin allein → KEIN Auto-Merge zu Strange (Pauli-Kaskade deaktiviert)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'yin'],
            [2, 3, 'yin'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.equal(result, null, 'Gen1→Gen2 nur via Recipe, nicht via Auto-Merge');
    });

    it('Strange+Strange → KEIN Auto-Merge zu Cave (Haupt-Bug-Vektor, fixed)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'strange'],
            [2, 3, 'strange'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.equal(result, null, 'Grid voll strange darf NICHT zu Grid voll cave kollabieren');
    });

    it('Charm+Charm → KEIN Auto-Merge zu Mountain (symmetrischer Bug, fixed)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'charm'],
            [2, 3, 'charm'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.equal(result, null, 'Grid voll charm darf NICHT zu Grid voll mountain kollabieren');
    });
});

// === Standardmodell-Erweiterungen (Higgs, Mesonen, Positron) ===
// Scope: neue Materialien + neue Merges + Regressions-Check bestehender Pair-Merges.
describe('INSEL_AUTOMERGE — Standardmodell komplett', () => {
    let ctx;
    let checkMerge;

    beforeEach(() => {
        ctx = createBrowserContext();
        loadScript(path.join(WORLD, 'materials.js'), ctx);
        loadScript(path.join(WORLD, 'automerge.js'), ctx);
        checkMerge = ctx.INSEL_AUTOMERGE.checkMerge;
    });

    // === Higgs-Boson: mountain + cave → higgs_boson ===

    it('Mountain + Cave → Higgs-Boson (Top+Bottom-Fusion)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'mountain'],
            [2, 3, 'cave'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'higgs_boson');
        assert.equal(result.type, 'pair');
    });

    it('Cave + Mountain (Reihenfolge umgekehrt) → Higgs-Boson', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'cave'],
            [2, 3, 'mountain'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'higgs_boson');
    });

    // === Mesonen: Yang+Electron → Pion, Strange+Electron → Kaon ===

    it('Yang + Electron → Pion (leichtestes Meson)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'yang'],
            [2, 3, 'electron'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'pion');
    });

    it('Strange + Electron → Kaon (seltsames Meson)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'strange'],
            [2, 3, 'electron'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'kaon');
    });

    // === Positron: antimatter + electron → positron ===

    it('Antimaterie + Elektron → Positron (Dirac 1928)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'antimatter'],
            [2, 3, 'electron'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'positron');
    });

    // === Neue Materialien existieren in INSEL_MATERIALS ===

    it('higgs_boson ist in INSEL_MATERIALS definiert (mass=125, spin=0)', () => {
        const mats = ctx.INSEL_MATERIALS;
        assert.ok(mats.higgs_boson, 'higgs_boson muss existieren');
        assert.equal(mats.higgs_boson.mass, 125);
        assert.equal(mats.higgs_boson.spin, 0);
        assert.equal(mats.higgs_boson.charge, 0);
    });

    it('pion, kaon, positron sind in INSEL_MATERIALS mit korrekten Feldern', () => {
        const mats = ctx.INSEL_MATERIALS;
        assert.ok(mats.pion);
        assert.equal(mats.pion.spin, 0);
        assert.ok(mats.kaon);
        assert.equal(mats.kaon.spin, 0);
        assert.ok(mats.positron);
        assert.equal(mats.positron.charge, 1, 'Positron = +1 (Anti-Elektron)');
        assert.equal(mats.positron.spin, 0.5);
    });

    // === Regressionen: bestehende Merges bleiben intakt ===

    it('Regression: Charm + Strange → Antimaterie (nicht Positron)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'charm'],
            [2, 3, 'strange'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'antimatter');
    });

    it('Regression: Antimaterie + Yang → Elektron (Paarproduktion bleibt)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'antimatter'],
            [2, 3, 'yang'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'electron');
    });

    it('Elektron × Elektron → KEIN Auto-Merge (Pauli-Kaskade deaktiviert, 2026-04-24)', () => {
        // Audit: e⁻×e⁻→Myon im Auto-Merge = gleicher Chain-Kollaps-Vektor
        // wie yin²→strange²→cave. Gen-Upgrades laufen nur via Recipe.
        const grid = makeGrid(5, 5, [
            [2, 2, 'electron'],
            [2, 3, 'electron'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.equal(result, null, 'e⁻ × e⁻ → Myon nur via Recipe (electron + star)');
    });

    it('Regression: Elektron + Yin → Neutrino (bleibt unverändert)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'electron'],
            [2, 3, 'yin'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'neutrino');
    });

    it('Regression 2026-04-24: Yang+Yang+Yin → Qi (NICHT Proton, Grid-Triplet entfernt)', () => {
        const grid = makeGrid(5, 5, [
            [2, 1, 'yang'],
            [2, 3, 'yang'],
            [2, 2, 'yin'],
        ]);
        const result = checkMerge(grid, 2, 2, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'qi', 'Yang+Yin→Qi greift; Baryon nur via Craft-Recipe');
    });

    it('Regression: Yang + Yin → Qi (allein, ohne drittes Quark)', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'yang'],
            [2, 3, 'yin'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.ok(result);
        assert.equal(result.result, 'qi');
    });
});

// === Baryon-Bauplan-Audit (Till, 2026-04-22) ===
// Masse-Ordering, Spin-Konsistenz, Farbladungs-Dokumentation.
describe('INSEL_MATERIALS — Baryon-Bauplan-Konsistenz', () => {
    let ctx;
    let materials;

    beforeEach(() => {
        ctx = createBrowserContext();
        loadScript(path.join(WORLD, 'materials.js'), ctx);
        materials = ctx.INSEL_MATERIALS;
    });

    // Fix 1: Neutron real leicht schwerer als Proton (+0.14% in der Natur).
    it('neutron.mass > proton.mass (real: 939.565 > 938.272 MeV/c²)', () => {
        assert.ok(typeof materials.proton.mass === 'number');
        assert.ok(typeof materials.neutron.mass === 'number');
        assert.ok(
            materials.neutron.mass > materials.proton.mass,
            `neutron.mass (${materials.neutron.mass}) muss > proton.mass (${materials.proton.mass}) sein`
        );
    });

    // Fix 3: Alle Fermionen (Quarks, Leptonen, Baryonen) haben spin = 0.5.
    it('alle Gen1-Quarks haben spin=0.5 (Fermionen)', () => {
        assert.equal(materials.yin.spin, 0.5, 'yin (down-Quark) ist Fermion');
        assert.equal(materials.yang.spin, 0.5, 'yang (up-Quark) ist Fermion');
    });

    it('alle Gen2-Quarks haben spin=0.5 (Fermionen)', () => {
        assert.equal(materials.charm.spin, 0.5);
        assert.equal(materials.strange.spin, 0.5);
    });

    it('alle Gen3-Quarks haben spin=0.5 (mountain=top, cave=bottom)', () => {
        assert.equal(materials.mountain.spin, 0.5, 'mountain = Top-Quark');
        assert.equal(materials.cave.spin, 0.5, 'cave = Bottom-Quark');
    });

    it('alle geladenen Leptonen haben spin=0.5', () => {
        assert.equal(materials.electron.spin, 0.5);
        assert.equal(materials.muon.spin, 0.5);
        assert.equal(materials.tau.spin, 0.5);
    });

    it('alle Neutrinos haben spin=0.5', () => {
        assert.equal(materials.neutrino.spin, 0.5);
        assert.equal(materials.neutrino_mu.spin, 0.5);
        assert.equal(materials.neutrino_tau.spin, 0.5);
    });

    it('Baryonen (Proton, Neutron) haben spin=0.5 (Drei-Quark-Fermionen)', () => {
        assert.equal(materials.proton.spin, 0.5);
        assert.equal(materials.neutron.spin, 0.5);
    });

    // Bosonen bleiben bei ihren Spins (Regression).
    it('Bosonen-Spin intakt (Regression)', () => {
        assert.equal(materials.photon.spin, 1,   'γ: Vektor-Boson');
        assert.equal(materials.w_boson.spin, 1,  'W: schwaches Vektor-Boson');
        assert.equal(materials.z_boson.spin, 1,  'Z: schwaches Vektor-Boson');
        assert.equal(materials.higgs_boson.spin, 0, 'H: Skalar-Boson');
    });
});

// === Baryon-Craft-Rezepte (Pauli-Workaround) ===
// Grid-Triplet-Merge wird durch Yang+Yang → Charm blockiert. Craft ist
// der direkte Weg für Oscar. Ladung/Nukleonen physikalisch konsistent.
describe('INSEL_CRAFTING_RECIPES — Baryon-Craft', () => {
    let ctx;
    let recipes;
    let materials;

    beforeEach(() => {
        ctx = createBrowserContext();
        loadScript(path.join(WORLD, 'materials.js'), ctx);
        loadScript(path.join(WORLD, 'recipes.js'), ctx);
        recipes = ctx.INSEL_CRAFTING_RECIPES;
        materials = ctx.INSEL_MATERIALS;
    });

    it('Proton-Recipe existiert: 2 yang + 1 yin → 1 proton', () => {
        const r = recipes.find(x => x.result === 'proton');
        assert.ok(r, 'Proton-Craft-Recipe fehlt');
        assert.equal(r.ingredients.yang, 2);
        assert.equal(r.ingredients.yin, 1);
        assert.equal(r.resultCount, 1);
    });

    it('Neutron-Recipe existiert: 1 yang + 2 yin → 1 neutron', () => {
        const r = recipes.find(x => x.result === 'neutron');
        assert.ok(r, 'Neutron-Craft-Recipe fehlt');
        assert.equal(r.ingredients.yang, 1);
        assert.equal(r.ingredients.yin, 2);
        assert.equal(r.resultCount, 1);
    });

    // Ladungs-Bilanz Proton: 2·(+2/3) + 1·(-1/3) = +1 ✓
    // Ladungs-Bilanz Neutron: 1·(+2/3) + 2·(-1/3) = 0 ✓
    // Symbolisch über Ergebnis-Material verifiziert (yin/yang ohne charge).
    it('Proton-Ergebnis hat charge=+1 (uud)', () => {
        assert.equal(materials.proton.charge, 1);
    });

    it('Neutron-Ergebnis hat charge=0 (udd)', () => {
        assert.equal(materials.neutron.charge, 0);
    });
});

// === Neutrino-Gen-Upgrade (PR #495-Follow-up) ===
// Nach Entfernung der Pauli-Selbstaufwertungs-Regeln im Auto-Merge
// (neutrino²→neutrino_mu, neutrino_mu²→neutrino_tau, caves-überall-Bug)
// müssen Craft-Rezepte den Gen-Upgrade-Pfad für Neutrinos abdecken.
// Progressive Disclosure: Gen2 erst nach muon, Gen3 erst nach tau.
describe('INSEL_CRAFTING_RECIPES — Neutrino-Gen-Upgrade', () => {
    let ctx;
    let recipes;
    let materials;

    beforeEach(() => {
        ctx = createBrowserContext();
        loadScript(path.join(WORLD, 'materials.js'), ctx);
        loadScript(path.join(WORLD, 'recipes.js'), ctx);
        recipes = ctx.INSEL_CRAFTING_RECIPES;
        materials = ctx.INSEL_MATERIALS;
    });

    it('Myon-Neutrino-Recipe existiert: 2 neutrino → 1 neutrino_mu', () => {
        const r = recipes.find(x => x.result === 'neutrino_mu');
        assert.ok(r, 'Myon-Neutrino-Craft-Recipe fehlt');
        assert.equal(r.ingredients.neutrino, 2);
        assert.equal(r.resultCount, 1);
    });

    it('Tau-Neutrino-Recipe existiert: 2 neutrino_mu → 1 neutrino_tau', () => {
        const r = recipes.find(x => x.result === 'neutrino_tau');
        assert.ok(r, 'Tau-Neutrino-Craft-Recipe fehlt');
        assert.equal(r.ingredients.neutrino_mu, 2);
        assert.equal(r.resultCount, 1);
    });

    it('Myon-Neutrino-Recipe hat Progressive-Disclosure-Gate: requires=["muon"]', () => {
        const r = recipes.find(x => x.result === 'neutrino_mu');
        assert.ok(r);
        // Cross-vm Array-Prototype: per Element vergleichen statt deepEqual.
        assert.ok(Array.isArray(r.requires) || r.requires.length !== undefined, 'requires muss Array-ähnlich sein');
        assert.equal(r.requires.length, 1);
        assert.equal(r.requires[0], 'muon', 'Gen2-Neutrino erst nach Muon-Erlebnis sichtbar');
    });

    it('Tau-Neutrino-Recipe hat Progressive-Disclosure-Gate: requires=["tau"]', () => {
        const r = recipes.find(x => x.result === 'neutrino_tau');
        assert.ok(r);
        assert.ok(Array.isArray(r.requires) || r.requires.length !== undefined, 'requires muss Array-ähnlich sein');
        assert.equal(r.requires.length, 1);
        assert.equal(r.requires[0], 'tau', 'Gen3-Neutrino erst nach Tau-Erlebnis sichtbar');
    });

    it('alle Neutrino-Recipe-Ingredients sind gültige Materials', () => {
        const keys = ['neutrino_mu', 'neutrino_tau'];
        for (const key of keys) {
            const r = recipes.find(x => x.result === key);
            for (const ing of Object.keys(r.ingredients)) {
                assert.ok(
                    materials[ing],
                    `Neutrino-Recipe ${key}: Ingredient "${ing}" ist kein Material`
                );
            }
        }
    });

    it('Neutrino-Recipes-Ergebnisse sind als Materials definiert (spin=0.5)', () => {
        assert.ok(materials.neutrino_mu, 'neutrino_mu muss existieren');
        assert.equal(materials.neutrino_mu.spin, 0.5);
        assert.ok(materials.neutrino_tau, 'neutrino_tau muss existieren');
        assert.equal(materials.neutrino_tau.spin, 0.5);
    });
});

// === Regression: Neutrino-Pauli-Kaskade bleibt im Auto-Merge deaktiviert ===
// Sicherstellen, dass die Gen-Upgrade-Rezepte NICHT versehentlich wieder
// als Auto-Merge-Regel eingeführt werden (Caves-überall-Bug-Klasse).
describe('INSEL_AUTOMERGE — Neutrino-Pauli-Kaskade bleibt deaktiviert', () => {
    let ctx;
    let checkMerge;

    beforeEach(() => {
        ctx = createBrowserContext();
        loadScript(path.join(WORLD, 'materials.js'), ctx);
        loadScript(path.join(WORLD, 'automerge.js'), ctx);
        checkMerge = ctx.INSEL_AUTOMERGE.checkMerge;
    });

    it('Neutrino + Neutrino allein → KEIN Auto-Merge zu neutrino_mu', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'neutrino'],
            [2, 3, 'neutrino'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.equal(result, null, 'Gen1→Gen2 nur via Recipe, nicht via Auto-Merge');
    });

    it('Neutrino_mu + Neutrino_mu allein → KEIN Auto-Merge zu neutrino_tau', () => {
        const grid = makeGrid(5, 5, [
            [2, 2, 'neutrino_mu'],
            [2, 3, 'neutrino_mu'],
        ]);
        const result = checkMerge(grid, 2, 3, 5, 5);
        assert.equal(result, null, 'Gen2→Gen3 nur via Recipe, nicht via Auto-Merge');
    });
});

