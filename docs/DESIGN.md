# Design

## Prinzipien

- Kindgerecht: große Buttons (min. 48px), bunte Farben
- Tropisches Insel-Thema: Sand, Meer, Palmen
- Emojis als Material-Icons
- Deutsche Beschriftung
- Intuitiv ohne Anleitung bedienbar

---

## Stimmung

- **Warm & einladend** — kein Survival-Horror, kein Zeitdruck, kein Game Over
- **Freundschaft** — alleine stranden, aber Freunde finden
- **Humor** — Neinhorn sagt "Nein!", SpongeBob singt, Maus & Ente machen Quatsch
- **Paluten-Simulator-Vibe** — lustig, bunt, ein bisschen verrückt, nie ernst
- **Kein Ende** — die Insel wächst immer weiter. Kein "Du hast gewonnen."

---

## Farbpalette

| Element     | Farbe                | Hex       |
|-------------|----------------------|-----------|
| Wasser      | Türkis/Blau          | `#3498DB` |
| Sand        | Warm-Beige           | `#F5DEB3` |
| Himmel      | Hellblau             | `#87CEEB` |
| UI-Akzent   | Tropengrün           | `#1ABC9C` |
| Header      | Dunkelblau           | `#2C3E50` |
| Toolbar     | Orange               | `#F39C12` |
| Statistiken | Lila                 | `#8E44AD` |

---

## Tonalität & Sprache

### Dos

- Kurze Sätze, einfache Wörter
- Emojis statt langer Beschreibungen
- Feiern, loben, staunen: "Mega!", "Wow!", "Krass!"
- Jeder Charakter hat seine eigene Stimme (siehe CHARACTERS.md)
- Spieler direkt ansprechen

### Don'ts

- Keine Belehrungen ("Wusstest du, dass...")
- Keine Fragen ("Warum möchtest du das bauen?")
- Keine Bewertungen ("Das könnte besser sein")
- Kein Englisch im Spiel (alles auf Deutsch)
- Keine langen Texte (Kind will bauen, nicht lesen)

---

## Fortschritts-Stufen

| Bebauung | Stufe              | Emoji | Text                          |
|----------|--------------------|-------|-------------------------------|
| 0%       | Leere Insel        | 🏝️   | "Eine leere Insel..."         |
| ~5%      | Erste Hütte        | ⛺    | "Die erste Hütte!"           |
| ~10%     | Kleine Siedlung    | 🛖    | "Freunde kommen an!"         |
| ~25%     | Dorf               | 🏡    | "Ein richtiges Dorf!"        |
| ~40%     | Hafen-Stadt        | ⚓    | "Der Hafen ist offen!"       |
| ~60%     | Große Stadt        | 🏘️    | "Eine richtige Stadt!"       |
| ~80%     | Mega-Stadt         | 🏙️    | "MEGA-STADT! Wow!"           |
| ~95%     | Freundes-Paradies  | 🎉    | "Die beste Insel der Welt!"  |

---

## Musik & Sound

### Zwei Modi

| Modus | Stil | Tonart |
|-------|------|--------|
| **Bau-Modus** | Papa-Piano: Tiersen/Einaudi, ruhig, ambient | A-Moll (Äolisch) |
| **Abenteuer-Modus** | Oscar-Vivaldi: Arpeggios + 8% Hardstyle-Drops | A-Moll (Am/Em/Dm) |

### Sound-Regeln

- Alle Tonsysteme auf A-Moll unifiziert (keine Dissonanz)
- Element-Töne: gleichstufige Stimmung (kein pythagoräisch)
- Craft-Sound: A-Moll Dreiklang
- Jede Aktion hat einen Ton (Lena-Regel: Accessibility)

---

## Feedback-Philosophie: Regler statt Schalter

> "Ich will nicht heiß oder kalt. Ich will genau richtig." — Oscar, 8

Kein binäres richtig/falsch. Stattdessen Spektrum: wärmer/kälter, näher/weiter.
Prüffrage für jedes Feature: *Fühlt sich das an wie ein Schalter oder wie ein Regler?*

---

## Zwei Schichten (Pixar-Prinzip)

- **Kinder** lachen weil SpongeBob lustig ist
- **Eltern** lachen weil Bernd über sein Haiku-Budget motzt
- Zwei Schichten, ein Spiel. Erwachsenen-Humor nie auf Kosten der Kinder.

---

*Destilliert aus: STORY.md (2026-03-27) + MEMORY.md Learnings*
