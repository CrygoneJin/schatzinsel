# Metrik-Audit — Feynman × Heidegger

Stand: 2026-04-04

---

## Feynman: Was wir messen

### Session Clock Milestones (`analytics.js:56-77`)

| Milestone | Was | Wie gemessen | Sauber? |
|-----------|-----|-------------|---------|
| `firstBlock` | Zeit bis erster Block platziert | `recordMilestone('firstBlock')` in game.js | ✅ Sauber — direkt beim Platzieren |
| `firstChat` | Zeit bis erster NPC-Chat | `recordMilestone('firstChat')` in chat.js | ✅ Sauber |
| `firstCodeView` | Zeit bis Code-Ebene geöffnet | `recordMilestone('firstCodeView')` in game.js | ✅ Sauber |
| `firstEasterEgg` | Zeit bis erstes Easter Egg | `recordMilestone('firstEasterEgg')` | ⚠️ Nicht überall getriggert — nur explizite Easter Eggs, nicht Dungeon |

**Fehlende Milestones:**
- `firstCraft` — wann craftet das Kind zum ersten Mal? Crafting ist der Kern, aber kein Milestone.
- `firstSail` — wann segelt das Kind? Größter Discovery-Moment, nicht gemessen.
- `firstNpcMemory` — wann wird das Kind erkannt? Emotionaler Höhepunkt, keine Metrik.

### Engagement Score (`analytics.js:161-168`)

```
(duration > 30s ? 20 : 0) + (blocks > 0 ? 20 : 0) + (chat ? 20 : 0)
+ (quest_done ? 20 : 0) + (easter_egg ? 10 : 0) + (materials > 3 ? 10 : 0)
```

**Kritik:** Score ist binär pro Kategorie — 1 Block = 100 Blocks = gleiche 20 Punkte. Kein Gradient. Ein Kind das 5 Minuten baut und eines das 45 Minuten baut bekommen denselben Score wenn beide >30s und >0 Blocks haben.

**Vorschlag:** Gradient einführen. `min(20, duration_s / 15)` statt `duration > 30 ? 20 : 0`.

### Discovery/Craft Ratio (`analytics.js` — nur im Webhook-Payload)

Berechnet als: `discovery_count / crafts_count`. Ziel: >3.

