import { PROFILE, EXPERIENCE, LEADERSHIP_ROLES } from './data/profile';
import { PROJECTS } from './data/projects';
import { DEFAULT_CERTIFICATES } from './data/certificates';

export type ChatRole = 'user' | 'model';
export type ChatMode = 'balanced' | 'fast';

export interface ClientChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  modelLabel?: string;
}

export interface GeminiHistoryEntry {
  role: ChatRole;
  parts: Array<{ text: string }>;
}

export const CHAT_MODEL_MAP: Record<ChatMode, string> = {
  balanced: 'gemini-4-hydrogen',
  fast: 'gemini-3.1-flash-lite',
};

export const CHAT_MODEL_LABELS: Record<ChatMode, string> = {
  balanced: 'Gemini 4 Flash',
  fast: 'Gemini 3.1 Flash Lite',
};

export const MAX_CHAT_MESSAGE_LENGTH = 1500;
export const MAX_CHAT_HISTORY_TURNS = 16;

export const PORTFOLIO_STARTER_PROMPTS = [
  "Summarize Yoftahe's full-stack engineering stack and experience",
  'Tell me about Leku Primary Hospital HMS and MenuVista',
  'Which certifications and leadership roles are verified?',
  'How can I collaborate with or hire Yoftahe?',
] as const;

export function resolveChatModel(mode: unknown): { mode: ChatMode; model: string; label: string } {
  if (mode === 'fast') {
    return {
      mode: 'fast',
      model: CHAT_MODEL_MAP.fast,
      label: CHAT_MODEL_LABELS.fast,
    };
  }
  return {
    mode: 'balanced',
    model: CHAT_MODEL_MAP.balanced,
    label: CHAT_MODEL_LABELS.balanced,
  };
}

export function validateChatMessage(
  message: unknown
): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof message !== 'string') {
    return { ok: false, error: 'Message must be a text string.' };
  }
  const trimmed = message.trim();
  if (!trimmed) {
    return { ok: false, error: 'Please enter a message before sending.' };
  }
  if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `Message is too long (maximum ${MAX_CHAT_MESSAGE_LENGTH} characters).`,
    };
  }
  return { ok: true, value: trimmed };
}

export function sanitizeChatHistory(history: unknown): GeminiHistoryEntry[] {
  if (!Array.isArray(history)) {
    return [];
  }

  const normalized: GeminiHistoryEntry[] = [];

  for (const raw of history) {
    if (!raw || typeof raw !== 'object') continue;
    const record = raw as Record<string, unknown>;
    const role = record.role === 'user' || record.role === 'model' ? record.role : null;
    const rawContent = typeof record.content === 'string' ? record.content.trim() : '';

    if (!role || !rawContent) continue;

    const clipped = rawContent.slice(0, MAX_CHAT_MESSAGE_LENGTH);

    // Gemini chat history should begin with a user turn and alternate roles cleanly.
    if (normalized.length === 0 && role !== 'user') {
      continue;
    }

    const previous = normalized[normalized.length - 1];
    if (previous && previous.role === role) {
      previous.parts[0].text = `${previous.parts[0].text}\n\n${clipped}`.slice(
        0,
        MAX_CHAT_MESSAGE_LENGTH * 2
      );
    } else {
      normalized.push({ role, parts: [{ text: clipped }] });
    }
  }

  // Ensure the last turn in history is a model turn (since the new user message is sent next).
  while (normalized.length > 0 && normalized[normalized.length - 1].role === 'user') {
    normalized.pop();
  }

  // Keep only the most recent bounded turns while preserving user-first ordering.
  if (normalized.length > MAX_CHAT_HISTORY_TURNS) {
    const sliced = normalized.slice(normalized.length - MAX_CHAT_HISTORY_TURNS);
    if (sliced.length > 0 && sliced[0].role !== 'user') {
      sliced.shift();
    }
    return sliced;
  }

  return normalized;
}

