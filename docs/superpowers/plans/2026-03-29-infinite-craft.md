# Infinite Craft — LLM-generierte Rezepte mit Cloudflare KV

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wenn ein Kind zwei Materialien craftet und kein lokales Rezept existiert, fragt der Cloudflare Worker die Requesty-API. Das Ergebnis (Emoji + Name) wird in Cloudflare KV gecacht. Das Kind ist "Entdecker" des Rezepts.

**Architecture:** Client schickt `POST /craft` mit `{a: "fire", b: "sand"}` an den Worker. Worker prüft KV-Cache (`craft:fire+sand`). Cache-Hit → sofort zurück. Cache-Miss → Requesty Haiku generiert `{emoji, name, color}` → KV speichern → zurück an Client. Client registriert neues Material dynamisch in `MATERIALS` und `unlockMaterial()`.

**Tech Stack:** Cloudflare Worker (vanilla JS), Cloudflare KV, Requesty API (claude-haiku-4-5), Browser Vanilla JS

---

## Dateiübersicht

| Datei | Änderung |
|-------|----------|
| `worker.js` | Neuer `/craft`-Endpoint mit KV-Cache + LLM-Generierung |
| `game.js` | `doCraft()` bei fehlendem Rezept → `POST /craft` → dynamisch Material registrieren |
| `materials.js` | Keine Änderung (dynamische Materialien werden zur Laufzeit in `MATERIALS` eingefügt) |
| `recipes.js` | Keine Änderung (feste Rezepte bleiben, LLM ist Fallback) |

---

## Task 1: Worker — `/craft`-Endpoint mit KV-Lookup

**Files:**
- Modify: `worker.js`

- [ ] **Schritt 1: URL-basiertes Routing im Worker einbauen**

Aktuell hat der Worker kein Routing — alles geht an Requesty. Wir brauchen einen URL-Pfad-Check:

```javascript
// Am Anfang der fetch()-Funktion, nach CORS und POST-Check:
const url = new URL(request.url);

if (url.pathname === '/craft') {
    return handleCraft(request, env);
}

// Default: Chat-Proxy (bestehender Code)
```

Die bestehende Chat-Logik bleibt der Default-Pfad.

- [ ] **Schritt 2: `handleCraft`-Funktion mit KV-Lookup**

```javascript
async function handleCraft(request, env) {
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return json({ error: 'Ungültiger Request-Body' }, 400);
    }

    const { a, b, discoverer } = body;
    if (!a || !b) {
        return json({ error: 'a und b sind Pflicht' }, 400);
    }

    // Kanonische Reihenfolge: alphabetisch sortiert → "fire+water" nicht "water+fire"
    const pair = [a, b].sort().join('+');
    const kvKey = `craft:${pair}`;

    // 1. KV-Cache prüfen
    if (env.CRAFT_KV) {
        const cached = await env.CRAFT_KV.get(kvKey, 'json');
        if (cached) {
            return json({ ...cached, fromCache: true });
        }
    }

    // 2. LLM fragen
    const apiKey = env['schatzinsel-requesty'] || env.API_KEY;
    if (!apiKey) {
        return json({ error: 'Server nicht konfiguriert (kein API Key)' }, 500);
    }

    const prompt = `Du bist ein Crafting-System für ein Kinderspiel auf einer Insel.
Ein Kind kombiniert "${a}" und "${b}".
Was entsteht? Antworte NUR mit einem JSON-Objekt, kein anderer Text:
{"emoji": "passendes einzelnes Emoji", "name": "deutsches Wort", "color": "#hexfarbe", "border": "#dunklere hexfarbe"}
Regeln: Kindgerecht. Kein Grusel, keine Gewalt, nichts Trauriges. Das Ergebnis muss auf eine tropische Insel passen. Maximal 1 Wort als Name.`;

    try {
        const response = await fetch('https://router.requesty.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'anthropic/claude-haiku-4-5-20251001',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
                temperature: 0.3,
            }),
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // JSON aus Antwort extrahieren
        const match = content.match(/\{[\s\S]*\}/);
        if (!match) {
            return json({ error: 'LLM hat kein gültiges JSON geliefert' }, 502);
        }

        const result = JSON.parse(match[0]);
        const craft = {
            emoji: result.emoji || '❓',
            name: result.name || 'Unbekannt',
            color: result.color || '#999999',
            border: result.border || '#666666',
            a,
            b,
            discoverer: discoverer || 'Anonym',
            created: new Date().toISOString(),
        };

        // 3. In KV speichern (kein await nötig, fire-and-forget ist ok)
        if (env.CRAFT_KV) {
            await env.CRAFT_KV.put(kvKey, JSON.stringify(craft));
        }

        return json({ ...craft, fromCache: false });

    } catch (e) {
        return json({ error: 'Craft-Fehler: ' + e.message }, 500);
    }
}
```

