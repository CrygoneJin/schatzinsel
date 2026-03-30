# Sprint 21 — "Erste Mitochondrien"

**Sprint Goal:** Prokaryot baut erste Organellen ein. Code-Modularisierung + P0-Bugs + Offline-Fähigkeit.

**Start:** 2026-03-30
**Typ:** BUILD

---

## Sprint Backlog

| # | Item | PR | Owner | Status |
|---|------|----|-------|--------|
| S21-1 | **Sound Mute-Refactor** — 9× Copy-Paste → 1× `isMuted()` + 2 Bugs gefixt | #50 | Engineer | ✅ Done |
| S21-2 | **localStorage-Helper** — Zentraler `INSEL_STORAGE` Layer mit Namespace | #51 | Engineer | ✅ Done |
| S21-3 | **INSEL Namespace** — Event-Bus + Modul-Registry statt 41 Globals | #52 | Engineer | ✅ Done |
| S21-4 | **NPC-Visibility Fix** — Doppelte Floriane + CHAR_CURRENCY Duplikat | #53 | Engineer | ✅ Done |
| S21-5 | **10-Sekunden-Erster-Moment** — Intro beschleunigt, Los!-Button pulsiert golden | #54 | Designer + Engineer | ✅ Done |
| S21-6 | **Offline-Manifest** — Service Worker + PWA-Manifest für Spielen ohne Internet | #56 | Engineer | ✅ Done |
| S21-7 | **Konsequenz-System** — Wasser→Blumen, Feuer→Asche, Ernten→Stumpf | #57 | Engineer | ✅ Done |

---

## Standup Log

### 2026-03-30 (Sprint 21 — "Erste Mitochondrien")

**Was passiert ist:**
- 7 PRs erstellt, alle via Worktree-Agents parallel gebaut
- Backlog #11 (Zellteilung): 3 Module extrahiert (sound mute, storage, namespace)
- Backlog #48/#49 (NPCs): Duplikat-Bug gefixt
- Backlog #59 (10s-Moment): Intro optimiert, goldener Puls
- Backlog #8 (Offline): Service Worker + PWA-Manifest
- Backlog #61 (Konsequenz): Welt reagiert auf Bauen/Ernten
- Backlog #40 (Insel-Identität): Bereits in Sprint 7/8 implementiert — kein neuer PR nötig

---

# Sprint 20 — "Alle antreten" ✅ DONE

**Sprint Goal:** Organisation aufräumen, Code-Fundament stärken. Jeder Agent hat einen Job.

**Start:** 2026-03-30
**Typ:** BUILD + DOC (Hybrid — einmalig, weil Org-Umbau)

---

## Sprint Backlog

| # | Item | Owner(s) | Status |
|---|------|----------|--------|
| S20-1 | **Docs konsolidiert** — SCHNIPSEL→USERS, PROJECT→STORY, DESIGN→STORY, DECISIONS→ARCHITECTURE. 4 Dateien gelöscht, 0 Information verloren. | Weber (COO) + Engineer | ✅ Done |
| S20-2 | **ROSTER.md** — Alle 18 Agents mit Lebensphase, Model, Skills. Skill-Zuordnung ohne Dopplungen. | Feynman (Scientist) | ✅ Done |
| S20-3 | **CxO-Aktivierung** — `/einstein`, `/darwin`, `/weber` als Command-Dateien. 3 Agents von EINGEFROREN → AKTIV. | Leader + Engineer | ✅ Done |
| S20-4 | **Padawan-Codizes** — Alle 5 Codizes mit Erfahrungen aus Sprint 1–19 gefüllt. Kein "Noch leer" mehr. | Alle Padawans + Feynman | ✅ Done |
| S20-5 | **SPRINT.md getrimmt** — Historische Sprints 14–18 raus. Nur aktiver Sprint + Referenz. | Weber (COO) | ✅ Done |
| S20-6 | **Code Metrics Review** — Feynman/Darwin/Linus/Taylor Podcast-Format. 35 Stimmen. | Feynman + Darwin | ✅ Done |

---

## Standup Log

### 2026-03-30 (Sprint 20 — "Alle antreten")

**Was passiert ist:**
- Kompletter Org-Umbau: 18 Agents inventarisiert, 8 CxOs+Sales als EINGEFROREN identifiziert, 3 CxOs aktiviert
- Doc-Konsolidierung: 4 Dateien gemergt (SCHNIPSEL, PROJECT, DESIGN, DECISIONS), TEST-RESULTS archiviert
- 5 Padawan-Codizes mit je 3 Erfahrungseinträgen gefüllt
- Skill-Zuordnung: 14 Skills auf 5 Masters verteilt, keine Dopplungen
- Code Metrics Review mit harten Zahlen: 8.583 LOC, 207 Funktionen, 41 Globals, 63 JSON.parse

---

## Sprint 19 — "Floriane & Flow" ✅ DONE

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

---

*Sprints 14–18: Abgeschlossen. Dokumentation in MEMORY.md.*
