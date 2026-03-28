// === INSEL-CHAT — NPCs reden mit dem Spieler ===

(function () {
    'use strict';

    // --- Charakter-Prompts ---
    const CHARACTERS = {
        spongebob: {
            name: 'SpongeBob',
            emoji: '🧽',
            system: `Du bist SpongeBob Schwammkopf auf einer tropischen Insel.
Du bist immer fröhlich, hilfsbereit und begeistert. Du willst einen Burger-Stand am Hafen bauen.
Du sprichst Deutsch, kindgerecht für 8-Jährige. Kurze Sätze (max 2-3).
Du sagst oft "Ich bin bereit!" und redest über Krabbenburger.
Wenn der Spieler etwas gebaut hat, bist du MEGA begeistert.`
        },
        krabs: {
            name: 'Mr. Krabs',
            emoji: '🦀',
            system: `Du bist Mr. Krabs auf einer tropischen Insel.
Du liebst Geld und Handel. Du willst einen Handelshafen bauen.
Du sprichst Deutsch, kindgerecht für 8-Jährige. Kurze Sätze (max 2-3).
Du sagst oft "Geld! Geld! Geld!" und bewertest alles nach seinem Wert.
Wenn der Spieler viel gebaut hat, siehst du Profit-Potenzial.`
        },
        elefant: {
            name: 'Blauer Elefant',
            emoji: '🐘',
            system: `Du bist der Blaue Elefant auf einer tropischen Insel.
Du bist ruhig, geduldig und liebst Pflanzen und Musik. Du willst einen Musik-Turm bauen.
Du sprichst Deutsch, kindgerecht für 8-Jährige. Kurze Sätze (max 2-3).
Du sagst manchmal "Törööö!" und ermutigst zum Pflanzen-Bauen.
Du bist der ruhige Gegenpol zu den aufgeregten Charakteren.`
        },
        tommy: {
            name: 'Tommy Krab',
            emoji: '🦀',
            system: `Du bist Tommy Krab, ein kleiner roter Krebs auf einer tropischen Insel.
Du bist schnell, neugierig und sagst zu allem "Ja!". Du willst den Hafen mit Booten füllen.
Du sprichst Deutsch, kindgerecht für 8-Jährige. Kurze Sätze (max 2-3).
Du machst "klick-klack!" Geräusche und bist der eifrigste Helfer.`
        },
        neinhorn: {
            name: 'Neinhorn',
            emoji: '🦄',
            system: `Du bist das Neinhorn auf einer tropischen Insel.
Du bist frech, sagst erst "Nein!" zu allem, hilfst aber am Ende doch.
Du sprichst Deutsch, kindgerecht für 8-Jährige. Kurze Sätze (max 2-3).
Du baust Geheimtüren und versteckte Ecken. Dein Regenbogen-Turm wird der allerschönste.
WICHTIG: Starte fast jede Antwort mit "Nein!" und sei trotzig-lustig.`
        },
        maus: {
            name: 'Maus & Ente',
            emoji: '🐭',
            system: `Du bist die Maus und die Ente zusammen auf einer tropischen Insel.
Ihr seid ein lustiges Duo. Die Maus piepst, die Ente quakt.
Ihr sprecht Deutsch, kindgerecht für 8-Jährige. Kurze Sätze (max 2-3).
Ihr macht viel Quatsch, zeigt wo Blumen und Pflanzen hin sollen.
Schreibt Geräusche so: *pieps pieps* und *quak quak!*`
        }
    };

    // --- DOM ---
    const bubble = document.getElementById('chat-bubble');
    const panel = document.getElementById('chat-panel');
    const charSelect = document.getElementById('chat-character');
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const settingsBtn = document.getElementById('chat-settings-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const apiKeyDialog = document.getElementById('api-key-dialog');
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKeySave = document.getElementById('api-key-save');
    const apiKeyClose = document.getElementById('api-key-close');

    // --- State ---
    let chatHistory = [];

    // --- API Key ---
    function getApiKey() {
        return localStorage.getItem('anthropic-api-key') || '';
    }

    function setApiKey(key) {
        localStorage.setItem('anthropic-api-key', key);
    }

    // --- Grid-Kontext lesen ---
    function getGridContext() {
        const grid = window.grid;
        if (!grid) return 'Der Spieler hat noch nichts gebaut.';

        const counts = {};
        let total = 0;
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c]) {
                    counts[grid[r][c]] = (counts[grid[r][c]] || 0) + 1;
                    total++;
                }
            }
        }

        if (total === 0) return 'Der Spieler hat noch nichts gebaut. Die Insel ist leer.';

        const parts = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([mat, count]) => `${count}x ${mat}`)
            .join(', ');

        const percent = Math.round((total / (grid.length * grid[0].length)) * 100);
        return `Die Insel ist zu ${percent}% bebaut (${total} Blöcke: ${parts}).`;
    }

    // --- Chat-Nachricht anzeigen ---
    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = `chat-msg ${type}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    // --- API-Call ---
    async function sendToApi(userMessage) {
        const key = getApiKey();
        if (!key) {
            addMessage('Bitte erst API-Key eingeben (⚙️ oben)', 'system');
            apiKeyDialog.classList.remove('hidden');
            return;
        }

        const char = CHARACTERS[charSelect.value];
        const gridInfo = getGridContext();

        chatHistory.push({ role: 'user', content: userMessage });

        // Max 10 Nachrichten History
        if (chatHistory.length > 10) {
            chatHistory = chatHistory.slice(-10);
        }

        const loadingDiv = addMessage(`${char.emoji} denkt nach...`, 'loading');
        sendBtn.disabled = true;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': key,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-haiku-4-5-20251001',
                    max_tokens: 150,
                    system: `${char.system}\n\nAktueller Insel-Status: ${gridInfo}\n\nAntworte IMMER auf Deutsch. Maximal 2-3 kurze Sätze. Sei lustig und ermutigend.`,
                    messages: chatHistory
                })
            });

            loadingDiv.remove();

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    addMessage('API-Key ungültig. Bitte neu eingeben (⚙️)', 'system');
                    chatHistory.pop();
                } else {
                    addMessage(`Fehler: ${err.error?.message || response.statusText}`, 'system');
                    chatHistory.pop();
                }
                return;
            }

            const data = await response.json();
            const reply = data.content[0].text;

            chatHistory.push({ role: 'assistant', content: reply });
            addMessage(`${char.emoji} ${reply}`, 'npc');

        } catch (err) {
            loadingDiv.remove();
            addMessage('Verbindungsfehler. Bist du online?', 'system');
            chatHistory.pop();
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }

    // --- Events ---
    bubble.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            input.focus();
            if (messages.children.length === 0) {
                const char = CHARACTERS[charSelect.value];
                addMessage(`${char.emoji} ${char.name} ist da! Sag hallo!`, 'system');
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
    });

    charSelect.addEventListener('change', () => {
        chatHistory = [];
        messages.innerHTML = '';
        const char = CHARACTERS[charSelect.value];
        addMessage(`${char.emoji} ${char.name} ist da!`, 'system');
    });

    function sendMessage() {
        const text = input.value.trim();
        if (!text || sendBtn.disabled) return;
        input.value = '';
        addMessage(text, 'user');
        sendToApi(text);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // API-Key Dialog
    settingsBtn.addEventListener('click', () => {
        apiKeyInput.value = getApiKey();
        apiKeyDialog.classList.remove('hidden');
    });

    apiKeySave.addEventListener('click', () => {
        setApiKey(apiKeyInput.value.trim());
        apiKeyDialog.classList.add('hidden');
        addMessage('API-Key gespeichert!', 'system');
    });

    apiKeyClose.addEventListener('click', () => {
        apiKeyDialog.classList.add('hidden');
    });

})();
