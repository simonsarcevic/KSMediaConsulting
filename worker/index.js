const staticAssets = __STATIC_ASSETS__;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimits = new Map();
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 5;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isRateLimited(request) {
  const clientId = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const recent = (rateLimits.get(clientId) || []).filter((time) => now - time < rateLimitWindowMs);

  if (recent.length >= rateLimitMaxRequests) {
    rateLimits.set(clientId, recent);
    return true;
  }

  recent.push(now);
  rateLimits.set(clientId, recent);
  return false;
}

async function handleContact(request, env) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== requestUrl.origin) {
    return json({ error: 'Forbidden' }, 403);
  }

  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > 16_384 || !request.headers.get('content-type')?.includes('application/json')) {
    return json({ error: 'Invalid request' }, 400);
  }

  if (isRateLimited(request)) {
    return json({ error: 'Too many requests' }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  if (cleanText(body.website, 200)) {
    return json({ ok: true });
  }

  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 254);
  const subject = cleanText(body.subject, 4000);
  if (!name || !emailPattern.test(email) || !subject) {
    return json({ error: 'Invalid form data' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return json({ error: 'Email service unavailable' }, 503);
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || 'KS Media Consulting <noreply@KSMediaConsulting.de>',
      to: [env.CONTACT_TO_EMAIL || 'luca.kruse@ksmediaconsulting.de'],
      reply_to: email,
      subject: `Neue Projektanfrage von ${name}`,
      text: [`Name: ${name}`, `E-Mail: ${email}`, '', 'Anfrage:', subject].join('\n'),
    }),
  });

  if (!resendResponse.ok) {
    const resendErrorBody = await resendResponse.text();
    let resendError = resendErrorBody;
    try {
      const parsedError = JSON.parse(resendErrorBody);
      resendError = parsedError.message || parsedError.name || resendErrorBody;
    } catch {
      // Keep the plain response text when Resend did not return JSON.
    }
    console.error(
      `Resend request failed with status ${resendResponse.status}: ${resendError || 'No details'}`,
    );
    return json({ error: 'Email delivery failed' }, 502);
  }

  return json({ ok: true });
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function serveAsset(pathname, request) {
  let asset = staticAssets[pathname];
  if (!asset && request.headers.get('accept')?.includes('text/html')) {
    asset = staticAssets['/index.html'];
  }
  if (!asset) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers({
    'content-type': asset.contentType,
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  });
  headers.set(
    'cache-control',
    pathname === '/' || pathname.endsWith('.html')
      ? 'no-cache'
      : 'public, max-age=31536000, immutable',
  );

  return new Response(decodeBase64(asset.base64), { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      try {
        return await handleContact(request, env);
      } catch (error) {
        console.error('Contact handler failed', error instanceof Error ? error.message : 'unknown error');
        return json({ error: 'Email service unavailable' }, 503);
      }
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const response = serveAsset(pathname, request);
    return request.method === 'HEAD' ? new Response(null, response) : response;
  },
};
