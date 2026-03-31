# Decisions — Schatzinsel

## Architekturentscheidungen

### Kein Framework (React, Vue, etc.)
**Warum**: Ein 8-Jaehriger braucht kein Virtual DOM. Vanilla JS ist schnell,
hat null Dependencies, laeuft ueberall, und der gesamte Code passt in den Kopf.
GitHub Pages served statische Files — fertig.

### Canvas statt DOM-Grid
**Warum**: Performance. Hunderte Bloecke im DOM sind langsam. Canvas rendert
alles in einem Rutsch. Nachteil: kein natives Click-Handling pro Block —
muss manuell ueber Koordinaten geloest werden.

### localStorage statt Backend-Datenbank
**Warum**: Kein Account, kein Login, keine DSGVO-Probleme mit Kinderdaten.
Spielstand lebt auf dem Geraet. Nachteil: kein Cross-Device-Sync.

### BYOK (Bring Your Own Key) fuer LLM-Chat
**Warum**: Kein API-Key auf dem Server = keine laufenden Kosten, kein
Missbrauchsrisiko, keine Haftung. Der Elternteil entscheidet ob und welchen
Key er eingibt.

### Eliza als Fallback
**Warum**: Wenn kein API-Key vorhanden, laeuft ein lokaler Eliza-Chatbot.
Kein Kind steht vor einem leeren Chat-Fenster.

### Cloudflare Worker fuer Analytics
**Warum**: GitHub Pages kann kein Server-Side. Der Worker sammelt anonyme
Session-Metriken in D1. Minimal, DSGVO-konform, keine Cookies.

### Wu Xing als Crafting-System
**Warum**: Fuenf Elemente sind ueberschaubar fuer Kinder, bieten aber
kombinatorische Tiefe. Die Zyklen (Erzeugung/Ueberwindung) ergeben natuerliche
Rezeptlogik.

## Bekannte technische Schulden

| Was | Warum es noch so ist | Prioritaet |
|-----|---------------------|-----------|
| Kein Build-Tool | Reicht fuer aktuelle Groesse, wird bei >20 JS-Files eng | Niedrig |
| Kein TypeScript | Schnelligkeit > Typsicherheit bei diesem Scope | Niedrig |
| Kein automatisches Testing | Manuelles Testen reicht bei einem Spieler | Mittel |
| localStorage-Limit (~5MB) | Reicht fuer aktuelle Spielstaende | Niedrig |
| Kein Service Worker | Offline moeglich aber nicht robust | Mittel |

## Offene Fragen

1. **Cross-Device-Sync** — Braucht Oscar seinen Spielstand auf mehreren Geraeten?
   Falls ja: Export/Import als JSON-File? Oder Cloud-Sync?
2. **Multiplayer** — Zusammen bauen? Wenn ja: WebRTC oder Server?
3. **Content-Pipeline** — Wie kommen neue Quests/Rezepte rein ohne Deploy?
4. **Moderation** — Braucht der LLM-Chat einen Content-Filter fuer Kinder?
