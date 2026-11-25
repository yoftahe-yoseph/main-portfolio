import { PROFILE } from './data/profile';
import type { ContactFormPayload } from './types';

export interface ContactEmailSubmission extends Omit<ContactFormPayload, 'website'> {
  id: string;
  submittedAt: string;
}

export type ResolvedEmailProvider =
  | {
      provider: 'resend';
      apiKey: string;
      from: string;
      to: string;
    }
  | {
      provider: 'gmail_smtp';
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
      from: string;
      to: string;
    }
  | {
      provider: 'none';
      to: string;
    };

/**
 * Strips CR, LF, and NUL characters to prevent SMTP / email header injection.
 */
export function sanitizeEmailHeader(value: string): string {
  return value.replace(/[\r\n\0]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Escapes HTML special characters for safe interpolation inside HTML email templates.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Builds clean plain-text and HTML-escaped email content for delivery to Yoftahe's inbox.
 */
export function buildContactEmailContent(submission: ContactEmailSubmission) {
  const safeName = sanitizeEmailHeader(submission.name);
  const safeEmail = sanitizeEmailHeader(submission.email);
  const safeInquiryType = sanitizeEmailHeader(submission.inquiryType);
  const safeSubject = sanitizeEmailHeader(submission.subject);
  const subject = `[Portfolio · ${safeInquiryType}] ${safeSubject}`;

  const text = [
    `New message submitted through ${PROFILE.name}'s portfolio`,
    '------------------------------------------------------------',
    `From: ${safeName} <${safeEmail}>`,
    `Inquiry Type: ${safeInquiryType}`,
    `Subject: ${safeSubject}`,
    `Reference ID: ${submission.id}`,
    `Submitted At: ${submission.submittedAt}`,
    '------------------------------------------------------------',
    '',
    submission.message.trim(),
    '',
    `Reply directly to this email to respond to ${safeName} (${safeEmail}).`,
  ].join('\n');

  const escapedMessageHtml = escapeHtml(submission.message.trim()).replace(/\r?\n/g, '<br />');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.04em;">
        Portfolio Inquiry · ${escapeHtml(safeInquiryType)}
      </p>
      <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0f172a;">
        ${escapeHtml(safeSubject)}
      </h1>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 120px;">Sender</td>
          <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${escapeHtml(safeName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Reply-To Email</td>
          <td style="padding: 6px 0;"><a href="mailto:${encodeURIComponent(safeEmail)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(safeEmail)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Reference ID</td>
          <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #334155;">${escapeHtml(submission.id)}</td>
        </tr>
      </table>
      <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1e293b;">
        ${escapedMessageHtml}
      </div>
      <p style="margin: 20px 0 0; font-size: 12px; color: #64748b;">
        Sent via ${escapeHtml(PROFILE.name)}&apos;s Portfolio Contact Form (${escapeHtml(submission.submittedAt)}). Reply directly to respond to ${escapeHtml(safeName)}.
      </p>
    </div>
  `.trim();

  return {
    subject,
    text,
    html,
    replyTo: safeEmail,
  };
}

/**
 * Builds a safe mailto: URI so visitors can send directly from their email client
 * when automated server email credentials are not yet configured.
 */
export function buildMailtoHref(params: {
  to: string;
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
}): string {
  const safeTo = sanitizeEmailHeader(params.to);
  const fullSubject = sanitizeEmailHeader(`[${params.inquiryType}] ${params.subject}`);
  const body = [
    `Hi Yoftahe,`,
    '',
    params.message.trim(),
    '',
    '---',
    `From: ${sanitizeEmailHeader(params.name)} (${sanitizeEmailHeader(params.email)})`,
    `Inquiry Type: ${sanitizeEmailHeader(params.inquiryType)}`,
  ].join('\n');

  return `mailto:${safeTo}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Resolves the active server-side email delivery provider from environment variables.
 * Recipient is always locked server-side to CONTACT_TO_EMAIL or Yoftahe's verified email.
 */
export function resolveEmailProviderConfig(
  env: Record<string, string | undefined>
): ResolvedEmailProvider {
  const to = sanitizeEmailHeader((env.CONTACT_TO_EMAIL || PROFILE.email).trim()) || PROFILE.email;

  const resendApiKey = (env.RESEND_API_KEY || '').trim();
  if (resendApiKey) {
    const from =
      sanitizeEmailHeader((env.CONTACT_FROM_EMAIL || '').trim()) ||
      'Portfolio Contact <onboarding@resend.dev>';
    return {
      provider: 'resend',
      apiKey: resendApiKey,
      from,
      to,
    };
  }

  const gmailAppPassword = (env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();
  const smtpPass = (env.SMTP_PASS || gmailAppPassword).trim();
  const smtpUser = sanitizeEmailHeader((env.SMTP_USER || (gmailAppPassword ? to : '')).trim());

  if (smtpUser && smtpPass) {
    const host = sanitizeEmailHeader((env.SMTP_HOST || 'smtp.gmail.com').trim()) || 'smtp.gmail.com';
    const parsedPort = Number.parseInt((env.SMTP_PORT || '465').trim(), 10);
    const port = Number.isFinite(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : 465;
    const from =
      sanitizeEmailHeader((env.CONTACT_FROM_EMAIL || '').trim()) ||
      `${PROFILE.name} Portfolio <${smtpUser}>`;

    return {
      provider: 'gmail_smtp',
      host,
      port,
      secure: port === 465,
      user: smtpUser,
      pass: smtpPass,
      from,
      to,
    };
  }

  return {
    provider: 'none',
    to,
  };
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, number[]>();

export function checkContactRateLimit(
  clientKey: string,
  nowMs: number = Date.now()
): { allowed: boolean; retryAfterSeconds: number } {
  const key = clientKey.trim() || 'unknown';
  const windowStart = nowMs - RATE_LIMIT_WINDOW_MS;

  const existing = (rateLimitStore.get(key) ?? []).filter((ts) => ts > windowStart);

  if (existing.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestInWindow = existing[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - nowMs) / 1000)
    );
    rateLimitStore.set(key, existing);
    return { allowed: false, retryAfterSeconds };
  }

  existing.push(nowMs);
  rateLimitStore.set(key, existing);

  // Periodically prune stale entries so memory stays bounded
  if (rateLimitStore.size > 500) {
    for (const [entryKey, timestamps] of rateLimitStore.entries()) {
      const active = timestamps.filter((ts) => ts > windowStart);
      if (active.length === 0) {
        rateLimitStore.delete(entryKey);
      } else {
        rateLimitStore.set(entryKey, active);
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetContactRateLimitStore(): void {
  rateLimitStore.clear();
}
