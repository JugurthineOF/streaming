import type { RequestHandler } from './$types';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

function strip(hdrs: Headers) {
  const h = new Headers(hdrs);
  h.delete('x-frame-options');
  h.delete('content-security-policy');
  h.delete('content-security-policy-report-only');
  h.set('access-control-allow-origin', '*');
  h.set('access-control-allow-headers', '*');
  h.set('access-control-expose-headers', '*');
  return h;
}
const prox = (u: string) => `/proxy?u=${encodeURIComponent(u)}`;

function rewriteHtml(html: string, base: URL) {
  html = html.replace(/(src|href)\s*=\s*"(.*?)"/gi, (_m, a, v) => {
    try { return `${a}="${prox(new URL(v, base).toString())}"`; } catch { return `${a}="${v}"`; }
  });
  html = html.replace(/(src|href)\s*=\s*'(.*?)'/gi, (_m, a, v) => {
    try { return `${a}='${prox(new URL(v, base).toString())}'`; } catch { return `${a}='${v}'`; }
  });
  html = html.replace(/url\((?!data:)(['"]?)(.*?)\1\)/gi, (_m, _q, v) => {
    try { return `url(${prox(new URL(v, base).toString())})`; } catch { return `url(${v})`; }
  });
  return html;
}
function rewriteM3U8(text: string, base: URL) {
  return text.split('\n').map((line) => {
    const s = line.trim();
    if (!s || s.startsWith('#')) return line;
    try { return prox(new URL(s, base).toString()); } catch { return line; }
  }).join('\n');
}

export const GET: RequestHandler = async ({ url, fetch, request }) => {
  const target = url.searchParams.get('u');
  if (!target) return new Response('Missing u', { status: 400 });

  const t = new URL(target);
  const hdrs: Record<string,string> = {
    'user-agent': UA,
    'accept': request.headers.get('accept') ?? '*/*',
    'accept-language': request.headers.get('accept-language') ?? 'en-US,en;q=0.9',
    'referer': t.origin
  };
  const range = request.headers.get('range');
  if (range) hdrs.range = range;

  const res = await fetch(target, { headers: hdrs, redirect: 'follow' });
  const ct = res.headers.get('content-type') || '';
  const safe = strip(res.headers);

  if (ct.includes('text/html')) {
    const html = await res.text();
    return new Response(rewriteHtml(html, t), { status: res.status, headers: safe });
  }
  if (ct.includes('application/vnd.apple.mpegurl') || t.pathname.endsWith('.m3u8')) {
    const txt = await res.text();
    const h = strip(res.headers); h.set('content-type','application/vnd.apple.mpegurl');
    return new Response(rewriteM3U8(txt, t), { status: res.status, headers: h });
  }
  return new Response(res.body, { status: res.status, headers: safe });
};
