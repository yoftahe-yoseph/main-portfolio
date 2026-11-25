import { NextRequest, NextResponse } from 'next/server';
import { readCertificateFile } from '@/lib/server-store';
import { mimeTypeForStoredFile } from '@/lib/validation';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const mimeType = mimeTypeForStoredFile(filename);
    if (!mimeType) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    const fileRecord = await readCertificateFile(filename);
    if (!fileRecord) {
      return NextResponse.json({ error: 'Certificate file not found.' }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(fileRecord.buffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${fileRecord.storedFileName}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to retrieve file.' }, { status: 500 });
  }
}
