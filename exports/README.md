# Export: Agents, Skills & Org-Struktur

Wiederverwendbare Dateien für neue Projekte. Kopiere was du brauchst.

## Schnellstart für ein neues Projekt

```bash
# 1. In dein Projekt-Root wechseln
cd mein-neues-projekt

# 2. AGENTS.md ins Root kopieren (Org-Struktur)
cp /pfad/zu/exports/AGENTS.md ./AGENTS.md

# 3. Skills als Slash-Commands installieren
mkdir -p .claude/commands
cp /pfad/zu/exports/skills/*.md .claude/commands/

# 4. Agents als Slash-Commands installieren
cp /pfad/zu/exports/agents/*.md .claude/commands/

# 5. Docs-Struktur anlegen
mkdir -p docs
cp /pfad/zu/exports/docs/DONE.md docs/
cp /pfad/zu/exports/docs/MEMORY.md docs/
# BEST-PRACTICES.md und FEYNMAN-QUOTES.md optional
```

## Was ist was

### AGENTS.md (Root)
Die komplette Org-Struktur: drei Zellen, Skalierungsprinzip, Beirat, Why.
Projekt-agnostisch — funktioniert überall.

### agents/ → .claude/commands/
Slash-Commands MIT Persona. Jeder Agent hat eine Stimme.

| Command | Agent | Persona |
|---------|-------|---------|
| `/leader` | Leader | Steve Jobs |
| `/artist` | Artist | David Ogilvy |
| `/designer` | Designer | Dieter Rams |
| `/scientist` | Scientist | Richard Feynman |
| `/engineer` | Engineer | Linus Torvalds |

### skills/ → .claude/commands/
Slash-Commands OHNE Persona. Workflows und Prüfungen.

| Command | Funktion |
|---------|----------|
| `/meeting` | Alle 5 Agents diskutieren ein Thema |
| `/triage` | Jobs prüft und routet |
| `/recap` | Session-Zusammenfassung |
| `/persona` | Sympathische KI-Persona bauen |
| `/anti-cringe` | Copy auf Schleimerei prüfen |
| `/backlog` | Ideen sammeln und priorisieren |
| `/brief-artist` | Brief für Ogilvy schreiben |
| `/review-scientist` | Feynman prüft Prompt/Rubric |
| `/collect` | Agents/Skills aus allen Repos einsammeln |

### docs/
| Datei | Zweck |
|-------|-------|
| `DONE.md` | Definition of Done (3 Punkte, binär) |
| `MEMORY.md` | Persistente Fehler/Erfolge/Learnings |
| `BEST-PRACTICES.md` | Regeln für Coding-Väter mit 30 Min |
| `FEYNMAN-QUOTES.md` | Sprüche für Agent-Prompts und Fehlermeldungen |

## In einem neuen Projekt CLAUDE.md ergänzen

Füge das hier in deine CLAUDE.md ein damit Claude die Agents kennt:

```markdown
## Org-Struktur
Siehe `AGENTS.md` im Root. Drei Zellen: org-support (3), team-dev (5), team-sales (5).

## On startup
Lies AGENTS.md und docs/MEMORY.md beim Session-Start.
```
