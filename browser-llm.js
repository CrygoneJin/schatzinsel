// @ts-nocheck
/**
 * Browser-LLM — Lokale Inferenz als Fallback wenn kein API-Key oder Budget leer.
 *
 * Stack: Transformers.js v4 + SmolLM2-360M-Instruct (ONNX q4f16, ~190 MB)
 * Backend: WebGPU (Safari 26+, Chrome 113+, Firefox 141+) mit WASM-Fallback
 * Caching: OPFS — nach Erstladen < 1s Ladezeit
 *
 * Progressive Loading: ELIZA (sofort) → Browser-LLM (wenn geladen) → Cloud-LLM (wenn API-Key)
 *
 * Backlog #90
 */
(function () {
    'use strict';

    const MODEL_ID = 'HuggingFaceTB/SmolLM2-360M-Instruct';
    const MODEL_DTYPE = 'q4f16';
    const CDN_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4';

    // Maximale Antwortlänge — kurz halten für Geschwindigkeit + Qualität
    const MAX_NEW_TOKENS = 80;

    let _pipeline = null;
    let _loadState = 'idle'; // idle | loading | ready | error
    let _loadError = null;
    let _toastEl = null;

    /**
     * Vereinfachte Persona-Prompts für NPC-Dialoge.
     * Vollständige Prompts kommen aus eliza-scripts.js in Phase 2.
     */
    const NPC_PERSONAS = {
        spongebob: 'Du bist SpongeBob Schwammkopf. Enthusiastisch, naiv, herzlich. Sehr kurze Sätze. Deutsch.',
        krabs:     'Du bist Mr. Krabs. Geldgierig aber lustig. Sprichst über Geld und Krabbenburger. Deutsch.',
        elefant:   'Du bist der Elefant aus der Sendung mit der Maus. Musikbegeistert und sanftmütig. Deutsch.',
        tommy:     'Du bist Tommy der Seemann. Abenteuerlustig und mutig. Kurze Sätze. Deutsch.',
        neinhorn:  'Du bist das Neinhorn. Sagst fast immer Nein — aber auf witzige Art. Deutsch.',
        maus:      'Du bist die Maus aus der Sendung mit der Maus. Neugierig und erklärt alles einfach. Deutsch.',
        bernd:     'Du bist Bernd das Brot. Mürrisch und lustlos, aber eigentlich nett. Kurz und trocken. Deutsch.',
        floriane:  'Du bist Floriane die Fee. Magisch und verträumt. Sprichst von Sternen und Wundern. Deutsch.',
        bug:       'Du bist Bug der Käfer. Abenteuerlustig und neugierig über die Natur. Deutsch.',
        mephisto:  'Du bist Mephisto der Drache. Dramatisch und geheimnisvoll, aber nicht böse. Deutsch.',
    };

    const DEFAULT_PERSONA = 'Du bist ein freundlicher NPC in einem Kinderspiel auf Schatzinsel. Antworte kurz, kindgerecht und auf Deutsch.';

    // --- Toast / Progress UI ---

    function createToast() {
        if (_toastEl) return _toastEl;
        _toastEl = document.createElement('div');
        _toastEl.id = 'browser-llm-toast';
        _toastEl.setAttribute('role', 'status');
        _toastEl.setAttribute('aria-live', 'polite');
        Object.assign(_toastEl.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(44, 62, 80, 0.92)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '16px',
            fontSize: '14px',
            fontFamily: 'Fredoka, Comic Neue, sans-serif',
            zIndex: '9999',
            display: 'none',
            textAlign: 'center',
            maxWidth: '320px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'opacity 0.3s ease'
        });
        _toastEl.innerHTML = '<div class="blm-label">\uD83E\uDDE0 Lade lokales Gehirn...</div>'
            + '<div class="blm-bar" style="margin-top:6px;height:6px;border-radius:3px;background:rgba(255,255,255,0.2);overflow:hidden;">'
            + '<div class="blm-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#f39c12,#e74c3c);border-radius:3px;transition:width 0.3s ease;"></div>'
            + '</div>';
        document.body.appendChild(_toastEl);
        return _toastEl;
    }

    function showToastProgress(progress) {
        var toast = createToast();
        toast.style.display = 'block';
        toast.style.opacity = '1';
        var fill = toast.querySelector('.blm-fill');
        var label = toast.querySelector('.blm-label');
        if (fill) fill.style.width = Math.round(progress) + '%';
        if (label) label.textContent = '\uD83E\uDDE0 Lade lokales Gehirn... ' + Math.round(progress) + '%';
    }

    function showToastReady() {
        var toast = createToast();
        var label = toast.querySelector('.blm-label');
        var bar = toast.querySelector('.blm-bar');
        if (label) label.textContent = '\uD83E\uDDE0 Lokales Gehirn bereit!';
        if (bar) bar.style.display = 'none';
        toast.style.display = 'block';
        toast.style.opacity = '1';
        setTimeout(function () {
            toast.style.opacity = '0';
            setTimeout(function () { toast.style.display = 'none'; }, 300);
        }, 2500);
    }

    function showToastError(msg) {
        var toast = createToast();
        var label = toast.querySelector('.blm-label');
        var bar = toast.querySelector('.blm-bar');
        if (label) label.textContent = '\u26A0\uFE0F ' + (msg || 'Browser-LLM nicht verf\u00fcgbar');
        if (bar) bar.style.display = 'none';
        toast.style.display = 'block';
        toast.style.opacity = '1';
        setTimeout(function () {
            toast.style.opacity = '0';
            setTimeout(function () { toast.style.display = 'none'; }, 300);
        }, 4000);
    }

    function hideToast() {
        if (_toastEl) {
            _toastEl.style.display = 'none';
        }
    }

    window.BROWSER_LLM = {

        /** Aktueller Ladezustand: idle | loading | ready | error */
        getState: function () { return _loadState; },
        isReady: function () { return _loadState === 'ready'; },
        getError: function () { return _loadError; },

        /**
         * Modell im Hintergrund vorladen.
         * Zeigt Toast mit Fortschritt. Kann mehrfach aufgerufen werden (idempotent).
         *
         * @param {function} [onProgress] - Optionaler zusätzlicher Callback
         */
        preload: async function (onProgress) {
            if (_loadState !== 'idle') return;
            _loadState = 'loading';
            _loadError = null;

            showToastProgress(0);

            try {
                // Dynamischer ESM-Import — Transformers.js kommt vom CDN
                var mod = await import(CDN_URL);
                var pipelineFn = mod.pipeline;

                _pipeline = await pipelineFn('text-generation', MODEL_ID, {
                    dtype: MODEL_DTYPE,
                    device: 'webgpu',       // WASM-Fallback automatisch wenn kein WebGPU
                    progress_callback: function (evt) {
                        // Transformers.js progress_callback: { status, progress, ... }
                        if (evt && typeof evt.progress === 'number') {
                            showToastProgress(evt.progress);
                            if (onProgress) onProgress(evt);
                        }
                    }
                });

                _loadState = 'ready';
                showToastReady();
                console.log('[BrowserLLM] Bereit \u2014', MODEL_ID, MODEL_DTYPE);

            } catch (err) {
                _loadState = 'error';
                _loadError = err;
                showToastError(err.message || 'Laden fehlgeschlagen');
                console.warn('[BrowserLLM] Laden fehlgeschlagen:', err);
            }
        },

        /**
         * NPC-Antwort generieren.
         *
         * @param {Array<{role: string, content: string}>} messages - Chat-History
         * @param {string} charId - Charakter-ID (z.B. 'spongebob')
         * @returns {Promise<string>} - Generierte Antwort
         */
        generate: async function (messages, charId) {
            if (!_pipeline) {
                throw new Error('[BrowserLLM] Modell nicht geladen');
            }

            var systemPrompt = NPC_PERSONAS[charId] || DEFAULT_PERSONA;

            // Nur letzte 4 Nachrichten als Kontext — reicht für kurze Dialoge
            var contextMessages = messages.slice(-4);

            var prompt = [
                { role: 'system', content: systemPrompt },
                ...contextMessages
            ];

            var result = await _pipeline(prompt, {
                max_new_tokens: MAX_NEW_TOKENS,
                temperature: 0.8,
                do_sample: true,
                repetition_penalty: 1.2,
                return_full_text: false
            });

            // Transformers.js gibt Array zurück, letztes Element = neue Antwort
            var generated = result[0]?.generated_text;
            if (Array.isArray(generated)) {
                return generated.at(-1)?.content || '';
            }
            return generated || '';
        },

        /** Toast manuell ausblenden */
        hideToast: hideToast
    };

    // --- Auto-Preload: nach Spielstart im Idle-Moment laden ---
    // Nur starten wenn kein API-Key gesetzt ist (sonst Cloud-LLM bevorzugt)
    function autoPreload() {
        // Wenn API-Key vorhanden → kein Browser-LLM nötig
        var hasKey = localStorage.getItem('insel-api-key') ||
                     localStorage.getItem('insel-proxy-url');
        if (hasKey) {
            console.log('[BrowserLLM] API-Key vorhanden — überspringe Auto-Preload');
            return;
        }

        // requestIdleCallback wenn verfügbar, sonst setTimeout
        var schedule = window.requestIdleCallback || function (cb) { setTimeout(cb, 3000); };
        schedule(function () {
            console.log('[BrowserLLM] Auto-Preload startet...');
            window.BROWSER_LLM.preload();
        });
    }

    // Nach dem Spielstart laden (start-button Click oder DOMContentLoaded)
    if (document.readyState === 'complete') {
        autoPreload();
    } else {
        window.addEventListener('load', autoPreload);
    }

})();
