# Design System

## Canvas

Grid-based, Canvas 2D rendering. Responsive dimensions.
Grid lines only on occupied cells — island, not spreadsheet.

## Layout

| Viewport | Grid | Ratio |
|----------|------|-------|
| Desktop 27" 4K | 32×18 | 16:9 |
| iPad | 28×21 | 4:3 |
| iPhone SE | 18×28 | portrait |

Water border around island. Sand gradient at edge.

## Color system

| Element | Color range |
|---------|-------------|
| Wood | Green tones |
| Fire | Red tones |
| Earth | Brown/ochre |
| Metal | White/silver |
| Water | Blue tones |

## Themes

1. Tropical (default)
2. Night
3. Candy
4. Ocean
5. Retro (8-bit)

## Day/night + Weather

Real-time cycle. Weather system: rain, sun, rainbow.
Live Atlantic weather via Open-Meteo (29°N, 31°W).

## Sidebar

Tabs — one section visible at a time:
Inventory | Quests (max 2 active) | Achievements

## Mobile

- Horizontal scrollable palette
- Touch: drag & drop to build, swipe for navigation
- Toolbar: overflow-safe, buttons wrap on small screens
- Min touch target: 48px

## Accessibility

- ARIA labels on all interactive elements
- Tab navigation through all dialogs
- Escape closes any dialog
- WCAG AA contrast minimum
- No typing required — emoji over text

## Progressive Disclosure (Hick's Law)

Max 7 options visible pro Bereich. Alles wird durch Spielfortschritt
freigeschaltet — nicht nur Materialien, sondern auch Toolbar, Sidebar
und Chat. Kein Button ohne Funktion. Kein Menü ohne Inhalt.

### Freischaltungsstufen

| Stufe | Trigger | Toolbar | Palette | Sidebar | Chat |
|-------|---------|---------|---------|---------|------|
| 1 | Erstbesuch | Malen | Tao | — | — |
| 2 | Tao platziert | — | + Yin, Yang | — | + Bernd |
| 3 | Qi entdeckt | — | + Qi, Wu Xing | Insel-Info | — |
| 4 | Erstes Rezept | + Werkbank | + gecraftete | + Inventar | — |
| 5 | Erste Quest | — | — | + Quests | + NPCs |
| 6 | 10+ Materialien | + Karte, Musik, Wetter | — | + Achievements | — |

### Regeln

- Toolbar-Buttons erscheinen mit sanftem Fade (300ms)
- Neue Buttons pulsieren 3× dann normal (Aufmerksamkeit ohne Stress)
- Sidebar-Tabs erscheinen nur wenn sie Inhalt haben
- Chat-Bubble erst ab Stufe 2 (Bernd wartet bis Oscar gebaut hat)
- Werkbank erst wenn mindestens 1 Rezept entdeckbar ist
- Kein Tooltip nötig wenn der Button selbsterklärend ist (Emoji reicht)

## Typography

- German labels, short words
- Large click targets (min 48px)
- Tone: slightly funny, slightly exaggerated, never boring
