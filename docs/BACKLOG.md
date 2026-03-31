# Product Backlog — Schnipsels Insel-Architekt

**Product Goal:** Kinder entdecken spielerisch dass Worte Dinge erschaffen. "Außer Text nix gehext." — Tao: Everything flows. Die 5 Elemente sind ein Kreislauf, kein Inventar.

---

## 🔴 P0 — Muss vor erstem echtem Test

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | **Auto-Save** — localStorage speichert Grid alle 30s automatisch | Engineer | ✅ Done |
| 2 | **Accessibility Audit** — Screenreader-Test, Tab-Navigation, Kontraste | Designer + Hick | ✅ Done (ARIA, Escape, Dialoge) |
| 3 | **Mobile Palette** — klappbar oder horizontal scrollbar auf iPad | Designer | ✅ Done |
| 4 | **Toolbar-Overflow auf Mobile** — 7 Buttons brechen auf kleinen Screens | Designer | ✅ Done |
| 5 | **Google Sheet Webhook einrichten** — Testdaten automatisch einsammeln | Engineer | ⏳ Braucht User (Google Credentials) |
| 44 | **schatzinsel.app → GitHub Pages** — DNS in Cloudflare auf GitHub IPs, Custom Domain setzen | Engineer | ⏳ Braucht User (Cloudflare Dashboard) |
| 59 | **10-Sekunden-Erster-Moment** | Designer | ✅ Done (9f8a0bf) |
| 70 | **KLONK vor erstem Block** | Engineer | ✅ Done |
| 78 | **Tesla-Nutzertest auswerten** — 1h Video von Oscar im Tesla, >1GB | Scientist + Leader | ⏳ Braucht User (Video-Datei) |