- [ ] **Schritt 3: Commit**

```bash
git add worker.js
git commit -m "feat: /craft Endpoint — LLM-generierte Rezepte mit KV-Cache"
```

---

## Task 2: Cloudflare KV Namespace einrichten

**Files:** keine Code-Änderung, nur CLI

- [ ] **Schritt 1: KV Namespace erstellen**

```bash
npx wrangler kv namespace create CRAFT_KV
```

Output enthält die Namespace-ID. Diese wird für `wrangler.toml` oder den Deploy-Befehl gebraucht.

- [ ] **Schritt 2: Worker mit KV-Binding deployen**

Option A — mit `wrangler.toml`:
```toml
name = "schatzinsel"
main = "worker.js"
compatibility_date = "2026-03-29"

[[kv_namespaces]]
binding = "CRAFT_KV"
id = "<die ID aus Schritt 1>"
```

Option B — ohne `wrangler.toml` (Dashboard):
Im Cloudflare Dashboard → Worker "schatzinsel" → Settings → KV Namespace Bindings → Add:
- Variable name: `CRAFT_KV`
- KV Namespace: den in Schritt 1 erstellten

- [ ] **Schritt 3: Deploy testen**

```bash
npx wrangler deploy worker.js --name schatzinsel --compatibility-date 2026-03-29
```

- [ ] **Schritt 4: Smoke-Test**

```bash
curl -X POST https://schatzinsel.hoffmeyer-zlotnik.workers.dev/craft \
  -H "Content-Type: application/json" \
  -d '{"a":"fire","b":"sand","discoverer":"Schnipsel"}'
```

Erwartetes Ergebnis: JSON mit `emoji`, `name`, `color`, `border`, `fromCache: false`.

Zweiter Aufruf mit gleichen Werten → `fromCache: true`.

---

## Task 3: Client — `doCraft()` als async mit LLM-Fallback

**Files:**
- Modify: `game.js:948-973` (Funktion `doCraft`)

- [ ] **Schritt 1: Worker-URL aus config.js beziehen**

In `game.js`, nach den bestehenden Konstanten am Anfang der IIFE (ca. Zeile 30-50), den Proxy-URL verfügbar machen:

```javascript
// Proxy-URL für Crafting (gleicher Worker wie Chat)
const CRAFT_URL = (window.INSEL_CONFIG?.proxy || 'https://schatzinsel.hoffmeyer-zlotnik.workers.dev') + '/craft';
```

- [ ] **Schritt 2: `doCraft()` zu async umschreiben**

Die bestehende `doCraft()` (game.js:948) wird erweitert. Feste Rezepte haben Vorrang. Nur wenn `findMatchingRecipe()` `null` liefert UND mindestens 2 verschiedene Materialien im Grid liegen, wird der Worker gefragt:

