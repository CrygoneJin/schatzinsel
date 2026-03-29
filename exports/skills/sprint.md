# /sprint — Sprint Planning aus Review-Findings

Sprint planen. Nicht träumen. 30 Minuten. Ein Ergebnis.

---

## Before you start

Lies ALLES. Keine Ausnahmen:

```
docs/MEMORY.md        — Was war, was gelernt, was offen
docs/BACKLOG.md       — Alles was ansteht
docs/DONE.md          — Die Qualitätsbar
docs/ARCHITECTURE.md  — Stack und Constraints
```

Prüfe ob ein vorheriges Review existiert:
- Letzter Review-Eintrag in `docs/MEMORY.md` (suche nach "Review Board Findings")
- Falls vorhanden: die Findings SIND der Input für diesen Sprint

Falls kein Review da ist: `/review` zuerst laufen lassen.

---

## Das Board plant

Drei Stimmen. Nicht mehr.

**Einstein (CEO):** Was ist die EINE Sache? Streicht alles was nicht dazu beiträgt.

**Torvalds (Engineer):** Was ist in 30 Minuten machbar? Ehrlich. Nicht optimistisch.

**Feynman (Scientist):** Wie wissen wir ob es fertig ist? Messbares Kriterium.

---

## Prozess

### Schritt 1: Findings sortieren

Nimm die Review-Findings (oder Backlog-Items, oder User-Input) und sortiere:

| Kategorie | Regel |
|-----------|-------|
| **Muss jetzt** | 🔴 Kritisch ODER blockiert alles andere |
| **Sollte jetzt** | 🟡 Wichtig UND in 30 Min machbar |
| **Nicht jetzt** | Alles andere. Egal wie verlockend. |

**Einstein-Filter:** "Wenn wir nur EINES davon machen könnten — welches?"

### Schritt 2: Sprint-Ziel formulieren

EIN Satz. Nicht zwei. Nicht drei.

Format:
> **Sprint-Ziel:** [Was Oscar/Schnipsel/der User am Ende dieser Session hat, was er vorher nicht hatte]

Beispiele:
- "Oscar hat ein Ziel auf der Insel."
- "game.js ist in 4 Dateien gesplittet."
- "Sounds crashen nicht mehr im Bau-Modus."

**Feynman-Test:** Kann man am Ende der Session binär sagen "ja, geschafft" oder "nein, nicht geschafft"? Wenn nicht: umformulieren.

### Schritt 3: Tasks definieren

Maximal 5 Tasks. Weniger ist besser.

| # | Task | Owner | Done-Kriterium | Est. |
|---|------|-------|----------------|------|
| 1 | ... | ... | Binär: ja/nein | 5m/10m/15m |

**Torvalds-Regel:** Wenn die Summe der Schätzungen > 25 Min → Tasks streichen bis es passt. 5 Min Buffer für Unvorhergesehenes.

**Feynman-Regel:** Jedes Done-Kriterium muss testbar sein:
- "Funktioniert" → WIE testen? Im Browser öffnen? `node -c`? Oscar drückt Play?
- "Sieht gut aus" → Für wen? Auf welchem Gerät?

### Schritt 4: Reihenfolge festlegen

Abhängigkeiten explizit machen:

```
Task 1 → Task 2 (braucht Output von 1)
Task 3 ∥ Task 4 (parallel möglich)
Task 5 → nach allem
```

**Torvalds:** "Was kann ich parallel laufen lassen?" → Subagents für unabhängige Tasks.

### Schritt 5: Sprint schreiben

Schreibe das Ergebnis in `docs/SPRINT.md`:

```markdown
# Sprint [Datum]

**Ziel:** [Ein Satz]

**Timebox:** 30 Minuten

| # | Task | Owner | Done | Est. |
|---|------|-------|------|------|
| 1 | ... | ... | [ ] | ... |
| 2 | ... | ... | [ ] | ... |

**Reihenfolge:** 1 → 2, 3 ∥ 4, 5 nach allem

**Nicht in diesem Sprint:**
- [bewusst geparkte Items mit kurzer Begründung]
```

---

## Regeln

1. **Kein Sprint ohne Ziel.** "Verschiedene Sachen machen" ist kein Sprint.
2. **Kein Task ohne Done-Kriterium.** "Verbessern" ist kein Task.
3. **Kein Sprint > 30 Minuten.** Der User hat Kinder. Respektiere das.
4. **Kein Task > 15 Minuten.** Wenn ein Task länger dauert: splitten oder verschieben.
5. **Erster Task = höchstes Risiko.** Wenn er scheitert, wissen wir es früh.
6. **Letzter Task = commit + push + MEMORY.md.** Immer. Nicht optional.
7. **Wenn das Sprint-Ziel nach 20 Min nicht erreichbar aussieht:** Scope reduzieren. Nicht überziehen.

---

## Nach dem Sprint

Am Ende JEDER Session, automatisch:

1. Tasks in `docs/SPRINT.md` abhaken (✅/❌)
2. Memory-Eintrag in `docs/MEMORY.md` schreiben
3. Commit + Push

Das ist die Definition of Done. Drei Punkte. Binär.

---

## Input

`/sprint` ohne Argument = Plant Sprint aus letztem Review + MEMORY.md
`/sprint [thema]` = Plant Sprint für spezifisches Thema

$ARGUMENTS
