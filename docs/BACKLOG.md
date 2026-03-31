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
| 5 | **Google Sheet Webhook einrichten** — Testdaten automatisch einsammeln | Engineer | 🔲 Offen |
| 44 | **schatzinsel.app → GitHub Pages** — DNS in Cloudflare auf GitHub IPs, Custom Domain setzen | Engineer | 🔲 Offen |

## 🟡 P1 — Vor Spielplatz-Phase (10 User)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 6 | **NPC-Stimmen schärfen** — Ogilvy: Jeder NPC braucht typographisches Tick | Artist | ✅ Done (Elefant/Krabs/Tommy) |
| 7 | **QR-Code auf Postkarte** — Godin/Welch: Scannen → direkt zum Spiel | Engineer | 🔲 Offen |
| 8 | **Offline-Manifest** — Service Worker für Spielen ohne Internet | Engineer | ✅ Done (sw.js + manifest.json) |
| 9 | **Mehr Quests** — 11 Templates sind zu wenig, mindestens 20 | Artist + Leader | ✅ Done (45 Templates) |
| 10 | **Favicon + Meta-Tags** — Torvalds: "10 Minuten, großer Unterschied" | Engineer | ✅ Done |
| 11 | **Zellteilung game.js** — Sound, Quests, Effects, Stories, Analytics rausziehen | Engineer | 🔲 Offen (sound.js, quests.js, achievements.js, recipes.js, automerge.js ausgelagert; Grid-Logik noch drin) |

## 🟢 P2 — Vor "100 User"-Phase

| # | Item | Owner | Status |
|---|------|-------|--------|
| 12 | **Voice-Pipeline** — Cartesia + vapi.ai, NPCs sprechen wirklich | Engineer + Scientist | 🔲 Offen |
| 13 | **Mehr Programmiersprachen-Bewohner** — Haskell, Lua, SQL, Scratch | Artist | ✅ Done (NPC_VOICES: haskell 🟣, lua 🌙, sql 🗃️, scratch 🐱) |
| 14 | **Haiku-Bauanleitungen** — Quests in 5-7-5 Silben (Krapweis-Idee) | Artist | 🔲 Offen |
| 15 | **Tutorial ohne Text** — Mandela: Kinder die nicht lesen können | Designer | 🔲 Offen |
| 16 | **Premium-Themes** — 3 weitere Themes als optionaler Kauf | Designer | 🔲 Offen |
| 17 | **Eltern-Dashboard** — Bernd zeigt Spielstatistiken für Eltern | Engineer | 🔲 Offen |
| 18 | **Musik on demand** — Loisach Marci Stil, Hardstyle kinderkompatibel | Artist + Engineer | 🔲 Offen |

## 🔵 P3 — Vision / Irgendwann

| # | Item | Owner | Status |
|---|------|-------|--------|
| 19 | **Game of Life Screensaver** — Conway-Regeln auf dem Grid wenn idle. Zellen leben, sterben, wachsen. Touch = Reset auf statische Insel. Perfekt für Auto-Display, Wartezimmer, Ladestation. | Engineer | ✅ Done (conwayOverlay + 30s idle-Timer, nur null-Zellen, stopConway() auf Interaction) |
| 20 | **Multiplayer** — Inseln besuchen, gemeinsam bauen | Engineer | ❄️ Eingefroren |
| 21 | **Leaderboard** — Meiste Blöcke, meiste Entdeckungen, kreativstes Bauwerk | Engineer | ❄️ Eingefroren |
| 22 | **Projekt-Sharing** — URL die eine Insel teilt (Base64-encoded Grid) | Engineer | ✅ Done (🔗-Button, btoa/atob, ?insel= URL-Parameter) |
| 23 | **Programmier-Tutorial** — NPCs bringen echtes JavaScript bei | Scientist + Engineer | 🔲 Offen |
| 24 | **AR-Modus** — Insel auf dem Tisch via WebXR | Engineer | ❄️ Eingefroren |
| 25 | **Hörspiel-Aufnahmen** — Professionelle Sprecher für die Hörspiele | Artist | ❄️ Eingefroren |
| 26 | **ZKM-Ausstellung** — "Mensch, Maschine, KI" als Installation | Leader + alle | ❄️ Eingefroren |

---

## Done (diese Session)

