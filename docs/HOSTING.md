# Hosting-Konzept — Schnipsels Insel-Architekt

## Aktuell: GitHub Pages + Cloudflare Worker + n8n Gateway

```
Browser (Spiel)
    ↓ POST
Cloudflare Worker (Edge)
    ├── CORS, Validierung, Sanitizing
    ├── Route 1: n8n Gateway (wenn konfiguriert)
    │   ├── Model-Routing pro NPC-Charakter
    │   ├── Logging (Token-Usage, Timestamps)
    │   └── → Langdock API (Key in n8n Environment)
    └── Route 2: Direkt Langdock (Fallback wenn n8n down)
```

**Kein API-Key im Browser. Nie. Unter keinen Umständen.**

---

## Setup: Cloudflare Worker

```bash
cd worker

# 1. Login
npx wrangler login

# 2. API Key als Secret (Fallback wenn n8n down)
wrangler secret put LANGDOCK_KEY

# 3. n8n Webhook URL als Secret
wrangler secret put N8N_WEBHOOK_URL
# → https://deine-n8n-instanz.com/webhook/insel-chat

# 4. Deployen
npx wrangler deploy
# → URL: https://insel-chat-proxy.dein-name.workers.dev
```

---

## Setup: n8n Gateway

### Langdock API in n8n einrichten

**Schritt 1: Environment Variable**
1. n8n Settings → Environment Variables
2. Name: `LANGDOCK_API_KEY`
3. Value: Dein Langdock API Key
4. Speichern, n8n neustarten

**Schritt 2: Workflow aktivieren**
1. Workflow "Insel Chat Gateway" öffnen (ID: LbuxYoemOlzMssC6)
2. Toggle oben rechts: Active → ON
3. Webhook-URL kopieren (steht im "Chat Request" Node)

**Schritt 3: Worker verbinden**
```bash
wrangler secret put N8N_WEBHOOK_URL
# → Webhook-URL aus Schritt 2
```

### Langdock API — Kurzreferenz

**Endpoint:** `https://api.langdock.com/openai/eu/v1/chat/completions`
**Format:** OpenAI-kompatibel
**DSGVO:** EU-hosted (Frankfurt)

**Header:**
```
Authorization: Bearer <LANGDOCK_KEY>
Content-Type: application/json
```

**Body:**
```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 150,
  "messages": [
    {"role": "system", "content": "Du bist SpongeBob..."},
    {"role": "user", "content": "Hallo!"}
  ]
}
```

**Model-Routing pro NPC (in n8n konfiguriert):**

| Modell | NPC | Kosten |
|--------|-----|--------|
| `claude-haiku-4-5-20251001` | Maus, Bernd, Känguru, Marc-Uwe, Willy | günstig |
| `claude-opus-4-5` | Elefant | teuer |
| `gemini-2.0-flash` | SpongeBob | günstig |
| `gpt-4o-mini` | Tommy | günstig |
| `llama-3.3-70b` | Mr. Krabs | günstig |
| `mistral-large-latest` | Neinhorn | günstig |

---

## Fallback-Logik

```
n8n erreichbar? → JA → n8n Gateway (smart routing + logging)
                → NEIN → Direkt Langdock (einfacher Proxy)
```

Chat geht immer — nur ohne Model-Routing und Logging wenn n8n down.

---

## Skalierungsplan

| Stufe | Trigger | Lösung | Kosten |
|-------|---------|--------|--------|
| **MVP** | Launch | GitHub Pages + CF Worker + n8n | 0€ |
| **Phase 2** | 100 User | + Supabase (Auth, DB, Leaderboard) | ~5€/Monat |
| **Phase 3** | 1000 User | + Railway (Voice Pipeline) | ~25€/Monat |
| **Viral** | 10k+ | Vercel Edge + Supabase Pro + vapi.ai | ~50€/Monat |

## Kosten

| Komponente | Kosten |
|------------|--------|
| Cloudflare Worker | Kostenlos (100k Requests/Tag) |
| n8n | Self-hosted: kostenlos |
| Langdock API | Pay-per-use, Haiku ≈ 0.001€ pro Chat |

Ein Kind das 50 Nachrichten schreibt kostet ~5 Cent.

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

## Kinderschutz (Defense in Depth)

Drei Schichten, jede validiert unabhängig:

| Schicht | Was | Wo |
|---------|-----|-----|
| **Edge** | Max 10 Messages, 500 Zeichen/Msg, POST-only | Cloudflare Worker |
| **Gateway** | Model-Routing, Rate Limiting (IP), Token-Cap 300 | n8n |
| **Prompt** | Kindersicherheit im System-Prompt, Anti-Jailbreak | chat.js |

---

*Erstellt 2026-03-28 | Linus (Infra) + Max Weber (Operations)*
