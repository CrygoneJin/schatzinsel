// bus.js — IslandOS Communication Layer
//
// Drei Muster, drei Zwecke:
//   Bus        = Broadcast    "Es ist etwas passiert"       → Reagiere wer will
//   Threads    = Pipeline     "Mach das, berichte zurück"   → Agent-Tool (extern)
//   Token Ring = Mutex        "Einer schreibt, Rest wartet" → Keine Kollisionen
//
// Bus + Token Ring leben hier. Threads sind das Agent-Tool (Claude Code extern).

(function () {
    'use strict';

    // === EVENT BUS (pub/sub, broadcast) ===
    var _handlers = {};

    function on(event, fn) {
        (_handlers[event] || (_handlers[event] = [])).push(fn);
    }

    function off(event, fn) {
        _handlers[event] = (_handlers[event] || []).filter(function (f) { return f !== fn; });
    }

    function emit(event) {
        var args = Array.prototype.slice.call(arguments, 1);
        (_handlers[event] || []).forEach(function (fn) { fn.apply(null, args); });
    }

    // === TOKEN RING (mutex für shared resources) ===
    //
    // Verhindert gleichzeitige Schreibzugriffe auf L2-Ressourcen
    // (MEMORY.md, SPRINT.md, git push). Einfachste Form:
    // acquire(resource) → Promise<release>. Nur ein Halter pro Resource.

    var _locks = {};   // resource → { holder, queue }

    function acquire(resource, holder) {
        holder = holder || 'anonymous';
        if (!_locks[resource]) {
            _locks[resource] = { holder: holder, queue: [] };
            emit('token:acquired', { resource: resource, holder: holder });
            return Promise.resolve(release.bind(null, resource, holder));
        }
        // Resource belegt → in Warteschlange
        return new Promise(function (resolve) {
            _locks[resource].queue.push({ holder: holder, resolve: resolve });
            emit('token:waiting', { resource: resource, holder: holder, position: _locks[resource].queue.length });
        });
    }

    function release(resource, holder) {
        var lock = _locks[resource];
        if (!lock) return;
        if (lock.holder !== holder) return; // nur der Halter darf freigeben

        emit('token:released', { resource: resource, holder: holder });

        if (lock.queue.length > 0) {
            // Token weitergeben an nächsten in der Schlange
            var next = lock.queue.shift();
            lock.holder = next.holder;
            emit('token:acquired', { resource: resource, holder: next.holder });
            next.resolve(release.bind(null, resource, next.holder));
        } else {
            delete _locks[resource];
        }
    }

    function isLocked(resource) {
        return !!_locks[resource];
    }

    function getLockHolder(resource) {
        return _locks[resource] ? _locks[resource].holder : null;
    }

    function getQueueLength(resource) {
        return _locks[resource] ? _locks[resource].queue.length : 0;
    }

    // === SESSION LOCK ===
    //
    // Verhindert parallele Sessions die auf dieselbe Ressource schreiben.
    // Basiert auf localStorage (Browser) — reicht für Single-User.

    var SESSION_ID = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    var SESSION_LOCK_KEY = 'insel-session-lock';
    var SESSION_LOCK_TTL = 120000; // 2 Minuten TTL

    function acquireSessionLock() {
        try {
            var raw = localStorage.getItem(SESSION_LOCK_KEY);
            if (raw) {
                var existing = JSON.parse(raw);
                // Lock abgelaufen?
                if (Date.now() - existing.ts > SESSION_LOCK_TTL) {
                    // Stale lock — übernehmen
                    emit('session:stale-lock', { previous: existing.id });
                } else if (existing.id !== SESSION_ID) {
                    // Andere aktive Session
                    emit('session:conflict', { other: existing.id, own: SESSION_ID });
                    return false;
                }
            }
            localStorage.setItem(SESSION_LOCK_KEY, JSON.stringify({ id: SESSION_ID, ts: Date.now() }));
            return true;
        } catch (e) {
            return true; // localStorage nicht verfügbar → kein Lock, kein Problem
        }
    }

    function renewSessionLock() {
        try {
            localStorage.setItem(SESSION_LOCK_KEY, JSON.stringify({ id: SESSION_ID, ts: Date.now() }));
        } catch (e) { /* ignore */ }
    }

    function releaseSessionLock() {
        try {
            var raw = localStorage.getItem(SESSION_LOCK_KEY);
            if (raw) {
                var existing = JSON.parse(raw);
                if (existing.id === SESSION_ID) {
                    localStorage.removeItem(SESSION_LOCK_KEY);
                }
            }
        } catch (e) { /* ignore */ }
    }

    // Heartbeat: Lock alle 30s erneuern
    if (typeof window !== 'undefined' && window.setInterval) {
        setInterval(renewSessionLock, 30000);
        // Lock freigeben bei Tab-Close
        window.addEventListener('beforeunload', releaseSessionLock);
    }

    // === EXPORTS ===

    var bus = {
        // Event Bus
        on: on,
        off: off,
        emit: emit,

        // Token Ring
        acquire: acquire,
        release: release,
        isLocked: isLocked,
        getLockHolder: getLockHolder,
        getQueueLength: getQueueLength,

        // Session Lock
        SESSION_ID: SESSION_ID,
        acquireSessionLock: acquireSessionLock,
        renewSessionLock: renewSessionLock,
        releaseSessionLock: releaseSessionLock,
    };

    window.INSEL_BUS = bus;
})();
