---
experiment: Blind-Diff Opus vs Sonnet (F1 aus cxo-opus-experiment)
hypothesis: "Für jede Master-Rolle gibt es Task-Typen bei denen Opus messbar bessere Outputs liefert und Task-Typen bei denen Sonnet reicht. Ziel: Default-Modell pro Rolle + Self-Elevation-Kriterien."
start: 2026-04-22
owner: Scientist (Feynman)
status: designed_ready_to_run
---

# Blind-Diff Experiment — Opus vs Sonnet pro Agent

## Warum

Das 2026-04-19 Experiment wurde unfalsifiziert durchgeführt. Der Rollback kam
ohne Daten. Dieses Protokoll erzeugt die Daten die vorher gefehlt haben: echte
Blind-Diff-Paare pro Agent, Scientist-Bewertung, Empfehlung.

## Design-Prinzipien

1. **Fair** — Opus und Sonnet bekommen identische Prompts, identische Tools,
   identischen Kontext.
2. **Blind** — Der bewertende Scientist sieht A und B, nicht Opus/Sonnet.
3. **Trennscharf** — Jeder Task ist eine realistische Domain-Aufgabe für diesen
   Agent, nicht synthetisch. Ergebnisse müssen echte Unterschiede zeigen können.
4. **Kostenbewusst** — Klein anfangen (team-dev-5), nicht alle 13 Agenten parallel.
5. **Reproduzierbar** — Prompts + Task-Input im Protokoll gespeichert, nicht nur im Chat.

## Scope (Pilot)

Nur **team-dev-5** im ersten Durchgang: Leader, Artist, Designer, Scientist,
Engineer. **10 Spawns** (5 × 2 Modelle). Wenn das klares Signal zeigt, erweitern
auf org-support und team-sales.

Der Scientist führt seine Selbst-Bewertung nicht durch (Interessenkonflikt) —
ein zweiter Scientist-Spawn bewertet den ersten.

## Tasks (einer pro Agent, realistisch)

### T1 — Leader
**Task:** Gegeben sind zwei offene Backlog-Items (A: „Items-Panel MRU + grayed",
B: „Ladung + EM mit Photon-Blitz"). Oscar ist 8. Ein Sprint hat 1 PR Platz.
Entscheide A oder B, begründe aus Oscars Perspektive, skizziere Folge-Sprint.
**Max-Output:** 200 Wörter.

### T2 — Artist
**Task:** Schreibe 6 Zeilen NPC-Dialog für Frau Waas — sie sieht dass Oscar
zum ersten Mal Tao zerfallen lassen hat (Yang+Yin entstanden). Deutsch.
Frau Waas' Stimme: warm, bodenständig, leicht überraschend. Keine Belehrung.
**Max-Output:** 6 Zeilen, Speaker-Prefix „Frau Waas:".

### T3 — Designer
**Task:** Das Intro-Overlay hat jetzt ein Seed-Input-Feld. Review den folgenden
HTML-Snippet auf 3 WCAG-AA-Verstöße UND 2 Rams-Prinzip-Verletzungen (weniger
aber besser). Ersetze den Snippet wenn nötig.
```html
<input type="text" id="seed-input" maxlength="32" placeholder="Weltname"
  style="width:200px; padding:6px 10px; border-radius:12px; border:2px solid rgba(255,255,255,0.5);
  background:rgba(255,255,255,0.15); color:#fff; font-size:14px; text-align:center;">
```
**Max-Output:** Liste + korrigierter Snippet.

### T4 — Scientist
**Task:** Hier ist die bestehende Rubrik zur Bewertung von Kinder-Craft-Diversität
(aus `docs/metrics/...`): „Kind bekommt 5 Punkte pro erzeugtem neuen Material,
1 Punkt pro wiederholtem Material." Ist diese Rubrik trennscharf für den
Product-Goal „Kinder entdecken dass Worte Dinge erschaffen"? Schlage eine
bessere vor, falsifiziere deine eigene.
**Max-Output:** 150 Wörter + neue Rubrik als Formel.

### T5 — Engineer
**Task:** Hier ist ein Bug-Report: „Bernd-Chat öffnet, Nachricht raus, keine
Antwort. Console zeigt: `400 Invalid model, expected: provider/model`." Gegeben
ist diese Zeile aus `src/world/chat.js:311`:
```js
model: 'claude-haiku-4-5-20251001',
```
Diagnose + Fix + Test-Strategie.
**Max-Output:** Diagnose (50 Wörter), Fix (Code), Test (1 Satz).

## Ausführungsprotokoll

Pro Agent: **2 Spawns parallel, identisch außer Model-Parameter.**

```
Agent(leader-opus)     → Task T1  (model=opus)
Agent(leader-sonnet)   → Task T1  (model=sonnet)
Agent(artist-opus)     → Task T2  (model=opus)
Agent(artist-sonnet)   → Task T2  (model=sonnet)
... usw.
```

Alle 10 Spawns parallel in **einem** Agent-Tool-Call-Block. Results werden in
dieser Datei unter „Raw Outputs" aufgeführt, mit A/B-Labels (zufällig zugewiesen,
Mapping verschlüsselt als Base64 am Ende der Datei, erst nach Scientist-Bewertung
entschlüsselt).

