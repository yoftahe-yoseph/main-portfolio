'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Upload,
  Link2,
  ExternalLink,
  Plus,
  Trash2,
  X,
  FileText,
  AlertCircle,
  ZoomIn,
  Download,
} from 'lucide-react';
import type { CertificateRecord } from '@/lib/types';
import {
  filterCertificates,
  getCertificateVaultStats,
  type CertificateFilterOption,
} from '@/lib/portfolio-filters';
import { formatBytes, validateSafeHttpUrl, validateCertificateFileMeta } from '@/lib/validation';
import CertificatePreviewFrame, {
  hasRealCertificateImage,
  hasVisualCertificatePreview,
} from './CertificatePreviewFrame';

interface CertificatesVaultProps {
  initialCertificates: CertificateRecord[];
}

export default function CertificatesVault({ initialCertificates }: CertificatesVaultProps) {
  const [certificates, setCertificates] = useState<CertificateRecord[]>(initialCertificates);
  const [statusFilter, setStatusFilter] = useState<CertificateFilterOption>('all');
  const [activeCert, setActiveCert] = useState<CertificateRecord | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificateRecord | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Attachment modal state
  const [attachMode, setAttachMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [credentialUrl, setCredentialUrl] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Add new certificate slot state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] =
    useState<CertificateRecord['category']>('Technical Certification');
  const [newIssuer, setNewIssuer] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [addingSlot, setAddingSlot] = useState(false);

  // Sync latest server state on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/certificates', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.certificates)) {
          setCertificates(data.certificates);
        }
      })
      .catch(() => {
        // Retain initial server-rendered state on transient network failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!previewCert) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewCert(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewCert]);

  const stats = useMemo(() => getCertificateVaultStats(certificates), [certificates]);
  const visibleCertificates = useMemo(
    () => filterCertificates(certificates, statusFilter),
    [certificates, statusFilter]
  );

  const openAttachModal = (cert: CertificateRecord) => {
    setActiveCert(cert);
    setAttachMode(cert.attachment?.type === 'url' ? 'url' : 'file');
    setSelectedFile(null);
    setCredentialUrl(cert.attachment?.type === 'url' && cert.attachment.url ? cert.attachment.url : '');
    setIssuer(cert.issuer === 'Pending Issuer Details' ? '' : cert.issuer);
    setIssueDate(cert.issueDate || '');
    setCredentialId(cert.credentialId || '');
    setNotes(cert.notes || '');
    setFormError(null);
  };

  const closeAttachModal = () => {
    setActiveCert(null);
    setSelectedFile(null);
    setFormError(null);
  };

  const handleAttachSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeCert) return;
    setFormError(null);

    if (attachMode === 'file') {
      if (!selectedFile) {
        setFormError('Please select a PDF, PNG, JPG, or WebP certificate file to upload.');
        return;
      }
      const metaCheck = validateCertificateFileMeta(
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );
      if (!metaCheck.valid) {
        setFormError(metaCheck.error || 'Invalid certificate file.');
        return;
      }
    } else {
      const urlCheck = validateSafeHttpUrl(credentialUrl);
      if (!urlCheck.valid) {
        setFormError(urlCheck.error || 'Invalid credential URL.');
        return;
      }
    }

    setSubmitting(true);
    try {
      let response: Response;
      if (attachMode === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (issuer.trim()) formData.append('issuer', issuer.trim());
        formData.append('issueDate', issueDate.trim());
        formData.append('credentialId', credentialId.trim());
        formData.append('notes', notes.trim());

        response = await fetch(`/api/certificates/${encodeURIComponent(activeCert.id)}`, {
          method: 'PATCH',
          body: formData,
        });
      } else {
        response = await fetch(`/api/certificates/${encodeURIComponent(activeCert.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credentialUrl: credentialUrl.trim(),
            issuer: issuer.trim(),
            issueDate: issueDate.trim(),
            credentialId: credentialId.trim(),
            notes: notes.trim(),
          }),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || 'Could not save certificate attachment.');
        return;
      }

      if (Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
      }
      setStatusNotice(`Attached proof for "${activeCert.title}".`);
      closeAttachModal();
    } catch {
      setFormError('Network error while saving attachment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearAttachment = async (cert: CertificateRecord, mode: 'clear' | 'remove') => {
    setStatusNotice(null);
    try {
      const response = await fetch(
        `/api/certificates/${encodeURIComponent(cert.id)}?mode=${mode}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (response.ok && Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
        setStatusNotice(
          mode === 'remove'
            ? `Removed custom slot "${cert.title}".`
            : `Reset "${cert.title}" back to pending upload.`
        );
      }
    } catch {
      setStatusNotice('Unable to update certificate record right now.');
    }
  };

  const handleAddSlotSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAddError(null);

    if (newTitle.trim().length < 3) {
      setAddError('Please enter a certificate or credential title (at least 3 characters).');
      return;
    }

    setAddingSlot(true);
    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          issuer: newIssuer.trim(),
          description: newDescription.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAddError(data.error || 'Could not add certificate slot.');
        return;
      }
      if (Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
      }
      setStatusNotice(`Added "${newTitle.trim()}" to your Certificates Vault.`);
      setNewTitle('');
      setNewIssuer('');
      setNewDescription('');
      setAddModalOpen(false);
    } catch {
      setAddError('Network error while adding certificate slot.');
    } finally {
      setAddingSlot(false);
    }
  };

  return (
    <section aria-labelledby="certificates-vault-heading">
      {/* Vault Summary & Controls Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-blue-600">
              Certificates Vault &amp; Verification Manager
            </p>
            <h2
              id="certificates-vault-heading"
              className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
            >
              Certifications &amp; Institutional Proof
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Every listed certification and university credential includes a structured attachment slot. Upload a PDF or image file directly, paste a verified credential link, or add new slots whenever needed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setAddError(null);
              setAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add Certificate Slot</span>
          </button>
        </div>

        {/* Metrics & Filter Row */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" data-testid="vault-stats">
            <span className="text-slate-900 font-semibold font-mono tabular-nums">
              {stats.attached} of {stats.total} attached
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-600 font-mono tabular-nums">
              {stats.pending} pending upload
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-500 font-mono tabular-nums">
              {stats.completionPercent}% verified
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Filter certificates by attachment status"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit"
          >
            {(
              [
                { id: 'all', label: `All (${stats.total})` },
                { id: 'pending', label: `Pending Upload (${stats.pending})` },
                { id: 'attached', label: `Attached (${stats.attached})` },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {statusNotice && (
          <div
            role="status"
            className="mt-5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-sm text-blue-900"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              <span>{statusNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              aria-label="Dismiss notification"
              className="text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Certificate Cards Grid */}
      {visibleCertificates.length === 0 ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <p className="font-display text-base font-semibold text-slate-900">
            No records in this filter view
          </p>
          <p className="mt-1.5 text-sm text-slate-600">
            {statusFilter === 'attached'
              ? 'No certificates have an uploaded file or verification URL yet. Switch to Pending Upload to attach proof.'
              : 'All certificate slots currently have proof attached.'}
          </p>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            View All Slots
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleCertificates.map((cert) => {
            const isAttached = cert.status === 'attached' && Boolean(cert.attachment);
            const hasRealPhoto = isAttached && hasRealCertificateImage(cert);
            const hasVisualPreview = hasVisualCertificatePreview(cert);
            const attachmentUrl = cert.attachment?.url || '';
            const verifyUrl = cert.verificationUrl || '';
            const externalLinkUrl = verifyUrl || attachmentUrl;
            const isUdacityLink = externalLinkUrl.includes('udacity.com/certificate');
            return (
              <article
                key={cert.id}
                id={cert.id}
                data-testid={`certificate-card-${cert.id}`}
                className="scroll-mt-24 bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between transition-colors hover:border-slate-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      {cert.category}
                      {cert.issueDate ? (
                        <>
                          {' '}
                          <span aria-hidden="true">·</span>{' '}
                          <span className="font-mono tabular-nums">{cert.issueDate}</span>
                        </>
                      ) : null}
                    </p>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
                        isAttached ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isAttached ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Pending Upload</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900 tracking-tight">
                    {cert.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Issuer: <span className="text-slate-700 font-medium">{cert.issuer}</span>
                    {cert.credentialId ? (
                      <>
                        {' '}
                        <span aria-hidden="true">·</span>{' '}
                        <span className="font-mono text-slate-700">{cert.credentialId}</span>
                      </>
                    ) : null}
                  </p>

                  {hasVisualPreview && (
                    <button
                      type="button"
                      onClick={() => setPreviewCert(cert)}
                      aria-label={`Inspect certificate for ${cert.title}`}
                      className="group relative mt-4 block w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    >
                      <CertificatePreviewFrame certificate={cert} size="card" />
                      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 border border-slate-200/90 text-xs font-medium text-slate-800 shadow-xs opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                        <span>{hasRealPhoto ? 'Inspect Photo' : 'Inspect Certificate'}</span>
                      </span>
                    </button>
                  )}

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {cert.description}
                  </p>

                  {/* Attachment Status Line */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {isAttached && cert.attachment ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          {cert.attachment.type === 'file' ? (
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                          ) : (
                            <Link2 className="w-3.5 h-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                          )}
                          <span className="font-medium truncate">
                            {cert.attachment.type === 'file'
                              ? `${cert.attachment.fileName}${
                                  cert.attachment.fileSize
                                    ? ` (${formatBytes(cert.attachment.fileSize)})`
                                    : ''
                                }`
                              : cert.attachment.url}
                          </span>
                        </div>
                        {cert.notes && (
                          <p className="text-xs text-slate-500 leading-relaxed">{cert.notes}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-slate-500">
                        [{cert.slotLabel}]
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {hasVisualPreview && (
                      <button
                        type="button"
                        onClick={() => setPreviewCert(cert)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{hasRealPhoto ? 'Preview Photo' : 'Preview Certificate'}</span>
                      </button>
                    )}

                    {isAttached && externalLinkUrl && (
                      <a
                        href={externalLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                      >
                        <span>
                          {isUdacityLink
                            ? 'Verify on Udacity'
                            : hasRealPhoto
                              ? 'Open Direct Link'
                              : 'View Proof'}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => openAttachModal(cert)}
                      aria-label={`${isAttached ? 'Replace proof' : 'Attach proof'} for ${cert.title}`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        isAttached
                          ? 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                          : 'text-white bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {isAttached
                          ? hasRealPhoto
                            ? 'Update Proof'
                            : 'Upload Photo Scan'
                          : 'Attach File or URL'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAttached && (
                      <button
                        type="button"
                        onClick={() => handleClearAttachment(cert, 'clear')}
                        aria-label={`Clear attachment for ${cert.title}`}
                        className="text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                    {!cert.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleClearAttachment(cert, 'remove')}
                        aria-label={`Delete custom slot ${cert.title}`}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Attach Proof Modal */}
      {activeCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="attach-cert-modal-title"
          onClick={closeAttachModal}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Certificate Attachment Manager</p>
                <h3
                  id="attach-cert-modal-title"
                  className="font-display text-base font-bold text-slate-900 truncate"
                >
                  {activeCert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeAttachModal}
                aria-label="Close attachment dialog"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAttachSubmit} className="p-6 space-y-5">
              {/* Mode switcher */}
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full">
                <button
                  type="button"
                  onClick={() => {
                    setAttachMode('file');
                    setFormError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    attachMode === 'file'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload Certificate File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttachMode('url');
                    setFormError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    attachMode === 'url'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paste Verification URL
                </button>
              </div>

              {attachMode === 'file' ? (
                <div key="attach-file-panel">
                  <label
                    htmlFor="cert-file-input"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Certificate File (PDF, PNG, JPG, or WebP · Max 5 MB)
                  </label>
                  <input
                    id="cert-file-input"
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      setSelectedFile(e.target.files?.[0] ?? null);
                      setFormError(null);
                    }}
                    className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-200 rounded-xl p-2 bg-slate-50/50 cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="mt-1.5 text-xs text-slate-500">
                      Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
                    </p>
                  )}
                </div>
              ) : (
                <div key="attach-url-panel">
                  <label
                    htmlFor="cert-url-input"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Verification URL
                  </label>
                  <input
                    id="cert-url-input"
                    type="url"
                    value={credentialUrl}
                    onChange={(e) => setCredentialUrl(e.target.value)}
                    placeholder="https://credentials.example.org/verify/..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cert-issuer-input"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Issuing Organization
                  </label>
                  <input
                    id="cert-issuer-input"
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g., Udacity / Haramaya Univ."
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cert-date-input"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Issue Date
                  </label>
                  <input
                    id="cert-date-input"
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g., May 2025"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cert-id-input"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Credential ID (optional)
                </label>
                <input
                  id="cert-id-input"
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g., CERT-2025-8841"
                  className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              <div>
                <label
                  htmlFor="cert-notes-input"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Verification Notes (optional)
                </label>
                <textarea
                  id="cert-notes-input"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional coursework focus or verification context..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAttachModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Attachment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Certificate Slot Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-cert-slot-title"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3
                id="add-cert-slot-title"
                className="font-display text-base font-bold text-slate-900"
              >
                Add New Certificate Slot
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                aria-label="Close add certificate slot dialog"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSlotSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="new-cert-title"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Certificate or Credential Title
                </label>
                <input
                  id="new-cert-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Cloud Architecture Specialization"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              <div>
                <label
                  htmlFor="new-cert-category"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Category
                </label>
                <select
                  id="new-cert-category"
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as CertificateRecord['category'])
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                >
                  <option value="Internship Certificate">Internship Certificate</option>
                  <option value="Technical Certification">Technical Certification</option>
                  <option value="Entrepreneurship & Leadership">Entrepreneurship &amp; Leadership</option>
                  <option value="Community Credential">Community Credential</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="new-cert-issuer"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Issuing Organization (optional)
                </label>
                <input
                  id="new-cert-issuer"
                  type="text"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  placeholder="e.g., Google / Coursera / University"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              <div>
                <label
                  htmlFor="new-cert-description"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Brief Summary (optional)
                </label>
                <textarea
                  id="new-cert-description"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Key competencies or recognition details..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                />
              </div>

              {addError && (
                <div
                  role="alert"
                  className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingSlot}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                >
                  {addingSlot ? 'Adding...' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Preview Lightbox Modal */}
      {previewCert && hasVisualCertificatePreview(previewCert) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/55 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-lightbox-title"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  {previewCert.category}
                  {previewCert.issueDate ? (
                    <>
                      {' '}
                      <span aria-hidden="true">·</span>{' '}
                      <span className="font-mono">{previewCert.issueDate}</span>
                    </>
                  ) : null}
                </p>
                <h3
                  id="cert-lightbox-title"
                  className="font-display text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5"
                >
                  {previewCert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                aria-label="Close certificate preview"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6 bg-slate-50/70">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <CertificatePreviewFrame certificate={previewCert} size="modal" />
              </div>

              <div className="mt-4 space-y-1.5 text-sm">
                <p className="text-slate-700 font-medium">{previewCert.issuer}</p>
                {previewCert.notes && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {previewCert.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-mono text-slate-500 truncate max-w-sm">
                {previewCert.attachment?.url || previewCert.credentialId || previewCert.title}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {hasRealCertificateImage(previewCert) && previewCert.attachment?.url ? (
                  <>
                    <a
                      href={previewCert.attachment.url}
                      download={previewCert.attachment.fileName || 'certificate.jpg'}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Download Photo</span>
                    </a>
                    <a
                      href={previewCert.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        previewCert.verificationUrl
                          ? 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                          : 'text-white bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <span>Open Full Photo</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    {previewCert.verificationUrl && (
                      <a
                        href={previewCert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        <span>Verify on Udacity</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const target = previewCert;
                        setPreviewCert(null);
                        openAttachModal(target);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Upload Photo Scan</span>
                    </button>
                    {previewCert.attachment?.url && (
                      <a
                        href={previewCert.attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        <span>Verify Official Credential</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
