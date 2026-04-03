// @ts-nocheck
// === NPC-SESSION-GEDÄCHTNIS (Backlog #96, Zellteilung #11) ===
// Reine Speicher-Operationen: kein Game-State, kein Canvas.
// Format: { [npcId]: { lastMaterial, lastMaterialKey, lastVisit, questsDone: [] } }

(function () {
    'use strict';

    const NPC_MEMORY_KEY = 'insel-npc-memory';

    function loadNpcMemory() {
        try { return JSON.parse(localStorage.getItem(NPC_MEMORY_KEY) || '{}'); }
        catch { return {}; }
    }

    function saveNpcMemory(mem) {
        localStorage.setItem(NPC_MEMORY_KEY, JSON.stringify(mem));
    }

    function getNpcMem(npcId) {
        return loadNpcMemory()[npcId] || null;
    }

    // Letzten Besuch für diesen NPC aktualisieren
    function touchNpcMemory(npcId) {
        const mem = loadNpcMemory();
        if (!mem[npcId]) mem[npcId] = { lastVisit: null, lastMaterial: null, lastMaterialKey: null, questsDone: [] };
        mem[npcId].lastVisit = Date.now();
        saveNpcMemory(mem);
    }

    // Quest-Abschluss für diesen NPC vermerken
    function recordNpcQuestDone(npcId, questTitle) {
        const mem = loadNpcMemory();
        if (!mem[npcId]) mem[npcId] = { lastVisit: null, lastMaterial: null, lastMaterialKey: null, questsDone: [] };
        if (!mem[npcId].questsDone.includes(questTitle)) mem[npcId].questsDone.push(questTitle);
        mem[npcId].lastVisit = Date.now();
        saveNpcMemory(mem);
    }

    // Session-Ende: Lieblingsmaterial in alle NPC-Memory-Einträge schreiben
    // Erwartet npcIds (Array), materials (Objekt {key: label}), snapshot-Daten
    function flushNpcMemory(npcIds, favKey, favLabel, snapshot) {
        const mem = loadNpcMemory();
        if (favKey) {
            for (const id of npcIds) {
                if (!mem[id]) mem[id] = { lastVisit: null, lastMaterial: null, lastMaterialKey: null, questsDone: [] };
                mem[id].lastMaterial = favLabel;
                mem[id].lastMaterialKey = favKey;
            }
        }
        saveNpcMemory(mem);
        if (snapshot) {
            let json = JSON.stringify(snapshot);
            if (json.length > 1024 && snapshot.questsCompleted) {
                snapshot.questsCompleted = snapshot.questsCompleted.slice(-2);
                json = JSON.stringify(snapshot);
            }
            localStorage.setItem('insel-session-snapshot', json);
        }
    }

    // Gedächtnis-Kommentar für NPC (gibt null zurück wenn nichts sinnvolles da ist)
    function getNpcMemoryComment(npc, npcId, playerName) {
        const m = getNpcMem(npcId);
        if (!m) return null;
        const hasName = playerName && playerName !== 'Spieler' && playerName !== 'Anonym';
        const nameStr = hasName ? ` ${playerName}` : '';
        const daysSince = m.lastVisit ? Math.floor((Date.now() - m.lastVisit) / 86400000) : null;

        if (m.lastMaterial && m.questsDone && m.questsDone.length > 0) {
            return `${npc.emoji} ${npc.prefix} Hey${nameStr}! Letztes Mal hast du viel mit ${m.lastMaterial} gebaut. Und ${m.questsDone.length} Quest${m.questsDone.length > 1 ? 's' : ''} geschafft!`;
        }
        if (m.lastMaterial) {
            return `${npc.emoji} ${npc.prefix} Hey${nameStr}! Letztes Mal hast du viel mit ${m.lastMaterial} gebaut...`;
        }
        if (daysSince !== null && daysSince >= 1) {
            const dayText = daysSince === 1 ? 'gestern' : `vor ${daysSince} Tagen`;
            return `${npc.emoji} ${npc.prefix} Schon ${dayText} warst du zuletzt hier${nameStr}!`;
        }
        if (m.questsDone && m.questsDone.length > 0) {
            return `${npc.emoji} ${npc.prefix} Erinnerst du dich${nameStr}? Wir haben schon ${m.questsDone.length} Quest${m.questsDone.length > 1 ? 's' : ''} zusammen gemacht!`;
        }
        return null;
    }

    window.INSEL_NPC_MEMORY = {
        loadNpcMemory,
        saveNpcMemory,
        getNpcMem,
        touchNpcMemory,
        recordNpcQuestDone,
        flushNpcMemory,
        getNpcMemoryComment,
    };

})();