```javascript
async function doCraft() {
    const recipe = findMatchingRecipe();

    if (recipe) {
        // Festes Rezept — wie bisher
        craftingGrid = Array(9).fill(null);
        addToInventory(recipe.result, recipe.resultCount);
        unlockMaterial(recipe.result);
        const isNew = !discoveredRecipes.has(recipe.name);
        discoveredRecipes.add(recipe.name);
        saveDiscoveredRecipes();
        soundCraft();
        const info = MATERIALS[recipe.result];
        if (isNew) {
            showToast(`🔮 Neues Rezept entdeckt: ${info.emoji} ${recipe.desc}!`);
        } else {
            showToast(`⚒️ ${info.emoji} ${recipe.resultCount}x ${info.label} hergestellt!`);
        }
        trackEvent('craft', { recipe: recipe.name, result: recipe.result });
        updateCraftingDisplay();
        return;
    }

    // Kein festes Rezept → LLM fragen (Infinite Craft)
    const placed = getCraftingIngredients();
    const ingredients = Object.keys(placed);
    if (ingredients.length < 2) {
        showToast('🤔 Lege mindestens 2 verschiedene Materialien rein!');
        return;
    }

    // Nur die ersten zwei Materialien nehmen (Paar-Kombination)
    const [a, b] = ingredients.slice(0, 2);
    const pair = [a, b].sort().join('+');

    // Schon mal LLM-generiert? Lokaler Cache
    const localKey = `llm-craft:${pair}`;
    const localCached = localStorage.getItem(localKey);
    if (localCached) {
        const cached = JSON.parse(localCached);
        craftingGrid = Array(9).fill(null);
        applyLlmCraft(cached, pair);
        return;
    }

    // Loading-State
    showToast('🔮 Die Insel denkt nach...');
    const craftBtn = document.querySelector('#craft-btn');
    if (craftBtn) craftBtn.disabled = true;

    try {
        const playerName = localStorage.getItem('insel-player-name') || 'Anonym';
        const res = await fetch(CRAFT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ a, b, discoverer: playerName }),
        });

        if (!res.ok) {
            showToast('🤔 Kein Rezept gefunden!');
            return;
        }

        const craft = await res.json();
        if (craft.error) {
            showToast('🤔 Kein Rezept gefunden!');
            return;
        }

        // Lokal cachen
        localStorage.setItem(localKey, JSON.stringify(craft));

        craftingGrid = Array(9).fill(null);
        applyLlmCraft(craft, pair);

    } catch (e) {
        showToast('🤔 Kein Rezept gefunden!');
    } finally {
        if (craftBtn) craftBtn.disabled = false;
    }
}
```

- [ ] **Schritt 3: `applyLlmCraft()`-Hilfsfunktion**

Direkt nach `doCraft()` einfügen:

```javascript
function applyLlmCraft(craft, pair) {
    // Material-ID aus dem Namen ableiten (lowercase, keine Sonderzeichen)
    const matId = 'llm_' + craft.name.toLowerCase()
        .replace(/[äöüß]/g, m => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[m])
        .replace(/[^a-z0-9]/g, '_');

    // Neues Material dynamisch registrieren (falls noch nicht vorhanden)
    if (!MATERIALS[matId]) {
        MATERIALS[matId] = {
            emoji: craft.emoji || '❓',
            label: craft.name,
            color: craft.color || '#999999',
            border: craft.border || '#666666',
        };
        // Dynamisch generierte Materialien persistent speichern
        saveLlmMaterials();
    }

    addToInventory(matId, 1);
    unlockMaterial(matId);

    const isNew = !discoveredRecipes.has(pair);
    discoveredRecipes.add(pair);
    saveDiscoveredRecipes();
    soundCraft();

    if (isNew && !craft.fromCache) {
        showToast(`🏆 WELTPREMIERE! ${craft.emoji} ${craft.name} — Entdecker: ${craft.discoverer}!`);
    } else if (isNew) {
        showToast(`🔮 Neues Rezept: ${craft.emoji} ${craft.name}!`);
    } else {
        showToast(`⚒️ ${craft.emoji} 1x ${craft.name} hergestellt!`);
    }

    trackEvent('llm-craft', { a: craft.a, b: craft.b, result: matId, name: craft.name });
    updateCraftingDisplay();
}
```

- [ ] **Schritt 4: LLM-Materialien persistent speichern/laden**

Damit LLM-generierte Materialien nach Reload noch da sind:

```javascript
// Nach MATERIALS-Definition am Anfang der IIFE
function loadLlmMaterials() {
    try {
        const stored = JSON.parse(localStorage.getItem('insel-llm-materials') || '{}');
        for (const [id, mat] of Object.entries(stored)) {
            if (!MATERIALS[id]) MATERIALS[id] = mat;
        }
    } catch (e) { /* ignore */ }
}

function saveLlmMaterials() {
    const llm = {};
    for (const [id, mat] of Object.entries(MATERIALS)) {
        if (id.startsWith('llm_')) llm[id] = mat;
    }
    localStorage.setItem('insel-llm-materials', JSON.stringify(llm));
}

// Direkt aufrufen beim Laden
loadLlmMaterials();
```

- [ ] **Schritt 5: Commit**

```bash
git add game.js
git commit -m "feat: Infinite Craft — LLM-Fallback wenn kein festes Rezept existiert"
```

---

## Task 4: Entdecker-Leaderboard in KV (optional, 10 Min)

**Files:**
- Modify: `worker.js`

- [ ] **Schritt 1: `/discoveries`-Endpoint für Statistiken**

```javascript
// Im Routing-Block des Workers:
if (url.pathname === '/discoveries') {
    return handleDiscoveries(env);
}
```