**Problem:** `discovery_count` fehlt in `collectTestData()`. Es wird nur im separaten Discovery-Tracking-PR (#223) als Webhook-Feld geliefert, aber nicht in den Standard-Testdaten. Zwei verschiedene Wahrheiten.

### Neutrino Score (`analytics.js:148-150`)

```
crafts=0 && chats=0 → 1.0 (Geist)
crafts<3 && chats<3 → 0.5 (Beobachter)
sonst → 0.0 (Teilnehmer)
```

**Kritik:** Invertiert. Score 0.0 = maximale Interaktion. Gegenintuitiv. Und 3 ist ein willkürlicher Schwellenwert — warum nicht 5?

### D1 Webhook Payload (`analytics.js:151-171`)

| Feld | Quelle | Problem |
|------|--------|---------|
| `player_name` | localStorage | Kann leer sein ("Anonym") |
| `blocks_placed` | `gameStats.total` | ✅ |
| `crafts_total` | `data.builds` | ⚠️ Heißt `builds` — zählt build-Events, nicht Crafts! Falsche Benennung. |
| `chat_messages` | chats + hasChat | ⚠️ Mischt Event-Count mit Milestone-Boolean |
| `unique_materials` | `gameStats.uniqueMats` | ✅ |
| `engagement_score` | Formel oben | ⚠️ Binär, kein Gradient |

### Was fehlt komplett

- **Kein Retention-Tracking.** Wie oft kommt dasselbe Kind zurück? `sessions` zählt, aber kein Kohortenvergleich.
- **Kein Funnel.** Welcome → BigBang → erster Block → erster Craft → erster NPC → erstes Segeln. Wo brechen Kinder ab?
- **Kein Error-Tracking.** `window.onerror` wird nicht geloggt. Crashes sind unsichtbar.
- **Kein Geräte-Tracking.** `screen` ist nur im Bug-Report, nicht in der Session.

---

## Heidegger: Was wir beschreiben aber nicht messen

### Zuhandenheit (das Tool verschwindet)

| Element | Zuhanden? | Begründung |
|---------|-----------|------------|
| **Palette → Block platzieren** | ✅ Ja | Hover = Sound = Material wählen = Klick = Block. Kein Menü, kein Modal. Das Kind denkt "Baum" nicht "material-btn click handler". |
| **BigBang-Intro** | ⚠️ Teils | Erstbesucher: Singularität → Countdown → Urknall → Grid ist ein Erlebnis. Wiederkehrende: Name eingeben → Start → sofort Grid. Das Intro ist zuhanden beim ersten Mal, danach überflüssig (richtig gelöst — nur bei !localStorage). |
| **NPC-Chat** | ✅ Ja | Kind tippt auf NPC → Dialog erscheint → ELIZA antwortet. Kein "Lade Chat-System...". Sofort da. |
| **NPC-Erinnerung** | ✅ Ja | "Hey Oscar, gestern hast du viel Holz gebaut!" — das Kind fühlt sich erkannt, nicht getrackt. Zuhandenheit par excellence. |
| **Crafting** | ⚠️ Teils | Rezepte sind versteckt bis entdeckt. Das ist gut (Discovery). Aber: kein visuelles Feedback welche Kombinationen möglich sind. Kind probiert blind. |
| **Segelboot → Insel** | ✅ Ja | Boot craften → Dialog → Insel wählen → segeln. Keine Ladezeit, kein Menü. |

### Vorhandenheit (das Tool wird sichtbar)

| Element | Vorhanden? | Problem |
|---------|-----------|---------|
| **API-Key-Dialog** | ❌ Vorhandenstes Vorhanden | Kind sieht "sk-..." Eingabefeld. Gestell pur. Muss hinter Eltern-Pin. |
| **Testdaten-Button** | ⚠️ | Nur bei `?test`. Aber wenn sichtbar → Kind sieht JSON. Bricht Immersion. |
| **Engagement Score** | ❌ | Ist unsichtbar für das Kind. Gut. Aber wenn Eltern es sehen (Dashboard) → wird das Kind zum Datenpunkt. |
| **Toolbar-Overflow** | ⚠️ | Auf kleinen Screens (iPhone SE) wird die Palette abgeschnitten. Kind scrollt → Tool wird sichtbar. |

### Gestell-Warnung: Wo wird das Kind zum Datenpunkt?

1. **Neutrino Score.** Misst "Geist vs. Teilnehmer". Das Kind wird klassifiziert. Ist das nötig? Oder reicht Engagement Score?
2. **A/B-Test.** `assignABTest()` existiert. Das Kind ist Versuchsobjekt. Solange kein aktiver A/B-Test läuft: kein Problem. Aber die Infrastruktur wartet.
3. **beforeunload Webhook.** Jede Session wird gemeldet. Das Kind weiß es nicht. Transparenz fehlt. DSGVO-Frage (Kinder unter 16).

### Lichtung: Wo entsteht Staunen, das keine Metrik erfasst?

- **Der Moment wenn das erste Mal Musik beim Bauen erklingt.** Kein Event. Kein Milestone. Nur ein Kind das lächelt.
- **Wenn Mephisto zum ersten Mal flüstert.** Gänsehaut. Nicht messbar.
- **Wenn Oscar "Lummerland" sagt und die Insel erscheint.** Magie. `trackEvent('sail')` erfasst den Klick, nicht das Leuchten in den Augen.
- **Wenn ein NPC sagt "Du warst gestern hier."** Zugehörigkeit. Kein Score dafür.

---

## Synthese: Feynman × Heidegger

### Wo widersprechen sich Messen und Erleben?

| Metrik | Misst | Erlebt wird |
|--------|-------|-------------|
| `ms_firstBlock` | Sekunden bis Klick | Moment der Entscheidung "Ich baue jetzt" |
| `engagement_score` | 6 binäre Checkboxen | Ob ein Kind glücklich war |
| `neutrino_score` | Aktivitäts-Schwellenwert | Ob ein Kind in die Welt eingetaucht ist |
| `crafts_total` | Anzahl build-Events | Kreativität |
| `duration_s` | Uhrzeit | Vergessene Zeit (Flow) |

### Was messen wir, das wir nicht messen sollten?

- **Neutrino Score** — Kinder die still beobachten sind keine "Geister". Stille Beobachtung ist eine valide Spielweise. Der Score bestraft Kontemplation.

### Was erleben Kinder, das wir messen müssten?

- **Rückkehr.** Kommt das Kind morgen wieder? `sessions` zählt, aber nicht wann und warum.
- **Eigennamen.** Wenn Oscar seine Insel "Schatzinsel" nennt statt "Test123" — Ownership. Nicht gemessen.
- **NPC-Präferenz.** Welchen NPC besucht Oscar zuerst? Wer ist sein Freund? Wir messen `npc_chat`, aber nicht mit wem.

### Empfehlung

1. **`firstCraft` und `firstSail` als Milestones hinzufügen.** 2 Zeilen Code.
2. **Engagement Score als Gradient.** Nicht binär.
3. **`crafts_total` in Webhook umbenennen.** Aktuell zählt es `builds`, nicht Crafts. Lügt.
4. **Geräte-Info in Session-Payload.** `screen`, `userAgent`, `touch`. Für DEVICES.md-Verifizierung.
5. **Neutrino Score überdenken.** Invertiert, willkürlich, bestraft stille Spieler.
6. **DSGVO-Hinweis.** Kinder unter 16. `beforeunload` sendet Daten. Mindestens ein Satz auf der Seite.
