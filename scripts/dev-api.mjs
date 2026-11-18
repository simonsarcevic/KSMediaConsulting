import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function loadLocalEnv(path = resolve('.env.local')) {
  if (!existsSync(path)) return;

  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const equals = line.indexOf('=');
    if (equals < 1) continue;
    const key = line.slice(0, equals).trim();
    let value = line.slice(equals + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function json(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(JSON.stringify(body));
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new Error('Payload too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createContactServer({ env = process.env, fetchImpl = fetch } = {}) {
  return createServer(async (request, response) => {
    const url = new URL(request.url || '/', 'http://127.0.0.1');
    if (url.pathname !== '/api/contact') {
      json(response, 404, { error: 'Not found' });
      return;
    }
    if (request.method !== 'POST') {
      json(response, 405, { error: 'Method not allowed' });
      return;
    }
    if (!request.headers['content-type']?.includes('application/json')) {
      json(response, 400, { error: 'Invalid request' });
      return;
    }

    try {
      const body = await readJson(request);
      if (cleanText(body.website, 200)) {
        json(response, 200, { ok: true });
        return;
      }

      const name = cleanText(body.name, 120);
      const email = cleanText(body.email, 254);
      const subject = cleanText(body.subject, 4000);
      if (!name || !emailPattern.test(email) || !subject) {
        json(response, 400, { error: 'Invalid form data' });
        return;
      }
      if (!env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY fehlt. Lege ihn in .env.local ab und starte npm start neu.');
        json(response, 503, { error: 'Email service unavailable' });
        return;
      }

      const resendResponse = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from:
            env.CONTACT_FROM_EMAIL ||
            'KS Media Consulting Kontaktformular <noreply@ksmediaconsulting.de>',
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
          `Resend-Anfrage fehlgeschlagen (${resendResponse.status}): ${resendError || 'Keine Details'}`,
        );
        json(response, 502, { error: 'Email delivery failed' });
        return;
      }
      json(response, 200, { ok: true });
    } catch (error) {
      console.error('Kontaktanfrage fehlgeschlagen:', error instanceof Error ? error.message : error);
      json(response, 400, { error: 'Invalid request' });
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  loadLocalEnv();
  const port = Number(process.env.CONTACT_API_PORT || 3001);
  const server = createContactServer();
  server.listen(port, '127.0.0.1', () => {
    console.log(`Lokales Kontakt-Backend läuft auf http://127.0.0.1:${port}`);
    if (!process.env.RESEND_API_KEY) {
      console.warn('Hinweis: RESEND_API_KEY fehlt in .env.local; E-Mails werden noch nicht versendet.');
    }
  });
}
