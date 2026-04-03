# UI-Audit Schatzinsel — Dieter Rams

**Datum:** 2026-04-03
**Getestet auf:** 1024x1366 (iPad-Portrait-Simulation via Playwright)
**URL:** https://schatzinsel.app

---

## Priorisierte Issue-Liste

### Prio 1 — Oscar kommt nicht klar

**#1 — Bernd ist nicht allein in der Chatbubble**
Beim Wechsel von SpongeBob zu Bernd (Support) bleibt die SpongeBob-Begruessung
("SpongeBob ist da!") stehen. Die Chat-History wird nicht pro NPC isoliert.
Oscar denkt, er redet noch mit SpongeBob, obwohl oben "Bernd (Support)" steht.
**Fix:** Chat-History pro Character-ID speichern und beim Wechsel austauschen.

**#2 — Model-Info leaked in die Chat-UI**
Die Systemnachricht zeigt "[Anthropic/haiku 4 5]" — internes Model-Routing,
das ein Kind weder versteht noch sehen sollte. Bricht die Immersion.
**Fix:** Model-Info aus der User-sichtbaren Nachricht entfernen. Nur in Console loggen.

**#3 — Sidebar-Tab-Buttons zu klein (22x36px)**
Die fuenf Tabs rechts (Insel, Rucksack, Quests, Trophaeen, Bauprojekte) sind
22x36px. Apple HIG verlangt mindestens 44x44pt. Oscar trifft die nicht mit
dem Finger — er trifft den falschen Tab oder gar keinen.
**Fix:** `min-width: 44px; min-height: 44px` auf alle Tab-Buttons. Padding statt
Margin fuer die Touch-Area.

### Prio 2 — Benutzbar, aber schlecht

**#4 — Toolbar-Overload: 47 Buttons**
Die Toolbar hat 47 Buttons. Das ist kein Werkzeugkasten, das ist ein Cockpit.
Ein 8-Jaehriger braucht 3 Werkzeuge (Pinsel, Spitzhacke, Eimer), nicht 47.
Die Datei-Aktionen (Speichern, Laden, Neu, Screenshot, Link) und die
Spezial-Tools (Craft, Code, Musik) sollten hinter einem Menu verschwinden.
**Fix:** Progressive Disclosure. Haupttools sichtbar, Rest hinter einem
Overflow-Menu (Hamburger oder "Mehr...").

**#5 — Hilfetext 12px bei 50% Opacity — unleserbar**
"Ernte Baeume fuer Holz!" ist 12px bei `rgba(255,255,255,0.5)`. Auf einem
iPad in der Sonne ist das unsichtbar. Auch "Lege Yin-Yang auf die Insel"
ist 12px bei 60% Opacity. WCAG AA verlangt Kontrastratio 4.5:1 fuer Text.
**Fix:** Mindestens 14px, mindestens `rgba(255,255,255,0.8)` auf dunklem Hintergrund.

**#6 — Hammer-Button nur 18px breit**
Der Craft-Button (Hammer) ist 18x44px — zu schmal zum Tippen.
**Fix:** Gleiche Breite wie andere Toolbar-Buttons (44px).

### Prio 3 — Kosmetik / technische Schuld

**#7 — Kein `viewport-fit=cover` in Meta-Tag**
Aktuell: `width=device-width, initial-scale=1.0`. Ohne `viewport-fit=cover`
wird auf iPhones mit Notch der Safe-Area-Inset nicht beruecksichtigt.
Im PWA-Standalone-Modus kann die UI hinter der Notch verschwinden.
**Fix:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
plus `padding: env(safe-area-inset-top)` auf Header.

**#8 — Kein `dvh` fuer Hoehe**
Die Seite nutzt kein `dvh` (dynamic viewport height). Auf iOS Safari
verschiebt die Adressleiste den Viewport — Elemente am unteren Rand
(Chat-Input, Yin+Yang-Banner) koennten abgeschnitten werden.
**Fix:** `min-height: 100dvh` statt `100vh` auf dem Root-Container.

**#9 — Code-View Zellen-Labels kaum lesbar**
Im Code-View sind die Materialnamen (qi, yin, yang, tao) extrem klein
und eng. Bei 11x11 Grid auf iPad ist jede Zelle ca. 30px breit — der
Text ist ~8px und nicht lesbar ohne Zoomen.
**Fix:** Tooltip bei Touch statt Inline-Label. Oder Abkuerzungen als
farbcodierte Punkte mit Legende.

**#10 — Energie/Geld-System unsichtbar**
Weder "Energie" noch "Geld" / "Muenzen" sind auf dem Screen sichtbar.
Wenn es zwei Wirtschaftssysteme gibt, muessen sie visuell getrennt und
erkennbar sein — sonst weiss Oscar nicht, was er ausgeben kann und wofuer.
**Fix:** Persistente Anzeige oben rechts: Energie-Balken + Muenz-Zaehler,
visuell klar getrennt (z.B. Blitz-Icon vs. Muenz-Icon).

---

## Zusammenfassung

| Prio | Issues | Kern-Problem |
|------|--------|-------------|
| 1    | #1-#3  | Oscar kann grundlegende Funktionen nicht nutzen (Chat verwechselt, Tabs nicht treffbar) |
| 2    | #4-#6  | Visuelle Ueberlastung und Lesbarkeit (zu viele Buttons, zu wenig Kontrast) |
| 3    | #7-#10 | Technische Schuld und fehlende Systeme (Safe Area, dvh, Wirtschaft) |

**Dieter-Rams-Urteil:** Weniger, aber besser. Das Spielfeld selbst ist gut —
die Bloecke sind klar, die Farben eindeutig, die Insel hat Charakter. Aber
die Werkzeuge drumherum erschlagen den Spieler. Ein Kind will bauen, nicht
ein Cockpit bedienen.
