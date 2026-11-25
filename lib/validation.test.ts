import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactForm,
  validateSafeHttpUrl,
  validateCertificateFileMeta,
  MAX_CERTIFICATE_FILE_BYTES,
} from './validation';

test('validateSafeHttpUrl permits valid https and http URLs and blocks unsafe schemes', () => {
  const okHttps = validateSafeHttpUrl('https://coursera.org/verify/ABC123');
  assert.equal(okHttps.valid, true);
  assert.equal(okHttps.normalized, 'https://coursera.org/verify/ABC123');

  const blockedJs = validateSafeHttpUrl('javascript:alert(1)');
  assert.equal(blockedJs.valid, false);

  const blockedData = validateSafeHttpUrl('data:text/html,<script>alert(1)</script>');
  assert.equal(blockedData.valid, false);

  const malformed = validateSafeHttpUrl('not-a-valid-url');
  assert.equal(malformed.valid, false);
});

test('validateCertificateFileMeta enforces MIME allowlist and 5 MB ceiling', () => {
  assert.equal(validateCertificateFileMeta('cert.pdf', 'application/pdf', 240_000).valid, true);
  assert.equal(validateCertificateFileMeta('badge.png', 'image/png', 120_000).valid, true);
  assert.equal(validateCertificateFileMeta('script.html', 'text/html', 1200).valid, false);
  assert.equal(
    validateCertificateFileMeta('huge.pdf', 'application/pdf', MAX_CERTIFICATE_FILE_BYTES + 1).valid,
    false
  );
  assert.equal(validateCertificateFileMeta('empty.pdf', 'application/pdf', 0).valid, false);
});

test('validateContactForm rejects empty or malformed fields and accepts complete valid payloads', () => {
  const invalid = validateContactForm({
    name: 'A',
    email: 'invalid-email',
    inquiryType: 'Engineering Role',
    subject: 'Hi',
    message: 'Too short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateContactForm({
    name: 'Selamawit Bekele',
    email: 'selam@example.org',
    inquiryType: 'Project Collaboration',
    subject: 'Hospital workflow system consultation',
    message: 'Hello Yoftahe, we would love to discuss a Next.js and RBAC healthcare project.',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.data?.email, 'selam@example.org');
});
