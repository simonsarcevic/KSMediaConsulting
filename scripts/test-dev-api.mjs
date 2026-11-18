import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createContactServer } from './dev-api.mjs';

let resendRequest;
const server = createContactServer({
  env: {
    RESEND_API_KEY: 'test-secret',
    CONTACT_TO_EMAIL: 'luca.kruse@ksmediaconsulting.de',
    CONTACT_FROM_EMAIL: 'K&S Media Consulting <onboarding@resend.dev>',
  },
  fetchImpl: async (url, options) => {
    resendRequest = { url, options };
    return new Response('{}', { status: 200 });
  },
});

server.listen(0, '127.0.0.1');
await once(server, 'listening');
const address = server.address();

try {
  const response = await fetch(`http://127.0.0.1:${address.port}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Testanfrage',
      website: '',
    }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(resendRequest.url, 'https://api.resend.com/emails');
  const payload = JSON.parse(resendRequest.options.body);
  assert.deepEqual(payload.to, ['luca.kruse@ksmediaconsulting.de']);
  assert.equal(payload.reply_to, 'test@example.com');
  console.log('Local contact API test passed.');
} finally {
  server.close();
  await once(server, 'close');
}
