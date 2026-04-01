// === DUNGEON-FRAMEWORK — Höhlen-Exploration (#50) ===
// 3 Akte (Goethe): Einstieg → Tiefe → Schatz
// Exportiert als window.INSEL_DUNGEON (Vanilla JS, kein Build-Tool)

(function () {
    'use strict';

    // --- Dungeon-Konfiguration ---
    const DUNGEON_COLS = 24;
    const DUNGEON_ROWS = 18;
    const TILE = {
        WALL:     0,
        FLOOR:    1,
        TORCH:    2,
        GEM_VEIN: 3,
        SWITCH:   4,
        DOOR:     5,
        TREASURE: 6,
        EXIT:     7,
        ENTRANCE: 8,
        OBSTACLE: 9,
    };

    const TILE_RENDER = {
        [TILE.WALL]:     { emoji: '', color: '#1a1a2e', border: '#0f0f1a' },
        [TILE.FLOOR]:    { emoji: '', color: '#2d2d44', border: '#222238' },
        [TILE.TORCH]:    { emoji: '🔥', color: '#3d2d1a', border: '#2d1d0a' },
        [TILE.GEM_VEIN]: { emoji: '💎', color: '#2d2044', border: '#1d1034' },
        [TILE.SWITCH]:   { emoji: '🔘', color: '#2d3d2d', border: '#1d2d1d' },
        [TILE.DOOR]:     { emoji: '🚪', color: '#4a3520', border: '#3a2510' },
        [TILE.TREASURE]: { emoji: '💰', color: '#3d3d1a', border: '#2d2d0a' },
        [TILE.EXIT]:     { emoji: '🔺', color: '#1a3d1a', border: '#0a2d0a' },
        [TILE.ENTRANCE]: { emoji: '🔻', color: '#1a3d1a', border: '#0a2d0a' },
        [TILE.OBSTACLE]: { emoji: '🪨', color: '#333344', border: '#222233' },
    };

    // --- Dungeon State ---
    let active = false;
    let dungeonGrid = null;
    let playerPos = { r: 0, c: 0 };
    let currentAct = 1; // 1, 2, 3
    let torchFound = false;
    let switchActivated = false;
    let treasureCollected = false;
    let visibilityRadius = 2; // ohne Fackel: 2, mit Fackel: 5
    let sourceCell = null; // {r, c} auf der Insel wo die Höhle steht
    let callbacks = {}; // { addToInventory, unlockMaterial, showToast, requestRedraw }

    // --- Prozedurale Generation: Random Walk ---
    function generateDungeon() {
        // Grid mit Wänden füllen
        dungeonGrid = [];
        for (let r = 0; r < DUNGEON_ROWS; r++) {
            dungeonGrid[r] = [];
            for (let c = 0; c < DUNGEON_COLS; c++) {
                dungeonGrid[r][c] = TILE.WALL;
            }
        }

        // Random Walk für Korridore — 3 Akte als 3 verbundene Bereiche
        const acts = generateThreeActs();

        // Akt 1: Einstieg — Eingang + Fackeln + Hindernisse
        placeActOne(acts[0]);

        // Akt 2: Tiefe — Edelstein-Adern + Schalter + Tür
        placeActTwo(acts[1]);

        // Akt 3: Schatz — Belohnung + Ausgang
        placeActThree(acts[2]);

        // Verbindungskorridore zwischen den Akten
        connectActs(acts);
    }

    function generateThreeActs() {
        // 3 Bereiche: links, mitte, rechts — jeweils ein Raum-Cluster
        const acts = [];
        const sectionWidth = Math.floor(DUNGEON_COLS / 3);

        for (let i = 0; i < 3; i++) {
            const startC = sectionWidth * i + Math.floor(sectionWidth / 2);
            const startR = Math.floor(DUNGEON_ROWS / 2);
            const rooms = randomWalk(startR, startC, sectionWidth * i + 1, sectionWidth * (i + 1) - 1);
            acts.push({ rooms, section: i, startR, startC });
        }

        return acts;
    }

    function randomWalk(startR, startC, minC, maxC) {
        const floors = new Set();
        let r = startR;
        let c = startC;
        const steps = 60 + Math.floor(Math.random() * 40);
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (let i = 0; i < steps; i++) {
            // Raum carven (2x2 oder 3x3)
            const roomSize = Math.random() < 0.3 ? 3 : 2;
            for (let dr = 0; dr < roomSize; dr++) {
                for (let dc = 0; dc < roomSize; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr > 0 && nr < DUNGEON_ROWS - 1 && nc > Math.max(0, minC) && nc < Math.min(DUNGEON_COLS - 1, maxC)) {
                        floors.add(nr + ',' + nc);
                        dungeonGrid[nr][nc] = TILE.FLOOR;
                    }
                }
            }

            // Nächste Richtung
            const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
            const nr = r + dr * 2;
            const nc = c + dc * 2;
            if (nr > 1 && nr < DUNGEON_ROWS - 2 && nc > Math.max(1, minC) && nc < Math.min(DUNGEON_COLS - 2, maxC)) {
                // Korridor
                dungeonGrid[r + dr][c + dc] = TILE.FLOOR;
                floors.add((r + dr) + ',' + (c + dc));
                r = nr;
                c = nc;
            }
        }

        return [...floors].map(s => {
            const [fr, fc] = s.split(',').map(Number);
            return { r: fr, c: fc };
        });
    }

    function placeActOne(act) {
        const rooms = act.rooms;
        if (rooms.length === 0) return;

        // Eingang: erster Boden-Tile
        const entrance = rooms[0];
        dungeonGrid[entrance.r][entrance.c] = TILE.ENTRANCE;
        playerPos = { r: entrance.r, c: entrance.c };

        // Hindernisse (Steine): 3-5 zufällige Boden-Tiles
        const obstacleCount = 3 + Math.floor(Math.random() * 3);
        const candidates = rooms.filter((_, i) => i > 2); // nicht direkt am Eingang
        for (let i = 0; i < Math.min(obstacleCount, candidates.length); i++) {
            const idx = Math.floor(Math.random() * candidates.length);
            const tile = candidates.splice(idx, 1)[0];
            dungeonGrid[tile.r][tile.c] = TILE.OBSTACLE;
        }

        // Fackel: irgendwo im hinteren Bereich von Akt 1
        const torchCandidates = rooms.filter((_, i) => i > rooms.length / 2);
        if (torchCandidates.length > 0) {
            const torchTile = torchCandidates[Math.floor(Math.random() * torchCandidates.length)];
            dungeonGrid[torchTile.r][torchTile.c] = TILE.TORCH;
        }
    }

    function placeActTwo(act) {
        const rooms = act.rooms;
        if (rooms.length === 0) return;

        // Edelstein-Adern an Wänden: finde Boden-Tiles neben Wänden
        let gemCount = 0;
        for (const tile of rooms) {
            if (gemCount >= 4) break;
            const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            const nearWall = neighbors.some(([dr, dc]) => {
                const nr = tile.r + dr;
                const nc = tile.c + dc;
                return nr >= 0 && nr < DUNGEON_ROWS && nc >= 0 && nc < DUNGEON_COLS &&
                    dungeonGrid[nr][nc] === TILE.WALL;
            });
            if (nearWall && Math.random() < 0.3) {
                dungeonGrid[tile.r][tile.c] = TILE.GEM_VEIN;
                gemCount++;
            }
        }

        // Schalter: in der Mitte des Akts
        const switchTile = rooms[Math.floor(rooms.length / 2)];
        if (switchTile) {
            dungeonGrid[switchTile.r][switchTile.c] = TILE.SWITCH;
        }

        // Tür: am Ende des Akts (blockiert Zugang zu Akt 3)
        const doorCandidates = rooms.filter((_, i) => i > rooms.length * 0.8);
        if (doorCandidates.length > 0) {
            const doorTile = doorCandidates[Math.floor(Math.random() * doorCandidates.length)];
            dungeonGrid[doorTile.r][doorTile.c] = TILE.DOOR;
        }
    }

    function placeActThree(act) {
        const rooms = act.rooms;
        if (rooms.length === 0) return;

        // Schatz: in der Mitte
        const treasureTile = rooms[Math.floor(rooms.length / 2)];
        if (treasureTile) {
            dungeonGrid[treasureTile.r][treasureTile.c] = TILE.TREASURE;
        }

        // Ausgang: am Ende
        const exitTile = rooms[rooms.length - 1];
        if (exitTile) {
            dungeonGrid[exitTile.r][exitTile.c] = TILE.EXIT;
        }
    }

    function connectActs(acts) {
        // Verbinde Akt 1→2 und Akt 2→3 mit Korridoren
        for (let i = 0; i < acts.length - 1; i++) {
            const a = acts[i].rooms;
            const b = acts[i + 1].rooms;
            if (a.length === 0 || b.length === 0) continue;

            // Endpunkt von a, Startpunkt von b
            const from = a[a.length - 1];
            const to = b[0];

            // Horizontaler Korridor
            const minC = Math.min(from.c, to.c);
            const maxC = Math.max(from.c, to.c);
            for (let c = minC; c <= maxC; c++) {
                if (dungeonGrid[from.r][c] === TILE.WALL) {
                    dungeonGrid[from.r][c] = TILE.FLOOR;
                }
            }

            // Vertikaler Korridor
            const minR = Math.min(from.r, to.r);
            const maxR = Math.max(from.r, to.r);
            for (let r = minR; r <= maxR; r++) {
                if (dungeonGrid[r][to.c] === TILE.WALL) {
                    dungeonGrid[r][to.c] = TILE.FLOOR;
                }
            }
        }
    }

    // --- Dungeon öffnen ---
    function enter(caveR, caveC, cbs) {
        callbacks = cbs || {};
        sourceCell = { r: caveR, c: caveC };
        active = true;
        currentAct = 1;
        torchFound = false;
        switchActivated = false;
        treasureCollected = false;
        visibilityRadius = 2;

        generateDungeon();

        if (callbacks.showToast) {
            callbacks.showToast('🕳️ Du betrittst die Höhle... (Pfeiltasten zum Bewegen, ESC zum Verlassen)', 3000);
        }
    }

    // --- Dungeon verlassen ---
    function exit() {
        active = false;
        dungeonGrid = null;
        sourceCell = null;
        if (callbacks.requestRedraw) callbacks.requestRedraw();
    }

    // --- Spieler im Dungeon bewegen ---
    function movePlayerInDungeon(dr, dc) {
        if (!active || !dungeonGrid) return false;

        const nr = playerPos.r + dr;
        const nc = playerPos.c + dc;

        // Bounds check
        if (nr < 0 || nr >= DUNGEON_ROWS || nc < 0 || nc >= DUNGEON_COLS) return true;

        const tile = dungeonGrid[nr][nc];

        // Wand oder geschlossene Tür blockiert
        if (tile === TILE.WALL) return true;
        if (tile === TILE.DOOR && !switchActivated) {
            if (callbacks.showToast) callbacks.showToast('🚪 Verschlossen! Suche den Schalter.', 2000);
            return true;
        }

        // Hindernis: schieben wenn dahinter frei
        if (tile === TILE.OBSTACLE) {
            const behindR = nr + dr;
            const behindC = nc + dc;
            if (behindR >= 0 && behindR < DUNGEON_ROWS && behindC >= 0 && behindC < DUNGEON_COLS &&
                dungeonGrid[behindR][behindC] === TILE.FLOOR) {
                dungeonGrid[behindR][behindC] = TILE.OBSTACLE;
                dungeonGrid[nr][nc] = TILE.FLOOR;
            } else {
                return true; // kann nicht schieben
            }
        }

        // Bewegen
        playerPos = { r: nr, c: nc };

        // Interaktion mit dem Tile
        handleTileInteraction(tile, nr, nc);

        if (callbacks.requestRedraw) callbacks.requestRedraw();
        return true; // Event consumed
    }

    function handleTileInteraction(tile, r, c) {
        switch (tile) {
            case TILE.TORCH:
                torchFound = true;
                visibilityRadius = 5;
                dungeonGrid[r][c] = TILE.FLOOR;
                if (callbacks.showToast) callbacks.showToast('🔥 Fackel gefunden! Die Dunkelheit weicht.', 2000);
                break;

            case TILE.GEM_VEIN:
                dungeonGrid[r][c] = TILE.FLOOR;
                if (callbacks.addToInventory) callbacks.addToInventory('gem', 1);
                if (callbacks.unlockMaterial) callbacks.unlockMaterial('gem');
                if (callbacks.showToast) callbacks.showToast('💎 Edelstein aus der Wand geschlagen!', 2000);
                break;

            case TILE.SWITCH:
                switchActivated = true;
                dungeonGrid[r][c] = TILE.FLOOR;
                // Tür öffnen
                for (let dr = 0; dr < DUNGEON_ROWS; dr++) {
                    for (let dc = 0; dc < DUNGEON_COLS; dc++) {
                        if (dungeonGrid[dr][dc] === TILE.DOOR) {
                            dungeonGrid[dr][dc] = TILE.FLOOR;
                        }
                    }
                }
                if (callbacks.showToast) callbacks.showToast('🔘 Schalter aktiviert! Eine Tür öffnet sich...', 2000);
                break;

            case TILE.DOOR:
                // Bereits gehandelt in movePlayerInDungeon
                break;

            case TILE.TREASURE:
                treasureCollected = true;
                dungeonGrid[r][c] = TILE.FLOOR;
                // Seltenes Material als Belohnung
                const rewards = ['diamond', 'crystal', 'crown', 'gem'];
                const reward = rewards[Math.floor(Math.random() * rewards.length)];
                if (callbacks.addToInventory) callbacks.addToInventory(reward, 1);
                if (callbacks.unlockMaterial) callbacks.unlockMaterial(reward);
                const mat = window.INSEL_MATERIALS?.[reward];
                if (callbacks.showToast) {
                    callbacks.showToast(`💰 Schatz gefunden: ${mat?.emoji || '✨'} ${mat?.label || reward}!`, 3000);
                }
                break;

            case TILE.EXIT:
                if (callbacks.showToast) callbacks.showToast('🔺 Du verlässt die Höhle. Zurück zur Insel!', 2000);
                setTimeout(() => exit(), 500);
                break;

            case TILE.ENTRANCE:
                // Kann zurück zum Eingang
                break;
        }

        // Akt-Tracking basierend auf Position
        const section = Math.floor(playerPos.c / (DUNGEON_COLS / 3));
        if (section + 1 !== currentAct) {
            currentAct = Math.min(3, Math.max(1, section + 1));
        }
    }

    // --- Dungeon Rendering ---
    function draw(ctx, canvasWidth, canvasHeight) {
        if (!active || !dungeonGrid) return;

        // Dungeon-Overlay: voller Canvas
        ctx.save();

        // Schwarzer Hintergrund
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Zellgröße für Dungeon berechnen
        const cellW = Math.floor(canvasWidth / DUNGEON_COLS);
        const cellH = Math.floor(canvasHeight / DUNGEON_ROWS);
        const cellSize = Math.min(cellW, cellH);
        const offsetX = Math.floor((canvasWidth - cellSize * DUNGEON_COLS) / 2);
        const offsetY = Math.floor((canvasHeight - cellSize * DUNGEON_ROWS) / 2);

        // Fog of War: nur Tiles im Sichtradius zeichnen
        for (let r = 0; r < DUNGEON_ROWS; r++) {
            for (let c = 0; c < DUNGEON_COLS; c++) {
                const dist = Math.abs(r - playerPos.r) + Math.abs(c - playerPos.c);
                const visible = dist <= visibilityRadius;
                const dimVisible = dist <= visibilityRadius + 2;

                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;

                if (!dimVisible) {
                    // Komplett dunkel
                    ctx.fillStyle = '#050510';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    continue;
                }

                const tile = dungeonGrid[r][c];
                const render = TILE_RENDER[tile] || TILE_RENDER[TILE.WALL];

                // Tile zeichnen
                if (visible) {
                    ctx.fillStyle = render.color;
                } else {
                    // Dimmed
                    ctx.fillStyle = '#111122';
                }
                ctx.fillRect(x, y, cellSize, cellSize);

                // Rand
                ctx.strokeStyle = render.border;
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellSize, cellSize);

                // Emoji (nur wenn sichtbar)
                if (visible && render.emoji) {
                    ctx.font = `${cellSize * 0.55}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'white';
                    ctx.fillText(render.emoji, x + cellSize / 2, y + cellSize / 2 + 1);
                }
            }
        }

        // Spieler zeichnen
        const px = offsetX + playerPos.c * cellSize + cellSize / 2;
        const py = offsetY + playerPos.r * cellSize + cellSize / 2;
        const playerEmoji = localStorage.getItem('insel-player-emoji') || '🧒';

        ctx.font = `${cellSize * 0.7}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(playerEmoji, px, py);

        // Fackel-Glow-Effekt
        if (torchFound) {
            const gradient = ctx.createRadialGradient(px, py, 0, px, py, cellSize * visibilityRadius);
            gradient.addColorStop(0, 'rgba(255, 180, 50, 0.15)');
            gradient.addColorStop(1, 'rgba(255, 180, 50, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // HUD: Akt-Anzeige
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(10, 10, 200, 60);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 200, 60);

        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ccc';

        const actNames = ['', 'Einstieg', 'Tiefe', 'Schatz'];
        ctx.fillText(`🕳️ Höhle — Akt ${currentAct}: ${actNames[currentAct]}`, 18, 18);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#999';
        const statusParts = [];
        statusParts.push(torchFound ? '🔥 Fackel' : '🌑 Dunkel');
        if (switchActivated) statusParts.push('🔓 Tür offen');
        if (treasureCollected) statusParts.push('💰 Schatz!');
        ctx.fillText(statusParts.join('  '), 18, 40);

        ctx.fillStyle = '#666';
        ctx.fillText('ESC = Verlassen  |  Pfeiltasten = Bewegen', 18, 54);

        ctx.restore();
    }

    // --- API ---
    window.INSEL_DUNGEON = {
        isActive: function () { return active; },
        enter: enter,
        exit: exit,
        movePlayer: movePlayerInDungeon,
        draw: draw,
    };
})();