## 🟡 P1 — Vor Spielplatz-Phase (10 User)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 6 | **NPC-Stimmen schärfen** | Artist | ✅ Done (Elefant/Krabs/Tommy) |
| 7 | **QR-Code auf Postkarte** | Engineer | ✅ Done |
| 8 | **Offline-Manifest** — Service Worker für Spielen ohne Internet | Engineer | ✅ Done (sw.js + manifest.json) |
| 9 | **Mehr Quests** — 11→45→57 Templates | Artist + Leader | ✅ Done (57 Templates, +8 Haiku-Quests) |
| 10 | **Favicon + Meta-Tags** | Engineer | ✅ Done |
| 11 | **Zellteilung game.js** — Grid-Logik noch in game.js | Engineer | 🔲 Offen — Lesbarkeit für User |
| 28 | **Chat-Fenster nicht überlappend** — als Sidebar, kein Overlay | Designer | ✅ Done (body.chat-open + margin-right) |
| 30 | **Tonhöhe zu Elementen** — Feuer=höher, Erde=tiefer, Wasser=fließend | Scientist | ✅ Done (ELEMENT_TONES in sound.js) |
| 31 | **Bauen/Ernten/Füllen Icons** — universelle Symbole | Designer | ✅ Done (🖌️⛏️🪣) |
| 32 | **Code-Ebenen per Touch** — Swipe statt Rechtsklick | Engineer | ✅ Done (Sprint 21) |
| 33 | **Header-Title "Schatzinsel"** | Designer | ✅ Done |
| 40 | **Insel-Identität** — Wasser-Rand, Strand-Gradient, Palmen | Designer + Engineer | ✅ Done |
| 41 | **Sidebar Tabs** | Designer | ✅ Done |
| 43 | **Save-System** | Engineer | ✅ Done |
| 45 | **Canvas responsive** — 16:9 auf PC, iPad-Ratio auf iPad | Engineer + Designer | ✅ Done |
| 46 | **Drag & Drop Crafting** | Engineer | ✅ Done (Sprint 21) |
| 47 | **Quests/Achievements balanciert** | Scientist | ✅ Done (Baseline-Tracking, max 2 aktive) |
| 48 | **NPCs sichtbar** — Chat-Bubble immer sichtbar | Engineer | ✅ Done |
| 49 | **Bernd Support-Chat** | Engineer | ✅ Done |
| 51 | **Wu Xing Philosophie im Craft-Prompt** | Scientist | ✅ Done |
| 53 | **Echtes Atlantik-Wetter** — Open-Meteo API | Engineer | ✅ Done |
| 55 | **Spielfigur auf der Insel** | Engineer + Designer | ✅ Done (Sprint 7) |
| 61 | **Konsequenz** — Baum fällen = Baum weg | Engineer | ✅ Done |
| 63 | **Erster Block = lautes KLONK** | Engineer + Scientist | ✅ Done (via #70) |
| 64 | **Elektronen = Crafting-Blitz** | Engineer | ✅ Done |
| 66 | **Spielfigur-Bewegung laggt** | Engineer | ✅ Done (Sprint 19) |
| 67 | **Automerge wie 2048** | Engineer + Scientist | ✅ Done |
| 68 | **Tutorial sichtbar** — Tao-Button pulsiert | Designer | ✅ Done |
| 69 | **Entdeckte Elemente sichtbar** — Genesis-Badge | Designer | ✅ Done |
| 74 | **NPC-Persönlichkeiten differenzieren** | Artist + Scientist | ✅ Done |
| 75 | **Wunschfee Floriane** | Artist + Engineer | ✅ Done (Sprint 19) |
| 76 | **Craft-Ergebnis visuell zeigen** | Designer + Engineer | ✅ Done |
| 80 | **docs/PROJECT.md + DESIGN.md + DECISIONS.md** | Leader | ✅ Done (Sprint 22) |
| 29 | **NPC-Emoji eindeutig** | Artist | ✅ Done |

## 🟢 P2 — Vor "100 User"-Phase

| # | Item | Owner | Status |
|---|------|-------|--------|
| 13 | **Mehr Programmiersprachen-Bewohner** | Artist | ✅ Done |
| 14 | **Haiku-Bauanleitungen** — Quests in 5-7-5 Silben | Artist | ✅ Done (Sprint 22, 8 Haiku-Quests) |
| 22 | **Projekt-Sharing** — URL die eine Insel teilt | Engineer | ✅ Done |
| 58 | **Unsinn-Rezepte** — Feuer+Eierkuchen=?, Drache+Kuchen=? | Artist | ✅ Done (Sprint 22, +10 Rezepte) |
| 60 | **Haikus am Strand** — 5-7-5 statt Tutorial-Text | Artist | ✅ Done (Sprint 22, in Quest-Descs) |
| 84 | **Höhlen + Edelsteine** — Berg+Wasser=Höhle, Tropfstein+Feuer=Edelstein | Engineer | ✅ Done (Sprint 22, 5 Rezepte) |
| 85 | **Genre-Tonsequenzen** — 5 Genres × 5-Noten-Sequenzen | Engineer + Artist | ✅ Done (Sprint 22) |
| 86 | **CI/CD Pipeline** — ci.yml + Unit Tests + Smoke Test | Engineer | ✅ Done (Sprint 22) |
| 87 | **TTS Hörspiele** — Web Speech API für Hörspiel-Zeilen | Engineer | ✅ Done (Sprint 22) |
| 65 | **Neutrino-Spieler** — Analytics-Metrik für Nicht-Crafter | Scientist | ✅ Done (Sprint 22) |
| 88 | **Floriane die Wunschfee** | Artist + Engineer | ✅ Done (dd9569e1) |

---

## ⏳ Braucht User / Human Input

| # | Item | Was fehlt |
|---|------|-----------|
| 5 | Google Sheet Webhook | Google-Credentials vom User |
| 27 | Cloudflare Worker CORS | User muss worker.js im Dashboard deployen |
| 44 | DNS schatzinsel.app → GitHub Pages | User braucht Cloudflare Dashboard |
| 78 | Tesla-Nutzertest Video | Video >1GB, muss vom User bereitgestellt werden |
| 92 | Requesty Key rotieren | Neuen Key erstellen, alten revoken — User muss Login machen |

---

## 🔒 Bleibt offen — Crash-Risiko für Oscar oder Lesbarkeit

| # | Item | Warum bleibt es |
|---|------|-----------------|
| 11 | **Zellteilung game.js** | 3400 Zeilen in einer Datei — Lesbarkeit für Papa |

---

## ❄️ Eingefroren / Vision / Irgendwann

| # | Item | Grund |
|---|------|-------|
| 12 | Voice-Pipeline (Cartesia + vapi.ai) | Braucht externe Services |
| 15 | Tutorial ohne Text | Design-Arbeit, kein Code |
| 16 | Premium-Themes | Monetarisierung — nicht jetzt |
| 17 | Eltern-Dashboard | Feature nach 100 Usern |
| 18 | Musik on demand | Braucht Audio-Assets |
| 19 | Game of Life Screensaver | ✅ Done |
| 20 | Multiplayer | ❄️ Eingefroren |
| 21 | Leaderboard | ❄️ Eingefroren |
| 23 | Programmier-Tutorial | Braucht Wissenschaftler |
| 24 | AR-Modus | ❄️ Eingefroren |
| 25 | Hörspiel-Aufnahmen | ❄️ Eingefroren |
| 26 | ZKM-Ausstellung | ❄️ Eingefroren |
| 34 | NPCs in User-Sprache | Scientist-Arbeit |
| 35 | Eigene NPCs craften | Alle beteiligt |
| 36 | Wigald Boning & Willy Astor | Kein Konzept |
| 37 | Schöpfungsgeschichte als Tutorial | Leader-Design nötig |
| 38 | A/B Test Mythologie | Scientist nötig |
| 39 | Tutorial-Gating Postkarte | Depends on #37 |
| 42 | Werkbank als Canvas-Drag | P2 UX-Verbesserung |
| 50 | Höhle = Dungeon-Framework | Massive Feature, Design nötig |
| 52 | Kung Fu Panda Wuxi | Ästhetik-Arbeit |
| 54 | Jim Knopfs Welt | Massive Feature |
| 56 | Bibliothek von Alexandria | Inhalte nötig |
| 57 | Stille-Momente | Design-Feature |
| 62 | Mehrsprachige NPCs | Scientist |
| 71 | Palette = Instrument = Bauwerk | Komplexes Feature |
| 72 | Das Buch | Content-Arbeit |
| 73 | Suchregeln-Optimierung 8D | Scientist + Engineer |
| 77 | Rewind/Zeitreise | Nice-to-have |
| 79 | Hau-den-Lukas zurückbringen | P3 |
| 81 | Inventar-Töne | P2 Sound |
| 82 | Bau-Trommel | P2 Sound |
| 83 | Urknall-Crafting | Design-Entscheidung nötig |
| 89 | Koop-Modus | Braucht WebRTC |
| 90 | Browser-LLM | Feynman muss testen |
| 91 | Lokales LLM auf Mac Mini | Braucht Hardware-Setup |

---

## Done (diese Session — Sprint 22)

| # | Was | Commit |
|---|-----|--------|
| ✅ | #28 Chat nicht überlappend (body.chat-open) | Sprint 22 |
| ✅ | #14/#60 Haiku-Quests (8 neue Quests in 5-7-5) | Sprint 22 |
| ✅ | #58 Unsinn-Rezepte (+5 absurde Rezepte) | Sprint 22 |
| ✅ | #84 Höhlen+Edelsteine (5 Rezepte + Materialien) | Sprint 22 |
| ✅ | #85 Genre-Tonsequenzen (5 Genres × 5 Noten) | Sprint 22 |
| ✅ | #86 CI/CD Pipeline (ci.yml + Unit + Smoke) | Sprint 22 |
| ✅ | #87 TTS Hörspiele (Web Speech API) | Sprint 22 |
| ✅ | #65 Neutrino-Spieler Metrik | Sprint 22 |
| ✅ | #80 PROJECT.md + DESIGN.md + DECISIONS.md | Sprint 22 |
| ✅ | Wind + Palme als craftbare Materialien | Sprint 22 |

---

## Priorisierungs-Regel

**Einstein entscheidet.** Bei Gleichstand: Mandela-Bedingung gewinnt (Zugänglichkeit vor Features). Feynman misst ob es sich gelohnt hat.