export function buildPortfolioSystemInstruction(): string {
  const projectLines = PROJECTS.map((project) => {
    const live = project.liveUrl ? ` | Live URL: ${project.liveUrl}` : '';
    return `- ${project.title} (${project.category}, ${project.year}, Role: ${project.role}): ${project.summary} Tech: ${project.techStack.join(', ')}.${live}`;
  }).join('\n');

  const experienceLines = EXPERIENCE.map(
    (exp) =>
      `- ${exp.role} at ${exp.organization} (${exp.location}, ${exp.period}): ${exp.summary} Highlights: ${exp.highlights.join(' ')}`
  ).join('\n');

  const leadershipLines = LEADERSHIP_ROLES.map(
    (role) => `- ${role.role}, ${role.organization} (${role.scope}): ${role.description}`
  ).join('\n');

  const certLines = DEFAULT_CERTIFICATES.map((cert) => {
    const verify = cert.verificationUrl ? ` | Verify: ${cert.verificationUrl}` : '';
    return `- ${cert.title} (${cert.issuer}, ${cert.issueDate})${verify}`;
  }).join('\n');

  const skillsLines = PROFILE.skillGroups
    .map((group) => `- ${group.category}: ${group.items.join(', ')}`)
    .join('\n');

  return [
    `You are the official Portfolio Assistant for ${PROFILE.name}, a ${PROFILE.title}.`,
    'Your role is to help recruiters, engineering leads, researchers, and collaborators explore Yoftahe Yoseph’s projects, technical architecture, work experience, education, certifications, leadership impact, and contact options.',
    '',
    'Strict Guidelines:',
    '- Be concise, factual, warm, and professional. Use clean Markdown (short paragraphs or crisp bullet points) when helpful.',
    '- Stay strictly grounded in the verified portfolio facts below. Never invent employers, dates, URLs, salaries, or unpublished projects.',
    '- If asked about something not covered in the portfolio data, state clearly what is known and invite the visitor to reach out directly via the Contact page (/contact) or email.',
    '- When mentioning live systems or credentials, include their verified URLs when relevant.',
    '',
    '=== PROFILE ===',
    `Name: ${PROFILE.name}`,
    `Title: ${PROFILE.title}`,
    `Location & Availability: ${PROFILE.location}`,
    `Email: ${PROFILE.email}`,
    `Portfolio Domain: ${PROFILE.portfolioDomain}`,
    `Social & Messaging: ${PROFILE.socialLinks.map((s) => `${s.platform} (${s.handle}): ${s.url}`).join(' | ')}`,
    `Education: ${PROFILE.education.degree} (${PROFILE.education.honors}), ${PROFILE.education.institution}. Complementary coursework: ${PROFILE.education.complementaryCoursework.join(', ')}.`,
    `Summary: ${PROFILE.subheadline}`,
    '',
    '=== TECHNICAL SKILLS ===',
    skillsLines,
    '',
    '=== FEATURED PROJECTS & SYSTEMS ===',
    projectLines,
    '',
    '=== WORK EXPERIENCE ===',
    experienceLines,
    '',
    '=== LEADERSHIP & COMMUNITY ===',
    leadershipLines,
    '',
    '=== VERIFIED CERTIFICATIONS & CREDENTIALS ===',
    certLines,
  ].join('\n');
}

export function classifyGeminiError(err: unknown): {
  status: number;
  code: string;
  message: string;
} {
  const numericStatus =
    err && typeof err === 'object' && 'status' in err && typeof (err as { status: unknown }).status === 'number'
      ? (err as { status: number }).status
      : null;

  const rawMessage = err instanceof Error ? err.message : String(err ?? '');
  const lower = rawMessage.toLowerCase();

  if (
    numericStatus === 401 ||
    numericStatus === 403 ||
    lower.includes('api key not valid') ||
    lower.includes('api_key_invalid') ||
    lower.includes('invalid api key') ||
    lower.includes('permission_denied') ||
    lower.includes('permission denied')
  ) {
    return {
      status: 502,
      code: 'API_KEY_INVALID',
      message:
        'The Gemini API key could not be verified. Please check your API key in Settings > Secrets.',
    };
  }

  if (
    numericStatus === 429 ||
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('resource_exhausted') ||
    lower.includes('rate limit')
  ) {
    return {
      status: 429,
      code: 'RESOURCE_EXHAUSTED',
      message:
        'The Gemini API quota or rate limit was reached. Please wait a moment and try again, or select a billing-enabled API key in Settings > Secrets.',
    };
  }

  if (
    numericStatus === 404 ||
    lower.includes('not_found') ||
    lower.includes('is not found') ||
    lower.includes('404')
  ) {
    return {
      status: 503,
      code: 'MODEL_NOT_FOUND',
      message:
        'The selected Gemini model is currently unavailable for this API key. Try switching speed mode or retrying shortly.',
    };
  }

  if (numericStatus === 503 || lower.includes('unavailable') || lower.includes('overloaded')) {
    return {
      status: 503,
      code: 'SERVICE_UNAVAILABLE',
      message: 'Gemini is temporarily overloaded. Please retry in a few seconds.',
    };
  }

  return {
    status: 500,
    code: 'UPSTREAM_ERROR',
    message: 'Unable to reach the portfolio assistant right now. Please try again shortly.',
  };
}