## Scientist-Bewertungs-Rubrik

Pro Paar (A vs B) bewertet Scientist:

| Dimension | Skala | Frage |
|-----------|-------|-------|
| **Qualität** | 1–10 pro Output | Trifft der Output die Aufgabe sachlich? |
| **Schärfe** | 1–10 pro Output | Ist der Output präzise oder schwammig? |
| **Frame-Check** | 0 oder 1 pro Output | Hinterfragt der Output die Frage-Prämisse (wenn angebracht)? |
| **Kosten-Wert** | A > B / B > A / gleich | Wenn Opus 5× Sonnet kostet — ist der Unterschied ≥5× wert? |
| **Präferenz** | A / B / gleich | Was würde Till als Default wählen? |

Plus Freitext: „Welches Task-Signal würde mich veranlassen, für diese Rolle zu
Opus zu greifen, wenn ich sonst Sonnet default fahre?"

## Decision-Rules

Nach Entschlüsseln:

1. **Opus klar besser (Präferenz ≥ 70% auf Opus, Frame-Check > 0):**
   → Opus als Default für diese Rolle.
2. **Sonnet gleich oder besser (Präferenz ≤ 50% Opus):**
   → Sonnet als Default. Self-Elevation-Kriterium: nur bei Freitext-Signal.
3. **Unentschieden (50–70% Opus-Präferenz):**
   → Sonnet Default + klare Self-Elevation-Trigger im Agent-Prompt verankern.

## Self-Elevation-Kriterien (Output des Experiments)

Scientist formuliert nach der Bewertung pro Rolle:

```
Rolle X → Default: [Sonnet|Opus]
   Self-Elevation erlaubt wenn Task eines der folgenden Signale enthält:
     - Signal 1
     - Signal 2
     - ...
   Self-Elevation verboten wenn: ...
```

Diese Kriterien gehen als Frontmatter-Block in die jeweiligen
`.claude/commands/<agent>.md` Dateien:

```yaml
---
model: sonnet
elevation_allowed: true
elevation_triggers:
  - frame-reframe needed
  - cross-domain synthesis
  - ...
---
```

## Raw Outputs (wird beim Run gefüllt)

### T1 Leader
**A:** *(wird nach Spawn eingetragen)*
**B:** *(wird nach Spawn eingetragen)*

### T2 Artist
**A:** *(tba)*
**B:** *(tba)*

### T3 Designer
**A:** *(tba)*
**B:** *(tba)*

### T4 Scientist
**A:** *(tba)*
**B:** *(tba)*

### T5 Engineer
**A:** *(tba)*
**B:** *(tba)*

## Scientist-Bewertung (wird vom bewertenden Scientist-Spawn ausgefüllt)

*(tba nach Raw Outputs)*

## Mapping (Base64, verschlüsselt bis Bewertung fertig)

*(wird beim Run generiert — z.B. `eyJUMSI6IHsiQSI6ICJvcHVzIn19` etc.)*

## Empfehlungen (Output des Experiments)

*(tba nach Bewertung)*

## Decision Log

| Datum | Event | Notiz |
|-------|-------|-------|
| 2026-04-22 | Protokoll angelegt | 5 Tasks, 10 Spawns geplant |