| # | Was | Commit |
|---|-----|--------|
| ✅ | Quest-System (11 Templates, Feynman-kalibriert) | 70d6e1f |
| ✅ | Achievement-System (12 Achievements) | 70d6e1f |
| ✅ | Sound-System (Web Audio API) | 70d6e1f |
| ✅ | Token Flywheel (Quests → Energie → Chat) | 70d6e1f |
| ✅ | 5 Themes (Tropical, Night, Candy, Ocean, Retro) | 70d6e1f |
| ✅ | Wetter-System (Regen, Sonne, Regenbogen) | 70d6e1f |
| ✅ | Day/Night Cycle (Echtzeit) | caf8bb4 |
| ✅ | Charakter-Währungen (7 NPCs) | 3a3f083 |
| ✅ | Kindersicherheit (Anti-Jailbreak, Input-Sanitizing) | 70d6e1f |
| ✅ | NPC-Parenting (Cringe-Platitüden) | 70d6e1f |
| ✅ | Bernd das Brot (Eltern-Support) | 5f5a5a1 |
| ✅ | LLM-Persönlichkeiten (Open Source = Freidenker) | bcb528f |
| ✅ | Code-Zauber ("baue 5 bäume" → es passiert) | 8aeca3a |
| ✅ | Code-View (</> Button) | 8aeca3a |
| ✅ | Insel Java (18 Programmiersprachen-Bewohner) | c762ffa..a3f9cc0 |
| ✅ | Spontan-Hörspiele (6 Szenen) | e086f8c |
| ✅ | Postkarte von Java (PNG-Download) | 5af4f2b |
| ✅ | Toast-Queue (Weber-Fix) | 5519cc2 |
| ✅ | Intro gekürzt (Salimi-Fix) | 306ba5c |
| ✅ | ARIA-Labels (Mandela-Fix) | a9ea3f2 |
| ✅ | Padawan-Codex-Dateien (5 Padawans) | f64b33b |
| ✅ | Testkonzept (5 Testkinder, 5 Hypothesen) | e0695e6 |
| ✅ | Feynman-Messpunkte (Session-Uhr + Milestones) | 63d09be |
| ✅ | Anonyme Testdaten-Sammlung (Clipboard + Webhook) | 94f612c |
| ✅ | Favicon + Meta + Schnittmarkierungen | 5144a9b |
| ✅ | BYOK Dialog (Bring Your Own Key) | d0c011a |
| ✅ | config.js Zero-Setup (Key einmal, nie wieder) | e5cfb5b |
| ✅ | Hirn-Transplantation (pro Charakter anderes Modell) | 141eb7d |
| ✅ | Charakter-Freischaltung (Starter + Unlock durch Quests) | 3e1f7b2 |
| ✅ | Auto-Save (30s + beforeunload + Restore) | 7f4ce66 |
| ✅ | Mobile Toolbar + Palette (horizontal scroll) | 5a5fa51 |
| ✅ | Accessibility (ARIA Dialoge, Escape-Key) | f017d5a |
| ✅ | Spielername + Intro-Polish | a12bed1 |
| ✅ | Undo (Strg+Z, 50 Schritte) | 30faac3 |
| ✅ | Keyboard-Shortcuts (B/D/F) | 30faac3 |
| ✅ | NPC-Stimmen geschärft (Elefant/Krabs/Tommy) | 899cb9d |
| ✅ | Bug-Fixes: Unlock-Threshold, Model-Selection | f017d5a |
| ✅ | 五行 Wu Xing: 5 Elemente (Metall/Holz/Feuer/Wasser/Erde) | 0cc40e7 |
| ✅ | Harvest-System: Ernten ersetzt Axt+Abreißen | 789fd1a |
| ✅ | Palette-Unlock: Crafting schaltet Artefakte frei | 789fd1a |
| ✅ | 五音 Element-Töne (pythagoräische Pentatonik) | f7f17d0 |
| ✅ | Palette als Klavier (Kind-Feature-Request) | 6b53fd3 |
| ✅ | Regenbogen als Hintergrund-Effekt | 61dda7a |
| ✅ | 20 Crafting-Rezepte, alle Quests lösbar | e743185 |
| ✅ | Save-Migration (alte Saves ohne unlocked) | be08f18 |
| ✅ | Infinite Craft — LLM-generierte Rezepte mit KV-Cache | 695eff10 |
| ✅ | Entdecker-System — Erster Finder steht am Rezept | 695eff10 |
| ✅ | /discoveries Leaderboard-Endpoint | 8cf45f0c |
| ✅ | Labels weg + Erde braun + Wasser blau | a75cb576 |
| ✅ | Requesty Migration (Langdock → Requesty) | 01a52fb |
| ✅ | Wu Xing Farben korrekt (Holz=Qing) | 01a52fb |
| ✅ | Easter Egg Fix: C war nicht Erster | 38a711b |

