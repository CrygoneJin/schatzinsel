#!/bin/bash
# === Claude Code LiteLLM Routing ===
# Routet Claude Code über LiteLLM/Langdock-Proxy mit Fallback auf claude.ai
#
# Nutzung:
#   source ~/.claude/routing.sh auto     # Standard: auto-detect
#   source ~/.claude/routing.sh proxy    # Proxy erzwingen
#   source ~/.claude/routing.sh direct   # Direkt zu claude.ai
#   source ~/.claude/routing.sh status   # Status anzeigen

PROXY_URL="http://localhost:4000"
HEALTH_ENDPOINT="${PROXY_URL}/health"
SETTINGS_FILE="$HOME/.claude/settings.json"
LAUNCHCTL_LABEL="com.litellm.proxy"
MAX_RETRIES=3
RETRY_DELAY=2
MODE_FILE="$HOME/.claude/routing-mode"

start_proxy() {
    launchctl start "$LAUNCHCTL_LABEL" 2>/dev/null
    sleep 2
}

check_health() {
    curl -sf --max-time 5 "$HEALTH_ENDPOINT" >/dev/null 2>&1
}

test_langdock() {
    curl -sf --max-time 15 \
        -X POST "${PROXY_URL}/v1/chat/completions" \
        -H "Content-Type: application/json" \
        -d '{"model":"gpt-4o","messages":[{"role":"user","content":"ping"}],"max_tokens":1}' \
        >/dev/null 2>&1
}

set_proxy_mode() {
    python3 -c "
import json, os
p = os.path.expanduser('$SETTINGS_FILE')
try:
    with open(p) as f: c = json.load(f)
except:
    c = {}
c['env'] = c.get('env', {})
c['env']['ANTHROPIC_BASE_URL'] = '${PROXY_URL}/v1'
c['env']['ANTHROPIC_API_KEY'] = os.environ.get('LANGDOCK_API_KEY', 'sk-proxy')
with open(p, 'w') as f: json.dump(c, f, indent=2)
"
    echo "proxy" > "$MODE_FILE"
}

set_direct_mode() {
    python3 -c "
import json, os
p = os.path.expanduser('$SETTINGS_FILE')
try:
    with open(p) as f: c = json.load(f)
except:
    c = {}
c['env'] = c.get('env', {})
c['env'].pop('ANTHROPIC_BASE_URL', None)
c['env'].pop('ANTHROPIC_API_KEY', None)
with open(p, 'w') as f: json.dump(c, f, indent=2)
"
    echo "direct" > "$MODE_FILE"
}

get_current_mode() {
    if [ -f "$MODE_FILE" ]; then
        cat "$MODE_FILE"
    else
        echo "unknown"
    fi
}

# --- Kommandos ---
case "${1:-auto}" in
    proxy)
        echo "Forcing proxy mode..."
        if check_health && test_langdock; then
            set_proxy_mode
            echo "Proxy mode active"
        else
            echo "Proxy not available"
            exit 1
        fi
        return 0 2>/dev/null || exit 0
        ;;
    direct)
        echo "Forcing direct claude.ai mode..."
        set_direct_mode
        echo "Direct mode active"
        return 0 2>/dev/null || exit 0
        ;;
    status)
        echo "Current routing: $(get_current_mode)"
        if check_health; then
            echo "Proxy: healthy"
        else
            echo "Proxy: unreachable"
        fi
        return 0 2>/dev/null || exit 0
        ;;
    auto)
        ;;
esac

# --- Auto-Routing ---
echo "Testing LiteLLM proxy..."

if ! check_health; then
    echo "Proxy not running -- starting via launchctl..."
    start_proxy

    attempt=0
    while [ $attempt -lt $MAX_RETRIES ]; do
        if check_health; then
            break
        fi
        attempt=$((attempt + 1))
        echo "  retry $attempt/$MAX_RETRIES..."
        sleep $RETRY_DELAY
    done
fi

if check_health; then
    echo "LiteLLM proxy healthy"

    if test_langdock; then
        echo "Langdock verified -- proxy mode"
        set_proxy_mode
    else
        echo "Langdock unreachable -- falling back to claude.ai"
        set_direct_mode
    fi
else
    echo "Proxy unreachable -- falling back to claude.ai"
    set_direct_mode
fi

echo "Routing: $(get_current_mode)"
