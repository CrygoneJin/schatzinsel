// === FAUNA — Tiere leben auf der Insel ===
// Krabben krabbeln am Strand. Vögel fliegen. Schmetterlinge flattern.
// Rein visuell, blockieren nichts. Die Insel atmet.

(function () {
    'use strict';

    let animals = [];
    let npcOnMap = null;
    let animationFrame = 0;

    // Bewegungsmuster pro Tierart
    const BEHAVIOR = {
        crab: { speed: 3000, range: 3, emoji: '🦀', staysNear: 'beach' },
        bird: { speed: 2000, range: 5, emoji: '🐦', staysNear: 'trees' },
        turtle: { speed: 8000, range: 2, emoji: '🐢', staysNear: 'beach' },
        butterfly: { speed: 1500, range: 4, emoji: '🦋', staysNear: 'flowers' },
    };

    function init(animalList, npc) {
        animals = (animalList || []).map(a => ({
            ...a,
            homeR: a.r,
            homeC: a.c,
            lastMove: Date.now() + Math.random() * 2000, // Versetzt starten
        }));
        npcOnMap = npc || null;
    }

    // Tiere bewegen sich in der Nähe ihres Startpunkts
    function update() {
        const now = Date.now();
        const grid = window.grid;
        if (!grid) return;
        const rows = grid.length;
        const cols = grid[0]?.length || 0;

        for (const animal of animals) {
            const b = BEHAVIOR[animal.type] || BEHAVIOR.crab;
            if (now - animal.lastMove < b.speed) continue;

            animal.lastMove = now;

            // Zufällige Bewegung innerhalb range von Home
            const dr = Math.floor(Math.random() * 3) - 1;
            const dc = Math.floor(Math.random() * 3) - 1;
            const nr = animal.r + dr;
            const nc = animal.c + dc;

            // Im Range bleiben
            if (Math.abs(nr - animal.homeR) > b.range) continue;
            if (Math.abs(nc - animal.homeC) > b.range) continue;

            // Im Grid bleiben
            if (nr < 2 || nr >= rows - 2 || nc < 2 || nc >= cols - 2) continue;

            animal.r = nr;
            animal.c = nc;
        }

        if (window.requestRedraw) window.requestRedraw();
    }

    // Tiere + NPC auf Canvas zeichnen
    function draw(ctx, cellSize, waterBorder) {
        animationFrame++;

        for (const animal of animals) {
            const b = BEHAVIOR[animal.type] || BEHAVIOR.crab;
            const px = (animal.c + waterBorder) * cellSize + cellSize / 2;
            const py = (animal.r + waterBorder) * cellSize + cellSize / 2;

            ctx.save();
            ctx.font = `${cellSize * 0.5}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Schmetterlinge und Vögel "flattern" (leichtes Wippen)
            if (animal.type === 'butterfly' || animal.type === 'bird') {
                const wobble = Math.sin(Date.now() / 200 + animal.homeR) * 3;
                ctx.fillText(b.emoji, px, py + wobble);
            } else {
                ctx.fillText(b.emoji, px, py);
            }
            ctx.restore();
        }

        // NPC auf der Karte zeichnen (entdeckbar!)
        if (npcOnMap?.pos) {
            const px = (npcOnMap.pos.c + waterBorder) * cellSize + cellSize / 2;
            const py = (npcOnMap.pos.r + waterBorder) * cellSize + cellSize / 2;

            ctx.save();
            ctx.font = `${cellSize * 0.7}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(npcOnMap.emoji, px, py);

            // Sprechblase wenn Spieler nah genug
            const playerP = window.playerPos?.();
            if (playerP) {
                const dist = Math.abs(playerP.r - npcOnMap.pos.r) + Math.abs(playerP.c - npcOnMap.pos.c);
                if (dist <= 3) {
                    // Kleine Sprechblase
                    const fontSize = Math.max(8, cellSize * 0.22);
                    ctx.font = `${fontSize}px sans-serif`;
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(px - 30, py - cellSize * 0.8, 60, fontSize + 6);
                    ctx.fillStyle = 'white';
                    ctx.fillText('💬 Sprich!', px, py - cellSize * 0.6);

                    // Bei Berührung: Chat öffnen
                    if (dist <= 1 && !npcOnMap._chatOpened) {
                        npcOnMap._chatOpened = true;
                        if (window.openChat) window.openChat(npcOnMap.id);
                        setTimeout(() => { npcOnMap._chatOpened = false; }, 5000);
                    }
                }
            }
            ctx.restore();
        }
    }

    // Alle 500ms Tiere updaten
    setInterval(update, 500);

    // --- Public API ---
    window.Fauna = {
        init: init,
        draw: draw,
        get animals() { return animals; },
        get npc() { return npcOnMap; },
        addAnimal: function (type, r, c) {
            const b = BEHAVIOR[type];
            if (!b) return;
            animals.push({ type, emoji: b.emoji, r, c, homeR: r, homeC: c, lastMove: Date.now() });
        },
    };

})();
