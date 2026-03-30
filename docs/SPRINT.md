# Sprint 8 — "Dampf, Performance, Aufräumen"

**Sprint Goal:** CPU von 20% auf <5%. Module-Fallbacks raus. Oscar-Delta maximieren.

**Start:** 2026-03-30
**Ende:** 2026-03-30 (Speed-Sprint, 1h Wallclock)

---

## Sprint Backlog

| # | Item | Owner | Status |
|---|------|-------|--------|
| S8-1 | **CPU Performance** — rAF durch dirty-flag ersetzen, draw() nur bei Änderung, setInterval statt rAF-Loop | Engineer | 🔄 In progress |
| S8-2 | **Module-Fallbacks raus** — MATERIALS/ACHIEVEMENTS/QUESTS/RECIPES Fallback-Kopien in game.js löschen | Engineer | 🔄 In progress |
| S8-3 | **10-Sekunden-Erster-Moment** — Intro kürzen, sofort bauen nach 1 Klick | Designer | 🔄 In progress |

---

## Standup Log

### 2026-03-30 (Sprint 7 Retro — 30 Sekunden)
- Remote Agent hat Sprint 6+7 autonom abgeschlossen. Gut.
- Kein Limit-Monitoring. Schlecht. Feynman: "Was du nicht misst, existiert nicht."
- Lektion: Token-Verbrauch tracken, nach jedem Sprint prüfen ob noch einer reinpasst.
- Aktion: Feynman baut Token-Counter. Owner: Feynman. Deadline: Sprint 9.

### 2026-03-30 (Sprint 8 Planning)
- PO-Ansage: "Dampf! 1h Wallclock. Gas geben."
- 3 Items, alle parallel, alle performance-kritisch.
- S8-1 ist der größte Impact (CPU 20%→<5%).
- S8-2 entfernt ~500 Zeilen toter Code.
- S8-3 ist sichtbar für Oscar.
