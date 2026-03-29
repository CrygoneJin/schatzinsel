# Sprint 2026-03-29 (Repo-Reorg)

**Ziel:** Das Repo hat keine toten Dateien mehr — Root zeigt Spiel-Code, docs/ zeigt aktive Doku, sonst nichts.

**Timebox:** 30 Minuten

| # | Task | Owner | Done | Est. |
|---|------|-------|------|------|
| 1 | `exports/` komplett löschen (Kopie-Friedhof, 23 Dateien) | Torvalds | [x] | 2m |
| 2 | Tote docs destillieren + löschen (STORY→DESIGN, HOSTING→ARCH, BEST-PRACTICES→USERS, SCHNIPSEL→USERS, FEYNMAN-QUOTES→MEMORY) | Torvalds + Ranganathan | [x] | 10m |
| 3 | CHARACTERS.md: Tim → Oscar | Torvalds | [x] | 1m |
| 4 | Root: AGENTS.md → docs/, hau-den-lukas.html + CHANGELOG.md löschen, CLAUDE.md Pfade fixen | Torvalds | [x] | 3m |
| 5 | Ranganathan in Beirat, BACKLOG #5 schließen, Commit + Push + MEMORY.md | Feynman | [x] | 5m |

**Reihenfolge:** 1 ∥ 2 (parallel), dann 3+4, dann 5

**Ergebnis:**
- 32 Dateien gelöscht, 0 Wissen verloren
- 4 Docs angereichert (DESIGN, ARCHITECTURE, USERS, MEMORY)
- Ranganathan (8. Beirat): "Wer liest das? Findet er es? Spart es ihm Zeit?"
- Padawan-Konzept als Evolutions-These beibehalten

**Nicht in diesem Sprint:**
- game.js Split (eigener Sprint, ~2h)
- Höhlen im Adventure-Grid (#27)
- Floriane die Wunschfee (#29)
- MEMORY.md Archivierung (alte Sessions → archive/)
