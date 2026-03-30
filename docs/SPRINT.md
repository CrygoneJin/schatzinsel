# Sprint 16 — "Reibungslos"

**Sprint Goal:** Kein Overlay, kein Rätsel — Oscar spielt sofort und ungestört.

**Start:** 2026-03-30
**Ende:** 2026-03-30

---

## Sprint Backlog

| # | Item | Owner | Status |
|---|------|-------|--------|
| S16-1 | **Chat als Sidebar** — Chat-Panel slide-in von rechts, überlappt Canvas nicht. (#28) | Designer | ✅ Done |
| S16-2 | **Block-KLONK** — Spezial-Sound beim allerersten platzierten Block. Ergänzt den Palette-KLONK. (#63) | Engineer | ✅ Done |
| S16-3 | **NPC-Emoji fix** — Alle NPCs eindeutig prüfen, kein Doppler. (#29) | Artist | ✅ Done |

---

## Standup Log

### 2026-03-30 (Sprint 16 Planning — nach Sprint 15 Review/Retro)
- S16-1: Chat-Panel als Sidebar — transform statt display:none, slide-in 0.25s
- S16-2: soundFirstBlock() — 3 Oszillatoren (triangle 180→80Hz, square 540→270Hz), nur bei Block #1
- S16-3: Tommy-Emoji war 🦀 in index.html, jetzt 🦞 (war in chat.js schon korrekt)

### 2026-03-30 (Sprint 16 Done)
Alle 3 Items implementiert und committed.

---

## Sprint 15 Review — 2026-03-30

**Sprint Goal erfüllt: ✅** Oscar versteht in 10 Sekunden was er tun soll.

| Item | Status | Commit |
|------|--------|--------|
| S15-1: Sofort-KLONK — Sound bei Palette-Klick | ✅ Done | 627ba95 |
| S15-2: Tutorial-Puls — Canvas-Rand gold bis 1. Block | ✅ Done | 627ba95 |
| S15-3: Sidebar Tabs — war bereits implementiert | ✅ Done | 627ba95 |

## Sprint 15 Retro — 2026-03-30

**Gut:** Sofort-KLONK ist eine klare Verbesserung. Canvas-Puls ist besser als Text.

**Weniger gut:** Zweiter Agent hat Sprint 15 doppelt geplant und implementiert, weil `git fetch origin` nicht zuerst ausgeführt wurde. Gleicher Fehler wie Sprint 6. Lektion steht in MEMORY — wird nicht gelesen.

**Aktion für alle Agents:** `git fetch origin` + Remote-SPRINT.md lesen VOR jeglicher Implementierung.

---

## Sprint 15 — "Erster Moment" ✅ DONE

**Sprint Goal:** Oscar versteht in 10 Sekunden was er tun soll — und hört es sofort.

| # | Item | Owner | Status |
|---|------|-------|--------|
| S15-1 | **Sofort-KLONK** — Sound beim Palette-Klick, nicht erst nach Block-Platzierung. Laut. Befriedigend. (#70 + #63) | Engineer | ✅ Done (627ba95) |
| S15-2 | **Tutorial-Puls** — Canvas-Rand pulsiert gold bis erster Block. Kein Text, reines Signal. (#68) | Designer | ✅ Done (627ba95) |
| S15-3 | **Sidebar Tabs** — Inventar/Quests/Erfolge als Tabs statt alles gestapelt. (#41) | Designer | ✅ Done (627ba95) |

---

## Sprint 14 — "Naturgesetze" ✅ DONE

**Sprint Goal:** Automerge als Physik-Engine. Die Insel organisiert sich selbst.

| # | Item | Owner | Status |
|---|------|-------|--------|
| S14-1 | **automerge.js** — Eigenes Modul: Nachbarschafts-Regeln als Naturgesetze | Engineer | ✅ Done (4bb86bd) |
| S14-2 | **Wu Xing Zyklen** — Erzeugungszyklus als Automerge | Engineer | ✅ Done (80f240e) |
| S14-3 | **Visuelle Merge-Animation** — Blitz/Funken wenn Blöcke verschmelzen | Designer | ✅ Done (93dbbbe + abcf45f) |
