# Nutzer & Stakeholder

## Primärer Nutzer: Oscar (Schnipsel)

| Feld               | Wert                          |
|--------------------|-------------------------------|
| Name               | Schnipsel (Oscar)             |
| Alter              | 8 Jahre                       |
| Sprache            | Deutsch (Muttersprache)       |
| Traumberuf         | Architekt                     |
| Lieblings-YouTuber | Paluten (Simulator-Spiele)    |

### Interessen (nach Begeisterung)

1. **Bauen & Konstruieren** — Häuser, Türme, alles was man zusammensetzen kann
2. **Pflanzen** — findet Bäume, Blumen und Gärten faszinierend
3. **Holz** — das Lieblings-Baumaterial, weil es "echt" ist
4. **Basteln & Werken** — mit den Händen etwas erschaffen
5. **Simulator-Spiele** — wie Paluten sie spielt: lustig, bunt, ein bisschen chaotisch

### Lieblings-Figuren

- **SpongeBob Schwammkopf** — kennt alle Folgen
- **Die Sendung mit dem Elefanten** — der blaue Elefant, die Maus, die Ente
- **Das Neinhorn** — das freche Einhorn aus dem Kinderbuch
- **Loisach Marci** — mag die Musik (Elefant trötet wie Loisach Marci)

### Wie Oscar spielt

- **Entdecker-Typ**: will sofort loslegen, nicht lange Anleitungen lesen
- **Kreativ**: baut lieber frei als nach Vorgabe
- **Stolz auf Ergebnisse**: will sehen was er geschafft hat
- **Kurze Aufmerksamkeitsspanne**: Feedback muss sofort kommen
- **Mag Humor**: findet es lustig wenn Figuren freche Sprüche sagen

### O-Ton Oscar

> "Architekt ist einfach ein cooler Beruf."
> "Mein Lieblings-YouTuber Paluten spielt auch Simulator."
> "Du sagst immer warum warum warum — ich will einfach bauen!"
> "Ich will nicht heiß oder kalt. Ich will genau richtig." (Dusche)

### Bedienungs-Anforderungen

- Große Klickflächen (min. 48px)
- Emojis statt Text wo möglich
- Deutsche Labels, kurze Wörter
- Kein Tippen nötig zum Spielen
- Touch-Support (Tablet)
- Kein Login, kein Account, keine Werbung

### Design-Implikationen

- **Nicht belehren**: Oscar will nicht erklärt bekommen warum Architektur toll ist
- **Nicht ausfragen**: Kein "Warum möchtest du das bauen?" — einfach bauen lassen
- **Feiern statt bewerten**: Jedes Bauwerk ist großartig. Keine Noten, keine Fehler
- **Paluten-Ton**: Ein bisschen lustig, ein bisschen übertrieben, nie langweilig

---

## Stakeholder: Die Familie

| Wer | Rolle | Einfluss auf das Projekt |
|-----|-------|--------------------------|
| **Papa** (Entwickler) | Baut das Spiel, automatisiert alles | Technische Entscheidungen, Sessions zwischen Kindern und Garten |
| **Mama** (Lehrerin) | Quality Gate, Zeitwächterin | Sagt wann Feierabend ist. Hat immer recht. |
| **Schwester** | Mittesterin, Meinungsgeberin | Andere Perspektive als Oscar |
| **Bruder** | Mittester, Chaosagent | Drückt alle Buttons gleichzeitig. Bester QA-Tester. |

---

## Papa: Der Entwickler

### Profil

- Frau ist Lehrerin — sie erkennt wenn du "recherchierst" statt arbeitest
- Ein Mädchen und zwei Jungs die jederzeit den Stecker ziehen
- Riesiger Garten der nie fertig ist
- Haus das immer irgendwo kaputt ist
- Unaufhaltsamer Drang alles zu automatisieren

### Session-Typen

| Session | Dauer | Regel |
|---------|-------|-------|
| **Garten-Session** | 30 Min max | Minute 0-2 Kontext, 2-5 Scope, 5-25 Bauen, 25-30 Commit |
| **Kinder-schlafen-Session** | Unbegrenzt | Spielwiese. Aber: Commit vor dem Rabbit Hole. |
| **Sonntagmorgen-Session** | Premium-Zeit | Architektur, Refactoring, große Entscheidungen. Nicht "kurz Proxy-Config anpassen." |

### Die goldenen Regeln

1. **Commit early, commit often.** Kinder WERDEN den Stecker ziehen.
2. **CLAUDE.md ist das Gedächtnis.** Nach 3 Wochen Pause sofort wieder Kontext.
3. **Timer setzen.** "Nur noch 5 Minuten" ist gelogen. Immer.
4. **Die Doku überlebt den Code.** Eine gute CLAUDE.md > ein cleveres Script.
5. **Du bist nie "gleich fertig."** Deine Frau weiß das.

### Pair-Programming mit Kindern

- Lass ihn den "Los geht's"-Button drücken
- Lass ihn Farben aussuchen
- Erkläre NICHT wie der Code funktioniert (er fragt wenn er will)
- Zeig ihm das Ergebnis, nicht den Prozess
- Nicht "gleich, ich muss nur noch..." (Du musst NIE "nur noch")
- Nicht enttäuscht sein wenn er nach 5 Minuten weg ist (er kommt wieder)

### Automatisierungs-Halbwertszeit

| Typ | Halbwertszeit | Reuse-Chance |
|-----|---------------|--------------|
| Shell-Script | 2 Wochen | 10% |
| Claude Agent Config | 1 Monat | 40% |
| CLAUDE.md Doku | 6 Monate | 90% |
| Gut benanntes Git-Repo | Jahre | 95% |
| "Ich merk mir das" | 0 Tage | 0% |

---

## Infrastruktur

| Komponente | Spec |
|------------|------|
| **Rechner** | Mac Mini M4 |
| **Speicher** | 256 GB |
| **Display** | 27" 4K Monitor |
| **Entwicklung** | Claude Code CLI + LiteLLM/Langdock Proxy |
| **Deployment** | GitHub Pages |

### Spielgeräte

| Gerät | Display | Wer | Hinweise |
|-------|---------|-----|----------|
| Mac Mini M4 + 27" 4K | 3840x2160 | Oscar, Familie | Hauptgerät |
| MacBook Pro 13" (2013) | 2560x1600 | Testgerät | macOS Monterey, älterer Browser |
| iPhone SE | 4.7" (750x1334) | Tochter | Winzig! Touch only. |

### KI-Ökosystem im Haushalt

| Gerät | KI | Nutzer |
|-------|----|--------|
| Papas iPhone | Gemini (Spracheingabe) | Transkribiert "Architekt" als "Are she tackled" |
| Mamas iPhone | ChatGPT | Antwortet auf "Was gibt's zum Abendessen?" mit Ernährungsphilosophie |
| Mac Mini | Claude Code CLI | Versteht Denglisch. Meistens. |

---

*Destilliert aus: SCHNIPSEL.md + BEST-PRACTICES.md (2026-03-27/28)*
