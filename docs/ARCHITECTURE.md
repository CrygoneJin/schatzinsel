# Architektur

## Stack

- **HTML5 + CSS3 + Vanilla JavaScript**
- Kein Framework, kein Build-Tool
- Canvas-basiertes Grid für das Bauen
- localStorage für Speichern/Laden

## Dateien

| Datei | Zweck | Zeilen |
|-------|-------|--------|
| `index.html` | HTML-Struktur | ~310 |
| `style.css` | Styling, Themes, responsive | ~1.400 |
| `game.js` | Spiellogik (Monolith, Split geplant) | ~4.400 |
| `chat.js` | NPC-Chat, LLM-Integration | ~910 |
| `worker.js` | Web Worker für Hintergrund-Tasks | ~90 |
| `config.example.js` | BYOK-Template (API-Keys) | ~30 |

## CI/CD

| Was | Wie |
|-----|-----|
| Trigger | Push/PR gegen `main` |
| Syntax-Check | `node -c` auf alle `.js` (außer `worker.js`) |
| Smoke-Test | Puppeteer lädt `index.html`, prüft auf Laufzeitfehler |
| Deploy | GitHub Pages via `actions/deploy-pages@v4` |
| Version | SemVer-Tags (`v0.1.0`), Fallback `v0.COMMITS.SHA` |

Workflow: `.github/workflows/deploy.yml`

## Versionierung

- SemVer via Git-Tags: `./scripts/release.sh [major|minor|patch]`
- Version wird beim Deploy in `index.html` gestempelt (`<!--VERSION-->`)
- Badge unten rechts im Game-UI zeigt aktuelle Version
- Kein Tag = Fallback auf Commit-Count + SHA

## Starten

`index.html` im Browser öffnen — fertig.

---

## BYOK-Modell (Bring Your Own Key)

Eltern geben Langdock/Anthropic Key ein. Key bleibt im Browser (localStorage).
Wir sehen den Key nie. Spiel funktioniert auch ohne Key (Bauen, Quests, Achievements).
Chat ist Bonus, nicht Pflicht.

## Skalierungsplan

| Stufe | Trigger | Lösung | Kosten |
|-------|---------|--------|--------|
| **MVP** | Launch | GitHub Pages | 0€ |
| **Phase 2** | 100 User | Cloudflare Pages + Workers | 0€ (Free Tier) |
| **Phase 3** | 1000 User | + Supabase (Auth, DB, Leaderboard) | ~5€/Monat |
| **Phase 4** | 5000+ User | + Railway (LiteLLM Proxy, Voice) | ~25€/Monat |
| **Viral** | 10k+ | Vercel Edge + Supabase Pro + vapi.ai | ~50€/Monat |

### Phase 3: Supabase Schema (Entwurf)

```sql
users (id, email, created_at)
projects (id, user_id, name, grid_json, created_at)
achievements (id, user_id, achievement_key, unlocked_at)
leaderboard (id, user_id, engagement_score, blocks_total)
```

## Kennzahlen (Feynman-approved)

| KPI | Definition | Ziel MVP |
|-----|-----------|----------|
| DAU | Unique Besucher/Tag | 10 |
| Session-Dauer | Zeit von Start bis letztem Build-Event | > 5min |
| Blocks/Session | Blöcke pro Session | > 20 |
| Chat-Nutzung | % Sessions mit mindestens 1 Chat | > 30% |
| Quest-Completion | % angenommene Quests abgeschlossen | > 50% |
| Retention D7 | % User die nach 7 Tagen wiederkommen | > 20% |
| NPS | "Würdest du das Spiel weiterempfehlen?" | > 50 |

---

*Destilliert aus: HOSTING.md (2026-03-28, Jack Welch + Max Weber)*
