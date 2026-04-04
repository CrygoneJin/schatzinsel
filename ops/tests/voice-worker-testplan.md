# Voice Worker Testplan — Pythia simuliert

**Ziel:** Cloudflare Voice Worker testen ohne User-Interaktion.
**Wer:** Torvalds (technisch) + Pythia (simuliert User)

---

## Voraussetzungen

1. `GEMINI_API_KEY` ist im Worker gesetzt (`wrangler secret put GEMINI_API_KEY`) ✅ Done
2. Worker deployed: `wrangler deploy -c src/infra/wrangler-voice.toml`
3. Voice Proxy URL: `wss://schatzinsel.hoffmeyer-zlotnik.workers.dev/voice`

---

## Testschritte

### 1. Health-Check (kein Browser nötig)

```bash
# Worker erreichbar?
curl -s https://schatzinsel.hoffmeyer-zlotnik.workers.dev/voice | head -20
# Erwartung: WebSocket-Upgrade-Fehler (405 oder Upgrade Required) = Worker läuft
# Fehler: 404 = Worker nicht deployed, 500 = GEMINI_API_KEY fehlt
```

### 2. WebSocket-Verbindung (Node.js oder Browser DevTools)

```javascript
// In Browser-Konsole auf schatzinsel.app:
const ws = new WebSocket('wss://schatzinsel.hoffmeyer-zlotnik.workers.dev/voice');
ws.onopen = () => console.log('✅ WS verbunden');
ws.onerror = (e) => console.log('❌ WS Fehler:', e);
ws.onclose = (e) => console.log('🔌 WS geschlossen:', e.code, e.reason);
// Erwartung: ✅ WS verbunden
```

### 3. Voice-Setup senden

```javascript
// Nach Verbindung:
ws.send(JSON.stringify({
    setup: {
        model: "models/gemini-2.0-flash-exp",
        generation_config: {
            response_modalities: ["AUDIO"],
            speech_config: { voice_config: { prebuilt_voice_config: { voice_name: "Puck" } } }
        },
        system_instruction: { parts: [{ text: "Du bist SpongeBob. Antworte auf Deutsch. Kurz und lustig." }] }
    }
}));
// Erwartung: Server akzeptiert Setup, keine Fehlermeldung
```

### 4. Text-Input simulieren (Pythia spricht)

```javascript
// Pythia simuliert Oscars Frage:
ws.send(JSON.stringify({
    client_content: {
        turns: [{ role: "user", parts: [{ text: "Hallo SpongeBob, was machst du?" }] }],
        turn_complete: true
    }
}));

// Auf Audio-Antwort warten:
ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
        console.log('🔊 Audio-Antwort empfangen!', data.serverContent.modelTurn.parts[0].inlineData.mimeType);
    }
    if (data.serverContent?.turnComplete) {
        console.log('✅ Antwort komplett');
    }
};
// Erwartung: Audio-Chunks (audio/pcm) + turnComplete
```

### 5. Vollständiger Browser-Test

1. schatzinsel.app öffnen
2. NPC antippen → Chat öffnen
3. 🎤 Mikrofon-Button klicken
4. Mikrofon erlauben
5. Sprechen: "Hallo, wer bist du?"
6. Erwartung: NPC antwortet mit Stimme (Gemini Live)

---

## Pythia-Simulation (ohne Mikrofon)

Pythia kann Schritt 1-4 automatisiert ausführen. Schritt 5 braucht ein echtes Gerät mit Mikrofon.

**Was Pythia prüft:**
- [ ] Worker erreichbar (HTTP 405 auf /voice)
- [ ] WebSocket-Verbindung steht
- [ ] Setup akzeptiert
- [ ] Text-Input liefert Audio-Response
- [ ] Latenz <3s für erste Audio-Chunks

**Was ein Mensch prüft:**
- [ ] Mikrofon-Permission funktioniert
- [ ] Audio-Playback im Browser
- [ ] NPC-Stimme klingt passend (Puck=SpongeBob, Charon=Mephisto)
- [ ] Oscar versteht was der NPC sagt

---

## Fehlerszenarien

| Symptom | Ursache | Fix |
|---------|---------|-----|
| 404 auf /voice | Worker nicht deployed | `wrangler deploy -c src/infra/wrangler-voice.toml` |
| 500 auf /voice | GEMINI_API_KEY fehlt | `wrangler secret put GEMINI_API_KEY` |
| WS öffnet, kein Audio | Setup-Format falsch | Gemini API Docs prüfen, Model-ID checken |
| Audio kommt, kein Sound | Browser-Autoplay-Policy | User muss erst klicken (Touch-Event) |
| Latenz >5s | Worker-Coldstart + Gemini-Latenz | Akzeptabel für v1, optimierbar |
