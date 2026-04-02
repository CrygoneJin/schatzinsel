// === LEADERBOARD === Backlog #21
// Top 10 Baumeister, Entdecker, Zeitreisende
// Daten via GET /leaderboard vom Worker (D1 sessions-Tabelle)
(function () {
    'use strict';

    const PROXY = () => (window.INSEL_CONFIG && window.INSEL_CONFIG.proxy) || 'https://schatzinsel.hoffmeyer-zlotnik.workers.dev';

    // Kategorie-Config: kinderfreundliche Titel statt kalter Ranks
    const CATEGORIES = [
        { key: 'blocks',       title: 'Baumeister',    emoji: '🧱', unit: 'Bloecke',      field: 'blocks_placed' },
        { key: 'discoveries',  title: 'Entdecker',     emoji: '🔬', unit: 'Entdeckungen',  field: 'quests_completed' },
        { key: 'time',         title: 'Zeitreisende',  emoji: '⏳', unit: 'Minuten',        field: 'duration_s' },
    ];

    let cachedData = null;
    let lastFetch = 0;
    const CACHE_TTL = 30_000; // 30s cache

    // --- Daten holen ---
    async function fetchLeaderboard() {
        const now = Date.now();
        if (cachedData && now - lastFetch < CACHE_TTL) return cachedData;

        try {
            const res = await fetch(PROXY() + '/leaderboard');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            cachedData = await res.json();
            lastFetch = now;
            return cachedData;
        } catch (e) {
            console.warn('[Leaderboard] Fetch fehlgeschlagen:', e.message);
            return cachedData || { blocks: [], discoveries: [], time: [] };
        }
    }

    // --- Modal rendern ---
    function createModal() {
        // Nicht doppelt anlegen
        if (document.getElementById('leaderboard-overlay')) return document.getElementById('leaderboard-overlay');

        const overlay = document.createElement('div');
        overlay.id = 'leaderboard-overlay';
        overlay.className = 'leaderboard-overlay';
        overlay.innerHTML = `
            <div class="leaderboard-modal">
                <div class="leaderboard-header">
                    <h2>🏆 Bestenliste</h2>
                    <button class="leaderboard-close" title="Schließen" aria-label="Schließen">&times;</button>
                </div>
                <div class="leaderboard-tabs"></div>
                <div class="leaderboard-list"></div>
                <div class="leaderboard-footer">
                    <span class="leaderboard-hint">Spiele weiter um aufzusteigen!</span>
                </div>
            </div>
        `;

        // Styles injizieren (einmalig)
        if (!document.getElementById('leaderboard-styles')) {
            const style = document.createElement('style');
            style.id = 'leaderboard-styles';
            style.textContent = `
                .leaderboard-overlay {
                    display: none;
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 8000;
                    align-items: center; justify-content: center;
                    animation: lbFadeIn 0.2s ease-out;
                }
                .leaderboard-overlay.active { display: flex; }
                @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }

                .leaderboard-modal {
                    background: var(--panel-bg, #1a2332);
                    border: 2px solid var(--accent, #f0c040);
                    border-radius: 16px;
                    padding: 20px;
                    width: min(420px, 90vw);
                    max-height: 80vh;
                    overflow-y: auto;
                    font-family: 'Fredoka', 'Comic Neue', sans-serif;
                    color: var(--text, #e0e0e0);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                }
                .leaderboard-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 12px;
                }
                .leaderboard-header h2 { margin: 0; font-size: 22px; }
                .leaderboard-close {
                    background: none; border: none; color: var(--text, #e0e0e0);
                    font-size: 28px; cursor: pointer; padding: 0 4px; line-height: 1;
                }
                .leaderboard-close:hover { color: #ff6b6b; }

                .leaderboard-tabs {
                    display: flex; gap: 6px; margin-bottom: 16px;
                }
                .leaderboard-tab {
                    flex: 1; padding: 8px 4px;
                    background: rgba(255,255,255,0.08);
                    border: 2px solid transparent;
                    border-radius: 10px;
                    cursor: pointer; text-align: center;
                    font-family: inherit; font-size: 13px;
                    color: var(--text, #e0e0e0);
                    transition: all 0.15s;
                }
                .leaderboard-tab:hover { background: rgba(255,255,255,0.14); }
                .leaderboard-tab.active {
                    border-color: var(--accent, #f0c040);
                    background: rgba(240,192,64,0.15);
                }
                .leaderboard-tab .tab-emoji { font-size: 20px; display: block; margin-bottom: 2px; }

                .leaderboard-list { min-height: 200px; }

                .lb-row {
                    display: flex; align-items: center; gap: 10px;
                    padding: 8px 10px; border-radius: 10px;
                    margin-bottom: 4px; transition: background 0.15s;
                }
                .lb-row:hover { background: rgba(255,255,255,0.06); }
                .lb-row.lb-self {
                    background: rgba(240,192,64,0.18);
                    border: 1px solid rgba(240,192,64,0.4);
                }
                .lb-pos {
                    width: 28px; height: 28px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%; font-size: 14px; font-weight: 700;
                    background: rgba(255,255,255,0.1);
                    flex-shrink: 0;
                }
                .lb-row:nth-child(1) .lb-pos { background: #ffd700; color: #333; }
                .lb-row:nth-child(2) .lb-pos { background: #c0c0c0; color: #333; }
                .lb-row:nth-child(3) .lb-pos { background: #cd7f32; color: #fff; }
                .lb-name { flex: 1; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .lb-score { font-weight: 700; font-size: 15px; color: var(--accent, #f0c040); }
                .lb-unit { font-size: 11px; opacity: 0.6; margin-left: 2px; }

                .lb-empty {
                    text-align: center; padding: 40px 10px;
                    opacity: 0.5; font-size: 15px;
                }

                .leaderboard-footer {
                    margin-top: 12px; text-align: center;
                    font-size: 12px; opacity: 0.5;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        // Event-Handler
        overlay.querySelector('.leaderboard-close').addEventListener('click', closeLeaderboard);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeLeaderboard();
        });

        return overlay;
    }

    function renderTabs(overlay, activeKey) {
        const tabsEl = overlay.querySelector('.leaderboard-tabs');
        tabsEl.innerHTML = '';
        CATEGORIES.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'leaderboard-tab' + (cat.key === activeKey ? ' active' : '');
            btn.innerHTML = `<span class="tab-emoji">${cat.emoji}</span>${cat.title}`;
            btn.addEventListener('click', () => renderCategory(overlay, cat.key));
            tabsEl.appendChild(btn);
        });
    }

    function renderCategory(overlay, catKey) {
        renderTabs(overlay, catKey);
        const listEl = overlay.querySelector('.leaderboard-list');
        const cat = CATEGORIES.find(c => c.key === catKey);

        if (!cachedData || !cachedData[catKey] || cachedData[catKey].length === 0) {
            listEl.innerHTML = `<div class="lb-empty">Noch keine ${cat.title} — sei der Erste!</div>`;
            return;
        }

        const playerName = (localStorage.getItem('insel-spielername') || '').toLowerCase();
        const entries = cachedData[catKey];
        let html = '';

        entries.forEach((entry, i) => {
            const isSelf = playerName && entry.name.toLowerCase() === playerName;
            const score = cat.key === 'time' ? Math.round(entry.score / 60) : entry.score;
            const unit = cat.key === 'time' ? 'Min' : '';
            html += `
                <div class="lb-row${isSelf ? ' lb-self' : ''}">
                    <div class="lb-pos">${i + 1}</div>
                    <div class="lb-name">${escapeHtml(entry.name)}${isSelf ? ' ⭐' : ''}</div>
                    <div class="lb-score">${score}<span class="lb-unit">${unit}</span></div>
                </div>
            `;
        });

        listEl.innerHTML = html;
    }

    function escapeHtml(s) {
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    // --- Open / Close ---
    async function openLeaderboard() {
        const overlay = createModal();
        overlay.classList.add('active');

        // Loading state
        overlay.querySelector('.leaderboard-list').innerHTML = '<div class="lb-empty">Lade...</div>';
        renderTabs(overlay, 'blocks');

        await fetchLeaderboard();
        renderCategory(overlay, 'blocks');

        // Keyboard: Escape schließt
        document.addEventListener('keydown', handleEscape);
    }

    function closeLeaderboard() {
        const overlay = document.getElementById('leaderboard-overlay');
        if (overlay) overlay.classList.remove('active');
        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(e) {
        if (e.key === 'Escape') closeLeaderboard();
    }

    // --- Button einbinden ---
    function initLeaderboard() {
        const btn = document.getElementById('leaderboard-btn');
        if (btn) {
            btn.addEventListener('click', openLeaderboard);
        }
    }

    // Auto-Init wenn DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLeaderboard);
    } else {
        initLeaderboard();
    }

    // INSEL-Namespace
    if (window.INSEL) {
        window.INSEL.register('leaderboard', { open: openLeaderboard, close: closeLeaderboard });
    }
})();
