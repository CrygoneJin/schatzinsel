// === SCHWARZMARKT — Mephisto's P2P Rare-Item-Handel ===
// Kindertauglich: Seelenglut 🔥 als In-Game-Währung.
// DSGVO: Nur pseudonyme IDs (player_id aus localStorage), kein PII.
// "Ein Reisender bietet..." — keine Spielernamen sichtbar.
(function () {
    'use strict';

    // --- Config ---
    var PROXY = (window.INSEL_CONFIG && window.INSEL_CONFIG.proxy) || 'https://schatzinsel.hoffmeyer-zlotnik.workers.dev';
    var PAGE_SIZE = 20;
    var PLAYER_ID_KEY = 'insel-player-id';

    // --- Pseudonyme Spieler-ID (DSGVO: kein Name, kein Account) ---
    function getPlayerId() {
        var id = localStorage.getItem(PLAYER_ID_KEY);
        if (!id) {
            id = 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
            localStorage.setItem(PLAYER_ID_KEY, id);
        }
        return id;
    }

    // --- Seelenglut (Inventory-Integration) ---
    function getSeelenglut() {
        try {
            var inv = JSON.parse(localStorage.getItem('insel-inventar') || '{}');
            return inv.soulfire || 0;
        } catch (e) { return 0; }
    }

    function spendSeelenglut(amount) {
        try {
            var inv = JSON.parse(localStorage.getItem('insel-inventar') || '{}');
            if ((inv.soulfire || 0) < amount) return false;
            inv.soulfire -= amount;
            if (inv.soulfire <= 0) delete inv.soulfire;
            localStorage.setItem('insel-inventar', JSON.stringify(inv));
            return true;
        } catch (e) { return false; }
    }

    function earnSeelenglut(amount) {
        try {
            var inv = JSON.parse(localStorage.getItem('insel-inventar') || '{}');
            inv.soulfire = (inv.soulfire || 0) + amount;
            localStorage.setItem('insel-inventar', JSON.stringify(inv));
        } catch (e) { /* still */ }
    }

    // --- API ---
    function apiGet(path) {
        return fetch(PROXY + path).then(function (r) { return r.json(); });
    }

    function apiPost(path, body) {
        return fetch(PROXY + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then(function (r) { return r.json(); });
    }

    // --- Mephisto Kommentare ---
    var MEPHISTO_COMMENTS = {
        buy: [
            'Ein guter Tausch... für mich 😈',
            'Hehehehe... Deal!',
            'Du wirst es nicht bereuen. Oder doch. Hehehehe...',
            'Das Schicksal hat euch zusammengeführt. Und ich.',
            'Ein Schnäppchen! Für mich jedenfalls...',
        ],
        sell: [
            'Ah, du willst handeln? Ich mag deinen Stil...',
            'Ein Reisender wird sich freuen. Oder auch nicht.',
            'Ins Schaufenster damit! Hehehehe...',
            'Der Basar der Schatten nimmt dein Angebot an.',
        ],
        empty: [
            'Noch leer hier... Aber Geduld ist eine Tugend. Die ich nicht habe.',
            'Der Markt schläft. Weck ihn auf — biete etwas an!',
            'Kein Angebot? Dann schaff eins. Hehehehe...',
        ],
        greeting: [
            '😈 Willkommen im Schwarzmarkt, Reisender...',
            '😈 Ah, du bist zurück. Ich habe auf dich gewartet...',
            '😈 Der Basar der Schatten ist geöffnet. Was suchst du?',
        ],
        broke: [
            'Kein Seelenglut? Erledige meine Quests. Dann reden wir.',
            'Arm aber neugierig. Das gefällt mir. Hehehehe...',
        ],
    };

    function mephistoSays(category) {
        var lines = MEPHISTO_COMMENTS[category] || MEPHISTO_COMMENTS.greeting;
        return lines[Math.floor(Math.random() * lines.length)];
    }

    // --- NPC Rare Shop Items (Mephisto's eigener Laden) ---
    var MEPHISTO_DEALS = [
        { id: 'schatten_kristall', name: 'Schatten-Kristall', emoji: '🔮', desc: 'Leuchtet nur bei Nacht. Flüstert Faust-Zitate.', price_glut: 50 },
        { id: 'seelen_laterne', name: 'Seelen-Laterne', emoji: '🏮', desc: 'Zeigt den Weg den man nicht gehen sollte.', price_glut: 80 },
        { id: 'mitternachts_rose', name: 'Mitternachts-Rose', emoji: '🥀', desc: 'Blüht nur zwischen 23:00 und 01:00.', price_glut: 120 },
        { id: 'pakt_siegel', name: 'Pakt-Siegel', emoji: '📜', desc: 'Unterschreibe nicht. Oder doch. Hehehehe...', price_glut: 200 },
        { id: 'hawking_stern', name: 'Hawking-Stern', emoji: '⭐', desc: 'Strahlt Information. Schwarzes Loch im Taschenformat.', price_glut: 500 },
    ];

    // --- Schwarzmarkt UI ---
    var marketPanel = null;
    var isOpen = false;

    function createMarketPanel() {
        if (marketPanel) return marketPanel;

        var panel = document.createElement('div');
        panel.id = 'schwarzmarkt-panel';
        panel.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
            'width:92vw;max-width:500px;max-height:85vh;background:#0a0a12;color:#e0d0c0;border:2px solid #8B0000;' +
            'border-radius:12px;z-index:10000;overflow-y:auto;font-family:monospace;padding:0;' +
            'box-shadow:0 0 30px rgba(139,0,0,0.5),inset 0 0 20px rgba(139,0,0,0.1);';

        panel.innerHTML = [
            '<div style="padding:16px;border-bottom:1px solid #2a0a0a;background:linear-gradient(180deg,#1a0505,#0a0a12);">',
            '  <div style="display:flex;justify-content:space-between;align-items:center;">',
            '    <span style="font-size:18px;font-weight:bold;">😈 Schwarzmarkt</span>',
            '    <div style="display:flex;align-items:center;gap:12px;">',
            '      <span id="sm-glut-display" style="font-size:12px;color:#ff4400;">🔥 0</span>',
            '      <button id="sm-close" style="background:none;border:none;color:#666;font-size:22px;cursor:pointer;line-height:1;">&times;</button>',
            '    </div>',
            '  </div>',
            '  <div id="sm-greeting" style="font-size:10px;color:#8B4513;margin-top:6px;font-style:italic;"></div>',
            '</div>',
            '<div id="sm-tabs" style="display:flex;border-bottom:1px solid #2a0a0a;">',
            '  <button class="sm-tab active" data-tab="deals" style="flex:1;padding:8px;background:none;border:none;color:#ff4400;font-size:11px;cursor:pointer;border-bottom:2px solid #ff4400;">Mephisto Deals</button>',
            '  <button class="sm-tab" data-tab="bazaar" style="flex:1;padding:8px;background:none;border:none;color:#555;font-size:11px;cursor:pointer;border-bottom:2px solid transparent;">Basar</button>',
            '  <button class="sm-tab" data-tab="sell" style="flex:1;padding:8px;background:none;border:none;color:#555;font-size:11px;cursor:pointer;border-bottom:2px solid transparent;">Anbieten</button>',
            '</div>',
            '<div id="sm-content" style="padding:12px;min-height:200px;">',
            '  <div id="sm-deals"></div>',
            '  <div id="sm-bazaar" style="display:none;"></div>',
            '  <div id="sm-sell" style="display:none;"></div>',
            '</div>',
        ].join('\n');

        document.body.appendChild(panel);
        marketPanel = panel;

        // Close
        panel.querySelector('#sm-close').addEventListener('click', closeMarket);

        // Tabs
        var tabs = panel.querySelectorAll('.sm-tab');
        var tabIds = ['deals', 'bazaar', 'sell'];
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function () {
                var target = this.getAttribute('data-tab');
                for (var j = 0; j < tabs.length; j++) {
                    tabs[j].style.color = '#555';
                    tabs[j].style.borderBottom = '2px solid transparent';
                    tabs[j].classList.remove('active');
                }
                this.style.color = '#ff4400';
                this.style.borderBottom = '2px solid #ff4400';
                this.classList.add('active');
                for (var k = 0; k < tabIds.length; k++) {
                    var el = panel.querySelector('#sm-' + tabIds[k]);
                    if (el) el.style.display = tabIds[k] === target ? '' : 'none';
                }
                if (target === 'deals') renderMephistoDeals();
                if (target === 'bazaar') loadBazaarListings();
                if (target === 'sell') renderSellTab();
            });
        }

        return panel;
    }

    function updateGlutDisplay() {
        var el = document.getElementById('sm-glut-display');
        if (el) el.textContent = '🔥 ' + getSeelenglut();
    }

    function openMephisto() {
        var panel = createMarketPanel();
        panel.style.display = '';
        isOpen = true;
        updateGlutDisplay();
        // Greeting
        var greetEl = document.getElementById('sm-greeting');
        if (greetEl) greetEl.textContent = mephistoSays('greeting');
        renderMephistoDeals();
        if (typeof window.showToast === 'function') {
            window.showToast(mephistoSays('greeting'), 3000);
        }
    }

    // Legacy: openMarket als Alias
    function openMarket() { openMephisto(); }

    function closeMarket() {
        if (marketPanel) marketPanel.style.display = 'none';
        isOpen = false;
    }

    // --- Tab 1: Mephisto Deals (NPC-Shop, Seelenglut only) ---
    function renderMephistoDeals() {
        var container = document.getElementById('sm-deals');
        if (!container) return;
        updateGlutDisplay();

        var glut = getSeelenglut();
        var html = '<div style="font-size:10px;color:#8B4513;margin-bottom:10px;">Mephistos persönliche Sammlung. Nur gegen Seelenglut.</div>';

        for (var i = 0; i < MEPHISTO_DEALS.length; i++) {
            var deal = MEPHISTO_DEALS[i];
            var canAfford = glut >= deal.price_glut;
            html += [
                '<div style="background:#110808;border:1px solid #2a0a0a;border-radius:8px;padding:10px;margin-bottom:8px;',
                canAfford ? '' : 'opacity:0.6;', '">',
                '  <div style="display:flex;justify-content:space-between;align-items:center;">',
                '    <span style="font-size:22px;">' + deal.emoji + '</span>',
                '    <div style="flex:1;margin-left:10px;">',
                '      <div style="font-weight:bold;font-size:12px;color:#e0d0c0;">' + escHtml(deal.name) + '</div>',
                '      <div style="font-size:9px;color:#8B4513;font-style:italic;">' + escHtml(deal.desc) + '</div>',
                '    </div>',
                '    <div style="text-align:right;">',
                '      <div style="font-size:11px;color:#ff4400;">🔥 ' + deal.price_glut + '</div>',
                '      <button class="sm-deal-btn" data-idx="' + i + '" style="margin-top:4px;background:' + (canAfford ? '#8B0000' : '#333') + ';color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:10px;cursor:' + (canAfford ? 'pointer' : 'not-allowed') + ';" ' + (canAfford ? '' : 'disabled') + '>Kaufen</button>',
                '    </div>',
                '  </div>',
                '</div>',
            ].join('');
        }

        container.innerHTML = html;

        var btns = container.querySelectorAll('.sm-deal-btn');
        for (var j = 0; j < btns.length; j++) {
            btns[j].addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-idx'));
                buyMephistoDeal(idx);
            });
        }
    }

    function buyMephistoDeal(idx) {
        var deal = MEPHISTO_DEALS[idx];
        if (!deal) return;
        if (!spendSeelenglut(deal.price_glut)) {
            if (typeof window.showToast === 'function') {
                window.showToast('😈 ' + mephistoSays('broke'), 3000);
            }
            return;
        }
        // Item ins LLM-Materials Inventar legen (rare item)
        try {
            var stored = JSON.parse(localStorage.getItem('insel-llm-materials') || '{}');
            stored[deal.id] = { name: deal.name, emoji: deal.emoji, description: deal.desc, source: 'mephisto' };
            localStorage.setItem('insel-llm-materials', JSON.stringify(stored));
        } catch (e) { /* still */ }

        if (typeof window.showToast === 'function') {
            window.showToast('😈 ' + mephistoSays('buy') + ' ' + deal.emoji + ' ' + deal.name, 4000);
        }
        updateGlutDisplay();
        renderMephistoDeals();
    }

    // --- Tab 2: Basar (P2P anonym via Worker) ---
    function loadBazaarListings() {
        var container = document.getElementById('sm-bazaar');
        if (!container) return;
        updateGlutDisplay();
        container.innerHTML = '<div style="text-align:center;color:#555;padding:20px;">Lade Angebote...</div>';

        apiGet('/blackmarket/items?limit=' + PAGE_SIZE).then(function (data) {
            if (!data.items || data.items.length === 0) {
                container.innerHTML = '<div style="text-align:center;color:#8B4513;padding:20px;font-style:italic;">' + mephistoSays('empty') + '</div>';
                return;
            }
            var html = '<div style="font-size:10px;color:#8B4513;margin-bottom:10px;">Anonyme Angebote von Reisenden. Mephisto garantiert... nichts.</div>';
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                html += renderBazaarCard(item);
            }
            container.innerHTML = html;

            var buyBtns = container.querySelectorAll('.sm-buy-btn');
            for (var j = 0; j < buyBtns.length; j++) {
                buyBtns[j].addEventListener('click', function () {
                    handleBazaarBuy(this.getAttribute('data-id'), parseInt(this.getAttribute('data-price')));
                });
            }
        }).catch(function () {
            container.innerHTML = '<div style="text-align:center;color:#8B0000;padding:20px;">Keine Verbindung zum Schwarzmarkt. Die Schatten schweigen.</div>';
        });
    }

    function renderBazaarCard(item) {
        var emoji = item.emoji || '🎁';
        var price = item.price_glut || 0;
        var canAfford = getSeelenglut() >= price;
        var isMine = item.seller_id === getPlayerId();

        return [
            '<div style="background:#110808;border:1px solid #2a0a0a;border-radius:8px;padding:10px;margin-bottom:8px;">',
            '  <div style="display:flex;justify-content:space-between;align-items:center;">',
            '    <span style="font-size:20px;">' + emoji + '</span>',
            '    <div style="flex:1;margin-left:10px;">',
            '      <div style="font-weight:bold;font-size:12px;color:#e0d0c0;">' + escHtml(item.name || item.material_id) + '</div>',
            '      <div style="font-size:9px;color:#8B4513;">' + escHtml(item.description || '') + '</div>',
            '    </div>',
            '    <div style="text-align:right;">',
            '      <div style="font-size:11px;color:#ff4400;">🔥 ' + price + '</div>',
            isMine
                ? '      <span style="font-size:9px;color:#555;">Dein Angebot</span>'
                : '      <button class="sm-buy-btn" data-id="' + item.id + '" data-price="' + price + '" style="margin-top:4px;background:' + (canAfford ? '#8B0000' : '#333') + ';color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:10px;cursor:' + (canAfford ? 'pointer' : 'not-allowed') + ';" ' + (canAfford ? '' : 'disabled') + '>Kaufen</button>',
            '    </div>',
            '  </div>',
            '  <div style="font-size:9px;color:#442211;margin-top:4px;font-style:italic;">Ein Reisender bietet an...</div>',
            '</div>',
        ].join('');
    }

    function handleBazaarBuy(listingId, price) {
        if (!spendSeelenglut(price)) {
            if (typeof window.showToast === 'function') {
                window.showToast('😈 ' + mephistoSays('broke'), 3000);
            }
            return;
        }

        apiPost('/blackmarket/buy', {
            listing_id: listingId,
            buyer_id: getPlayerId(),
            price_glut: price,
        }).then(function (res) {
            if (res.ok) {
                // Item ins lokale Inventar
                if (res.item) {
                    try {
                        var stored = JSON.parse(localStorage.getItem('insel-llm-materials') || '{}');
                        stored[res.item.material_id] = {
                            name: res.item.name,
                            emoji: res.item.emoji,
                            description: res.item.description || '',
                            source: 'schwarzmarkt',
                        };
                        localStorage.setItem('insel-llm-materials', JSON.stringify(stored));
                    } catch (e) { /* still */ }
                }
                if (typeof window.showToast === 'function') {
                    window.showToast('😈 ' + mephistoSays('buy'), 4000);
                }
                updateGlutDisplay();
                loadBazaarListings();
            } else {
                // Seelenglut zurückgeben bei Fehler
                earnSeelenglut(price);
                if (typeof window.showToast === 'function') {
                    window.showToast('😈 ' + (res.error || 'Der Deal ist geplatzt...'), 3000);
                }
            }
        }).catch(function () {
            earnSeelenglut(price);
            if (typeof window.showToast === 'function') {
                window.showToast('😈 Keine Verbindung. Die Schatten schweigen.', 3000);
            }
        });
    }

    // --- Tab 3: Anbieten (eigene Rare Items listen) ---
    function renderSellTab() {
        var container = document.getElementById('sm-sell');
        if (!container) return;
        updateGlutDisplay();

        var rareItems = findPlayerRareItems();
        if (rareItems.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#8B4513;padding:20px;font-style:italic;">Keine Rare Items. Crafte mit dem LLM etwas Einzigartiges — oder erledige Mephistos Quests!</div>';
            return;
        }

        var html = '<div style="font-size:10px;color:#8B4513;margin-bottom:10px;">Biete deine seltenen Items anonym an. Nur Seelenglut als Preis.</div>';
        for (var i = 0; i < rareItems.length; i++) {
            var item = rareItems[i];
            html += [
                '<div style="background:#110808;border:1px solid #2a0a0a;border-radius:8px;padding:10px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">',
                '  <span style="font-size:16px;">' + (item.emoji || '✨') + ' <span style="font-size:12px;color:#e0d0c0;">' + escHtml(item.name) + '</span></span>',
                '  <button class="sm-list-btn" data-material="' + escHtml(item.id) + '" data-name="' + escHtml(item.name) + '" data-emoji="' + escHtml(item.emoji || '✨') + '" style="background:#8B0000;color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:10px;cursor:pointer;">Anbieten</button>',
                '</div>',
            ].join('');
        }
        container.innerHTML = html;

        var listBtns = container.querySelectorAll('.sm-list-btn');
        for (var j = 0; j < listBtns.length; j++) {
            listBtns[j].addEventListener('click', function () {
                handleList(this.getAttribute('data-material'), this.getAttribute('data-name'), this.getAttribute('data-emoji'));
            });
        }
    }

    function findPlayerRareItems() {
        var rares = [];
        try {
            var stored = JSON.parse(localStorage.getItem('insel-llm-materials') || '{}');
            for (var key in stored) {
                if (stored.hasOwnProperty(key)) {
                    rares.push({
                        id: key,
                        name: stored[key].name || key,
                        emoji: stored[key].emoji || '✨',
                    });
                }
            }
        } catch (e) { /* still */ }
        return rares;
    }

    function handleList(materialId, name, emoji) {
        var priceStr = prompt('Preis in Seelenglut 🔥 (z.B. 30):');
        if (!priceStr || isNaN(parseInt(priceStr))) return;
        var price = Math.max(1, parseInt(priceStr));

        apiPost('/blackmarket/list', {
            material_id: materialId,
            name: name,
            emoji: emoji,
            price_glut: price,
            seller_id: getPlayerId(),
        }).then(function (res) {
            if (res.ok) {
                // Item aus lokalem Inventar entfernen (es ist jetzt auf dem Markt)
                try {
                    var stored = JSON.parse(localStorage.getItem('insel-llm-materials') || '{}');
                    delete stored[materialId];
                    localStorage.setItem('insel-llm-materials', JSON.stringify(stored));
                } catch (e) { /* still */ }

                if (typeof window.showToast === 'function') {
                    window.showToast('😈 ' + mephistoSays('sell'), 3000);
                }
                renderSellTab();
            } else {
                if (typeof window.showToast === 'function') {
                    window.showToast('😈 ' + (res.error || 'Fehler beim Listen'), 3000);
                }
            }
        }).catch(function () {
            if (typeof window.showToast === 'function') {
                window.showToast('😈 Keine Verbindung. Die Schatten schweigen.', 3000);
            }
        });
    }

    // --- Rare Item Detection ---
    function isRareItem(materialId) {
        var mats = window.INSEL_MATERIALS || {};
        return materialId && !mats[materialId];
    }

    // --- HTML Escaping ---
    function escHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str || ''));
        return div.innerHTML;
    }

    // --- Exports ---
    var marketplace = {
        open: openMarket,
        openMephisto: openMephisto,
        close: closeMarket,
        isOpen: function () { return isOpen; },
        isRareItem: isRareItem,
        getMephistoDeals: function () { return MEPHISTO_DEALS; },
        MEPHISTO_DEALS: MEPHISTO_DEALS,
        getSeelenglut: getSeelenglut,
        earnSeelenglut: earnSeelenglut,
        spendSeelenglut: spendSeelenglut,
    };

    if (window.INSEL) {
        window.INSEL.register('marketplace', marketplace);
    }
    window.INSEL_MARKETPLACE = marketplace;
})();
