export interface PortfolioHubQuery {
  id: string;
  label: string;
  regionTag: string;
  roleContext: string;
  searchQuery: string;
}

/**
 * Portfolio geographic hubs defined solely by Yoftahe Yoseph's project/work context
 * and search query text. All geographic coordinates, formatted addresses, Place IDs,
 * and Google Maps links are resolved dynamically at runtime via Google Maps Places API (New).
 */
export const PORTFOLIO_HUB_QUERIES: PortfolioHubQuery[] = [
  {
    id: 'mesob-addis',
    label: 'Addis Ababa · Mesob Center',
    regionTag: 'Base & Internship',
    roleContext:
      'Engineered and shipped the secure inter-agency RBAC data-sharing platform during a 45-day IT internship in Addis Ababa; current base for remote global work.',
    searchQuery: 'Addis Ababa, Ethiopia',
  },
  {
    id: 'haramaya-university',
    label: 'Haramaya University',
    regionTag: 'B.Sc. CS & HUCISA',
    roleContext:
      'Graduated with Distinction in Computer Science, led 350+ members as Head of HUCISA, and organized campus technology events and hackathons.',
    searchQuery: 'Haramaya University, Ethiopia',
  },
  {
    id: 'hawassa',
    label: 'Hawassa',
    regionTag: 'MenuVista & Affin Connect',
    roleContext:
      'Hospitality and local commerce hub inspiring MenuVista (QR digital menu platform) and Affin Connect (multi-vendor local marketplace).',
    searchQuery: 'Hawassa, Ethiopia',
  },
  {
    id: 'leku-sidama',
    label: 'Leku · Sidama',
    regionTag: 'Hospital HMS',
    roleContext:
      'Clinical workflow and shift-payroll requirements behind the Leku Primary Hospital Management System web application.',
    searchQuery: 'Leku, Ethiopia',
  },
];

// Broad initial framing over Ethiopia before live Places API (New) results resolve.
export const INITIAL_MAP_VIEW = {
  center: { lat: 8.6, lng: 39.8 },
  zoom: 6,
} as const;

export const MAPS_ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];
export const MAPS_QUOTA_EVENT = 'gmp-quota-exceeded';
export const MAPS_QUOTA_DOCS_URL =
  'https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors';
export const MAPS_END_USER_TERMS_URL =
  'https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio';
export const MAPS_PRIVACY_URL =
  'https://policies.google.com/privacy?utm_campaign=gmp_mcp_codeassist_v1_aistudio';

/**
 * Detects genuine Google Maps Platform quota / rate-limit errors without triggering
 * false positives on normal empty search results.
 */
export function isMapsQuotaError(err: unknown): boolean {
  if (!err) return false;

  if (typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (obj.status === 429 || obj.code === 429) {
      return true;
    }
    if (
      typeof obj.code === 'string' &&
      /RESOURCE_EXHAUSTED|OVER_QUERY_LIMIT|OVER_DAILY_LIMIT/i.test(obj.code)
    ) {
      return true;
    }
  }

  const text = err instanceof Error ? err.message : String(err);
  return /OverQuotaMapError|QuotaExceededError|RESOURCE_EXHAUSTED|OVER_QUERY_LIMIT|OVER_DAILY_LIMIT|\b429\b/i.test(
    text
  );
}
