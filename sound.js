// === SOUND — Audio-Funktionen ===
// Alle Sound-Funktionen als window.INSEL_SOUND exportiert (Vanilla JS, kein Build-Tool)
// Pentatonik-Töne, Kirchentonarten, Pythagoräische Stimmung

(function () {
    'use strict';

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    let lastSoundTime = 0;
    const SOUND_THROTTLE = 60; // Max ~16 Töne/Sekunde, verhindert Oszillator-Überlauf

    let masterVolume = 1.0;

    function setMasterVolume(v) { masterVolume = Math.max(0, Math.min(1, v)); }
    function getMasterVolume() { return isMuted() ? 0 : masterVolume; }
    function setMuted(m) { localStorage.setItem('insel-muted', m ? 'true' : 'false'); }
    function isMuted() { return localStorage.getItem('insel-muted') === 'true'; }

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
        if (isMuted()) return;
        try {
            const ctx = ensureAudio();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime((vol || 0.15) * masterVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) { /* Audio nicht verfügbar — kein Problem */ }
    }

    // Glide-Ton: Frequenz fließt von startFreq zu endFreq (für Wasser)
    function playGlideTone(startFreq, endFreq, duration, type, vol) {
        try {
            const ctx = ensureAudio();
            const t = ctx.currentTime;
            for (let detune of [0, 7]) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type || 'sine';
                osc.frequency.setValueAtTime(startFreq, t);
                osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
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

    // Reicherer Sound: 2 Oszillatoren + leichtes Detune = Chorus-Effekt
    function playRichTone(freq, duration, type, vol) {
        if (isMuted()) return;
        try {
            const ctx = ensureAudio();
            const t = ctx.currentTime;
            for (let detune of [0, 7]) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type || 'sine';
                osc.frequency.value = freq;
                osc.detune.value = detune;
                gain.gain.setValueAtTime((vol || 0.1) * 0.6 * masterVolume, t);
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
    // === GENESIS-Töne: Stille → Tiefe → Höhe → Akkord → Pentatonik ===
    const C2 = 65.41;   // Tiefes C
    const C3 = 130.81;  // Tiefes Mittleres C
    const C5 = 523.25;  // Hohes C
    const ELEMENT_TONES = {
        // 道 Tao = Stille. Kein Ton. Lindgren: "Manchmal ist Stille der schönste Moment."
        tao:    null,
        // ⚫ Yin = tief, dunkel, empfangend
        yin:    { freq: C2,         wave: 'sine',     dur: 0.5,  vol: 0.12 },
        // ⚪ Yang = hoch, hell, gebend
        yang:   { freq: C5,         wave: 'sine',     dur: 0.3,  vol: 0.08 },
        // ✨ Qi = Yin+Yang Akkord (wird in soundBuild als Doppelton gespielt)
        qi:     { freq: C2,         wave: 'sine',     dur: 0.4,  vol: 0.10, chord: C5 },
        // === 五音 Wu Yin — Pentatonik: 宫商角徵羽 (Gōng Shāng Jué Zhǐ Yǔ) ===
        // Pythagoräische Stimmung — Sprint 18: Erde tiefer, Feuer höher, Wasser fließend
        // 土 Erde = 宫 Gōng — tief, geerdet, Fundament (eine Oktave tiefer als vorher)
        earth:  { freq: C3,         wave: 'triangle', dur: 0.20, vol: 0.12 },
        // 金 Metall = 商 Shāng — klar, glockenartig (Quinte über Erde)
        metal:  { freq: C3 * 3/2,   wave: 'square',   dur: 0.10, vol: 0.08 },
        // 木 Holz = 角 Jué — warm, wachsend (C4, Frühling)
        wood:   { freq: C4,         wave: 'triangle', dur: 0.14, vol: 0.09 },
        // 火 Feuer = 徵 Zhǐ — höchster Ton, aufsteigend, heiß (G5 = C4 * 3)
        fire:   { freq: C4 * 3,     wave: 'sawtooth', dur: 0.06, vol: 0.06 },
        // 水 Wasser = 羽 Yǔ — fließend (glide: A4→A3, absteigende Energie)
        water:  { freq: C4 * 27/16, wave: 'sine',     dur: 0.30, vol: 0.09, glide: C3 * 27/16 },
    };

    // === GENRE-TONSEQUENZEN (Backlog #85) ===
    // Jedes Genre hat 5 Noten: [freq, duration, waveform, volume]
    // Beim Platzieren wird die nächste Note der Sequenz gespielt (round-robin)
    const GENRE_SEQUENCES = {
        // Punk: schnell, laut, Powerchords (Grundton + Quinte), verzerrt
        punk: [
            [329.63, 0.08, 'sawtooth', 0.14],  // E4
            [440.00, 0.08, 'sawtooth', 0.15],  // A4
            [493.88, 0.06, 'square',   0.14],  // B4
            [440.00, 0.06, 'sawtooth', 0.15],  // A4
            [329.63, 0.10, 'square',   0.16],  // E4 — zurück zum Root
        ],
        // Jazz: Swing-Feeling, chromatische Durchgänge, weich
        jazz: [
            [261.63, 0.18, 'sine',     0.10],  // C4
            [329.63, 0.14, 'triangle', 0.09],  // E4
            [369.99, 0.16, 'sine',     0.10],  // F#4 (Tritone!)
            [392.00, 0.20, 'triangle', 0.09],  // G4
            [466.16, 0.22, 'sine',     0.08],  // Bb4 — Blue Note
        ],
        // Chiptune: 8-Bit, square waves, schnelle Arpeggios
        chiptune: [
            [523.25, 0.06, 'square', 0.10],  // C5
            [659.25, 0.06, 'square', 0.10],  // E5
            [783.99, 0.06, 'square', 0.10],  // G5
            [659.25, 0.04, 'square', 0.08],  // E5
            [523.25, 0.08, 'square', 0.12],  // C5
        ],
        // Reggae: offbeat, entspannt, tief
        reggae: [
            [146.83, 0.20, 'triangle', 0.11],  // D3
            [174.61, 0.16, 'sine',     0.09],  // F3 (Offbeat)
            [196.00, 0.18, 'triangle', 0.10],  // G3
            [174.61, 0.14, 'sine',     0.09],  // F3
            [130.81, 0.24, 'triangle', 0.12],  // C3 — Root
        ],
        // Klassik: Mozart-artig, elegant, klare Intervalle
        klassik: [
            [523.25, 0.16, 'sine',     0.10],  // C5
            [587.33, 0.12, 'sine',     0.09],  // D5
            [659.25, 0.14, 'sine',     0.10],  // E5
            [783.99, 0.18, 'triangle', 0.09],  // G5
            [523.25, 0.22, 'sine',     0.11],  // C5 — Auflösung
        ],
        // Blues: Moll-Pentatonik, Bends, soulful
        blues: [
            [196.00, 0.18, 'triangle', 0.11],  // G3
            [233.08, 0.16, 'sine',     0.10],  // Bb3
            [261.63, 0.14, 'triangle', 0.10],  // C4
            [293.66, 0.20, 'sine',     0.09],  // D4 (Bend-Zone)
            [196.00, 0.24, 'triangle', 0.12],  // G3 — zurück
        ],
        // Metal: tief, aggressiv, Tritonus
        metal_music: [
            [82.41,  0.10, 'sawtooth', 0.16],  // E2 — Drop-Tuning
            [110.00, 0.08, 'sawtooth', 0.15],  // A2
            [116.54, 0.06, 'square',   0.16],  // Bb2 (Tritonus!)
            [110.00, 0.08, 'sawtooth', 0.15],  // A2
            [82.41,  0.12, 'square',   0.18],  // E2 — Chug
        ],
        // HipHop: 808-Bass, rhythmisch, deep
        hiphop: [
            [65.41,  0.20, 'sine',     0.14],  // C2 — 808 Bass
            [73.42,  0.12, 'sine',     0.12],  // D2
            [65.41,  0.16, 'sine',     0.14],  // C2
            [87.31,  0.10, 'triangle', 0.10],  // F2
            [65.41,  0.24, 'sine',     0.16],  // C2 — Boom
        ],
        // Techno: repetitiv, synthetisch, hypnotisch
        techno: [
            [130.81, 0.08, 'sawtooth', 0.12],  // C3
            [130.81, 0.08, 'square',   0.10],  // C3 (anderer Waveshape)
            [146.83, 0.10, 'sawtooth', 0.12],  // D3
            [130.81, 0.08, 'square',   0.10],  // C3
            [155.56, 0.12, 'sawtooth', 0.14],  // Eb3 — Acid
        ],
        // Country: Dur-Tonleiter, twangy, fröhlich
        country: [
            [293.66, 0.12, 'triangle', 0.10],  // D4
            [329.63, 0.10, 'triangle', 0.09],  // E4
            [369.99, 0.10, 'sine',     0.10],  // F#4
            [440.00, 0.14, 'triangle', 0.10],  // A4
            [293.66, 0.16, 'triangle', 0.11],  // D4 — Hoedown!
        ],
        // Flamenco: Phrygisch, leidenschaftlich, dramatisch
        flamenco: [
            [329.63, 0.14, 'sine',     0.12],  // E4
            [349.23, 0.10, 'sine',     0.11],  // F4 (Phrygische Sekunde!)
            [392.00, 0.12, 'triangle', 0.10],  // G4
            [440.00, 0.16, 'sine',     0.11],  // A4
            [329.63, 0.20, 'sine',     0.13],  // E4 — Rasgueado
        ],
        // Samba: synkopiert, perkussiv, lebhaft
        samba: [
            [392.00, 0.08, 'triangle', 0.12],  // G4
            [440.00, 0.06, 'triangle', 0.10],  // A4
            [523.25, 0.08, 'triangle', 0.12],  // C5
            [440.00, 0.06, 'sine',     0.10],  // A4
            [392.00, 0.10, 'triangle', 0.13],  // G4 — Batucada
        ],
        // Oper: dramatisch, weit, Vibrato-artig
        opera: [
            [261.63, 0.24, 'sine',     0.12],  // C4
            [329.63, 0.20, 'sine',     0.11],  // E4
            [392.00, 0.22, 'sine',     0.12],  // G4
            [523.25, 0.28, 'sine',     0.13],  // C5 — Aria!
            [392.00, 0.26, 'triangle', 0.11],  // G4 — Auflösung
        ],
        // Surf: Reverb-drenched, tremolo, Strandfeeling
        surf: [
            [329.63, 0.10, 'sine',     0.10],  // E4
            [392.00, 0.08, 'sine',     0.09],  // G4
            [440.00, 0.10, 'triangle', 0.10],  // A4
            [493.88, 0.08, 'sine',     0.09],  // B4
            [329.63, 0.14, 'triangle', 0.11],  // E4 — Pipeline!
        ],
        // Wiegenlied: langsam, sanft, einschläfernd
        lullaby: [
            [392.00, 0.28, 'sine', 0.06],  // G4
            [440.00, 0.24, 'sine', 0.05],  // A4
            [523.25, 0.30, 'sine', 0.06],  // C5
            [440.00, 0.26, 'sine', 0.05],  // A4
            [392.00, 0.32, 'sine', 0.04],  // G4 — Schlaf...
        ],
    };
    const genreNoteIndex = {}; // Tracks welche Note als nächstes kommt pro Genre

    // Erster Sound = KLONK. Laut. Befriedigend. Minecraft-Niveau.
    let firstSoundPlayed = false;

    function playKlonk() {
        try {
            const ctx = ensureAudio();
            const t = ctx.currentTime;
            // Tiefer Schlag
            const osc1 = ctx.createOscillator();
            const g1 = ctx.createGain();
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(180, t);
            osc1.frequency.exponentialRampToValueAtTime(60, t + 0.15);
            g1.gain.setValueAtTime(0.35, t);
            g1.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc1.connect(g1); g1.connect(ctx.destination);
            osc1.start(t); osc1.stop(t + 0.2);
            // Heller Klick obendrauf
            const osc2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.value = 800;
            g2.gain.setValueAtTime(0.2, t);
            g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            osc2.connect(g2); g2.connect(ctx.destination);
            osc2.start(t); osc2.stop(t + 0.08);
        } catch (e) {}
    }

    function soundBuild(material) {
        if (isMuted()) return;
        if (!canPlaySound()) return;
        // Erster Sound der Session = KLONK (Paluten: "muss in 30 Sek auffallen")
        if (!firstSoundPlayed) {
            firstSoundPlayed = true;
            playKlonk();
            return;
        }
        const tone = ELEMENT_TONES[material];
        if (tone === null) return; // Tao = Stille
        if (tone) {
            if (tone.glide) {
                // Fließend: Frequenz gleitet von freq zu glide (Wasser)
                playGlideTone(tone.freq, tone.glide, tone.dur, tone.wave, tone.vol);
            } else {
                // Element-Ton + leichte Variation
                const freq = tone.freq * (1 + (Math.random() - 0.5) * 0.02);
                playRichTone(freq, tone.dur + Math.random() * 0.04, tone.wave, tone.vol);
            }
            // Qi-Akkord: zweiter Ton dazu
            if (tone.chord) {
                playRichTone(tone.chord * (1 + (Math.random() - 0.5) * 0.02), tone.dur, tone.wave, tone.vol * 0.7);
            }
            return;
        }
        // Genre-Materialien: 5-Noten-Sequenz round-robin
        const seq = GENRE_SEQUENCES[material];
        if (seq) {
            if (!(material in genreNoteIndex)) genreNoteIndex[material] = 0;
            const note = seq[genreNoteIndex[material] % seq.length];
            genreNoteIndex[material] = (genreNoteIndex[material] + 1) % seq.length;
            const freq = note[0] * (1 + (Math.random() - 0.5) * 0.01); // Minimale Variation
            playRichTone(freq, note[1], note[2], note[3]);
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
        if (isMuted()) return;
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
        if (isMuted()) return;
        // Zelda-Chest-artig: aufsteigende Fanfare mit Chorus
        playRichTone(523, 0.12, 'sine', 0.12);
        setTimeout(() => playRichTone(659, 0.12, 'sine', 0.12), 100);
        setTimeout(() => playRichTone(784, 0.25, 'triangle', 0.14), 200);
    }

    function soundQuestComplete() {
        if (isMuted()) return;
        // Mario-Level-Complete-artig: längere Fanfare
        const notes = [392, 523, 659, 784, 880];
        notes.forEach((f, i) => {
            setTimeout(() => playRichTone(f, i === notes.length - 1 ? 0.4 : 0.1, 'sine', 0.12), i * 100);
        });
    }

    function soundChop() {
        if (isMuted()) return;
        if (!canPlaySound()) return;
        playRichTone(180, 0.15, 'sawtooth', 0.1);
        setTimeout(() => playTone(120, 0.2, 'square', 0.08), 80);
    }

    function soundCraft() {
        if (isMuted()) return;
        if (!canPlaySound()) return;
        playRichTone(440, 0.1, 'sine', 0.1);
        setTimeout(() => playRichTone(554, 0.1, 'sine', 0.1), 100);
        setTimeout(() => playRichTone(659, 0.2, 'triangle', 0.12), 200);
    }

    // KLONK — lautes befriedigendes Geräusch beim Auswählen eines Materials.
    // Minecraft-Niveau: tief, körperlich, sofort. Kein Throttle — jeder Klick klingt.
    const KLONK_FREQS = {
        earth:  65,   // C2 — tief, geerdet (Sprint 18: tiefer)
        metal:  196,  // G3 — klar, glockenartig
        wood:   147,  // D3 — warm, organisch
        fire:   440,  // A4 — hoch, heiß (Sprint 18: höher)
        water:  110,  // A2 — ruhig, fließend (Sprint 18: tiefer)
        tao:    null,
        yin:    80,
        yang:   330,
        qi:     165,
    };
    function soundSelect(material) {
        if (isMuted()) return;
        const freq = KLONK_FREQS[material] || 140;
        if (freq === null) return;
        try {
            const ctx = ensureAudio();
            const t = ctx.currentTime;
            // Hauptschlag: sawtooth, kurz, laut
            const osc1 = ctx.createOscillator();
            const g1 = ctx.createGain();
            osc1.type = 'sawtooth';
            osc1.frequency.value = freq;
            g1.gain.setValueAtTime(0.35, t);
            g1.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            osc1.connect(g1);
            g1.connect(ctx.destination);
            osc1.start(t);
            osc1.stop(t + 0.18);
            // Oberton: leichter square-Ping
            const osc2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            osc2.type = 'square';
            osc2.frequency.value = freq * 2;
            g2.gain.setValueAtTime(0.12, t + 0.01);
            g2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc2.connect(g2);
            g2.connect(ctx.destination);
            osc2.start(t + 0.01);
            osc2.stop(t + 0.12);
        } catch (e) {}
    }

    // Allererster Block: tiefer Punch-Akkord — Minecraft-Moment
    function soundFirstBlock() {
        if (isMuted()) return;
        try {
            const ctx = ensureAudio();
            const t = ctx.currentTime;
            // Tiefer Punch (180→80 Hz, triangle)
            const osc1 = ctx.createOscillator();
            const g1 = ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(180, t);
            osc1.frequency.exponentialRampToValueAtTime(80, t + 0.12);
            g1.gain.setValueAtTime(0.45, t);
            g1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            osc1.connect(g1); g1.connect(ctx.destination);
            osc1.start(t); osc1.stop(t + 0.22);
            // Knackiger Oberton (540→270 Hz, square)
            const osc2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(540, t);
            osc2.frequency.exponentialRampToValueAtTime(270, t + 0.06);
            g2.gain.setValueAtTime(0.15, t);
            g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            osc2.connect(g2); g2.connect(ctx.destination);
            osc2.start(t); osc2.stop(t + 0.08);
            lastSoundTime = performance.now();
        } catch (e) {}
    }

    window.INSEL_SOUND = {
        soundBuild,
        soundDemolish,
        soundAchievement,
        soundQuestComplete,
        soundChop,
        soundCraft,
        soundSelect,
        soundFirstBlock,
        // Volume-Steuerung
        setMasterVolume,
        getMasterVolume,
        setMuted,
        isMuted,
        // Low-level für Erweiterungen
        playTone,
        playRichTone,
        canPlaySound,
    };

})();
