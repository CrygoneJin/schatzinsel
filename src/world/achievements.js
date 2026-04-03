// === ACHIEVEMENTS — Progressiv schwerer, offen nach oben ===
// Exportiert als window.INSEL_ACHIEVEMENTS (Vanilla JS, kein Build-Tool)
//
// Design:
//   - 5 Kategorien mit festen Meilensteinen (Stufe 1-4)
//   - Danach: dynamische Achievements die sich selbst generieren
//   - Fibonacci-ähnliche Progression: 1, 3, 10, 25, 50, 100, 250, ...
//   - Kein Cap. Unendliche Materialien = unendliche Achievements.
//
// Stats aus getGridStats():
//   playerPlaced, questsDone, blueprintsDone, recipesFound,
//   uniqueMats, percent, total

(function () {
    'use strict';

    // Feste Meilensteine (die ersten 20 — handgeschrieben, mit Charakter)
    var FIXED = {

        // 🔨 BAUEN
        bau1: { emoji: '🔨', title: 'Grundstein',      desc: 'Deinen allerersten Block gebaut!',                    check: function (s) { return s.playerPlaced >= 1; } },
        bau2: { emoji: '🛖', title: 'Huettenbauer',     desc: '25 Bloecke gebaut — das wird was!',                  check: function (s) { return s.playerPlaced >= 25; } },
        bau3: { emoji: '🏗️', title: 'Architekt',        desc: '100 Bloecke! Eine richtige Siedlung!',               check: function (s) { return s.playerPlaced >= 100; } },
        bau4: { emoji: '🏰', title: 'Burgherr',          desc: '500 Bloecke — deine Insel ist legendaer!',          check: function (s) { return s.playerPlaced >= 500; } },

        // ⚗️ CRAFTEN
        mix1: { emoji: '⚗️', title: 'Erster Mix',       desc: 'Dein erstes Rezept entdeckt!',                       check: function (s) { return s.recipesFound >= 1; } },
        mix2: { emoji: '🧪', title: 'Tueftler',          desc: '5 Rezepte — du experimentierst gerne!',             check: function (s) { return s.recipesFound >= 5; } },
        mix3: { emoji: '🔮', title: 'Alchemist',          desc: '15 Rezepte! Du kennst die Geheimnisse!',           check: function (s) { return s.recipesFound >= 15; } },
        mix4: { emoji: '🌟', title: 'Meister-Mixer',     desc: '30 Rezepte — nichts ist dir fremd!',                check: function (s) { return s.recipesFound >= 30; } },

        // 📜 QUESTS
        quest1: { emoji: '📜', title: 'Guter Freund',    desc: 'Deine erste Quest geschafft!',                      check: function (s) { return s.questsDone >= 1; } },
        quest2: { emoji: '🤝', title: 'Helfer',           desc: '3 Quests — die Bewohner moegen dich!',             check: function (s) { return s.questsDone >= 3; } },
        quest3: { emoji: '🦸', title: 'Insel-Held',       desc: '10 Quests! Alle kennen deinen Namen!',             check: function (s) { return s.questsDone >= 10; } },
        quest4: { emoji: '👑', title: 'Legende',           desc: '25 Quests — du bist die Legende der Insel!',      check: function (s) { return s.questsDone >= 25; } },

        // 📐 BAUPLÄNE
        plan1: { emoji: '📐', title: 'Bauplan-Finder',   desc: 'Deinen ersten Bauplan gebaut!',                     check: function (s) { return s.blueprintsDone >= 1; } },
        plan2: { emoji: '🏠', title: 'Haeuslebauer',      desc: '3 Gebaeude — ein kleines Dorf!',                   check: function (s) { return s.blueprintsDone >= 3; } },
        plan3: { emoji: '🏘️', title: 'Stadtplaner',      desc: '5 Gebaeude stehen — eine Siedlung!',               check: function (s) { return s.blueprintsDone >= 5; } },
        plan4: { emoji: '🏙️', title: 'Grossstadt',        desc: 'Alle 8 Bauplaene gebaut — Insel komplett!',       check: function (s) { return s.blueprintsDone >= 8; } },

        // 🧭 ENTDECKEN
        mat1: { emoji: '🧭', title: 'Neugierig',         desc: '5 verschiedene Materialien benutzt!',               check: function (s) { return s.uniqueMats >= 5; } },
        mat2: { emoji: '🗺️', title: 'Entdecker',         desc: '15 verschiedene Materialien — bunt!',              check: function (s) { return s.uniqueMats >= 15; } },
        mat3: { emoji: '🌈', title: 'Sammler',            desc: '30 verschiedene Materialien entdeckt!',            check: function (s) { return s.uniqueMats >= 30; } },
        mat4: { emoji: '🐋', title: 'Orca-Grossmutter',   desc: '50 Materialien — Weisheit der Tiefe!',            check: function (s) { return s.uniqueMats >= 50; } },
    };

    // Dynamische Achievements: generieren sich selbst bei wachsenden Zahlen
    // Schwelle-Folge: 100, 250, 500, 1000, 2500, 5000, 10000, ...
    // Für jede Kategorie ab Stufe 5+
    var DYN_CATEGORIES = [
        { key: 'bau',  stat: 'playerPlaced', emoji: '⭐', titleFn: function (n) { return n + ' Bloecke!'; },     descFn: function (n) { return n + ' Bloecke gebaut — unglaublich!'; } },
        { key: 'mix',  stat: 'recipesFound', emoji: '💫', titleFn: function (n) { return n + ' Rezepte!'; },     descFn: function (n) { return n + ' Rezepte entdeckt — Infinite Craft!'; } },
        { key: 'mat',  stat: 'uniqueMats',   emoji: '🌌', titleFn: function (n) { return n + ' Materialien!'; }, descFn: function (n) { return n + ' verschiedene Materialien — kein Ende in Sicht!'; } },
    ];

    // Fibonacci-artige Schwellen ab dem festen Cap: 100, 250, 500, 1k, 2.5k, 5k, 10k, ...
    function dynamicThresholds(start) {
        var t = [];
        var v = start;
        for (var i = 0; i < 20; i++) {
            t.push(v);
            v = (i % 2 === 0) ? Math.round(v * 2.5) : Math.round(v * 2);
        }
        return t;
    }

    var DYN_THRESHOLDS = {
        playerPlaced: dynamicThresholds(1000),
        recipesFound: dynamicThresholds(50),
        uniqueMats:   dynamicThresholds(100),
    };

    // Alle Achievements zusammenbauen (fest + dynamisch)
    /** @type {Record<string, {emoji: string, title: string, desc: string, check: function(Object): boolean}>} */
    var all = {};
    var id;
    for (id in FIXED) { all[id] = FIXED[id]; }

    DYN_CATEGORIES.forEach(function (cat) {
        var thresholds = DYN_THRESHOLDS[cat.stat];
        if (!thresholds) return;
        thresholds.forEach(function (threshold, i) {
            var dynId = cat.key + '_dyn_' + threshold;
            all[dynId] = {
                emoji: cat.emoji,
                title: cat.titleFn(threshold),
                desc: cat.descFn(threshold),
                check: (function (s, t) { return function (stats) { return stats[s] >= t; }; })(cat.stat, threshold),
            };
        });
    });

    window.INSEL_ACHIEVEMENTS = all;
})();