---

## 🌍 Schöpfungsgeschichten — Konzepte für Insel-Genesis

Idee: Die leere Insel (nur Wasser) wird in einer Sequenz erschaffen. Verschiedene Schöpfungs-Mythen als A/B-Varianten. Alle kindgerecht, alle mit demselben Gameplay-Unterbau.

### Variante A — Bibel (monotheistisch)
> "Am Anfang war das Wort. Und das Wort war bei Gott. Und die Erde war wüst und leer."

- Tag 1: Licht (Tageszeit-System schaltet sich ein)
- Tag 2: Himmel und Wasser (Ozean erscheint, Hintergrund wird blau)
- Tag 3: Erde (erste Inselkacheln tauchen auf, Pflanzen erscheinen)
- Tag 4: Sonne, Mond, Sterne (Wetter-System, Day/Night-Cycle)
- Tag 5: Fische und Vögel (Fisch-Material freigeschaltet)
- Tag 6: Tiere und der Mensch / Schnipsel kommt auf die Insel
- Tag 7: Ruhetag (Sonntag) — **Postkarte wird freigeschaltet**. Insel "rastet". Eigenmotivation: Kinder schließen das Tutorial ab, weil die Postkarte wartet — nicht weil sie müssen. Bernd ist für alle Fragen da, kein Hilfetext im Tutorial selbst.

### Variante B — Griechische Mythologie
> "Am Anfang war das Chaos — formlos, unendlich, dunkel."

- Gaia (Erde) steigt aus dem Chaos: Insel erscheint
- Kronos (Zeit): Day/Night-Cycle schaltet sich ein
- Poseidon: Ozean erscheint drumherum, Boote werden freigeschaltet
- Hephaistos (Feuer + Metall): Erste Handwerksmaterialien
- Demeter (Ernte): Pflanzen, Bäume, Harvest-System
- Prometheus gibt Feuer → Code-Zauber schaltet sich ein (Worte werden Dinge)
- "Du bist der neue Architekt. Die Götter haben gebaut. Jetzt du."

### Variante C — Maori (Ozeanisch)
> "Te Kore — die Leere. Te Pō — die Nacht. Te Ao — das Licht."

- Ranginui (Himmel) und Papatūānuku (Erde) werden getrennt → Licht entsteht
- Tāne (Wälder): Bäume wachsen, Wald-Materialien freigeschaltet
- Tangaroa (Ozean): Wasser erscheint, Fische kommen
- Rongo (Pflanzen): Garten-Materialien
- "Die Insel singt. Baue damit sie bleibt."

### Variante D — Nordisch
> "Im Anfang war Ginnungagap — die gähnende Leere."

- Aus Eis und Feuer entsteht Yggdrasil (Baum der Welt): erster Baum erscheint
- Odin, Vili, Ve formen die Welt: Insel wächst
- Dwarfs (Zwerge) schmieden: Metall-Crafting freigeschaltet
- Thor: Wetter-System, Blitz bei Regen
- Loki: Easter Eggs, versteckte Dinge auf der Insel
- "Ragnarök kommt irgendwann — die Insel verschwindet. Heute nicht."

### Variante E — Tao / Wu Xing (bereits im Spiel)
> "Das Tao gebar das Eine. Das Eine gebar das Zwei. Das Zwei gebar das Drei. Das Drei gebar die zehntausend Dinge."

- Bereits umgesetzt als 五行 (Metall, Holz, Feuer, Wasser, Erde)
- Könnte als "Origin Story" verpackt werden statt nur als Materialien

### Nächste Schritte (wenn bereit)
- A/B Test: Bibel vs. Griechisch (welche kommt bei Kindern besser an?)
- Feynman definiert Messpunkt: "Wie lange bis erstes freies Bauen nach Tutorial?"
- Ogilvy formuliert die Texte (kindgerecht, maximal 1 Satz pro Schritt)
- Rams entscheidet: 7 Level Tutorial oder 3? (Kinder verlieren nach 3 Klicks Geduld)

---

## 🔧 Offene Punkte aus Session 2026-03-29

