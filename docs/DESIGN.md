# Design — Schatzinsel

## Grundprinzipien

1. **Ein Kind muss es bedienen koennen** — kein Tooltip-Wissen, kein Kleingedrucktes
2. **Touch first** — primaeres Geraet ist ein iPad, alles muss mit Fingern funktionieren
3. **Wenig Text, viel Bild** — Icons und Farben statt Beschriftungen wo moeglich
4. **Kein Ladebildschirm** — sofort spielbar, progressive Enhancement

## Farben

Wu-Xing-Elemente definieren die Farbpalette:

| Element | Farbe | Verwendung |
|---------|-------|-----------|
| Holz | Gruen | Natur-Materialien, Wachstum |
| Feuer | Rot/Orange | Energie, Transformation |
| Erde | Braun/Gelb | Basis-Materialien, Boden |
| Metall | Grau/Silber | Werkzeuge, Struktur |
| Wasser | Blau | Fluessigkeiten, Bewegung |

Hintergrund: dunkel genug fuer Kontrast, hell genug fuer Kinder.

## Layout

- **Canvas** nimmt den Grossteil des Bildschirms ein
- **Toolbar** am Rand — Material-Auswahl, minimal
- **Chat** als Overlay/Panel — ein-/ausklappbar
- **Kein Hamburger-Menu** — alles sichtbar oder gar nicht

## Komponenten-Konventionen

- Vanilla HTML/CSS — keine Komponentenbibliothek
- CSS-Klassen: beschreibend, flach, kein BEM-Overkill
- Animationen: CSS transitions, kein JS-Animation-Framework
- Sounds: dezent, abschaltbar, nie erschreckend

## Accessibility

- **Mindestens AA-Kontrast** fuer alle Texte
- **Touch-Targets mindestens 44x44px** (Apple HIG)
- **Keine rein farbbasierte Information** — immer Icon oder Form dazu
- **Tastatur-Navigation** fuer Desktop: Tab-Reihenfolge muss Sinn ergeben
- **Kein Autoplay-Sound** — Sound erst nach erster Interaktion
- **Schriftgroesse**: mindestens 16px Basis, skalierbar

## Responsive Breakpoints

| Geraet | Breite | Anpassung |
|--------|--------|-----------|
| Handy | < 480px | Grid verkleinern, Toolbar unten |
| Tablet | 480-1024px | Primaerlayout, Touch-optimiert |
| Desktop | > 1024px | Mehr Grid sichtbar, Keyboard-Shortcuts |
