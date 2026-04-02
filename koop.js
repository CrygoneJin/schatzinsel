// koop.js — Lokaler Koop-Modus: Papa + Kind auf einer Insel (#89)
// Aktivierung: ?koop=1 in der URL oder Toggle-Button
(function () {
    'use strict';

    // --- Aktivierung prüfen ---
    var params = new URLSearchParams(window.location.search);
    var koopActive = params.get('koop') === '1';

    // Toggle-Button einfügen (immer, damit man aktivieren kann)
    function createToggleButton() {
        var toolbar = document.getElementById('view-group');
        if (!toolbar) return;
        var btn = document.createElement('button');
        btn.className = 'tool-btn';
        btn.id = 'koop-btn';
        btn.title = 'Koop-Modus (Papa+Kind)';
        btn.textContent = koopActive ? '👫' : '👤';
        btn.addEventListener('click', function () {
            var url = new URL(window.location);
            if (koopActive) {
                url.searchParams.delete('koop');
            } else {
                url.searchParams.set('koop', '1');
            }
            window.location.href = url.toString();
        });
        toolbar.appendChild(btn);
    }

    // Warten bis DOM bereit
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }

    if (!koopActive) return;

    // --- Warten auf API ---
    function waitForAPI(cb) {
        if (window.INSEL_KOOP_API) { cb(); return; }
        var interval = setInterval(function () {
            if (window.INSEL_KOOP_API) {
                clearInterval(interval);
                cb();
            }
        }, 50);
    }

    waitForAPI(function () {
        var API = window.INSEL_KOOP_API;

        // --- Spieler 2 State ---
        var player2 = {
            emoji: '👨',
            name: 'Papa',
            pos: null,
            material: 'wood',  // Default-Material für Spieler 2
            tool: 'build',
        };

        // Spieler 2 neben Spieler 1 spawnen
        function spawnPlayer2() {
            var p1 = API.getPlayerPos();
            if (!p1) return;
            var ROWS = API.getROWS();
            var COLS = API.getCOLS();
            // Rechts neben Spieler 1, falls frei
            var candidates = [
                { r: p1.r, c: p1.c + 1 },
                { r: p1.r, c: p1.c - 1 },
                { r: p1.r + 1, c: p1.c },
                { r: p1.r - 1, c: p1.c },
            ];
            for (var i = 0; i < candidates.length; i++) {
                var c = candidates[i];
                if (c.r >= 2 && c.r < ROWS - 2 && c.c >= 2 && c.c < COLS - 2) {
                    player2.pos = { r: c.r, c: c.c };
                    return;
                }
            }
            // Fallback: gleiche Position
            player2.pos = { r: p1.r, c: p1.c };
        }

        spawnPlayer2();

        // --- Spieler 2 zeichnen (afterDraw-Hook) ---
        API.onAfterDraw(function () {
            if (!player2.pos) return;
            var ctx = API.getCtx();
            var CELL_SIZE = API.getCellSize();
            var WATER_BORDER = API.getWaterBorder();

            var px = (player2.pos.c + WATER_BORDER) * CELL_SIZE + CELL_SIZE / 2;
            var py = (player2.pos.r + WATER_BORDER) * CELL_SIZE + CELL_SIZE / 2;

            ctx.save();
            // Figur-Emoji
            ctx.font = CELL_SIZE * 0.7 + 'px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(player2.emoji, px, py);

            // Name-Label
            var fontSize = Math.max(9, CELL_SIZE * 0.27);
            ctx.font = 'bold ' + fontSize + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.lineWidth = 3;
            ctx.strokeText(player2.name, px, py - CELL_SIZE * 0.35);
            ctx.fillStyle = 'white';
            ctx.fillText(player2.name, px, py - CELL_SIZE * 0.35);
            ctx.restore();

            // Aktives Material-Indikator unter dem Spieler
            var MATERIALS = API.getMATERIALS();
            var matInfo = MATERIALS[player2.material];
            if (matInfo) {
                ctx.save();
                ctx.font = Math.max(8, CELL_SIZE * 0.25) + 'px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(matInfo.emoji || '', px, py + CELL_SIZE * 0.3);
                ctx.restore();
            }
        });

        // --- Spieler 2 Bewegung ---
        function movePlayer2(dr, dc) {
            if (!player2.pos) return;
            var ROWS = API.getROWS();
            var COLS = API.getCOLS();
            var nr = player2.pos.r + dr;
            var nc = player2.pos.c + dc;
            if (nr >= 2 && nr < ROWS - 2 && nc >= 2 && nc < COLS - 2) {
                player2.pos = { r: nr, c: nc };
                API.requestRedraw();
                API.draw();
            }
        }

        // --- Spieler 2 baut (E-Taste -> Leertaste für P1, E für P2) ---
        function player2Build() {
            if (!player2.pos) return;
            // applyTool nutzt currentMaterial/currentTool aus game.js
            // Wir müssen temporär umschalten und zurücksetzen
            var origMaterial = API.getCurrentMaterial();
            var origTool = API.getCurrentTool();

            API.selectMaterial(player2.material);
            API.selectTool(player2.tool);
            API.applyTool(player2.pos.r, player2.pos.c);

            // Zurücksetzen auf Spieler 1 Material/Tool
            API.selectMaterial(origMaterial);
            API.selectTool(origTool);

            API.requestRedraw();
            API.draw();
        }

        // --- Keyboard-Handler für Spieler 2 (WASD + E) ---
        document.addEventListener('keydown', function (e) {
            // Nicht triggern wenn Input/Textarea fokussiert
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'w': case 'W': movePlayer2(-1, 0); e.preventDefault(); break;
                case 's': case 'S': movePlayer2(1, 0); e.preventDefault(); break;
                case 'a': case 'A': movePlayer2(0, -1); e.preventDefault(); break;
                case 'd': case 'D': movePlayer2(0, 1); e.preventDefault(); break;
                // Leertaste = Spieler 1 baut
                case ' ': player1Build(); e.preventDefault(); break;
                // Q = Spieler 2 baut
                case 'q': case 'Q': player2Build(); e.preventDefault(); break;
            }
        });

        // --- Spieler 1: Leertaste zum Bauen ---
        function player1Build() {
            var p1 = API.getPlayerPos();
            if (!p1) return;
            API.applyTool(p1.r, p1.c);
            API.requestRedraw();
            API.draw();
        }

        // --- Spieler 2 Material-Auswahl (Palette) ---
        // Shift+Klick auf Material = Spieler 2 wählt das Material
        // Oder Shift+1-5 für Elemente
        document.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (!e.shiftKey) return;

            var mat = null;
            switch (e.key) {
                case '!': case '1': mat = 'metal'; break;  // Shift+1
                case '@': case '2': mat = 'wood'; break;   // Shift+2
                case '#': case '3': mat = 'fire'; break;   // Shift+3
                case '$': case '4': mat = 'water'; break;  // Shift+4
                case '%': case '5': mat = 'earth'; break;  // Shift+5
            }
            if (mat) {
                player2.material = mat;
                e.preventDefault();
                showPlayer2Material();
            }
        });

        // Shift+Klick auf Palette-Button = Spieler 2
        document.getElementById('palette').addEventListener('click', function (e) {
            if (!e.shiftKey) return;
            var btn = e.target.closest('.material-btn');
            if (!btn) return;
            var mat = btn.dataset.material;
            if (mat) {
                player2.material = mat;
                e.preventDefault();
                e.stopPropagation();
                showPlayer2Material();
            }
        }, true);

        // --- Spieler 2 Tool-Auswahl ---
        document.addEventListener('keydown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (!e.shiftKey) return;

            switch (e.key) {
                case 'B': player2.tool = 'build'; e.preventDefault(); break;
                case 'E': player2.tool = 'harvest'; e.preventDefault(); break;
                case 'F': player2.tool = 'fill'; e.preventDefault(); break;
            }
        });

        // --- Koop-HUD: zeigt Spieler-2-Info an ---
        function createKoopHUD() {
            var hud = document.createElement('div');
            hud.id = 'koop-hud';
            hud.style.cssText = 'position:fixed; bottom:12px; left:12px; background:rgba(0,0,0,0.75); color:white; padding:8px 14px; border-radius:12px; font-family:Fredoka,sans-serif; font-size:14px; z-index:5000; display:flex; align-items:center; gap:8px; pointer-events:none;';
            hud.innerHTML = '<span style="font-size:24px;">' + player2.emoji + '</span>'
                + '<span>' + player2.name + '</span>'
                + '<span id="koop-hud-mat" style="font-size:18px;"></span>'
                + '<span id="koop-hud-tool" style="font-size:12px; opacity:0.7;"></span>';
            document.body.appendChild(hud);
            showPlayer2Material();
        }

        function showPlayer2Material() {
            var matEl = document.getElementById('koop-hud-mat');
            var toolEl = document.getElementById('koop-hud-tool');
            if (!matEl) return;
            var MATERIALS = API.getMATERIALS();
            var info = MATERIALS[player2.material];
            matEl.textContent = info ? (info.emoji || '') : player2.material;
            if (toolEl) {
                var toolNames = { build: 'Bauen', harvest: 'Ernte', fill: 'Fuellen' };
                toolEl.textContent = toolNames[player2.tool] || player2.tool;
            }
        }

        createKoopHUD();

        // --- Koop-Steuerungshilfe einblenden ---
        function showKoopHelp() {
            var help = document.createElement('div');
            help.id = 'koop-help';
            help.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.88); color:white; padding:24px 32px; border-radius:16px; font-family:Fredoka,sans-serif; z-index:9999; text-align:center; max-width:400px;';
            help.innerHTML = '<h3 style="margin:0 0 12px;">Koop-Modus aktiv!</h3>'
                + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; text-align:left; font-size:13px;">'
                + '<div><b>Kind (Spieler 1)</b><br>Bewegen: Pfeiltasten<br>Bauen: Leertaste<br>Material: 1-5</div>'
                + '<div><b>Papa (Spieler 2)</b><br>Bewegen: WASD<br>Bauen: Q<br>Material: Shift+1-5</div>'
                + '</div>'
                + '<p style="font-size:11px; opacity:0.6; margin:12px 0 0;">Shift+Klick auf Material = Papa</p>';

            document.body.appendChild(help);
            setTimeout(function () {
                help.style.transition = 'opacity 0.5s';
                help.style.opacity = '0';
                setTimeout(function () { help.remove(); }, 600);
            }, 5000);
        }

        // Kurz warten damit das Spiel erst fertig lädt
        setTimeout(showKoopHelp, 1500);

        // Koop-Status loggen
        console.log('[Koop] Papa+Kind Modus aktiv. WASD+Q=Papa, Pfeile+Space=Kind.');
    });
})();
