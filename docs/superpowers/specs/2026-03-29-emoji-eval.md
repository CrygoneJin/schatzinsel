# Emoji-Eval — Craft-Qualität messen

> Feynman: "Aus 1 mach 3 mach 5 mach 10.000"

## Prinzip

Das Crafting-Universum wächst exponentiell. Jedes neue Material kann mit jedem anderen kombiniert werden. Die Eval baut sich selbst:

```
Runde 0:  5 Basis-Elemente (metal, wood, fire, water, earth)
Runde 1:  10 Paare → ~8 neue Materialien (2 Duplikate mit festen Rezepten)
Runde 2:  8×8 = 64 Paare → ~40 neue
Runde 3:  40×40 = 1.600 Paare → ~500 neue
Runde 4:  500×500 = 250.000 Paare → Universum
```

## Eval-Skript (eval-craft.js)

Automatisch Paare generieren, `/craft` aufrufen, Ergebnis bewerten:

```javascript
// Seed: 5 Wu Xing Elemente
let materials = ['metal', 'wood', 'fire', 'water', 'earth'];
const results = [];
const ENDPOINT = 'https://schatzinsel.hoffmeyer-zlotnik.workers.dev/craft';

for (let round = 0; round < 3; round++) {
    const newMaterials = [];
    for (let i = 0; i < materials.length; i++) {
        for (let j = i + 1; j < materials.length; j++) {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a: materials[i], b: materials[j], discoverer: 'Feynman-Eval' }),
            });
            const craft = await res.json();
            if (!craft.error) {
                results.push({ round, a: materials[i], b: materials[j], ...craft });
                if (!materials.includes(craft.name.toLowerCase())) {
                    newMaterials.push(craft.name.toLowerCase());
                }
            }
        }
    }
    materials = [...new Set([...materials, ...newMaterials])];
}
```

## Bewertungskriterien (automatisierbar)

| # | Kriterium | Test | Pass | Fail |
|---|-----------|------|------|------|
| 1 | Einzelnes Emoji | `[...emoji].length === 1` | 1 Codepoint | 2+ Codepoints |
| 2 | Nicht Zutat-Emoji | `emoji !== MATERIALS[a].emoji && emoji !== MATERIALS[b].emoji` | Anders | Identisch |
| 3 | Name max 12 Zeichen | `name.length <= 12` | ≤12 | >12 |
| 4 | Name ist 1 Wort | `!name.includes(' ')` | Kein Leerzeichen | Leerzeichen |
| 5 | Gültiger Hex-Color | `/^#[0-9A-Fa-f]{6}$/.test(color)` | Gültig | Ungültig |
| 6 | Deterministisch | Gleiches Paar → gleiches Ergebnis (KV-Cache) | Konsistent | Inkonsistent |

## Metriken

- **Pass-Rate** pro Kriterium (Ziel: >90%)
- **Emoji-Diversität**: Wie viele einzigartige Emojis in N Ergebnissen? (Ziel: >60% unique)
- **Name-Diversität**: Wie viele einzigartige Namen? (Ziel: >80% unique)
- **Runden-Tiefe**: Wie viele Runden bis Ergebnisse generisch werden? ("Ding", "Sache")

## Kosten-Schätzung

| Runde | Paare | Kosten (~0.001€/Call) |
|-------|-------|---------------------|
| 1 | 10 | 0.01€ |
| 2 | ~64 | 0.06€ |
| 3 | ~1.600 | 1.60€ |
| 4 | ~250.000 | 250€ ← STOP |

**Empfehlung:** Runde 1-3 laufen lassen (~1.67€). Runde 4 nur mit Budget-Freigabe.

## Falsifizierbarkeits-Check

- Wenn Pass-Rate < 80% bei Kriterium 1 (einzelnes Emoji) → Prompt braucht Emoji-Liste
- Wenn Name-Diversität < 50% → Prompt produziert zu generische Namen → Temperature erhöhen
- Wenn Runde 3 nur noch "Ding" und "Sache" produziert → LLM verliert Kreativität bei abstrakten Paaren → Prompt braucht mehr Kontext
