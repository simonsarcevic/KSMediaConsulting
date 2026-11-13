import assert from 'node:assert/strict';

const { default: worker } = await import('../dist/server/index.js');

const pageResponse = await worker.fetch(new Request('https://example.com/'), {});
assert.equal(pageResponse.status, 200);
assert.match(pageResponse.headers.get('content-type'), /^text\/html/);

const invalidResponse = await worker.fetch(
  new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': 'test-invalid' },
    body: JSON.stringify({ name: '', email: 'invalid', subject: '' }),
  }),
  {},
);
assert.equal(invalidResponse.status, 400);

let resendRequest;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (request, init) => {
  resendRequest = { request, init };
  return new Response(JSON.stringify({ id: 'email-id' }), { status: 200 });
};

const contactResponse = await worker.fetch(
  new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://example.com',
      'cf-connecting-ip': 'test-valid',
    },
    body: JSON.stringify({
      name: 'Max Mustermann',
      email: 'max@example.com',
      subject: 'Eine neue Website',
      website: '',
    }),
  }),
  {
    RESEND_API_KEY: 'test-key',
    CONTACT_FROM_EMAIL: 'Website <kontakt@example.com>',
    CONTACT_TO_EMAIL: 'team@example.com',
  },
);
globalThis.fetch = originalFetch;

assert.equal(contactResponse.status, 200);
assert.equal(resendRequest.request, 'https://api.resend.com/emails');
assert.equal(resendRequest.init.headers.authorization, 'Bearer test-key');
const resendBody = JSON.parse(resendRequest.init.body);
assert.deepEqual(resendBody.to, ['team@example.com']);
assert.equal(resendBody.reply_to, 'max@example.com');

console.log('Worker contact and asset checks passed');
