import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContactEmailContent,
  buildMailtoHref,
  checkContactRateLimit,
  escapeHtml,
  resetContactRateLimitStore,
  resolveEmailProviderConfig,
  sanitizeEmailHeader,
} from './email-utils';

test('sanitizeEmailHeader strips CRLF and null bytes to prevent header injection', () => {
  assert.equal(sanitizeEmailHeader("Hello\r\nBcc: evil@attacker.com\n"), 'Hello Bcc: evil@attacker.com');
  assert.equal(sanitizeEmailHeader("Normal   Subject\0"), 'Normal Subject');
});

test('escapeHtml neutralizes script tags and HTML attributes', () => {
  const escaped = escapeHtml(`<script>alert("xss")</script> & 'test'`);
  assert.equal(
    escaped,
    '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;test&#39;'
  );
});

test('buildContactEmailContent escapes HTML body and sanitizes headers', () => {
  const built = buildContactEmailContent({
    id: 'msg_123',
    submittedAt: '2026-11-24T07:00:00.000Z',
    name: 'Jane Doe',
    email: 'jane@example.com',
    inquiryType: 'Engineering Role',
    subject: 'Senior Role\r\nInjected',
    message: 'Hello <b>Yoftahe</b>\nInterested in working together.',
  });

  assert.equal(built.subject, '[Portfolio · Engineering Role] Senior Role Injected');
  assert.equal(built.replyTo, 'jane@example.com');
  assert.match(built.html, /&lt;b&gt;Yoftahe&lt;\/b&gt;/);
  assert.match(built.html, /<br \/>/);
  assert.doesNotMatch(built.html, /<b>Yoftahe<\/b>/);
  assert.match(built.text, /jane@example\.com/);
});

test('resolveEmailProviderConfig prioritizes Resend, falls back to Gmail App Password SMTP, then none', () => {
  const none = resolveEmailProviderConfig({});
  assert.equal(none.provider, 'none');
  assert.equal(none.to, 'yoftaheyoseph5@gmail.com');

  const gmail = resolveEmailProviderConfig({ GMAIL_APP_PASSWORD: 'abcd efgh ijkl mnop' });
  assert.equal(gmail.provider, 'gmail_smtp');
  if (gmail.provider === 'gmail_smtp') {
    assert.equal(gmail.host, 'smtp.gmail.com');
    assert.equal(gmail.port, 465);
    assert.equal(gmail.secure, true);
    assert.equal(gmail.user, 'yoftaheyoseph5@gmail.com');
    assert.equal(gmail.pass, 'abcdefghijklmnop');
    assert.equal(gmail.to, 'yoftaheyoseph5@gmail.com');
  }

  const resend = resolveEmailProviderConfig({
    RESEND_API_KEY: 're_test_key',
    GMAIL_APP_PASSWORD: 'test-app-password',
  });
  assert.equal(resend.provider, 'resend');
  assert.equal(resend.to, 'yoftaheyoseph5@gmail.com');
});

test('buildMailtoHref creates a properly encoded mailto link for yoftaheyoseph5@gmail.com', () => {
  const href = buildMailtoHref({
    to: 'yoftaheyoseph5@gmail.com',
    name: 'Alex',
    email: 'alex@example.com',
    inquiryType: 'Project Collaboration',
    subject: 'Next.js Build',
    message: 'Let us build together.',
  });
  assert.ok(href.startsWith('mailto:yoftaheyoseph5@gmail.com?subject='));
  assert.match(href, /Next\.js%20Build/);
  assert.match(href, /alex%40example\.com/);
});

test('checkContactRateLimit enforces 5 requests per 10-minute window', () => {
  resetContactRateLimitStore();
  const baseTime = 1_700_000_000_000;

  for (let i = 0; i < 5; i++) {
    assert.equal(checkContactRateLimit('192.0.2.10', baseTime + i * 1000).allowed, true);
  }
  const blocked = checkContactRateLimit('192.0.2.10', baseTime + 6000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);

  // Allowed again after window expires
  assert.equal(
    checkContactRateLimit('192.0.2.10', baseTime + 11 * 60 * 1000).allowed,
    true
  );
  resetContactRateLimitStore();
});
