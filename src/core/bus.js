// bus.js — Event Bus + Session Lock
//
// Bus   = pub/sub broadcast. "Es ist etwas passiert." Reagiere wer will.
// Lock  = Multi-Tab Guard. Nur ein Tab darf Auto-Saven.
// Threads (Agent-Delegation) sind extern (Claude Code Agent-Tool).

(function () {
    'use strict';

    // === EVENT BUS ===
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

    // === SESSION LOCK ===
    // Verhindert Multi-Tab Auto-Save Konflikte.
    // localStorage-basiert, 30s Heartbeat, 2min Stale Detection.

    var SESSION_ID = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    var LOCK_KEY = 'insel-session-lock';
    var TTL = 120000;

    function acquireSessionLock() {
        try {
            var raw = localStorage.getItem(LOCK_KEY);
            if (raw) {
                var existing = JSON.parse(raw);
                if (Date.now() - existing.ts < TTL && existing.id !== SESSION_ID) {
                    emit('session:conflict', { other: existing.id, own: SESSION_ID });
                    return false;
                }
            }
            localStorage.setItem(LOCK_KEY, JSON.stringify({ id: SESSION_ID, ts: Date.now() }));
            return true;
        } catch (e) {
            return true;
        }
    }

    function releaseSessionLock() {
        try {
            var raw = localStorage.getItem(LOCK_KEY);
            if (raw && JSON.parse(raw).id === SESSION_ID) {
                localStorage.removeItem(LOCK_KEY);
            }
        } catch (e) { /* ignore */ }
    }

    // Heartbeat + Cleanup
    setInterval(function () {
        try { localStorage.setItem(LOCK_KEY, JSON.stringify({ id: SESSION_ID, ts: Date.now() })); } catch (e) { /* ignore */ }
    }, 30000);
    window.addEventListener('beforeunload', releaseSessionLock);

    // === EXPORTS ===
    var bus = {
        on: on,
        off: off,
        emit: emit,
        SESSION_ID: SESSION_ID,
        acquireSessionLock: acquireSessionLock,
        releaseSessionLock: releaseSessionLock,
    };

    window.INSEL_BUS = bus;
})();
