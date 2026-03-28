# Hosting-Konzept — Schnipsels Insel-Architekt

## Aktuell: GitHub Pages (MVP)

Statisches Frontend. Kein Backend. Kostenlos. Unbegrenzt.

- **URL**: `https://crygonejin.github.io/plant-care-game/`
- **Deployment**: Push to `main` → GitHub Pages baut automatisch
- **API-Kosten**: User bringt eigenen Key mit (BYOK)
- **DSGVO**: Keine Daten bei uns. Alles im Browser (localStorage)

## Skalierungsplan

| Stufe | Trigger | Lösung | Kosten |
|-------|---------|--------|--------|
| **MVP** | Launch | GitHub Pages | 0€ |
| **Phase 2** | 100 User | Cloudflare Pages + Workers | 0€ (Free Tier: 100k req/Tag) |
| **Phase 3** | 1000 User | + Supabase (Auth, DB, Leaderboard) | ~5€/Monat |
| **Phase 4** | 5000+ User | + Railway (LiteLLM Proxy, Voice) | ~25€/Monat |
| **Viral** | 10k+ | Vercel Edge + Supabase Pro + vapi.ai | ~50€/Monat |

## BYOK-Modell (Bring Your Own Key)

Phase 1-2: Jeder User nutzt seinen eigenen API-Key.
- Eltern geben Langdock/Anthropic Key ein
- Key bleibt im Browser (localStorage)
- Wir sehen den Key nie

Phase 3+: Optionaler Shared-Key mit Budget-System.
- Supabase Auth für User-Management
- API-Budget pro User pro Monat
- Free Tier: 1000 Nachrichten/Monat
- Premium: Unlimited (10€/Monat Familie)

## Warum kostenlos verschenken?

> "Das beste Marketing ist ein Produkt das so gut ist, dass Eltern es
> anderen Eltern empfehlen." — Jack Welch (team-sales)

1. Spiel funktioniert ohne API-Key (Bauen, Quests, Achievements)
2. Chat ist Bonus, nicht Pflicht
3. Kinder erzählen anderen Kindern
4. Eltern sehen: sicher, werbefrei, lehrreich
5. Name macht sich selbst

## Technische Anforderungen pro Phase

### Phase 2: Cloudflare Workers
```
// workers/llm-proxy.js
// Versteckt API-Keys, Rate-Limiting, Model-Routing
// Cloudflare Workers Free: 100k req/Tag, 10ms CPU
```

### Phase 3: Supabase
```
-- tables
users (id, email, created_at)
projects (id, user_id, name, grid_json, created_at)
achievements (id, user_id, achievement_key, unlocked_at)
leaderboard (id, user_id, engagement_score, blocks_total)
```

### Phase 4: Railway
```
# LiteLLM Proxy für Multi-Model-Routing
# vapi.ai Voice Pipeline
# docker-compose.yml mit litellm + redis
```

## Kennzahlen (Feynman-approved)

| KPI | Definition | Ziel MVP |
|-----|-----------|----------|
| DAU | Unique Besucher/Tag | 10 |
| Session-Dauer | Zeit von Start bis letztem Build-Event | > 5min |
| Blocks/Session | Blöcke pro Session | > 20 |
| Chat-Nutzung | % Sessions mit mindestens 1 Chat-Nachricht | > 30% |
| Quest-Completion | % angenommene Quests die abgeschlossen werden | > 50% |
| Retention D7 | % User die nach 7 Tagen wiederkommen | > 20% |
| NPS | "Würdest du das Spiel weiterempfehlen?" (Bernd fragt) | > 50 |

---

*Erstellt 2026-03-28 | Jack Welch (Skalierung) + Max Weber (Operations)*
