// Insel Chat Proxy — Cloudflare Worker
// Key liegt bei Cloudflare, nie im Browser.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();

      // Validierung: nur erlaubte Felder durchlassen
      const model = body.model || 'claude-haiku-4-5-20251001';
      const messages = body.messages;
      const maxTokens = Math.min(body.max_tokens || 150, 300); // Hard cap

      if (!Array.isArray(messages) || messages.length === 0) {
        return Response.json({ error: 'messages required' }, { status: 400, headers: CORS_HEADERS });
      }

      // Max 10 Nachrichten, max 500 Zeichen pro Nachricht (Kinderschutz)
      const safeMsgs = messages.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
        content: String(m.content).slice(0, 500),
      }));

      const response = await fetch('https://api.langdock.com/openai/eu/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.LANGDOCK_KEY}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: safeMsgs,
        }),
      });

      const data = await response.json();

      return Response.json(data, {
        status: response.status,
        headers: CORS_HEADERS,
      });

    } catch (err) {
      return Response.json(
        { error: 'Proxy error', message: err.message },
        { status: 502, headers: CORS_HEADERS }
      );
    }
  },
};
