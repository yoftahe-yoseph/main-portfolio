import nodemailer from 'nodemailer';
import {
  buildContactEmailContent,
  resolveEmailProviderConfig,
  type ContactEmailSubmission,
} from './email-utils';

export interface EmailDeliveryResult {
  delivered: boolean;
  configured: boolean;
  provider: 'resend' | 'gmail_smtp' | 'none';
  recipient: string;
  messageId?: string;
  error?: string;
}

/**
 * Server-side email delivery to yoftaheyoseph5@gmail.com (or CONTACT_TO_EMAIL).
 * Supports Resend HTTPS API (RESEND_API_KEY) and Gmail / custom SMTP
 * (GMAIL_APP_PASSWORD or SMTP_USER + SMTP_PASS).
 */
export async function deliverContactEmail(
  submission: ContactEmailSubmission
): Promise<EmailDeliveryResult> {
  const config = resolveEmailProviderConfig(process.env);

  if (config.provider === 'none') {
    return {
      delivered: false,
      configured: false,
      provider: 'none',
      recipient: config.to,
    };
  }

  const content = buildContactEmailContent(submission);

  if (config.provider === 'resend') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.from,
          to: [config.to],
          reply_to: content.replyTo,
          subject: content.subject,
          text: content.text,
          html: content.html,
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        id?: string;
        message?: string;
      };

      if (!response.ok) {
        return {
          delivered: false,
          configured: true,
          provider: 'resend',
          recipient: config.to,
          error: body.message || `Email service returned HTTP ${response.status}.`,
        };
      }

      return {
        delivered: true,
        configured: true,
        provider: 'resend',
        recipient: config.to,
        messageId: body.id,
      };
    } catch (err) {
      return {
        delivered: false,
        configured: true,
        provider: 'resend',
        recipient: config.to,
        error: err instanceof Error ? err.message : 'Failed to reach Resend API.',
      };
    }
  }

  // Gmail SMTP / Custom SMTP via nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const info = await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: content.replyTo,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    return {
      delivered: true,
      configured: true,
      provider: 'gmail_smtp',
      recipient: config.to,
      messageId: info.messageId,
    };
  } catch (err) {
    return {
      delivered: false,
      configured: true,
      provider: 'gmail_smtp',
      recipient: config.to,
      error: err instanceof Error ? err.message : 'SMTP delivery failed.',
    };
  }
}
