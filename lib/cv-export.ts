import { EXPERIENCE, LEADERSHIP_ROLES, PROFILE } from './data/profile';
import { PROJECTS } from './data/projects';
import { DEFAULT_CERTIFICATES } from './data/certificates';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateMarkdownCV(): string {
  const lines: string[] = [
    `# ${PROFILE.name}`,
    `**${PROFILE.title}**`,
    `${PROFILE.location} | ${PROFILE.email} | ${PROFILE.portfolioDomain}`,
    '',
    '## Summary',
    PROFILE.subheadline,
    '',
    '## Education',
    `**${PROFILE.education.degree}** — ${PROFILE.education.institution} (${PROFILE.education.honors})`,
    `Complementary Coursework: ${PROFILE.education.complementaryCoursework.join(', ')}`,
    '',
    '## Experience',
    ...EXPERIENCE.flatMap((exp) => [
      `### ${exp.role} — ${exp.organization} (${exp.period})`,
      `${exp.location} | ${exp.engagement}`,
      exp.summary,
      ...exp.highlights.map((item) => `- ${item}`),
      '',
    ]),
    '## Selected Projects & Systems',
    ...PROJECTS.flatMap((project) => [
      `### ${project.title} (${project.year})${project.liveUrl ? ` — ${project.liveUrl}` : ''}`,
      `${project.subtitle}`,
      project.summary,
      `Tech Stack: ${project.techStack.join(', ')}`,
      '',
    ]),
    '## Leadership & Community Impact',
    ...LEADERSHIP_ROLES.flatMap((role) => [
      `- **${role.role}, ${role.organization}** (${role.scope}): ${role.description}`,
    ]),
    '',
    '## Certifications & Credentials',
    ...DEFAULT_CERTIFICATES.map((cert) => `- ${cert.title} (${cert.category})`),
    '',
    '## Technical Skills',
    ...PROFILE.skillGroups.map((group) => `- **${group.category}**: ${group.items.join(', ')}`),
  ];

  return lines.join('\n');
}

export function generatePrintableHtmlCV(): string {
  const expHtml = EXPERIENCE.map(
    (exp) => `
      <div class="item">
        <div class="item-head">
          <strong>${escapeHtml(exp.role)}</strong>
          <span>${escapeHtml(exp.period)}</span>
        </div>
        <div class="sub">${escapeHtml(exp.organization)} · ${escapeHtml(exp.location)}</div>
        <p>${escapeHtml(exp.summary)}</p>
        <ul>${exp.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
      </div>`
  ).join('');

  const projectsHtml = PROJECTS.map(
    (p) => `
      <div class="item">
        <div class="item-head">
          <strong>${escapeHtml(p.title)}</strong>
          <span>${escapeHtml(p.year)}</span>
        </div>
        <div class="sub">${escapeHtml(p.subtitle)}${p.liveUrl ? ` · ${escapeHtml(p.liveUrl)}` : ''}</div>
        <p>${escapeHtml(p.summary)}</p>
        <div class="meta">Stack: ${escapeHtml(p.techStack.join(' · '))}</div>
      </div>`
  ).join('');

  const leadershipHtml = LEADERSHIP_ROLES.map(
    (l) => `<li><strong>${escapeHtml(l.role)}, ${escapeHtml(l.organization)}</strong> (${escapeHtml(l.scope)}): ${escapeHtml(l.description)}</li>`
  ).join('');

  const certsHtml = DEFAULT_CERTIFICATES.map(
    (c) => `<li><strong>${escapeHtml(c.title)}</strong> — ${escapeHtml(c.category)}</li>`
  ).join('');

  const skillsHtml = PROFILE.skillGroups
    .map(
      (g) => `<li><strong>${escapeHtml(g.category)}:</strong> ${escapeHtml(g.items.join(', '))}</li>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(PROFILE.name)} — Curriculum Vitae</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; max-width: 820px; margin: 36px auto; padding: 0 24px; line-height: 1.55; font-size: 14px; }
    header { border-bottom: 1px solid #cbd5e1; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { margin: 0 0 4px 0; font-size: 28px; letter-spacing: -0.02em; }
    .role { color: #2563eb; font-weight: 600; margin-bottom: 6px; }
    .contact { color: #475569; font-size: 13px; }
    h2 { font-size: 15px; text-transform: none; letter-spacing: -0.01em; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 22px 0 12px 0; color: #0f172a; }
    .item { margin-bottom: 14px; }
    .item-head { display: flex; justify-content: space-between; gap: 16px; }
    .sub { color: #475569; font-size: 13px; margin: 2px 0 6px 0; }
    .meta { color: #64748b; font-size: 12px; margin-top: 4px; }
    p { margin: 4px 0; color: #334155; }
    ul { margin: 6px 0 0 18px; padding: 0; color: #334155; }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(PROFILE.name)}</h1>
    <div class="role">${escapeHtml(PROFILE.title)}</div>
    <div class="contact">${escapeHtml(PROFILE.location)} · ${escapeHtml(PROFILE.email)} · ${escapeHtml(PROFILE.portfolioDomain)}</div>
  </header>

  <section>
    <h2>Profile Summary</h2>
    <p>${escapeHtml(PROFILE.subheadline)}</p>
  </section>

  <section>
    <h2>Education</h2>
    <div class="item">
      <div class="item-head">
        <strong>${escapeHtml(PROFILE.education.degree)} — ${escapeHtml(PROFILE.education.institution)}</strong>
        <span>${escapeHtml(PROFILE.education.honors)}</span>
      </div>
      <div class="sub">Complementary Coursework: ${escapeHtml(PROFILE.education.complementaryCoursework.join(' · '))}</div>
    </div>
  </section>

  <section>
    <h2>Experience</h2>
    ${expHtml}
  </section>

  <section>
    <h2>Featured Projects & Systems</h2>
    ${projectsHtml}
  </section>

  <section>
    <h2>Leadership & Community</h2>
    <ul>${leadershipHtml}</ul>
  </section>

  <section>
    <h2>Certifications & Credentials</h2>
    <ul>${certsHtml}</ul>
  </section>

  <section>
    <h2>Technical Capabilities</h2>
    <ul>${skillsHtml}</ul>
  </section>
</body>
</html>`;
}
