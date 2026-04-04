# Archiv — L5 Kalter Speicher

> *"In jeder Kultur gibt es zwischen dem Gebrauch dessen, was man die
> ordnenden Codes nennen könnte, und den Reflexionen über die Ordnung
> eine nackte Erfahrung der Ordnung und ihrer Seinsweisen."*
> — Michel Foucault, Die Ordnung der Dinge (1966)

## Taxonomie (Foucault)

Nicht nach Format (Essay, Podcast, Buch) sondern nach **Episteme** —
welche Wissensordnung bedient der Text?

```
archive/
├── theorie/    Repräsentation — Wie die Welt zusammenhängt
│                Quantenfelder, Wu Xing, Tao-Higgs, Bewusstsein, Dialektik,
│                Ricardo-Interviews, Rezensionen
│
├── narrativ/   Sprache — Was wir erzählen
│                Buch-Kapitel, In-Game Stories, Podcasts,
│                Schöpfungsgeschichten, Aufsätze, Taschentücher
│
└── technik/    Arbeit — Wie wir es bauen
                 Browser-LLM Evaluierung, Pruning-Modell,
                 Hexvoxel-Specs, Format-Reviews
```

## Zugriff

- **Latenz:** Hoch. Nur bei expliziter Anfrage.
- **Skill:** `/buch` (narrativ), `/podcast` (narrativ), `/paper` (theorie)
- **Suche:** `Grep` / `Read` mit Pfad `archive/`
- **Schreiben:** Selten. Neue Texte landen hier wenn sie keinem Sprint dienen.

## Abgrenzung

| Ordner | Level | Zweck |
|--------|-------|-------|
| `docs/masters/`, `docs/padawans/` | L1d | Persönliche Codizes |
| `docs/*.md` (7 Kern-Docs) | L3 | Org-Constraints |
| `archive/` | L5 | Kalter Speicher, selten gelesen |

Wenn eine Datei öfter als 1× pro Sprint gelesen wird → gehört sie nicht ins Archiv.
Wenn eine Datei nie gelesen wird → gehört sie gelöscht, nicht archiviert.
