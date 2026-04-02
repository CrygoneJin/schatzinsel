// === INSEL MARKETPLACE — Krabbenburger Token-Ökonomie (#93) ===
// Kindertauglich: Kinder sehen Krabbenburger 🍔, Nerds sehen MMX.
// DSGVO: Nur pseudonyme Adressen, kein PII.
// Deflationäre Arbeitswerttheorie: Tokens → Burn → Arbeit → Hawking-Strahlung.
(function () {
    'use strict';

    // --- Config ---
    var PROXY = (window.INSEL_CONFIG && window.INSEL_CONFIG.proxy) || 'https://schatzinsel.hoffmeyer-zlotnik.workers.dev';
    var WALLET_KEY = 'insel-wallet'; // localStorage: { mmx: 'mmx1...', xch: 'xch1...' }

    // --- MMX ↔ Krabbenburger Wechselkurs ---
    var BURGER_TO_MMX = 0.001; // 1 🍔 = 0.001 MMX

    // --- Wallet (pseudonym, kein Account) ---
    function getWallet() {
        try { return JSON.parse(localStorage.getItem(WALLET_KEY) || '{}'); } catch (e) { return {}; }
    }

    function setWallet(wallet) {
        localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
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

    // --- Rare Items: LLM-gecraftete Unikate erkennen ---
    function isRareItem(materialId) {
        var mats = window.INSEL_MATERIALS || {};
        return materialId && !mats[materialId];
    }

    // --- Marketplace Panel UI ---
    var marketPanel = null;
    var isOpen = false;

    function createMarketPanel() {
        if (marketPanel) return marketPanel;

        var panel = document.createElement('div');
        panel.id = 'marketplace-panel';
        panel.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
            'width:90vw;max-width:480px;max-height:80vh;background:#1a1a2e;color:#e0e0e0;border:2px solid #FF6B00;' +
            'border-radius:12px;z-index:10000;overflow-y:auto;font-family:monospace;padding:0;';

        panel.innerHTML = [
            '<div style="padding:16px;border-bottom:1px solid #333;">',
            '  <div style="display:flex;justify-content:space-between;align-items:center;">',
            '    <span style="font-size:16px;font-weight:bold;">🏪 Insel-Marktplatz</span>',
            '    <span id="market-balance" style="font-size:14px;color:#FFD700;">🍔 0</span>',
            '    <button id="market-close" style="background:none;border:none;color:#888;font-size:20px;cursor:pointer;">&times;</button>',
            '  </div>',
            '  <div style="font-size:10px;color:#666;margin-top:4px;">Materialien kaufen und verkaufen. Krabbenburger sind Geld!</div>',
            '</div>',
            '<div id="market-tabs" style="display:flex;border-bottom:1px solid #333;">',
            '  <button class="market-tab active" data-tab="prices" style="flex:1;padding:8px;background:none;border:none;color:#FF6B00;font-size:12px;cursor:pointer;border-bottom:2px solid #FF6B00;">Preise</button>',
            '  <button class="market-tab" data-tab="buy" style="flex:1;padding:8px;background:none;border:none;color:#666;font-size:12px;cursor:pointer;">Kaufen</button>',
            '  <button class="market-tab" data-tab="sell" style="flex:1;padding:8px;background:none;border:none;color:#666;font-size:12px;cursor:pointer;">Verkaufen</button>',
            '  <button class="market-tab" data-tab="wallet" style="flex:1;padding:8px;background:none;border:none;color:#666;font-size:12px;cursor:pointer;">Wallet</button>',
            '</div>',
            '<div id="market-content" style="padding:16px;min-height:200px;">',
            '  <div id="market-prices"></div>',
            '  <div id="market-buy" style="display:none;"></div>',
            '  <div id="market-sell" style="display:none;"></div>',
            '  <div id="market-wallet" style="display:none;"></div>',
            '</div>',
        ].join('\n');

        document.body.appendChild(panel);
        marketPanel = panel;

        // Close
        panel.querySelector('#market-close').addEventListener('click', closeMarket);

        // Tabs
        var tabs = panel.querySelectorAll('.market-tab');
        var tabIds = ['prices', 'buy', 'sell', 'wallet'];
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function () {
                var target = this.getAttribute('data-tab');
                for (var j = 0; j < tabs.length; j++) {
                    tabs[j].style.color = '#666';
                    tabs[j].style.borderBottom = '2px solid transparent';
                    tabs[j].classList.remove('active');
                }
                this.style.color = '#FF6B00';
                this.style.borderBottom = '2px solid #FF6B00';
                this.classList.add('active');
                for (var k = 0; k < tabIds.length; k++) {
                    var el = panel.querySelector('#market-' + tabIds[k]);
                    if (el) el.style.display = tabIds[k] === target ? '' : 'none';
                }
                if (target === 'prices') renderPricesTab();
                if (target === 'buy') renderBuyTab();
                if (target === 'sell') renderSellTab();
                if (target === 'wallet') renderWalletTab();
            });
        }

        return panel;
    }

    function updateBalanceDisplay() {
        var el = document.getElementById('market-balance');
        if (!el) return;
        var burgers = window.getKrabbenburger ? window.getKrabbenburger() : 0;
        el.textContent = '\uD83C\uDF54 ' + burgers;
    }

    function openMarket() {
        var panel = createMarketPanel();
        panel.style.display = '';
        isOpen = true;
        updateBalanceDisplay();
        renderPricesTab();
    }

    function closeMarket() {
        if (marketPanel) marketPanel.style.display = 'none';
        isOpen = false;
    }

    // --- Preisliste: Was kostet was? ---
    // Seltenheit bestimmt den Preis in Krabbenburger
    var MARKET_PRICES = {
        // Häufige Materialien: billig
        wood:     { buy: 1,  sell: 0, emoji: '🪵',  name: 'Holz' },
        stone:    { buy: 1,  sell: 0, emoji: '🪨',  name: 'Stein' },
        sand:     { buy: 1,  sell: 0, emoji: '🏖️', name: 'Sand' },
        // Verarbeitete Materialien: mittel
        planks:   { buy: 2,  sell: 1, emoji: '🪓',  name: 'Bretter' },
        glass:    { buy: 3,  sell: 1, emoji: '🪟',  name: 'Glas' },
        brick:    { buy: 3,  sell: 1, emoji: '🧱',  name: 'Ziegel' },
        // Natur: mittel
        flower:   { buy: 2,  sell: 1, emoji: '🌸',  name: 'Blume' },
        plant:    { buy: 2,  sell: 1, emoji: '🌿',  name: 'Pflanze' },
        tree:     { buy: 3,  sell: 1, emoji: '🌳',  name: 'Baum' },
        // Wertvolle Materialien: teuer
        fish:     { buy: 3,  sell: 1, emoji: '🐟',  name: 'Fisch' },
        honey:    { buy: 5,  sell: 2, emoji: '🍯',  name: 'Honig' },
        apple:    { buy: 4,  sell: 1, emoji: '🍎',  name: 'Apfel' },
        // Seltene Materialien: sehr teuer
        diamond:  { buy: 15, sell: 5, emoji: '💎',  name: 'Diamant' },
        crystal:  { buy: 10, sell: 3, emoji: '🔮',  name: 'Kristall' },
        gold:     { buy: 12, sell: 4, emoji: '🥇',  name: 'Gold' },
        // Spezial
        shell:    { buy: 0,  sell: 0, emoji: '🐚',  name: 'Muschel' }, // Muscheln werden nicht gehandelt, nur gesammelt
    };

    function renderPricesTab() {
        var container = document.getElementById('market-prices');
        if (!container) return;

        var html = '<div style="font-size:11px;color:#888;margin-bottom:8px;">Preise in Krabbenburger 🍔 — seltener = teurer</div>';
        html += '<table style="width:100%;font-size:11px;border-collapse:collapse;">';
        html += '<tr style="color:#FF6B00;"><th style="text-align:left;padding:4px;">Item</th><th>Kaufen</th><th>Verkaufen</th><th style="text-align:right;">MMX</th></tr>';

        var entries = Object.entries(MARKET_PRICES).filter(function (e) { return e[1].buy > 0 || e[1].sell > 0; });
        entries.sort(function (a, b) { return b[1].buy - a[1].buy; });

        for (var i = 0; i < entries.length; i++) {
            var mat = entries[i][0];
            var p = entries[i][1];
            html += '<tr style="border-bottom:1px solid #222;">' +
                '<td style="padding:3px 4px;">' + p.emoji + ' ' + escHtml(p.name) + '</td>' +
                '<td style="text-align:center;color:#c33;">' + (p.buy > 0 ? p.buy + '\uD83C\uDF54' : '-') + '</td>' +
                '<td style="text-align:center;color:#3AAC59;">' + (p.sell > 0 ? p.sell + '\uD83C\uDF54' : '-') + '</td>' +
                '<td style="text-align:right;color:#FF6B00;font-size:9px;">' + (p.buy * BURGER_TO_MMX).toFixed(3) + '</td>' +
                '</tr>';
        }
        html += '</table>';
        html += '<div style="font-size:9px;color:#555;margin-top:8px;text-align:center;">1 🍔 = ' + BURGER_TO_MMX + ' MMX · mmx.network</div>';

        container.innerHTML = html;
    }

    // --- Buy Tab ---
    function renderBuyTab() {
        var container = document.getElementById('market-buy');
        if (!container) return;
        var burgers = window.getKrabbenburger ? window.getKrabbenburger() : 0;

        var entries = Object.entries(MARKET_PRICES).filter(function (e) { return e[1].buy > 0; });
        entries.sort(function (a, b) { return a[1].buy - b[1].buy; });

        var html = '<div style="font-size:11px;color:#888;margin-bottom:8px;">Kaufe Materialien mit Krabbenburger 🍔</div>';
        for (var i = 0; i < entries.length; i++) {
            var mat = entries[i][0];
            var p = entries[i][1];
            var canBuy = burgers >= p.buy;
            html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #222;">' +
                '<span>' + p.emoji + ' ' + escHtml(p.name) + '</span>' +
                '<button class="market-buy-btn" data-mat="' + mat + '" data-cost="' + p.buy + '"' +
                ' style="background:' + (canBuy ? '#2E7D32' : '#333') + ';color:' + (canBuy ? '#fff' : '#666') + ';border:none;border-radius:4px;padding:3px 8px;font-size:11px;cursor:' + (canBuy ? 'pointer' : 'not-allowed') + ';"' +
                (canBuy ? '' : ' disabled') + '>' + p.buy + '\uD83C\uDF54</button></div>';
        }
        container.innerHTML = html;

        container.querySelectorAll('.market-buy-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var mat = this.getAttribute('data-mat');
                var cost = parseInt(this.getAttribute('data-cost'));
                if (window.spendKrabbenburger && window.spendKrabbenburger(cost)) {
                    // Item zum Inventar hinzufügen (via game.js global)
                    if (window.INSEL_addToInventory) window.INSEL_addToInventory(mat, 1);
                    if (typeof window.showToast === 'function') window.showToast('🏪 Gekauft: ' + (MARKET_PRICES[mat] ? MARKET_PRICES[mat].emoji + ' ' + MARKET_PRICES[mat].name : mat), 2000);
                    updateBalanceDisplay();
                    renderBuyTab(); // Refresh
                }
            });
        });
    }

    // --- Sell Tab ---
    function renderSellTab() {
        var container = document.getElementById('market-sell');
        if (!container) return;

        // Welche Materialien hat der Spieler und was kann er verkaufen?
        var entries = Object.entries(MARKET_PRICES).filter(function (e) { return e[1].sell > 0; });
        var html = '<div style="font-size:11px;color:#888;margin-bottom:8px;">Verkaufe Materialien für Krabbenburger 🍔</div>';
        var hasAny = false;

        for (var i = 0; i < entries.length; i++) {
            var mat = entries[i][0];
            var p = entries[i][1];
            var count = window.INSEL_getInventoryCount ? window.INSEL_getInventoryCount(mat) : 0;
            if (count <= 0) continue;
            hasAny = true;
            html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #222;">' +
                '<span>' + p.emoji + ' ' + escHtml(p.name) + ' (' + count + 'x)</span>' +
                '<button class="market-sell-btn" data-mat="' + mat + '" data-earn="' + p.sell + '"' +
                ' style="background:#C62828;color:#fff;border:none;border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer;">Verkauf +' + p.sell + '\uD83C\uDF54</button></div>';
        }

        // Rare Items (LLM-gecraftet)
        var rareItems = findPlayerRareItems();
        for (var j = 0; j < rareItems.length; j++) {
            hasAny = true;
            html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid #222;">' +
                '<span>' + (rareItems[j].emoji || '✨') + ' ' + escHtml(rareItems[j].name) + ' <span style="color:#FF6B00;font-size:9px;">RARE</span></span>' +
                '<button class="market-sell-rare-btn" data-material="' + escHtml(rareItems[j].id) + '" data-name="' + escHtml(rareItems[j].name) + '"' +
                ' style="background:#8B0000;color:#FFD700;border:none;border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer;">Liste im P2P-Markt</button></div>';
        }

        if (!hasAny) {
            html += '<div style="text-align:center;color:#666;padding:20px;">Kein Material zum Verkaufen. Baue und sammle zuerst!</div>';
        }

        container.innerHTML = html;

        container.querySelectorAll('.market-sell-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var mat = this.getAttribute('data-mat');
                var earn = parseInt(this.getAttribute('data-earn'));
                if (window.INSEL_getInventoryCount && window.INSEL_getInventoryCount(mat) > 0) {
                    if (window.INSEL_removeFromInventory) window.INSEL_removeFromInventory(mat, 1);
                    if (window.addKrabbenburger) window.addKrabbenburger(earn);
                    if (typeof window.showToast === 'function') window.showToast('🏪 Verkauft! +' + earn + '🍔', 2000);
                    updateBalanceDisplay();
                    renderSellTab(); // Refresh
                }
            });
        });

        // Rare Items → P2P Markt (Worker-Backend)
        container.querySelectorAll('.market-sell-rare-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var materialId = this.getAttribute('data-material');
                var name = this.getAttribute('data-name');
                handleListRare(materialId, name);
            });
        });
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

    function handleListRare(materialId, name) {
        var wallet = getWallet();
        var price = prompt('Preis in 🍔 Krabbenburger (z.B. 10):');
        if (!price || isNaN(parseInt(price))) return;
        var priceBurger = parseInt(price);

        apiPost('/market/list', {
            material_id: materialId,
            name: name,
            emoji: '✨',
            price_mmx: priceBurger * BURGER_TO_MMX,
            price_xch: 0,
            price_glut: priceBurger,
            seller_addr: wallet.mmx || wallet.xch || 'anonym',
            seller_mmx: wallet.mmx || '',
            seller_xch: wallet.xch || '',
        }).then(function (res) {
            if (res.ok) {
                if (typeof window.showToast === 'function') window.showToast('✨ Rare Item gelistet für ' + priceBurger + '🍔!');
                renderSellTab();
            } else {
                if (typeof window.showToast === 'function') window.showToast(res.error || 'Fehler beim Listen');
            }
        }).catch(function () {
            if (typeof window.showToast === 'function') window.showToast('Keine Verbindung zum Markt');
        });
    }

    // --- Wallet Tab ---
    function renderWalletTab() {
        var container = document.getElementById('market-wallet');
        if (!container) return;

        var wallet = getWallet();
        var burgers = window.getKrabbenburger ? window.getKrabbenburger() : 0;
        var mmxValue = (burgers * BURGER_TO_MMX).toFixed(4);

        container.innerHTML = [
            '<div style="text-align:center;padding:12px 0;">',
            '  <div style="font-size:24px;">🍔 ' + burgers + '</div>',
            '  <div style="font-size:11px;color:#FF6B00;">≈ ' + mmxValue + ' MMX</div>',
            '  <div style="font-size:9px;color:#666;margin-top:4px;">Verdiene Krabbenburger durch Quests und Entdeckungen!</div>',
            '</div>',
            '<hr style="border:none;border-top:1px solid #333;">',
            '<div style="font-size:11px;color:#888;margin:12px 0 8px;">',
            '  Für Nerds: Wallet-Adressen (optional, für P2P-Handel)',
            '</div>',
            '<label style="font-size:10px;color:#FF6B00;">MMX Adresse</label>',
            '<input id="wallet-mmx" type="text" value="' + escHtml(wallet.mmx || '') + '" placeholder="mmx1..." style="width:100%;background:#0f0f1a;color:#e0e0e0;border:1px solid #333;border-radius:4px;padding:6px;font-size:11px;font-family:monospace;margin:4px 0 12px;box-sizing:border-box;">',
            '<label style="font-size:10px;color:#3AAC59;">XCH Adresse</label>',
            '<input id="wallet-xch" type="text" value="' + escHtml(wallet.xch || '') + '" placeholder="xch1..." style="width:100%;background:#0f0f1a;color:#e0e0e0;border:1px solid #333;border-radius:4px;padding:6px;font-size:11px;font-family:monospace;margin:4px 0 12px;box-sizing:border-box;">',
            '<button id="wallet-save" style="width:100%;background:#FF6B00;color:#fff;border:none;border-radius:6px;padding:8px;font-size:12px;cursor:pointer;">Speichern</button>',
            '<div style="margin-top:12px;padding:10px;background:#0f0f1a;border:1px solid #222;border-radius:6px;font-size:9px;color:#555;">',
            '  <b style="color:#888;">Deflation\u00e4re Arbeitswerttheorie</b><br>',
            '  Jeder Krabbenburger der hier flie\u00dft, wird zu Arbeit. Jede Arbeit strahlt<br>',
            '  als Code, als Quest, als Insel zur\u00fcck in die Welt. Das Schwarze Loch<br>',
            '  frisst Tokens und strahlt Hawking-Strahlung: Kinderlachen.',
            '</div>',
        ].join('\n');

        container.querySelector('#wallet-save').addEventListener('click', function () {
            var mmx = container.querySelector('#wallet-mmx').value.trim();
            var xch = container.querySelector('#wallet-xch').value.trim();

            if (mmx && !mmx.startsWith('mmx1')) {
                if (typeof window.showToast === 'function') window.showToast('MMX-Adresse muss mit mmx1 beginnen');
                return;
            }
            if (xch && !xch.startsWith('xch1')) {
                if (typeof window.showToast === 'function') window.showToast('XCH-Adresse muss mit xch1 beginnen');
                return;
            }

            setWallet({ mmx: mmx, xch: xch });
            if (typeof window.showToast === 'function') window.showToast('Wallet gespeichert');
        });
    }

    // --- HTML Escaping ---
    function escHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str || ''));
        return div.innerHTML;
    }

    // --- NPC Rare Shop (Mephisto) — Legacy Compat ---
    var MEPHISTO_DEALS = [
        { id: 'schatten_kristall', name: 'Schatten-Kristall', emoji: '🔮', desc: 'Leuchtet nur bei Nacht.', price_glut: 5, price_mmx: 0.005 },
        { id: 'seelen_laterne', name: 'Seelen-Laterne', emoji: '🏮', desc: 'Zeigt den Weg den man nicht gehen sollte.', price_glut: 8, price_mmx: 0.008 },
        { id: 'mitternachts_rose', name: 'Mitternachts-Rose', emoji: '🥀', desc: 'Bl\u00fcht nur zwischen 23:00 und 01:00.', price_glut: 12, price_mmx: 0.012 },
        { id: 'pakt_siegel', name: 'Pakt-Siegel', emoji: '📜', desc: 'Unterschreibe nicht. Oder doch.', price_glut: 20, price_mmx: 0.02 },
        { id: 'hawking_stern', name: 'Hawking-Stern', emoji: '⭐', desc: 'Strahlt Information.', price_glut: 50, price_mmx: 0.05 },
    ];

    function getMephistoDeals() { return MEPHISTO_DEALS; }

    // --- Exports ---
    var marketplace = {
        open: openMarket,
        close: closeMarket,
        isOpen: function () { return isOpen; },
        getWallet: getWallet,
        setWallet: setWallet,
        isRareItem: isRareItem,
        getMephistoDeals: getMephistoDeals,
        MEPHISTO_DEALS: MEPHISTO_DEALS,
        MARKET_PRICES: MARKET_PRICES,
    };

    if (window.INSEL) {
        window.INSEL.register('marketplace', marketplace);
    }
    window.INSEL_MARKETPLACE = marketplace;
})();