| # | Item | Prio | Owner |
|---|------|------|-------|
| 27 | **Cloudflare Worker CORS fixen** — User muss worker.js im Dashboard deployen | P0 | User |
| 28 | **Chat-Fenster nicht überlappend** — als Sidebar oder unten, kein Overlay über Canvas | P1 | Designer |
| 29 | **NPC-Emoji eindeutig** — Tommy=🦞 ✅, alle anderen prüfen, kein Doppler | ✅ Done (tommy: 🎬→🦞, kein Doppler) | Artist |
| 30 | **Tonhöhe zu Elementen** — Feuer=höher, Erde=tiefer, Wasser=fließend | P1 | Scientist |
| 31 | **Bauen/Ernten/Füllen Icons** — universelle Symbole statt Text-Labels | P1 | Designer |
| 32 | **Code-Ebenen per Touch** — Rechts/Links-Swipe statt Rechtsklick | P1 | Engineer |
| 33 | **Header-Title "Schatzinsel"** — aktuell "Schnipsels Insel-Architekt" | P2 | Designer |
| 34 | **NPCs antworten in User-Sprache** — Eingabe Englisch → Antwort Englisch | P2 | Scientist |
| 35 | **Eigene NPCs craften** — Custom-Charakter aus Materialien bauen | P3 | alle |
| 36 | **Wigald Boning & Willy Astor** — noch kein Symbol, kein Slot, kein Konzept | P3 | Artist |
| 37 | **Schöpfungsgeschichte als Tutorial** — 7 Level, Insel beginnt als reines Wasser | P2 | Leader |
| 38 | **A/B Test Mythologie** — Bibel vs. Griechisch vs. Maori vs. Nordisch | P2 | Scientist |
| 39 | **Tutorial-Gating: Postkarte erst in Schritt 7 (Sonntag)** — Motivation, Tutorium ohne Hilfetext abzuschließen | P2 | Engineer |
| 40 | **Insel-Identität zurückbringen** — Wasser-Rand sichtbar, Strand-Gradient, Palmen-Starter, Canvas fühlt sich an wie Insel nicht wie Spreadsheet | ✅ Done (WATER_BORDER, Strand-Gradient, 8 Palmen-Starter, Grid-Linien nur auf belegten Zellen) | Designer + Engineer |
| 41 | **Sidebar Tabs** — nur eine Sektion sichtbar (Inventar/Quests/Erfolge als Tabs), nicht alles gestapelt | ✅ Done (.sidebar-tab System implementiert) | Designer |
| 42 | **Werkbank als Canvas-Drag** — Drag Element-A auf Element-B statt 3×3 Modal (Infinite Craft Pattern) | P2 | Engineer |
| 43 | **Save-System** — localStorage Grid-Persist, Oskar baut nicht nochmal | ✅ Done | Engineer |
| 45 | **Canvas 16:9 auf PC, iPad-Ratio auf iPad, iPhone-Ratio auf iPhone** — Grid-Dimensionen responsive | ✅ Done (COLS/ROWS responsive nach Viewport) | Engineer + Designer |
| 46 | **Drag & Drop Crafting** — Materialien auf Canvas ziehen statt Klick (Oscars Wunsch) | ✅ Done (Sprint 21) | Engineer |
| 47 | **Quests/Achievements zu schnell** — Schwierigkeitsgrad erhöhen, passen nicht zur leeren Insel | ✅ Done (Baseline-Tracking ab Annahme, max 2 aktive Quests) | Scientist |
| 48 | **NPCs nicht sichtbar** — Chat-Button/NPCs tauchen nicht auf bei schatzinsel.app | ✅ Done (chat-bubble immer sichtbar) | Engineer |
| 49 | **Bernd Support-Chat fehlt** — Bernd als Hilfe-NPC nicht erreichbar | ✅ Done (Bernd im chat-character Select) | Engineer |
| 50 | **Höhle = Dungeon-Framework** — 3 Akte (Goethe), aber Inhalt ist austauschbar. Mögliche Dungeons: **IT** (Bits→Kernel→Browser), **Kosmologie** (Quarks→Atome→Sterne), **Jim Knopf** (Bürokraten→Drachen→Kummerland), **bunte Mischung**. Jeder Dungeon hat: Akt 1 (Einstieg), Akt 2 (Transformation), Akt 3 (Mandelbrot/Endlos). Welcher Dungeon erscheint = emergent. PR #13 als Basis. | P1 | alle |
| 51 | **Wu Xing Philosophie im Craft-Prompt** — Holz=Expansion, Feuer=Aktion, Erde=Wandlung, Metall=Reife, Wasser=Ruhe | ✅ Done (worker.js Craft-Prompt + Beispiele) | Scientist |
| 52 | **Kung Fu Panda Wuxi** — Ästhetik-Inspiration für Wu Xing Elemente | P2 | Artist |
| 53 | **Echtes Atlantik-Wetter** — Open-Meteo API (29°N, 31°W — halber Weg Martinique↔Bayonne), 🌊 im Meer wetterabhängig | ✅ Done (Open-Meteo fetch bei game.js:1434) | Engineer |
| 57 | **Stille-Momente** (Ende) — Leere Meerpassagen zwischen Inseln. Kein UI, kein Toast. Nur Wellen und Wind. Oscar denkt nach. | P1 | Designer |
| 58 | **Unsinn-Rezepte** (Lindgren) — Feuer+Pfannkuchen=?, Drache+Kuchen=?, unlogisch aber wunderbar | P2 | Artist |
| 59 | **10-Sekunden-Erster-Moment** (Paluten) — Erster Block in 10 Sek, nicht 30. Intro kürzen. Tao-Glow-Puls hilft. | P0 | Designer | ✅ Done (9f8a0bf) |
| 60 | **Haikus am Strand** (Krapweis) — Jede Insel-Station: 5-7-5 Schild am Strand statt Tutorial-Text | P2 | Artist |
| 61 | **Konsequenz** (Habeck) — Baum fällen = Baum weg. Brunnen bauen = Blumen wachsen. Welt reagiert. | ✅ Done (Baum→Stumpf→Setzling; Brunnen→Blumen: updateWorldConsequences(); Wasser→Blumen, Feuer→Asche: e002de7) | Engineer |
| 62 | **Mehrsprachige NPCs** (Habeck) — Lummerland = alle willkommen. NPCs antworten in Oscars Sprache oder der Sprache der Insel. | P2 | Scientist |
| 63 | **Erster Block = lautes KLONK** (Paluten) — Bau-Sound muss in 30 Sek auffallen. Lautstärke hoch, befriedigend, Minecraft-Niveau. Pentatonik ist schön aber zu subtil für den ersten Moment. | P1 | Engineer + Scientist |
| 64 | **Elektronen = Crafting-Blitz** — unsichtbares Feature: beim Craften blitzen kurze Lichtfunken zwischen den Materialien (Ladungsaustausch). Kein UI, kein Label. Amélie. | ✅ Done (spawnCraftSparks() — 8 Funken, 80ms versetzt) | Engineer |
| 65 | **Neutrino-Spieler** — Analytics: Kinder die spielen ohne zu craften, die nur bauen/schauen. Eigene Metrik. "Sie sind da, verändern nichts, und das ist auch ok." (Lesch) | P2 | Scientist |
| 66 | **Spielfigur-Bewegung laggt** — Pfeiltasten haben großen Zeitversatz, manchmal keine Reaktion. "Papa, warum kann ich mich nicht bewegen?" (Oscar) | ✅ Done (Sprint 19) | Engineer |
| 67 | **Automerge wie 2048** — RGB nebeneinander → Metall entsteht automatisch (starke Kernkraft). Schwarz neben Weiß → Qi/Energie (Strahlung). Wie 2048 auf dem Tesla-Bildschirm. Oscar liebt es. | ✅ Done (automerge.js mit MERGE_RULES + TRIPLET_RULES) | Engineer + Scientist |
| 68 | **Tutorial sichtbar machen** — Tao-Button pulsiert golden bis zum ersten Klick. | ✅ Done | Designer |
| 69 | **Entdeckte Elemente sichtbar** — Fortschritt der Genesis-Stufen anzeigen (0→1→3→5→10.000). Welche Stufe bin ich? | ✅ Done (updateGenesisBadge() bei game.js:2610, 道→⚫⚪→五行→✨→万+) | Designer |
| 70 | **KLONK vor erstem Block** — Erster Sound = KLONK (laut, Minecraft-Niveau). Danach Pentatonik. | P0 | Engineer | ✅ Done |
| 71 | **Palette = Instrument = Bauwerk** — Links spielen = rechts bauen. Gleichzeitig. Melodie UND Architektur in einem Flow. Denken und Tun verschränkt. Quantenverschränkung als Spielmechanik. Jede Reihe auf dem Canvas = eine Melodie-Spur. Replay = das Bauwerk als Song abspielen. | P1 | alle |
| 72 | **Das Buch** — Chatverlauf als Kapitel. Struktur: Prolog (plant-care-game), Akt 1 Dark Ages (Free→Pro→Teams), Akt 2 Inflation (Max, 32MB-Nacht), Akt 3 Big Crunch ("Papa warum kann ich mich nicht bewegen?"), Epilog (Oscar baut weiter). Hubble-Korrektur: keine Sterne am Anfang. Kükens: Tokens leer = Supernova (Langdock→Requesty). Schröder: "Nächste Folge 5 Kinder testen." /buch Skill erstellt. | P2 | Artist + Leader |
| 73 | **Suchregeln-Optimierung 8D-Vektorraum** — Aktuell 13 Regeln → 99.5% Abdeckung. Ziel: auf ~10 Regeln reduzieren (d + ⌈d/4⌉), Rest probabilistisch. Weniger Regeln = weniger Tokens an die KI = billiger + schneller. Feynman misst Abdeckungsgrad pro Regel, Torvalds implementiert den Cutover deterministisch→probabilistisch. | P2 | Scientist + Engineer |
| 74 | **NPC-Persönlichkeiten differenzieren** — Few-Shot-Beispiele, STIMME/TICK/ZIEL, Temperature pro NPC. KINDERSICHERHEIT 40→2 Zeilen. | P1 | Artist + Scientist | ✅ Done |
| 75 | **Wunschfee Floriane** — Oscar will eine Wunschfee. Neuer NPC: Floriane die Wunschfee. Kindgerecht, magisch, erfüllt kleine Wünsche auf der Insel. | P1 | Artist + Engineer | ✅ Done (Sprint 19) |
| 76 | **Craft-Ergebnis visuell zeigen** — Emoji + Name + Bounce-Animation in Result-Box. | P1 | Designer + Engineer | ✅ Done |
| 77 | **Rewind/Zeitreise** — Baugeschichte rückwärts abspielen wie Kassettenrekorder. Undo-History als Animation. | P2 | Engineer |
| 54 | **Jim Knopfs Welt als offene Inselkarte** — Lummerland (Tutorial) → Meer → Mandala/Ping → Wüste (Turtur) → Drachenstadt → Kummerland → Schatzinsel. Nicht linear, Oscar wählt. Boot craften = nächste Insel. **Goldener Pfad**: Abendsonne malt Lichtstreifen aufs Meer Richtung nächste Insel — kein UI, nur Licht. **Wachsende Verantwortung**: Lummerland=für sich, Mandala=?, Wüste=Hilfe annehmen (Turtur=Scheinriese: aus der Nähe anders als von weitem), Drachenstadt=?, Schatzinsel=für alle. Jede Station muss an Michael Ende rückgekoppelt werden — wir interpretieren nicht, wir lesen. | P1 | alle |
| 55 | **Spielfigur auf der Insel** — Kind benennt selbst (max 8 Buchstaben), bewegbar mit Pfeiltasten (PC) oder Finger-Drag (Touch) | P1 | Engineer + Designer | ✅ Done (Sprint 7) |
| 56 | **Bibliothek von Alexandria** — Gebäude auf der Insel (Stein+Bretter+Wissen), Schriftrollen statt Bücher, jede Rolle = Wiki-Game-Challenge ("Von Wasser zu Drache in X Schritten"). Timbuktu als zweite Bibliothek — wer beide baut verbindet zwei Wissenswelten. Papyrus vor Gutenberg. Wikipedia von damals. | P2 | alle |
| 78 | **Tesla-Nutzertest auswerten** — 1h Video von Oscar im Tesla (Auto-Touchscreen). Datei >1GB, muss kleiner formatiert werden (komprimieren/schneiden), dann hier rein. Da ist Gold drin — tonnenweise. Echte Nutzerdaten, echte Reaktionen, echter 8-Jähriger. | P0 | Scientist + Leader |
| 79 | **Hau-den-Lukas Mini-Game zurückbringen** — Existierte als eigenständige HTML-Seite (hau-den-lukas.html, 441 Zeilen). Pump-Check-Game. Bei Main→Branch-Migration nicht mitgenommen. Code lag auf Main, muss neu integriert oder als separates Mini-Game verlinkt werden. | P3 | Engineer |
| 80 | **docs/PROJECT.md + DESIGN.md + DECISIONS.md neu aufsetzen** — Bei Branch-Migration verloren gegangen. Inhalte teilweise in ARCHITECTURE.md, aber eigenständige Dateien fehlen. CLAUDE.md referenziert sie beim Session-Start. | P1 | Leader |

---

## Priorisierungs-Regel

**Einstein entscheidet.** Bei Gleichstand: Mandela-Bedingung gewinnt (Zugänglichkeit vor Features). Feynman misst ob es sich gelohnt hat.
