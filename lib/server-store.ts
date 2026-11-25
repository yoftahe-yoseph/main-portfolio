import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { DEFAULT_CERTIFICATES } from './data/certificates';
import type { CertificateRecord, ContactSubmission } from './types';
import { extensionForMimeType, sanitizeStoredFileName } from './validation';

const DATA_ROOT = path.resolve(process.cwd(), '.data');
const CERTIFICATES_FILE = path.resolve(DATA_ROOT, 'certificates.json');
const CONTACTS_FILE = path.resolve(DATA_ROOT, 'contacts.json');
const UPLOADS_DIR = path.resolve(DATA_ROOT, 'certificate-uploads');

let memoryCertificates: CertificateRecord[] | null = null;
let memoryContacts: ContactSubmission[] = [];
const memoryFiles = new Map<string, { buffer: Buffer; mimeType: string }>();

function assertConfined(targetPath: string, baseDir: string): void {
  const resolvedBase = path.resolve(baseDir);
  const resolvedTarget = path.resolve(targetPath);
  if (!resolvedTarget.startsWith(resolvedBase + path.sep)) {
    throw new Error('Path confinement check failed');
  }
}

async function ensureDataDirs(): Promise<boolean> {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export async function readCertificates(): Promise<CertificateRecord[]> {
  if (memoryCertificates) {
    return memoryCertificates.map((c) => ({ ...c, attachment: c.attachment ? { ...c.attachment } : null }));
  }

  try {
    const raw = await fs.readFile(CERTIFICATES_FILE, 'utf8');
    const parsed = JSON.parse(raw) as CertificateRecord[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      const defaultsById = new Map(DEFAULT_CERTIFICATES.map((d) => [d.id, d]));
      let changed = false;

      const upgraded = parsed.map((record) => {
        const def = defaultsById.get(record.id);
        const shouldUpgradePending = def && record.status === 'pending' && def.status === 'attached';
        const shouldUpgradeToStaticPhoto =
          def &&
          def.attachment?.url?.startsWith('/assets/') &&
          !record.attachment?.url?.startsWith('/assets/') &&
          !record.attachment?.storedFileName;
        const shouldSyncDefaultVerificationUrl =
          def &&
          Boolean(def.verificationUrl) &&
          !record.attachment?.storedFileName &&
          record.verificationUrl !== def.verificationUrl;
        if (shouldUpgradePending || shouldUpgradeToStaticPhoto || shouldSyncDefaultVerificationUrl) {
          changed = true;
          return { ...def, attachment: def.attachment ? { ...def.attachment } : null };
        }
        return record;
      });

      const existingIds = new Set(upgraded.map((c) => c.id));
      const missingDefaults = DEFAULT_CERTIFICATES.filter((def) => !existingIds.has(def.id)).map(
        (def) => ({ ...def, attachment: def.attachment ? { ...def.attachment } : null })
      );

      if (missingDefaults.length > 0 || changed) {
        const merged = [...missingDefaults, ...upgraded];
        memoryCertificates = merged;
        await writeCertificates(merged);
        return merged;
      }
      memoryCertificates = upgraded;
      return upgraded;
    }
  } catch {
    // Seed defaults if file does not exist yet
  }

  const seeded = DEFAULT_CERTIFICATES.map((c) => ({
    ...c,
    attachment: c.attachment ? { ...c.attachment } : null,
  }));
  memoryCertificates = seeded;
  await writeCertificates(seeded);
  return seeded;
}

export async function writeCertificates(records: CertificateRecord[]): Promise<void> {
  memoryCertificates = records.map((c) => ({ ...c, attachment: c.attachment ? { ...c.attachment } : null }));
  const ready = await ensureDataDirs();
  if (!ready) return;

  try {
    assertConfined(CERTIFICATES_FILE, DATA_ROOT);
    await fs.writeFile(CERTIFICATES_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch {
    // Fall back to in-memory state cleanly if filesystem is read-only
  }
}

export async function saveCertificateFile(
  certId: string,
  mimeType: string,
  buffer: Buffer
): Promise<string> {
  const ext = extensionForMimeType(mimeType);
  if (!ext) {
    throw new Error('Unsupported MIME type');
  }

  const safePrefix = sanitizeStoredFileName(certId).slice(0, 40) || 'cert';
  const token = crypto.randomBytes(8).toString('hex');
  const storedFileName = `${safePrefix}-${token}${ext}`;

  memoryFiles.set(storedFileName, { buffer, mimeType });

  const ready = await ensureDataDirs();
  if (ready) {
    const dest = path.resolve(UPLOADS_DIR, storedFileName);
    assertConfined(dest, UPLOADS_DIR);
    try {
      await fs.writeFile(dest, buffer);
    } catch {
      // Kept safely in memoryFiles if disk write fails
    }
  }

  return storedFileName;
}

export async function readCertificateFile(
  requestedName: string
): Promise<{ buffer: Buffer; storedFileName: string } | null> {
  const cleanName = sanitizeStoredFileName(path.basename(requestedName));
  if (!cleanName || cleanName !== requestedName) {
    return null;
  }

  const inMem = memoryFiles.get(cleanName);
  if (inMem) {
    return { buffer: inMem.buffer, storedFileName: cleanName };
  }

  const filePath = path.resolve(UPLOADS_DIR, cleanName);
  assertConfined(filePath, UPLOADS_DIR);

  try {
    const buffer = await fs.readFile(filePath);
    return { buffer, storedFileName: cleanName };
  } catch {
    return null;
  }
}

export async function deleteCertificateFile(storedFileName?: string): Promise<void> {
  if (!storedFileName) return;
  const cleanName = sanitizeStoredFileName(path.basename(storedFileName));
  if (!cleanName || cleanName !== storedFileName) return;

  memoryFiles.delete(cleanName);

  const filePath = path.resolve(UPLOADS_DIR, cleanName);
  try {
    assertConfined(filePath, UPLOADS_DIR);
    await fs.unlink(filePath);
  } catch {
    // File may not exist on disk
  }
}

export async function saveContactSubmission(
  submission: Omit<ContactSubmission, 'id' | 'submittedAt'>
): Promise<ContactSubmission> {
  const entry: ContactSubmission = {
    ...submission,
    id: `msg_${crypto.randomBytes(6).toString('hex')}`,
    submittedAt: new Date().toISOString(),
  };

  let existing = memoryContacts;
  const ready = await ensureDataDirs();

  if (ready) {
    try {
      assertConfined(CONTACTS_FILE, DATA_ROOT);
      const raw = await fs.readFile(CONTACTS_FILE, 'utf8');
      const parsed = JSON.parse(raw) as ContactSubmission[];
      if (Array.isArray(parsed)) {
        existing = parsed;
      }
    } catch {
      // Start fresh list
    }
  }

  const updated = [entry, ...existing].slice(0, 200);
  memoryContacts = updated;

  if (ready) {
    try {
      assertConfined(CONTACTS_FILE, DATA_ROOT);
      await fs.writeFile(CONTACTS_FILE, JSON.stringify(updated, null, 2), 'utf8');
    } catch {
      // Keep in-memory copy
    }
  }

  return entry;
}
