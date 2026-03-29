// === SOUND — Audio-Funktionen ===
// Alle Sound-Funktionen als window.INSEL_SOUND exportiert (Vanilla JS, kein Build-Tool)
// Pentatonik-Töne, Kirchentonarten, Pythagoräische Stimmung

(function () {
    'use strict';

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    let lastSoundTime = 0;
    const SOUND_THROTTLE = 60; // Max ~16 Töne/Sekunde, verhindert Oszillator-Überlauf

    function ensureAudio() {
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    function canPlaySound() {
        const now = performance.now();
        if (now - lastSoundTime < SOUND_THROTTLE) return false;
        lastSoundTime = now;
        return true;
    }

    function playTone(freq, duration, type, vol) {
        try {
            const ctx = ensureAudio();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(vol || 0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) { /* Audio nicht verfügbar — kein Problem */ }
    }

    // Reicherer Sound: 2 Oszillatoren + leichtes Detune = Chorus-Effekt
    function playRichTone(freq, duration, type, vol) {
        try {
            const ctx = ensureAudio();
            const t = ctx.currentTime;
            for (let detune of [0, 7]) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type || 'sine';
                osc.frequency.value = freq;
                osc.detune.value = detune;
                gain.gain.setValueAtTime((vol || 0.1) * 0.6, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + duration);
            }
        } catch (e) {}
    }

    // Modi — Kirchentonarten, Pythagoräische Stimmverhältnisse ab C4
    // Grundton × Intervall = reine Frequenz (Pythagoras + Bach)
    const C4 = 261.63;
    const SCALES = {
        // Dorisch (D-Modus): 1 9/8 32/27 4/3 3/2 27/16 16/9 2
        dorian:     [C4, C4*9/8, C4*32/27, C4*4/3, C4*3/2, C4*27/16, C4*16/9, C4*2, C4*9/4, C4*32/13.5, C4*8/3, C4*3],
        // Lydisch (F-Modus): 1 9/8 81/64 729/512 3/2 27/16 243/128 2
        lydian:     [C4, C4*9/8, C4*81/64, C4*729/512, C4*3/2, C4*27/16, C4*243/128, C4*2, C4*9/4, C4*81/32, C4*729/256, C4*3],
        // Mixolydisch (G-Modus): 1 9/8 81/64 4/3 3/2 27/16 16/9 2
        mixolydian: [C4, C4*9/8, C4*81/64, C4*4/3, C4*3/2, C4*27/16, C4*16/9, C4*2, C4*9/4, C4*81/32, C4*8/3, C4*3],
    };
    const SCALE_NAMES = Object.keys(SCALES);
    let currentScale = SCALES[SCALE_NAMES[Math.floor(Math.random() * SCALE_NAMES.length)]];
    let scaleChangeCounter = 0;

    const BUILD_WAVES = ['sine', 'triangle', 'square'];
    let lastBuildNote = -1;
    let buildNoteDir = 1;

    // === 五音 (Wǔ Yīn) — Die 5 Töne der chinesischen Pentatonik ===
    // Jedes Element hat seinen Ton: 宫商角徵羽 (Gōng Shāng Jué Zhǐ Yǔ)
    // Pythagoräische Stimmung aus reinen Quinten: C D E G A
    const ELEMENT_TONES = {
        // 土 Erde = 宫 Gōng (C) — Grundton, Fundament, Mitte
        earth:  { freq: C4,         wave: 'triangle', dur: 0.14, vol: 0.10 },
        // 金 Metall = 商 Shāng (D) — klar, schneidend, rein
        metal:  { freq: C4 * 9/8,   wave: 'square',   dur: 0.10, vol: 0.07 },
        // 木 Holz = 角 Jué (E) — warm, organisch, wachsend
        wood:   { freq: C4 * 81/64, wave: 'triangle', dur: 0.14, vol: 0.08 },
        // 火 Feuer = 徵 Zhǐ (G) — hell, energisch, aufsteigend
        fire:   { freq: C4 * 3/2,   wave: 'sawtooth', dur: 0.06, vol: 0.06 },
        // 水 Wasser = 羽 Yǔ (A) — fließend, weich, tief
        water:  { freq: C4 * 27/16, wave: 'sine',     dur: 0.18, vol: 0.08 },
    };

    function soundBuild(material) {
        if (!canPlaySound()) return;
        const tone = ELEMENT_TONES[material];
        if (tone) {
            // Element-Ton + leichte Variation
            const freq = tone.freq * (1 + (Math.random() - 0.5) * 0.02);
            playRichTone(freq, tone.dur + Math.random() * 0.04, tone.wave, tone.vol);
            return;
        }
        // Nicht-Basis-Materialien: melodische Skala wie bisher
        scaleChangeCounter++;
        if (scaleChangeCounter > 25 + Math.floor(Math.random() * 15)) {
            scaleChangeCounter = 0;
            currentScale = SCALES[SCALE_NAMES[Math.floor(Math.random() * SCALE_NAMES.length)]];
        }

        let idx;
        if (lastBuildNote < 0) {
            idx = Math.floor(Math.random() * currentScale.length);
        } else {
            if (Math.random() < 0.3) buildNoteDir *= -1;
            idx = lastBuildNote + buildNoteDir * (1 + Math.floor(Math.random() * 2));
            if (idx >= currentScale.length) { idx = currentScale.length - 2; buildNoteDir = -1; }
            if (idx < 0) { idx = 1; buildNoteDir = 1; }
        }
        lastBuildNote = idx;
        const type = BUILD_WAVES[Math.floor(Math.random() * BUILD_WAVES.length)];
        playRichTone(currentScale[idx], 0.06 + Math.random() * 0.06, type, 0.06 + Math.random() * 0.04);
    }

    function soundDemolish(getGridStats) {
        if (!canPlaySound()) return;
        const stats = typeof getGridStats === 'function' ? getGridStats() : { percent: 50 };
        const fillPercent = stats.percent || 0;
        const baseFreq = 120 + (fillPercent / 100) * 380;
        const freq = baseFreq + Math.random() * 60;
        const type = fillPercent < 20 ? 'sine' : 'sawtooth';
        playRichTone(freq, 0.18, type, 0.07);
        setTimeout(() => playTone(freq * 0.6, 0.12, type, 0.04), 60);
    }

    function soundAchievement() {
        // Zelda-Chest-artig: aufsteigende Fanfare mit Chorus
        playRichTone(523, 0.12, 'sine', 0.12);
        setTimeout(() => playRichTone(659, 0.12, 'sine', 0.12), 100);
        setTimeout(() => playRichTone(784, 0.25, 'triangle', 0.14), 200);
    }

    function soundQuestComplete() {
        // Mario-Level-Complete-artig: längere Fanfare
        const notes = [392, 523, 659, 784, 880];
        notes.forEach((f, i) => {
            setTimeout(() => playRichTone(f, i === notes.length - 1 ? 0.4 : 0.1, 'sine', 0.12), i * 100);
        });
    }

    function soundChop() {
        if (!canPlaySound()) return;
        playRichTone(180, 0.15, 'sawtooth', 0.1);
        setTimeout(() => playTone(120, 0.2, 'square', 0.08), 80);
    }

    function soundCraft() {
        if (!canPlaySound()) return;
        playRichTone(440, 0.1, 'sine', 0.1);
        setTimeout(() => playRichTone(554, 0.1, 'sine', 0.1), 100);
        setTimeout(() => playRichTone(659, 0.2, 'triangle', 0.12), 200);
    }

    // === 56k MODEM EINWAHL === (Generation 5: Internet-Nostalgie)
    // Komprimierte Version des klassischen Handshake-Sounds
    function soundModem() {
        try {
            const ctx = ensureAudio();
            const t = ctx.currentTime;
            const master = ctx.createGain();
            master.gain.setValueAtTime(0.12, t);
            master.connect(ctx.destination);

            // Phase 1: Freizeichen (0.0–0.3s) — Dual-Tone 350+440Hz
            for (const f of [350, 440]) {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.frequency.value = f;
                osc.type = 'sine';
                g.gain.setValueAtTime(0.4, t);
                g.gain.setValueAtTime(0, t + 0.3);
                osc.connect(g); g.connect(master);
                osc.start(t); osc.stop(t + 0.35);
            }

            // Phase 2: Wähltöne (0.35–0.7s) — DTMF-artige Pulse
            const dialFreqs = [697, 1209, 770, 1336, 852, 1477];
            dialFreqs.forEach((f, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.frequency.value = f;
                osc.type = 'sine';
                const start = t + 0.35 + i * 0.055;
                g.gain.setValueAtTime(0.3, start);
                g.gain.setValueAtTime(0, start + 0.04);
                osc.connect(g); g.connect(master);
                osc.start(start); osc.stop(start + 0.05);
            });

            // Phase 3: Carrier-Kreisch (0.8–1.8s) — der ikonische Sound
            const carrier = ctx.createOscillator();
            const cGain = ctx.createGain();
            carrier.type = 'sawtooth';
            carrier.frequency.setValueAtTime(1200, t + 0.8);
            carrier.frequency.linearRampToValueAtTime(2400, t + 1.1);
            carrier.frequency.linearRampToValueAtTime(980, t + 1.4);
            carrier.frequency.linearRampToValueAtTime(1800, t + 1.6);
            carrier.frequency.linearRampToValueAtTime(1400, t + 1.8);
            cGain.gain.setValueAtTime(0, t + 0.8);
            cGain.gain.linearRampToValueAtTime(0.25, t + 0.85);
            cGain.gain.setValueAtTime(0.25, t + 1.6);
            cGain.gain.exponentialRampToValueAtTime(0.001, t + 1.85);
            carrier.connect(cGain); cGain.connect(master);
            carrier.start(t + 0.8); carrier.stop(t + 1.9);

            // Phase 4: Rauschen (0.9–1.7s) — White-Noise-Burst
            const bufSize = ctx.sampleRate * 0.8;
            const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            const data = noiseBuf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
            const noise = ctx.createBufferSource();
            const nGain = ctx.createGain();
            noise.buffer = noiseBuf;
            nGain.gain.setValueAtTime(0, t + 0.9);
            nGain.gain.linearRampToValueAtTime(0.15, t + 1.0);
            nGain.gain.setValueAtTime(0.15, t + 1.5);
            nGain.gain.exponentialRampToValueAtTime(0.001, t + 1.75);
            noise.connect(nGain); nGain.connect(master);
            noise.start(t + 0.9); noise.stop(t + 1.8);

            // Phase 5: Handshake-Piepen (1.5–2.2s) — "Verbindung steht"
            const hsFreqs = [1300, 1100, 1300, 1100, 1500];
            hsFreqs.forEach((f, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = f;
                const start = t + 1.5 + i * 0.12;
                g.gain.setValueAtTime(0.08, start);
                g.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
                osc.connect(g); g.connect(master);
                osc.start(start); osc.stop(start + 0.11);
            });

            // Master-Fadeout
            master.gain.setValueAtTime(0.12, t + 2.0);
            master.gain.exponentialRampToValueAtTime(0.001, t + 2.3);
        } catch (e) { /* Audio nicht verfügbar */ }
    }

    window.INSEL_SOUND = {
        soundBuild,
        soundDemolish,
        soundAchievement,
        soundQuestComplete,
        soundChop,
        soundCraft,
        soundModem,
        // Low-level für Erweiterungen
        playTone,
        playRichTone,
        canPlaySound,
    };

})();
