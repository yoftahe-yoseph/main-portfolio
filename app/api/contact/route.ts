import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm } from '@/lib/validation';
import { saveContactSubmission } from '@/lib/server-store';
import { deliverContactEmail } from '@/lib/email';
import { buildMailtoHref, checkContactRateLimit } from '@/lib/email-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const rate = checkContactRateLimit(getClientIp(req));
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: 'Too many messages sent recently. Please wait a few minutes before sending another inquiry.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    // Silent honeypot check for automated spam bots
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json(
        {
          ok: true,
          emailDelivered: true,
          referenceId: 'msg_accepted',
          message: 'Thank you. Your inquiry has been received.',
        },
        { status: 201 }
      );
    }

    const result = validateContactForm(body);
    if (!result.valid || !result.data) {
      return NextResponse.json(
        {
          error: 'Please review the highlighted fields and try again.',
          fieldErrors: result.errors,
        },
        { status: 422 }
      );
    }

    const saved = await saveContactSubmission({
      name: result.data.name,
      email: result.data.email,
      inquiryType: result.data.inquiryType,
      subject: result.data.subject,
      message: result.data.message,
    });

    const emailResult = await deliverContactEmail(saved);
    const mailtoHref = buildMailtoHref({
      to: emailResult.recipient,
      name: saved.name,
      email: saved.email,
      inquiryType: saved.inquiryType,
      subject: saved.subject,
      message: saved.message,
    });

    if (emailResult.delivered) {
      return NextResponse.json(
        {
          ok: true,
          emailDelivered: true,
          deliveryProvider: emailResult.provider,
          recipient: emailResult.recipient,
          referenceId: saved.id,
          submittedAt: saved.submittedAt,
          message: `Your message has been sent directly to ${emailResult.recipient}. Yoftahe will respond shortly.`,
        },
        { status: 201 }
      );
    }

    if (emailResult.configured && !emailResult.delivered) {
      console.error('Contact email delivery failed:', emailResult.provider, emailResult.error);
      return NextResponse.json(
        {
          error: `Your message was saved (Ref: ${saved.id}), but automatic email delivery to ${emailResult.recipient} could not be completed right now. You can send it immediately using your email app below.`,
          referenceId: saved.id,
          recipient: emailResult.recipient,
          mailtoHref,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        emailDelivered: false,
        deliveryProvider: 'none',
        recipient: emailResult.recipient,
        referenceId: saved.id,
        submittedAt: saved.submittedAt,
        mailtoHref,
        message: `Your message was saved (Ref: ${saved.id}). To deliver it straight to ${emailResult.recipient} right now, click the button below to open your email app with everything pre-filled.`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json(
      { error: 'Unable to submit your message right now. Please try again shortly.' },
      { status: 500 }
    );
  }
}
