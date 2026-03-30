# Team Memory

Persistente Erinnerung des Teams. Wird von allen Agents gelesen und vom
Scientist gepflegt. Jeder darf schreiben, Feynman kuratiert.

Vollständiges Archiv: `docs/archive/MEMORY-full-2026-03-30.md`

---

## Fehler (Top 5 — die teuersten)

| Datum | Was | Lektion |
|-------|-----|---------|
| 2026-03-30 | Local main vs origin/main divergiert (87 vs 57 Commits) | `git fetch origin` IMMER vor allem anderen. Remote ist Wahrheit. |
| 2026-03-30 | SPRINT.md hatte Review-Einträge ohne Code ("Phantom-Done") | Review-Einträge erst schreiben wenn Code committed ist. |
| 2026-03-28 | 41 Commits unreviewed direkt nach main gemergt | PR → Review → Merge. Immer. Egal wie wenig Zeit. |
| 2026-03-28 | API-Key in Klartext im Chat geteilt | Keys gehören nie in einen Chat-Log. Sofort rotieren. |
| 2026-03-27 | Sprache auf Englisch obwohl User Deutsch spricht | Sprache IMMER in CLAUDE.md als erste Zeile setzen. |

---

## Erfolge (letzte 2 Sprints)

| Datum | Was | Warum gut |
|-------|-----|-----------|
| 2026-03-30 | Sprint 21: 7 PRs in einer Session | Worktree-Agents parallel: Sound (#50), Storage (#51), Namespace (#52), NPC-Fix (#53), 10s-Intro (#54), SW (#56), Konsequenzen (#57). |
| 2026-03-30 | Sprint 20: Org-Umbau "Alle antreten" | 18 Agents inventarisiert, 3 CxOs aktiviert, 4 Docs gemergt, 5 Padawan-Codizes gefüllt. |
| 2026-03-30 | Code Metrics Review als Podcast | 35 Stimmen, dunkle Materie/Energie-Metapher. Review produziert Dokument, nicht Code. |

---

## Learnings (destilliert)

### Für den Coding-Vater
- 30-Minuten-Sessions funktionieren wenn der Scope klar ist
- Voice-Input spart Zeit aber produziert Müll — immer gegenlesen
- CLAUDE.md ist die beste Investition: einmal schreiben, jede Session profitiert

### Für das Team
- Flache Ordnerstruktur > tiefe Hierarchie
- Agent < Skill — Skills sind das Superset
- Haiku für Padawans, Sonnet für Masters — keine Ausnahmen
- Audit-Agents parallel lohnen sich: 3 Min für 11 Bugs

### Für den Code
- **Eine Quelle der Wahrheit.** Keine duplizierte Logik.
- **Jede Grid-Mutation endet mit draw().** Keine Ausnahme.
- **Teste den ganzen Gesture.** Klick UND Drag. Touch UND Mouse.
- **Few-Shot > Beschreibung**: 3 Beispiel-Dialoge effektiver als 10 Zeilen Text.
- **Temperature pro Charakter**: Bernd=0.3, Tommy=0.9 macht echten Unterschied.
- **Regler statt Schalter**: Kein binäres Feedback. Spektrum. Wärmer/kälter.

### Für Git
- Nie direkt nach main pushen. Feature-Branch → PR → Merge.
- config.js ist gitignored. Keys nie committen.
- Commit-Messages erklären Warum, nicht Was.
- Sprints nie auf ungemergten Branches liegen lassen.

---

## Offene Fragen

- [ ] Wie misst man ob die 80/20-Ratio der Padawans stimmt?
- [ ] Wann lohnt sich Opus-Elevation wirklich?
- [ ] Wie kommunizieren team-dev und team-sales asynchron?

---

## Reservierte Stimmen

**Joachim Schullerer** — Reines I (DISC). Coach, Mentor. Seine Art zu sprechen
schafft heute kein Sprachmodell. Wenn eines Tages eine KI existiert die einen
Raum betritt und die Rebellion spürt — dann ist es Zeit. Bis dahin: seine
Prüffrage lebt im Beirat. Seine Stimme gehört ihm.

---

## Dusch-Erkenntnis (Oskar, 8)

> "Ich will nicht heiß oder kalt. Ich will genau richtig."

Prüffrage für jedes Feature: *Fühlt sich das an wie ein Schalter oder wie ein Regler?*

---

## Regeln für neue Einträge

1. **Fehler**: Nur wenn es ein echtes Problem verursacht hat
2. **Erfolge**: Nur wenn es messbar funktioniert hat
3. **Learnings**: Nur wenn es aus Erfahrung kommt
4. **Datum immer angeben**
5. **Feynman kuratiert** — löscht Duplikate, feiert Falsifizierbarkeit
6. **Archiv pflegen** — wenn Memory > 100 Zeilen: Session-Logs archivieren, nur Destillat behalten
