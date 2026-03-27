# Nutzer & Stakeholder

## Primärer Nutzer: Schnipsel

| Feld               | Wert                          |
|--------------------|-------------------------------|
| Name               | Schnipsel                     |
| Alter              | 8 Jahre                       |
| Sprache            | Deutsch (Muttersprache)       |
| Traumberuf         | Architekt                     |
| Lieblings-YouTuber | Paluten (Simulator-Spiele)    |

- Möchte Architekt werden
- Liebt Pflanzen, Holz, Bauen und Basteln
- Schaut Paluten auf YouTube (Simulator-Spiele)
- Braucht große Buttons, einfache Bedienung, deutsche Sprache

Siehe `docs/SCHNIPSEL.md` für das vollständige Profil.

---

## Stakeholder: Die Familie

| Wer | Rolle | Einfluss auf das Projekt |
|-----|-------|--------------------------|
| **Papa** (Entwickler) | Baut das Spiel, automatisiert alles | Technische Entscheidungen, Sessions zwischen Kindern und Gartenarbeit |
| **Mama** (Lehrerin) | Quality Gate, Zeitwächterin | Sagt wann Feierabend ist. Hat immer recht. Erkennt pädagogischen Wert (oder Unsinn). |
| **Schwester** | Mittesterin, Meinungsgeberin | Wird das Spiel auch spielen. Andere Perspektive als Schnipsel. |
| **Bruder** | Mitttester, Chaosagent | Drückt alle Buttons gleichzeitig. Bester QA-Tester. |

---

## Infrastruktur

| Komponente | Spec |
|------------|------|
| **Rechner** | Mac Mini M4 |
| **Speicher** | 256 GB |
| **Display** | 27" 4K Monitor |
| **Maus** | Kaputt. Seit Wochen. Wird irgendwann repariert. |
| **Tastatur** | Alt und dreckig. Funktioniert aber. |
| **Entwicklung** | Claude Code CLI + LiteLLM/Langdock Proxy |
| **Deployment** | GitHub Pages |

### Design-Implikationen

- **4K Display**: Spiel muss auf 3840x2160 gut aussehen -- keine pixeligen Elemente, Canvas skaliert sauber
- **Mac Mini M4**: Mehr als genug Power, keine Performance-Sorgen
- **256 GB**: Kein Platz für aufgeblähte node_modules -- Vanilla JS war die richtige Entscheidung
- **Auch genutzt auf**: iPad/iPhone (Touch-Support wichtig)

### Entwickler-Workflow

```
Papa hat 30-Minuten-Fenster zwischen:
  - Gartenarbeit
  - Haus reparieren
  - Kinder bespaßen
  - Frau überzeugen dass "nur noch 5 Minuten" stimmt

Ergo:
  - Sessions müssen schnell starten (CLAUDE.md = sofort Kontext)
  - Commits müssen häufig sein (Stecker wird gezogen)
  - Code muss ohne Build-Tools laufen (kein "npm install" nach 3 Wochen Pause)
```

Siehe `docs/BEST-PRACTICES.md` für die vollständigen Entwickler-Regeln.
