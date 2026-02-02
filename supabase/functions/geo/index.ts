// Proxies IP-to-country lookup so the browser calls same-origin (or your backend)
// instead of a third-party API that may be blocked by ad blockers (ERR_BLOCKED_BY_CLIENT).

const GEO_API = 'https://api.country.is/';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  try {
    const res = await fetch(GEO_API);
    if (!res.ok) {
      return new Response(JSON.stringify({ country: '' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const data = await res.json();
    const country = data?.country ?? '';
    return new Response(JSON.stringify({ country }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ country: '' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
