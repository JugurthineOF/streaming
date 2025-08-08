import type { RequestHandler } from './$types';

const UA = 'Mozilla/5.0';

function strip(h: Headers) {
  const x = new Headers(h);
  x.delete('x-frame-options');
  x.delete('content-security-policy');
  x.delete('content-security-policy-report-only');
  x.set('access-control-allow-origin', '*');
  x.set('access-control-allow-headers', '*');
  x.set('access-control-expose-headers', '*');
  return x;
}

export const GET: RequestHandler = async ({ url, fetch, request }) => {
  const target = url.searchParams.get('u');
  if (!target) return new Response('Missing u', { status: 400 });

  const t = new URL(target);
  const headers: Record<string, string> = {
    'user-agent': UA,
    'accept': request.headers.get('accept') ?? '*/*',
    'accept-language': request.headers.get('accept-language') ?? 'en-US,en;q=0.9',
    'referer': t.origin
  };
  const range = request.headers.get('range');
  if (range) headers.range = range;

  const res = await fetch(target, { headers, redirect: 'follow' });

  // Pass content as-is, only strip frame blockers
  const out = new Response(res.body, { status: res.status, headers: strip(res.headers) });
  return out;
};
