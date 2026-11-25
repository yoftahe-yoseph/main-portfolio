import type { CertificateRecord, Project, ProjectCategory } from './types';

export type ProjectFilterOption = 'All' | ProjectCategory;
export type CertificateFilterOption = 'all' | 'pending' | 'attached';

export interface CertificateVaultStats {
  total: number;
  attached: number;
  pending: number;
  completionPercent: number;
}

export function filterProjects(
  projects: Project[],
  category: ProjectFilterOption,
  query: string
): Project[] {
  const normalizedQuery = query.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory = category === 'All' || project.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystack = [
      project.title,
      project.subtitle,
      project.summary,
      project.category,
      project.role,
      ...project.techStack,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function getProjectCategoryCounts(projects: Project[]): Record<ProjectFilterOption, number> {
  const counts: Record<ProjectFilterOption, number> = {
    All: projects.length,
    'Full-Stack': 0,
    'Healthcare & Gov': 0,
    'AI & Tooling': 0,
  };

  for (const project of projects) {
    counts[project.category] = (counts[project.category] || 0) + 1;
  }

  return counts;
}

export function filterCertificates(
  certificates: CertificateRecord[],
  statusFilter: CertificateFilterOption
): CertificateRecord[] {
  if (statusFilter === 'all') return certificates;
  return certificates.filter((cert) => cert.status === statusFilter);
}

export function getCertificateVaultStats(certificates: CertificateRecord[]): CertificateVaultStats {
  const total = certificates.length;
  const attached = certificates.filter((cert) => cert.status === 'attached').length;
  const pending = total - attached;
  const completionPercent = total === 0 ? 0 : Math.round((attached / total) * 100);

  return {
    total,
    attached,
    pending,
    completionPercent,
  };
}