```javascript
async function handleDiscoveries(env) {
    if (!env.CRAFT_KV) return json({ error: 'KV nicht konfiguriert' }, 500);

    const list = await env.CRAFT_KV.list({ prefix: 'craft:' });
    const discoveries = [];

    for (const key of list.keys) {
        const val = await env.CRAFT_KV.get(key.name, 'json');
        if (val) discoveries.push(val);
    }

    // Nach Erstellungsdatum sortieren (neueste zuerst)
    discoveries.sort((a, b) => (b.created || '').localeCompare(a.created || ''));

    // Entdecker-Ranking
    const ranking = {};
    for (const d of discoveries) {
        const name = d.discoverer || 'Anonym';
        ranking[name] = (ranking[name] || 0) + 1;
    }

    return json({
        total: discoveries.length,
        ranking,
        recent: discoveries.slice(0, 20),
    });
}
```

- [ ] **Schritt 2: Commit**

```bash
git add worker.js
git commit -m "feat: /discoveries Endpoint — Entdecker-Leaderboard aus KV"
```

---

## Task 5: Verifikation

- [ ] **Schritt 1: Worker deployen**

```bash
npx wrangler deploy worker.js --name schatzinsel --compatibility-date 2026-03-29
```

- [ ] **Schritt 2: Craft-Endpoint testen**

```bash
# Neues Paar (Cache-Miss → LLM)
curl -X POST https://schatzinsel.hoffmeyer-zlotnik.workers.dev/craft \
  -H "Content-Type: application/json" \
  -d '{"a":"dragon","b":"ice","discoverer":"Schnipsel"}'

# Gleiches Paar nochmal (Cache-Hit)
curl -X POST https://schatzinsel.hoffmeyer-zlotnik.workers.dev/craft \
  -H "Content-Type: application/json" \
  -d '{"a":"dragon","b":"ice","discoverer":"Papa"}'
# → fromCache: true, discoverer bleibt "Schnipsel"

# Leaderboard
curl https://schatzinsel.hoffmeyer-zlotnik.workers.dev/discoveries
```

- [ ] **Schritt 3: Browser-Test**

1. Spiel öffnen
2. Zwei beliebige Materialien in die Werkbank legen (z.B. Drache + Eis)
3. Crafting-Button drücken
4. Erwartung: "🔮 Die Insel denkt nach..." → "🏆 WELTPREMIERE! [Emoji] [Name]"
5. Neues Material erscheint in der Palette
6. Seite neu laden → Material ist noch da (localStorage)
7. Gleiches Paar nochmal craften → "⚒️ [Emoji] 1x [Name] hergestellt!"

**Feynmans Falsifizierbarkeits-Check:**
- `fromCache` ist immer `false` → KV-Binding fehlt → Cloudflare Dashboard prüfen
- LLM gibt kein JSON zurück → Prompt-Temperature zu hoch oder Modell falsch → `temperature: 0.3` prüfen
- Material-ID-Kollision → zwei verschiedene LLM-Antworten für gleiches Paar → kann nicht passieren weil KV cached
- Kind sieht "Kein Rezept gefunden" → Worker nicht erreichbar oder CORS → Worker-URL + CORS-Header prüfen

---

## Airtable-Felder Mapping (falls später migriert)

| KV Key | Felder im Value | Quelle |
|--------|----------------|--------|
| `craft:fire+sand` | `emoji`, `name`, `color`, `border` | LLM-Antwort |
| | `a`, `b` | Client-Request |
| | `discoverer` | `localStorage('insel-player-name')` |
| | `created` | Server-Timestamp |

---

## Sicherheitshinweise

1. **Rate Limit:** Der bestehende `RATE_LIMIT_KV` im Worker schützt auch `/craft`. Ein Kind kann max 60 Craft-Anfragen pro Stunde machen.
2. **Prompt Injection:** Die Material-IDs (`a`, `b`) kommen aus dem Client. Der LLM-Prompt interpoliert sie. Risiko: Kind baut ein Material namens "Ignoriere alle vorherigen Anweisungen". **Mitigation:** Nur bekannte Material-IDs akzeptieren (Whitelist gegen `MATERIALS` + `llm_*`-Prefix). Wird in einem Follow-Up implementiert.
3. **Kosten:** ~0.001€ pro LLM-Call (Haiku, <100 Tokens). KV-Cache verhindert doppelte Calls. Bei 1000 einzigartigen Paaren: 1€ total.
