# Architecture

## Stack

```
Browser (Vanilla JS + Canvas 2D)
  ├── localStorage (grid, inventory, unlocks, quests)
  ├── Cloudflare Worker /chat (LLM proxy → Requesty → Claude/GPT)
  ├── Cloudflare Worker /craft (Infinite Craft → LLM + KV cache)
  ├── Cloudflare Worker /voice (WebSocket → Gemini Live API)
  └── Open-Meteo API (real-time weather, optional)
```

No framework. No build tool. No npm for frontend.

## Communication Layer

```
┌──────────────────────────────────────────────────┐
│                   INSEL_BUS                      │
│                                                  │
│  Event Bus (pub/sub)                             │
│  ─────────────────────                           │
│  emit('craft:success')                           │
│  on('element:fire', fn)                          │
│  off(event, fn)                                  │
│                                                  │
│  Session Lock (localStorage heartbeat)           │
│  ─────────────────────────────────────           │
│  acquireSessionLock() / releaseSessionLock()     │
│  30s heartbeat, 2min stale detection             │
└──────────────────────────────────────────────────┘

Events (9 Emitter → 3+ Subscriber):
  block:placed, craft:success, element:*, merge:result,
  consequence:*, tts:start/end, session:conflict

Threads (extern, Agent-Tool):
  User → Leader → Engineer/Artist/Designer/Scientist
  Max 2 Hops. Kontext pro Hop. Kein Multi-Hop-Routing.
```

### Speicher-Hierarchie (Harvard, 3 Level)

**Implementiert:**

```
Level  Name       Zugriff    Größe   Wo
─────  ─────────  ─────────  ──────  ──────────────────────────────────────
L1i    Commands   lazy       208K    .claude/commands/*.md
L1d    Codizes    eager      52K     docs/masters/*.md, docs/padawans/*.md
L2     Team       eager      84K     ops/MEMORY.md, ops/SPRINT.md
L3     Org+Code   on-demand  1.1M+   docs/*.md, src/, ops/tests/, archive
```

**L1 = Harvard.** Instructions (commands/) und Data (masters/, padawans/)
getrennt. Verschiedene Zugriffsfrequenz: Commands lazy, Codizes eager.

**L2 = shared.** Session Lock schützt Schreibzugriff (INSEL_BUS.acquireSessionLock).

**L3 = alles andere.** Org-Docs, Codebase, Archiv, Git-History.
Innerhalb von L3 steigt Latenz mit Suchtiefe — aber das ist Grep, kein Level.

**ECC:**
```
L1  git + Feynman-Review ("Hat jeder Codex einen Sprint-Eintrag?")
L2  Session Lock + safeParse
L3  tsc --noEmit, node --check, git SHA-1
```

---

### Denkmodell: Vollständiges Spektrum (L0–L∞)

*Nicht implementiert. Beschreibt wie sich Latenz ↔ Größe real verhält.*
*Siehe ADR-012 in DECISIONS.md für die Architekturentscheidung.*

```
L0   Kontext-Fenster   ~200K tokens   Session       CPU Register
L1   Persönlich        260K           persistent    L1 Cache (Harvard)
L2   Team-shared       84K            persistent    L2 Cache
L3   Org-Docs          100K           persistent    RAM
L4   Codebase          816K           persistent    SSD
L5   Archiv            228K+          persistent    Magnetband
L∞   Git-History       87 commits     forever       Geologie
```

## Files

### Frontend

| File | LOC | Purpose |
|------|-----|---------|
| `game.js` | ~4400 | Core: grid, rendering, NPCs, player, events |
| `chat.js` | ~1150 | NPC chat, LLM integration, token budget |
| `voice.js` | ~470 | Gemini voice (WebSocket, mic, playback) |
| `sound.js` | ~700 | Web Audio, pentatonic tones, drums |
| `iso-renderer.js` | ~350 | Isometric projection, cube rendering |
| `fractal-trees.js` | ~200 | L-system procedural trees |
| `materials.js` | — | Material definitions (emoji, color, label) |
| `recipes.js` | — | Deterministic crafting recipes |
| `quests.js` | — | 60+ quest templates per NPC |
| `achievements.js` | — | Achievement tracking |
| `automerge.js` | — | 2048-style merge rules |
| `blueprints.js` | ~330 | Blueprint pattern matching |
| `screensaver.js` | — | Conway's Game of Life overlay |
| `effects.js` | — | Weather, day/night, particles |
| `nature.js` | — | Tree growth, world consequences |
| `marketplace.js` | — | P2P rare item trading |
| `eliza.js` | ~350 | ELIZA pattern matching (LLM fallback) |
| `eliza-scripts.js` | ~300 | ELIZA scripts per NPC |
| `healthcheck.js` | — | localStorage LRU, grid integrity |
| `analytics.js` | ~230 | Session metrics, engagement score |
| `storage.js` | ~70 | Storage abstraction |
| `stories.js` | — | Audio drama data |
| `sw.js` | ~80 | Service Worker for offline play |

### Backend (Cloudflare Workers)

| File | Purpose |
|------|---------|
| `worker.js` | LLM proxy, craft endpoint (KV), analytics, D1 |
| `gemini-voice-worker.js` | WebSocket proxy for Gemini Live API |

## Grid

- Responsive: 32×18 (16:9), 28×21 (4:3), 18×28 (portrait)
- `WATER_BORDER = 2` cells around island
- `CELL_SIZE` dynamic per viewport
- Dirty-flag rendering: `needsRedraw` flag, no rAF loop
- Isometric mode: 2:1 diamond tiles, painter's algorithm

## NPC system

- 10 NPCs: 7 on-grid + 3 chat-only
- Unlock order: 5 starters → Tommy → Neinhorn → Krabs → Elefant → Mephisto
- Dual dialogue: template-based (offline) + LLM (with API key)
- Gemini voice: 5 voices mapped to NPCs

## Known debt

- `game.js` monolith — grid rendering, draw(), events still coupled
- Smoke test blocked by sandbox proxy in CI
