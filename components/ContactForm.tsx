'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, ArrowUpRight } from 'lucide-react';
import type { ContactFormPayload } from '@/lib/types';
import { validateContactForm } from '@/lib/validation';
import { PROFILE } from '@/lib/data/profile';

const INQUIRY_OPTIONS: ContactFormPayload['inquiryType'][] = [
  'Engineering Role',
  'Project Collaboration',
  'Research & QA',
  'Speaking & Community',
];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] =
    useState<ContactFormPayload['inquiryType']>('Engineering Role');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<{
    message: string;
    mailtoHref?: string;
    recipient?: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    referenceId: string;
    message: string;
    emailDelivered: boolean;
    recipient: string;
    mailtoHref?: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    setConfirmation(null);

    const validation = validateContactForm({
      name,
      email,
      inquiryType,
      subject,
      message,
      website,
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          inquiryType,
          subject,
          message,
          website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors && typeof data.fieldErrors === 'object') {
          setFieldErrors(data.fieldErrors);
        }
        setServerError({
          message: data.error || 'Could not send your message. Please verify your inputs.',
          mailtoHref:
            typeof data.mailtoHref === 'string' && data.mailtoHref.startsWith('mailto:')
              ? data.mailtoHref
              : undefined,
          recipient: typeof data.recipient === 'string' ? data.recipient : PROFILE.email,
        });
        return;
      }

      setConfirmation({
        referenceId: data.referenceId || 'received',
        message: data.message || `Your message has been sent to ${PROFILE.email}.`,
        emailDelivered: Boolean(data.emailDelivered),
        recipient: typeof data.recipient === 'string' ? data.recipient : PROFILE.email,
        mailtoHref:
          typeof data.mailtoHref === 'string' && data.mailtoHref.startsWith('mailto:')
            ? data.mailtoHref
            : undefined,
      });
      setName('');
      setEmail('');
      setInquiryType('Engineering Role');
      setSubject('');
      setMessage('');
    } catch {
      setServerError({
        message: 'Network error while submitting form. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight">
        Send a Direct Message
      </h2>
      <p className="mt-1.5 text-sm text-slate-600">
        Available for full-stack software engineering roles, healthcare research &amp; QA collaborations, and technical community initiatives.
      </p>

      {confirmation && (
        <div
          role="status"
          data-testid="contact-confirmation"
          className={`mt-6 p-4 rounded-xl text-sm border ${
            confirmation.emailDelivered
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-blue-50 border-blue-200 text-slate-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {confirmation.emailDelivered ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="space-y-2">
              <div>
                <p className="font-semibold">
                  {confirmation.emailDelivered
                    ? `Delivered to ${confirmation.recipient}`
                    : 'Message saved — send directly via email'}
                </p>
                <p className="mt-1 text-slate-700 leading-relaxed">{confirmation.message}</p>
                <p className="mt-1.5 text-xs font-mono text-slate-600">
                  Reference: {confirmation.referenceId}
                </p>
              </div>
              {!confirmation.emailDelivered && confirmation.mailtoHref && (
                <a
                  href={confirmation.mailtoHref}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Send to {confirmation.recipient} via Email App</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 space-y-2.5"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{serverError.message}</span>
          </div>
          {serverError.mailtoHref && (
            <div className="pl-7">
              <a
                href={serverError.mailtoHref}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white px-3.5 py-2 text-xs font-medium transition-colors"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Email {serverError.recipient || PROFILE.email} Directly</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {/* Hidden honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="contact-name"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Your name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                fieldErrors.name
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'
              }`}
            />
            {fieldErrors.name && (
              <p id="contact-name-error" className="mt-1.5 text-xs text-red-600">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="you@organization.com"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                fieldErrors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'
              }`}
            />
            {fieldErrors.email && (
              <p id="contact-email-error" className="mt-1.5 text-xs text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="contact-inquiry-type"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Inquiry Type
            </label>
            <select
              id="contact-inquiry-type"
              name="inquiryType"
              value={inquiryType}
              onChange={(e) =>
                setInquiryType(e.target.value as ContactFormPayload['inquiryType'])
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            >
              {INQUIRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (fieldErrors.subject) setFieldErrors((prev) => ({ ...prev, subject: '' }));
              }}
              placeholder="Role, project scope, or topic"
              aria-invalid={Boolean(fieldErrors.subject)}
              aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                fieldErrors.subject
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                  : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'
              }`}
            />
            {fieldErrors.subject && (
              <p id="contact-subject-error" className="mt-1.5 text-xs text-red-600">
                {fieldErrors.subject}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
            }}
            placeholder="Share details about the opportunity, project goals, timeline, or how we can collaborate..."
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              fieldErrors.message
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
                : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'
            }`}
          />
          {fieldErrors.message && (
            <p id="contact-message-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Messages are routed directly to{' '}
            <span className="font-medium text-slate-700">{PROFILE.email}</span>.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>{submitting ? 'Sending...' : 'Send Message'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
