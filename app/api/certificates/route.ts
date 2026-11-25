import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { readCertificates, writeCertificates } from '@/lib/server-store';
import type { CertificateRecord } from '@/lib/types';

const ALLOWED_CATEGORIES = new Set<CertificateRecord['category']>([
  'Internship Certificate',
  'Technical Certification',
  'Entrepreneurship & Leadership',
  'Community Credential',
]);

export async function GET() {
  const certificates = await readCertificates();
  return NextResponse.json({ certificates });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const issuer = typeof body.issuer === 'string' ? body.issuer.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const category =
      typeof body.category === 'string' && ALLOWED_CATEGORIES.has(body.category as CertificateRecord['category'])
        ? (body.category as CertificateRecord['category'])
        : 'Technical Certification';

    if (title.length < 3 || title.length > 140) {
      return NextResponse.json(
        { error: 'Certificate title must be between 3 and 140 characters.' },
        { status: 422 }
      );
    }

    const certificates = await readCertificates();
    const newRecord: CertificateRecord = {
      id: `cert-${crypto.randomBytes(5).toString('hex')}`,
      title,
      category,
      issuer: issuer || 'Pending Issuer Details',
      issueDate: '',
      credentialId: '',
      description:
        description || 'Custom certificate or credential record added to the portfolio vault.',
      status: 'pending',
      slotLabel: 'Certificate Attachment Slot — Pending Upload',
      notes: '',
      attachment: null,
      isDefault: false,
    };

    const updated = [...certificates, newRecord];
    await writeCertificates(updated);

    return NextResponse.json({ certificate: newRecord, certificates: updated }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Unable to create certificate slot.' },
      { status: 500 }
    );
  }
}
