// easter-snake.js — Easter Egg: Mini Snake
// Aktivierung: s-n-a-k-e tippen (Buchstaben in Folge)
(function () {
    'use strict';

    // --- Trigger: "snake" tippen ---
    const TRIGGER = ['s', 'n', 'a', 'k', 'e'];
    let triggerIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === TRIGGER[triggerIndex]) {
            triggerIndex++;
            if (triggerIndex === TRIGGER.length) {
                triggerIndex = 0;
                openSnake();
            }
        } else {
            triggerIndex = (e.key.toLowerCase() === TRIGGER[0]) ? 1 : 0;
        }
    });

    // --- Snake Konfiguration ---
    const COLS = 20;
    const ROWS = 20;
    const CELL = 20;
    const TICK_MS = 150;

    const DIR = { UP: [0,-1], DOWN: [0,1], LEFT: [-1,0], RIGHT: [1,0] };

    let gameLoop = null;
    let keyHandler = null;

    function openSnake() {
        if (document.getElementById('snake-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'snake-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:20000;display:flex;align-items:center;justify-content:center;';

        const box = document.createElement('div');
        box.style.cssText = 'background:#1a2e1a;border-radius:12px;padding:16px;color:#eee;font-family:monospace;text-align:center;';

        const title = document.createElement('div');
        title.style.cssText = 'font-size:18px;margin-bottom:8px;';
        title.textContent = '🐍 Snake — geheimes Easter Egg!';

        const hint = document.createElement('div');
        hint.style.cssText = 'font-size:11px;color:#888;margin-bottom:10px;';
        hint.textContent = '← → ↑ ↓ steuern · Iss die Äpfel · Esc schließen';

        const canvas = document.createElement('canvas');
        canvas.width = COLS * CELL;
        canvas.height = ROWS * CELL;
        canvas.style.cssText = 'display:block;border:2px solid #2d5a2d;';

        const scoreEl = document.createElement('div');
        scoreEl.style.cssText = 'margin-top:8px;font-size:14px;';
        scoreEl.textContent = 'Punkte: 0';

        box.appendChild(title);
        box.appendChild(hint);
        box.appendChild(canvas);
        box.appendChild(scoreEl);
        modal.appendChild(box);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeSnake();
        });

        startGame(canvas, scoreEl);
    }

    function closeSnake() {
        if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
        if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
        const modal = document.getElementById('snake-modal');
        if (modal) modal.remove();
    }

    function startGame(canvas, scoreEl) {
        const ctx = canvas.getContext('2d');

        // Schlange startet in der Mitte, bewegt sich nach rechts
        let snake = [
            { x: 12, y: 10 },
            { x: 11, y: 10 },
            { x: 10, y: 10 }
        ];
        let dir = DIR.RIGHT;
        let nextDir = DIR.RIGHT;
        let food = placeFood();
        let score = 0;
        let gameOver = false;

        function placeFood() {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * COLS),
                    y: Math.floor(Math.random() * ROWS)
                };
            } while (snake.some(s => s.x === pos.x && s.y === pos.y));
            return pos;
        }

        function tick() {
            if (gameOver) return;

            dir = nextDir;
            const head = { x: snake[0].x + dir[0], y: snake[0].y + dir[1] };

            // Wand-Kollision
            if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
                gameOver = true;
                draw();
                return;
            }

            // Selbst-Kollision (alle Segmente außer dem letzten, das gleich entfernt wird)
            if (snake.slice(0, -1).some(s => s.x === head.x && s.y === head.y)) {
                gameOver = true;
                draw();
                return;
            }

            snake.unshift(head);

            // Apfel gefressen?
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreEl.textContent = 'Punkte: ' + score;
                food = placeFood();
            } else {
                snake.pop();
            }

            draw();
        }

        function draw() {
            // Hintergrund
            ctx.fillStyle = '#0d1a0d';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Gitter (dezent)
            ctx.strokeStyle = '#142a14';
            ctx.lineWidth = 0.5;
            for (let x = 0; x <= COLS; x++) {
                ctx.beginPath();
                ctx.moveTo(x * CELL, 0);
                ctx.lineTo(x * CELL, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= ROWS; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * CELL);
                ctx.lineTo(canvas.width, y * CELL);
                ctx.stroke();
            }

            // Apfel
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(
                food.x * CELL + CELL / 2,
                food.y * CELL + CELL / 2,
                CELL / 2 - 2,
                0, Math.PI * 2
            );
            ctx.fill();

            // Schlange
            snake.forEach(function (seg, i) {
                ctx.fillStyle = i === 0 ? '#27ae60' : '#2ecc71';
                ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
            });

            // Kopf-Augen
            if (snake.length > 0 && !gameOver) {
                const h = snake[0];
                ctx.fillStyle = '#fff';
                const eyeOffset = dir === DIR.UP || dir === DIR.DOWN ? 4 : 2;
                const eyeX1 = h.x * CELL + (dir[0] === 1 ? CELL - 6 : 4);
                const eyeX2 = h.x * CELL + (dir[0] === 1 ? CELL - 6 : 4);
                const eyeY1 = h.y * CELL + (dir[1] === 1 ? CELL - 6 : 4);
                const eyeY2 = h.y * CELL + (dir[1] === 1 ? CELL - 6 : 4);
                // Zwei Punkte links/rechts vom Blickrichtungs-Zentrum
                if (dir === DIR.RIGHT || dir === DIR.LEFT) {
                    const ex = dir === DIR.RIGHT ? h.x * CELL + CELL - 6 : h.x * CELL + 4;
                    ctx.fillRect(ex, h.y * CELL + 4, 2, 2);
                    ctx.fillRect(ex, h.y * CELL + CELL - 6, 2, 2);
                } else {
                    const ey = dir === DIR.DOWN ? h.y * CELL + CELL - 6 : h.y * CELL + 4;
                    ctx.fillRect(h.x * CELL + 4, ey, 2, 2);
                    ctx.fillRect(h.x * CELL + CELL - 6, ey, 2, 2);
                }
            }

            if (gameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.65)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#27ae60';
                ctx.font = 'bold 20px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
                ctx.fillStyle = '#fff';
                ctx.font = '14px monospace';
                ctx.fillText('Punkte: ' + score, canvas.width / 2, canvas.height / 2 + 14);
                ctx.font = '12px monospace';
                ctx.fillStyle = '#888';
                ctx.fillText('Esc zum Schließen', canvas.width / 2, canvas.height / 2 + 34);
            }
        }

        keyHandler = function (e) {
            if (e.key === 'Escape') { closeSnake(); return; }
            if (gameOver) return;

            // Richtung wechseln — kein 180°-Umkehr
            if (e.key === 'ArrowUp'    && dir !== DIR.DOWN)  { nextDir = DIR.UP;    e.preventDefault(); }
            if (e.key === 'ArrowDown'  && dir !== DIR.UP)    { nextDir = DIR.DOWN;  e.preventDefault(); }
            if (e.key === 'ArrowLeft'  && dir !== DIR.RIGHT) { nextDir = DIR.LEFT;  e.preventDefault(); }
            if (e.key === 'ArrowRight' && dir !== DIR.LEFT)  { nextDir = DIR.RIGHT; e.preventDefault(); }
        };

        document.addEventListener('keydown', keyHandler);

        draw();
        gameLoop = setInterval(tick, TICK_MS);
    }

})();
