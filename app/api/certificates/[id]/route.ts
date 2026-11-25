import { NextRequest, NextResponse } from 'next/server';
import {
  deleteCertificateFile,
  readCertificates,
  saveCertificateFile,
  writeCertificates,
} from '@/lib/server-store';
import {
  validateCertificateFileMeta,
  validateSafeHttpUrl,
} from '@/lib/validation';
import type { CertificateRecord } from '@/lib/types';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const certificates = await readCertificates();
    const index = certificates.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Certificate record not found.' }, { status: 404 });
    }

    const current = certificates[index];
    const contentType = req.headers.get('content-type') || '';

    let issuer = current.issuer;
    let issueDate = current.issueDate;
    let credentialId = current.credentialId;
    let notes = current.notes;
    let attachment = current.attachment;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      const rawIssuer = formData.get('issuer');
      const rawIssueDate = formData.get('issueDate');
      const rawCredentialId = formData.get('credentialId');
      const rawNotes = formData.get('notes');
      const rawUrl = formData.get('credentialUrl');

      if (typeof rawIssuer === 'string' && rawIssuer.trim()) {
        issuer = rawIssuer.trim().slice(0, 120);
      }
      if (typeof rawIssueDate === 'string') {
        issueDate = rawIssueDate.trim().slice(0, 40);
      }
      if (typeof rawCredentialId === 'string') {
        credentialId = rawCredentialId.trim().slice(0, 80);
      }
      if (typeof rawNotes === 'string') {
        notes = rawNotes.trim().slice(0, 500);
      }

      if (file instanceof File && file.size > 0) {
        const fileCheck = validateCertificateFileMeta(file.name, file.type, file.size);
        if (!fileCheck.valid) {
          return NextResponse.json({ error: fileCheck.error }, { status: 422 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const storedFileName = await saveCertificateFile(current.id, file.type, buffer);

        if (current.attachment?.storedFileName) {
          await deleteCertificateFile(current.attachment.storedFileName);
        }

        attachment = {
          type: 'file',
          fileName: file.name.slice(0, 140),
          storedFileName,
          mimeType: file.type,
          fileSize: file.size,
          url: `/api/certificates/files/${encodeURIComponent(storedFileName)}`,
          uploadedAt: new Date().toISOString(),
        };
      } else if (typeof rawUrl === 'string' && rawUrl.trim()) {
        const urlCheck = validateSafeHttpUrl(rawUrl);
        if (!urlCheck.valid || !urlCheck.normalized) {
          return NextResponse.json({ error: urlCheck.error }, { status: 422 });
        }

        if (current.attachment?.storedFileName) {
          await deleteCertificateFile(current.attachment.storedFileName);
        }

        attachment = {
          type: 'url',
          url: urlCheck.normalized,
          uploadedAt: new Date().toISOString(),
        };
      } else {
        return NextResponse.json(
          { error: 'Please attach a certificate file (PDF/image) or enter a valid verification URL.' },
          { status: 422 }
        );
      }
    } else {
      const body = await req.json().catch(() => null);
      if (!body || typeof body !== 'object') {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
      }

      if (typeof body.issuer === 'string' && body.issuer.trim()) {
        issuer = body.issuer.trim().slice(0, 120);
      }
      if (typeof body.issueDate === 'string') {
        issueDate = body.issueDate.trim().slice(0, 40);
      }
      if (typeof body.credentialId === 'string') {
        credentialId = body.credentialId.trim().slice(0, 80);
      }
      if (typeof body.notes === 'string') {
        notes = body.notes.trim().slice(0, 500);
      }

      if (typeof body.credentialUrl === 'string' && body.credentialUrl.trim()) {
        const urlCheck = validateSafeHttpUrl(body.credentialUrl);
        if (!urlCheck.valid || !urlCheck.normalized) {
          return NextResponse.json({ error: urlCheck.error }, { status: 422 });
        }

        if (current.attachment?.storedFileName) {
          await deleteCertificateFile(current.attachment.storedFileName);
        }

        attachment = {
          type: 'url',
          url: urlCheck.normalized,
          uploadedAt: new Date().toISOString(),
        };
      } else if (!attachment) {
        return NextResponse.json(
          { error: 'Please provide a valid verification URL or upload a certificate file.' },
          { status: 422 }
        );
      }
    }

    const updatedRecord: CertificateRecord = {
      ...current,
      issuer,
      issueDate,
      credentialId,
      notes,
      attachment,
      status: attachment ? 'attached' : 'pending',
    };

    const updatedList = [...certificates];
    updatedList[index] = updatedRecord;
    await writeCertificates(updatedList);

    return NextResponse.json({ certificate: updatedRecord, certificates: updatedList });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update certificate attachment right now.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const mode = req.nextUrl.searchParams.get('mode') || 'clear';
    const certificates = await readCertificates();
    const index = certificates.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Certificate record not found.' }, { status: 404 });
    }

    const current = certificates[index];
    if (current.attachment?.storedFileName) {
      await deleteCertificateFile(current.attachment.storedFileName);
    }

    let updatedList: CertificateRecord[];
    if (mode === 'remove' && !current.isDefault) {
      updatedList = certificates.filter((c) => c.id !== id);
    } else {
      updatedList = [...certificates];
      updatedList[index] = {
        ...current,
        status: 'pending',
        attachment: null,
        issueDate: '',
        credentialId: '',
        notes: '',
        issuer:
          current.id === 'cred-haramaya-tech-organizer'
            ? 'Haramaya University'
            : current.id === 'cert-mesob-it-internship'
              ? 'Mesob Center · Federal Civil Service Commission (Addis Ababa)'
              : 'Pending Issuer Details',
      };
    }

    await writeCertificates(updatedList);
    return NextResponse.json({ certificates: updatedList });
  } catch {
    return NextResponse.json(
      { error: 'Unable to clear certificate attachment.' },
      { status: 500 }
    );
  }
}
