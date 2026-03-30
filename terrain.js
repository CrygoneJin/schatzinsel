// === TERRAIN-GENERATOR — Die Insel lebt bevor du ankommst ===
// Prozedural: Strand, Palmen, Fluss, Berge, Höhle, Tiere, ein NPC irgendwo.
// Jede Insel ist anders. Seed aus Spielernamen.

(function () {
    'use strict';

    // Einfacher Seeded Random (deterministische Insel pro Name)
    function mulberry32(seed) {
        let h = seed | 0;
        return function () {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            h ^= h >>> 16;
            return (h >>> 0) / 4294967296;
        };
    }

    function hashString(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        }
        return h;
    }

    // --- Simplex-artiges Noise (leichtgewichtig) ---
    function makeNoise(rng) {
        const perm = Array.from({ length: 256 }, () => Math.floor(rng() * 256));
        return function noise2d(x, y) {
            const xi = Math.floor(x) & 255;
            const yi = Math.floor(y) & 255;
            const xf = x - Math.floor(x);
            const yf = y - Math.floor(y);
            const u = xf * xf * (3 - 2 * xf);
            const v = yf * yf * (3 - 2 * yf);
            const a = perm[(xi + perm[yi & 255]) & 255];
            const b = perm[(xi + 1 + perm[yi & 255]) & 255];
            const c = perm[(xi + perm[(yi + 1) & 255]) & 255];
            const d = perm[(xi + 1 + perm[(yi + 1) & 255]) & 255];
            return (a + u * (b - a) + v * (c - a + u * (d - c - b + a))) / 255;
        };
    }

    // --- Haupt-Generator ---
    function generateTerrain(grid, rows, cols, playerName) {
        const seed = hashString(playerName || 'Schatzinsel');
        const rng = mulberry32(seed);
        const noise = makeNoise(rng);

        // Abstand vom Rand (0 = Rand, 1 = Mitte)
        function distFromEdge(r, c) {
            const dr = Math.min(r - 2, rows - 3 - r) / (rows / 2 - 2);
            const dc = Math.min(c - 2, cols - 3 - c) / (cols / 2 - 2);
            return Math.min(dr, dc);
        }

        // === PHASE 1: Strand-Ring (äußerste bebaubare Reihen) ===
        for (let r = 2; r < rows - 2; r++) {
            for (let c = 2; c < cols - 2; c++) {
                const d = distFromEdge(r, c);
                if (d < 0.15) {
                    // Strand: Sand mit gelegentlichen Palmen und Muscheln
                    if (rng() < 0.03) {
                        grid[r][c] = 'tree'; // Palme am Strand
                    } else if (rng() < 0.02) {
                        grid[r][c] = 'sand';
                    }
                }
            }
        }

        // === PHASE 2: Vegetation (Noise-basiert) ===
        for (let r = 4; r < rows - 4; r++) {
            for (let c = 4; c < cols - 4; c++) {
                if (grid[r][c]) continue; // Schon belegt
                const d = distFromEdge(r, c);
                if (d < 0.15) continue; // Strand frei lassen

                const n = noise(r * 0.3, c * 0.3);

                if (n > 0.7 && d > 0.3) {
                    // Dichter Wald im Inneren
                    grid[r][c] = rng() < 0.6 ? 'tree' : (rng() < 0.5 ? 'plant' : 'flower');
                } else if (n > 0.55 && d > 0.2) {
                    // Lichtung mit Pflanzen
                    if (rng() < 0.3) {
                        grid[r][c] = rng() < 0.5 ? 'plant' : 'flower';
                    }
                }
            }
        }

        // === PHASE 3: Fluss (von Berg zur Küste) ===
        const riverStartR = Math.floor(rows * 0.3 + rng() * rows * 0.3);
        const riverStartC = Math.floor(cols * 0.4 + rng() * cols * 0.2);
        let rr = riverStartR, rc = riverStartC;

        for (let i = 0; i < 40; i++) {
            if (rr < 2 || rr >= rows - 2 || rc < 2 || rc >= cols - 2) break;
            grid[rr][rc] = 'water';
            // Fluss etwas breiter (1-2 Felder)
            if (rc + 1 < cols - 2) grid[rr][rc + 1] = 'water';

            // Fließrichtung: tendiert nach unten/rechts zur Küste
            const dir = rng();
            if (dir < 0.5) rr++;
            else if (dir < 0.8) rc++;
            else rr += (rng() < 0.5 ? 1 : -1);

            // Fische im Fluss
            if (rng() < 0.15 && grid[rr]?.[rc] === 'water') {
                grid[rr][rc] = 'fish';
            }
        }

        // === PHASE 4: Berg/Hügel (Stein-Cluster) ===
        const mountainR = Math.floor(rows * 0.2 + rng() * rows * 0.2);
        const mountainC = Math.floor(cols * 0.2 + rng() * cols * 0.2);
        const mountainSize = 3 + Math.floor(rng() * 3);

        for (let dr = -mountainSize; dr <= mountainSize; dr++) {
            for (let dc = -mountainSize; dc <= mountainSize; dc++) {
                const mr = mountainR + dr;
                const mc = mountainC + dc;
                if (mr < 3 || mr >= rows - 3 || mc < 3 || mc >= cols - 3) continue;
                const dist = Math.sqrt(dr * dr + dc * dc);
                if (dist < mountainSize && rng() < 0.7) {
                    grid[mr][mc] = 'stone';
                }
                // Rand des Bergs: Erde
                if (dist >= mountainSize && dist < mountainSize + 1.5 && rng() < 0.4) {
                    if (!grid[mr][mc]) grid[mr][mc] = 'earth';
                }
            }
        }

        // === PHASE 5: Höhle (Loch im Berg) ===
        const caveR = mountainR + Math.floor(rng() * 2);
        const caveC = mountainC + Math.floor(rng() * 2);
        if (caveR > 3 && caveR < rows - 3 && caveC > 3 && caveC < cols - 3) {
            grid[caveR][caveC] = 'door'; // Höhleneingang
            if (grid[caveR][caveC - 1]) grid[caveR][caveC - 1] = 'stone'; // Rahmen
            if (grid[caveR][caveC + 1]) grid[caveR][caveC + 1] = 'stone';
            // Pilze um den Eingang
            for (let d = -1; d <= 1; d++) {
                const mr = caveR + 1;
                const mc = caveC + d;
                if (mr < rows - 2 && mc > 2 && mc < cols - 2 && !grid[mr][mc]) {
                    if (rng() < 0.5) grid[mr][mc] = 'mushroom';
                }
            }
        }

        // === PHASE 6: Tiere (statische Platzierung, fauna.js animiert sie) ===
        const animals = [];

        // Krabben am Strand
        for (let i = 0; i < 3; i++) {
            const side = Math.floor(rng() * 4);
            let ar, ac;
            if (side === 0) { ar = 3; ac = Math.floor(4 + rng() * (cols - 8)); }
            else if (side === 1) { ar = rows - 4; ac = Math.floor(4 + rng() * (cols - 8)); }
            else if (side === 2) { ar = Math.floor(4 + rng() * (rows - 8)); ac = 3; }
            else { ar = Math.floor(4 + rng() * (rows - 8)); ac = cols - 4; }
            animals.push({ type: 'crab', emoji: '🦀', r: ar, c: ac });
        }

        // Vögel im Wald
        for (let i = 0; i < 2; i++) {
            const ar = Math.floor(5 + rng() * (rows - 10));
            const ac = Math.floor(5 + rng() * (cols - 10));
            animals.push({ type: 'bird', emoji: '🐦', r: ar, c: ac });
        }

        // Schildkröte am Strand
        animals.push({
            type: 'turtle',
            emoji: '🐢',
            r: rows - 4,
            c: Math.floor(cols * 0.3 + rng() * cols * 0.4),
        });

        // Schmetterling bei Blumen
        animals.push({
            type: 'butterfly',
            emoji: '🦋',
            r: Math.floor(rows * 0.4 + rng() * rows * 0.2),
            c: Math.floor(cols * 0.4 + rng() * cols * 0.2),
        });

        // === PHASE 7: NPC irgendwo auf der Insel ===
        // Ein zufälliger Starter-NPC wartet auf Entdeckung
        const npcChars = [
            { id: 'spongebob', emoji: '🧽', spot: 'beach' },   // Am Strand
            { id: 'maus',      emoji: '🐭', spot: 'flowers' },  // Bei Blumen
        ];
        const npcChoice = npcChars[Math.floor(rng() * npcChars.length)];
        let npcPos = null;

        if (npcChoice.spot === 'beach') {
            npcPos = { r: rows - 4, c: Math.floor(cols * 0.6 + rng() * cols * 0.2) };
        } else {
            // Bei Blumen suchen
            for (let r = 4; r < rows - 4; r++) {
                for (let c = 4; c < cols - 4; c++) {
                    if (grid[r][c] === 'flower' && !npcPos) {
                        npcPos = { r: r - 1, c: c };
                    }
                }
            }
            if (!npcPos) npcPos = { r: Math.floor(rows / 2), c: Math.floor(cols / 2) };
        }

        // === PHASE 8: Boot an der Küste (Einladung zum Segeln) ===
        const boatR = 2;
        const boatC = Math.floor(cols * 0.7 + rng() * cols * 0.15);
        if (boatC > 2 && boatC < cols - 2) {
            grid[boatR][boatC] = 'boat';
        }

        // === PHASE 9: Weg vom Strand ins Inselinnere ===
        const pathStart = Math.floor(cols * 0.5);
        for (let r = rows - 4; r > rows / 2; r--) {
            const wobble = Math.floor(noise(r * 0.5, 0) * 2 - 1);
            const pc = pathStart + wobble;
            if (pc > 3 && pc < cols - 3 && !grid[r][pc]) {
                grid[r][pc] = 'path';
            }
        }

        return {
            animals: animals,
            npc: { ...npcChoice, pos: npcPos },
            mountain: { r: mountainR, c: mountainC },
            cave: { r: caveR, c: caveC },
            river: { startR: riverStartR, startC: riverStartC },
        };
    }

    // --- Public API ---
    window.Terrain = {
        generate: generateTerrain,
    };

})();
