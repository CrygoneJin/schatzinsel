# Project — Schatzinsel

## Was ist das?

Schatzinsel ist ein browserbasiertes Bauspiel fuer Kinder. Der Spieler
platziert Bloecke auf einem Canvas-Grid, entdeckt Rezepte durch ein
Wu-Xing-Crafting-System (5 Elemente) und spricht mit NPCs via Chat.

## Warum existiert es?

Oscar (8) soll ein Spiel haben, das:

1. **Im Browser laeuft** — kein Download, kein App Store, kein Account
2. **Offline funktioniert** — localStorage, kein Server noetig
3. **Kreativitaet foerdert** — freies Bauen + elementbasiertes Crafting
4. **Gespraeche ermoeglicht** — NPC-Chat mit LLM-Integration (BYOK)
5. **Sicher ist** — keine Accounts, keine Daten auf fremden Servern

## Primaerer User

Oscar, 8 Jahre. Deutschsprachig. Spielt auf iPad und Desktop.
Sekundaer: andere Kinder im gleichen Alter, die den Link bekommen.

## Wo laeuft es?

- **Produktion**: [schatzinsel.app](https://schatzinsel.app) via GitHub Pages
- **Backend**: Cloudflare Worker (`worker.js`) fuer Analytics/Healthcheck
- **Datenbank**: Cloudflare D1 fuer Session-Metriken

## Kernmechaniken

| Mechanik | Beschreibung |
|----------|-------------|
| Grid-Bau | Canvas-basiertes Raster, Bloecke platzieren/entfernen |
| Wu Xing | 5-Elemente-System (Holz, Feuer, Erde, Metall, Wasser) |
| Rezepte | Kombinationen aus Materialien ergeben neue Materialien |
| Quests | Aufgaben die den Spieler durch die Welt fuehren |
| NPC-Chat | LLM-gestuetzter Dialog mit Charakteren |
| Blueprints | Vorgefertigte Bauprojekte zum Nachbauen |
| Screensaver | Idle-Modus wenn niemand spielt |
