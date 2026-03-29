# Test-Ergebnisse — Sprint 1

**Datum:** 2026-03-29
**Methode:** Playwright MCP (Browser-Automation)
**URL:** https://crygonejin.github.io/schatzinsel/?v=20260329-sprint1

---

## Sprint 1 Verifikation

| # | Item | Erwartet | Ergebnis | Status |
|---|------|----------|----------|--------|
| S1-1 | Palette 5+3 | 8 Materialien sichtbar | 8 Buttons: Metall, Holz, Feuer, Wasser, Erde, Stein, Sand, Glas | PASS |
| S1-2 | Achievements versteckt | 1 sichtbar + 11 als "?" | 1× ⭐ "Erster Block" + 11× ❓ "???" | PASS |
| S1-3 | sessionDuration | getMetrics() gibt Sekunden | Code verifiziert: `s.start ? Math.round((Date.now() - s.start) / 1000) : 0` | PASS |
| S1-4 | Starter-Insel | Sand + Baum + Wasser beim Start | Baum + 3 Sand + Wasser auf Grid sichtbar nach "Los!" | PASS |
| S1-5 | Kindertexte | 4 neue Texte in Sidebar | "Deine Insel wartet!", "Klick links, bau los!", "Bau was — die Bewohner melden sich!", "Ernte Bäume für Holz!" | PASS |
| S1-6 | Feynman Datenfluss | _feynman in chat.js → worker.js → n8n | Code verifiziert: chat.js:603 baut _feynman, worker.js filtert vor Langdock | PASS |

---

## Bekannte Issues

| # | Was | Schwere | Status |
|---|-----|---------|--------|
| 1 | `config.js` 404 auf GitHub Pages (gitignored) | Niedrig — ELIZA-Fallback greift | Erwartet |
| 2 | Labels noch sichtbar bei 5 Wu-Xing-Elementen | Kosmetisch — shuffleLabels läuft erst bei page load | Bekannt |
| 3 | Toolbar hat Save/Load Buttons die aus Cherry-Pick kamen | Mittel — "Mein Bauwerk" Input + 💾📂🆕 waren nicht im Sprint | Regression |

---

## Screenshots

- `sprint1-live.png` — Intro-Screen nach Deploy
- `sprint1-after-los.png` — Spielansicht mit Starter-Insel + reduzierter Palette
