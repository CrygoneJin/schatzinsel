# Sprint 19 — "Floriane & Flow"

**Sprint Goal:** Bewegung fühlt sich sofort an. Und Oscar bekommt seine Wunschfee.

**Start:** 2026-03-30
**Ende:** 2026-03-30

---

## Sprint Backlog

| # | Item | Owner | Status |
|---|------|-------|--------|
| S19-1 | **Spielfigur-Lag fix** — `movePlayer()` ruft `draw()` direkt auf, kein 100ms-Warten (#66) | Engineer | ✅ Done |
| S19-2 | **Wunschfee Floriane** — Neuer NPC 🧚, ELIZA + LLM-Persönlichkeit, erste Freischaltung (#75) | Artist + Engineer | ✅ Done |
| S19-3 | **Cherry-pick Sprint 15–18** — Sprints 15/16/17/18 auf main gebracht (waren ungemergt) | Engineer | ✅ Done |

---

## Standup Log

### 2026-03-30 (Sprint 19 Planning — nach Sprint 18)
- Sprints 15-18 auf feat/sprint-15 und feat/sprint-18 lagen ungemergt. Cherry-picks mit Konfliktlösung.
- Doppelte playerName-Deklaration (Cherry-pick Bug) gefixt.
- Spielfigur-Lag: setInterval(draw, 100) ist Architektur-Entscheidung (CPU). Fix: movePlayer() ruft draw() direkt auf.
- Oscar will Floriane — Wunschfee als erster Unlock-NPC.

---

## Sprint 18 — "Stimme der Elemente" ✅ DONE

| # | Item | Status | Commit |
|---|------|--------|--------|
| S18-1 | Tonhöhe zu Elementen | ✅ Done | ffc6c6a (cherry) |
| S18-2 | Genesis-Badge | ✅ Done | ffc6c6a (cherry) |
| S18-3 | Titel "Schatzinsel" | ✅ Done | ffc6c6a (cherry) |

## Sprint 17 — "Oscar's Töne" ✅ DONE

| # | Item | Status | Commit |
|---|------|--------|--------|
| S17-1 | Replay-Song | ✅ Done | 47dbc0b (cherry) |
| S17-2 | Wasser nährt Holz | ✅ Done | 47dbc0b (cherry) |
| S17-3 | Avatar-Wahl | ✅ Done | 47dbc0b (cherry) |

## Sprint 16 — "Reibungslos" ✅ DONE

| # | Item | Status | Commit |
|---|------|--------|--------|
| S16-1 | Chat als Sidebar | ✅ Done | b7cc52d (cherry) |
| S16-2 | Block-KLONK | ✅ Done | b7cc52d (cherry) |
| S16-3 | NPC-Emoji fix | ✅ Done | b7cc52d (cherry) |

## Sprint 15 — "Erster Moment" ✅ DONE

| # | Item | Status | Commit |
|---|------|--------|--------|
| S15-1 | Sofort-KLONK | ✅ Done | 627ba95 (cherry) |
| S15-2 | Tutorial-Puls | ✅ Done | 627ba95 (cherry) |
| S15-3 | Sidebar Tabs | ✅ Done | 627ba95 (cherry) |

## Sprint 14 — "Naturgesetze" ✅ DONE

| # | Item | Owner | Status |
|---|------|-------|--------|
| S14-1 | automerge.js | Engineer | ✅ Done (4bb86bd) |
| S14-2 | Wu Xing Zyklen | Engineer | ✅ Done (80f240e) |
| S14-3 | Visuelle Merge-Animation | Designer | ✅ Done (93dbbbe + abcf45f) |
