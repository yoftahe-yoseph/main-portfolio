import test from 'node:test';
import assert from 'node:assert/strict';
import { PROJECTS } from './data/projects';
import { DEFAULT_CERTIFICATES } from './data/certificates';
import {
  filterProjects,
  getProjectCategoryCounts,
  filterCertificates,
  getCertificateVaultStats,
} from './portfolio-filters';

test('filterProjects filters by category and search query accurately', () => {
  const healthcareGov = filterProjects(PROJECTS, 'Healthcare & Gov', '');
  assert.equal(healthcareGov.length, 2);
  assert.ok(healthcareGov.some((p) => p.slug === 'leku-primary-hospital-hms'));
  assert.ok(healthcareGov.some((p) => p.slug === 'mesob-inter-agency-platform'));

  const fastApiSearch = filterProjects(PROJECTS, 'All', 'FastAPI');
  assert.equal(fastApiSearch.length, 1);
  assert.equal(fastApiSearch[0].slug, 'convertify-pdf-tooling');

  const combined = filterProjects(PROJECTS, 'Full-Stack', 'QR');
  assert.equal(combined.length, 1);
  assert.equal(combined[0].slug, 'menuvista');
});

test('getProjectCategoryCounts sums to total projects', () => {
  const counts = getProjectCategoryCounts(PROJECTS);
  assert.equal(counts.All, PROJECTS.length);
  assert.equal(
    counts['Full-Stack'] + counts['Healthcare & Gov'] + counts['AI & Tooling'],
    PROJECTS.length
  );
});

test('certificate vault stats and status filters reflect pending vs attached slots', () => {
  const initialStats = getCertificateVaultStats(DEFAULT_CERTIFICATES);
  assert.equal(initialStats.total, 7);
  assert.equal(initialStats.attached, 7);
  assert.equal(initialStats.pending, 0);
  assert.equal(initialStats.completionPercent, 100);

  const withPending = DEFAULT_CERTIFICATES.map((cert, index) =>
    index < 2
      ? {
          ...cert,
          status: 'pending' as const,
          attachment: null,
        }
      : cert
  );

  const updatedStats = getCertificateVaultStats(withPending);
  assert.equal(updatedStats.attached, 5);
  assert.equal(updatedStats.pending, 2);
  assert.equal(updatedStats.completionPercent, 71);

  assert.equal(filterCertificates(withPending, 'attached').length, 5);
  assert.equal(filterCertificates(withPending, 'pending').length, 2);
});
