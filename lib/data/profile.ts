import type { ExperienceItem, LeadershipRole } from '../types';

export const PROFILE = {
  name: 'Yoftahe Yoseph',
  shortName: 'Yoftahe Yoseph',
  title: 'Full-Stack Software Engineer & Computer Science Graduate',
  kicker: 'Computer Science (Distinction) · Full-Stack Engineering · AI & Healthcare Research',
  location: 'Addis Ababa, Ethiopia · Open to Remote Global Teams',
  portfolioDomain: 'https://yoftu.netlify.app/',
  email: 'yoftaheyoseph5@gmail.com',
  socialLinks: [
    {
      id: 'github',
      platform: 'GitHub',
      handle: '@yoftahe-yoseph',
      url: 'https://github.com/yoftahe-yoseph',
    },
    {
      id: 'telegram',
      platform: 'Telegram',
      handle: '@yoftu',
      url: 'https://t.me/yoftu',
    },
    {
      id: 'whatsapp',
      platform: 'WhatsApp',
      handle: '+251 96 161 3758',
      url: 'https://wa.me/251961613758',
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      handle: '@yoftu_',
      url: 'https://www.instagram.com/yoftu_?avpt=MTJjNGI0b3Q3M2F2dQ==',
    },
  ],
  headline: 'Building resilient full-stack systems and applied AI workflows.',
  subheadline:
    'Computer Science graduate with distinction pairing practical full-stack engineering, role-based security, and lean cloud architectures with healthcare research, QA evaluation, and community leadership.',
  metrics: [
    {
      value: '350+',
      label: 'Community Members Led',
      context: 'HUCISA at Haramaya University',
    },
    {
      value: '6+',
      label: 'Shipped Systems & Tools',
      context: 'Healthcare, Gov RBAC, Commerce & AI',
    },
    {
      value: '45 Days',
      label: 'Inter-Agency Platform',
      context: 'Delivered at Mesob Center, Addis Ababa',
    },
    {
      value: 'Distinction',
      label: 'B.Sc. Computer Science',
      context: 'Paired with Business & Entrepreneurship',
    },
  ],
  education: {
    degree: 'Bachelor of Science in Computer Science',
    honors: 'Graduated with Distinction',
    institution: 'Haramaya University',
    complementaryCoursework: [
      'Business Management',
      'Marketing Principles',
      'Strategic Planning',
      'Business Communication',
      'Entrepreneurship',
    ],
    summary:
      'Combined core computer science foundations—algorithms, software engineering, databases, and distributed web systems—with formal business and entrepreneurship training to engineer products that solve measurable operational problems.',
  },
  philosophy: [
    {
      index: '01',
      title: 'Role-Based Security by Default',
      body: 'From inter-agency government portals to hospital workflows, access boundaries are designed first—enforcing clear authentication states, least-privilege dashboards, and auditable operations.',
    },
    {
      index: '02',
      title: 'Lean, Practical Cloud Architectures',
      body: 'Engineering production software that runs reliably on disciplined, free-tier and serverless footprints across Next.js, Firebase, FastAPI, Vercel, and Netlify without unnecessary operational bloat.',
    },
    {
      index: '03',
      title: 'Clarity Over Visual Noise',
      body: 'Hospital clinicians, restaurant staff, and marketplace buyers need fast, predictable interfaces. Every workflow is built for responsive usability across desktop and mobile constraints.',
    },
    {
      index: '04',
      title: 'Product & Business Alignment',
      body: 'Coursework in strategic planning, marketing, and entrepreneurship shapes how features are prioritized—focusing on adoption, maintainability, and concrete operational outcomes.',
    },
  ],
  skillGroups: [
    {
      category: 'Frontend & Interface Engineering',
      items: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Responsive Design Systems'],
    },
    {
      category: 'Backend, APIs & Document Pipelines',
      items: ['Python FastAPI', 'REST API Design', 'Next.js Route Handlers', 'PyMuPDF', 'python-docx', 'Role-Based Access Control (RBAC)'],
    },
    {
      category: 'Cloud, Data & Deployment',
      items: ['Firebase Authentication', 'Cloud Firestore', 'Firebase Hosting', 'Vercel', 'Netlify', 'Lean / Free-Tier Architecture'],
    },
    {
      category: 'AI Evaluation, Research & QA',
      items: ['Healthcare Industry Research', 'Quality Assurance Testing', 'AI Model Evaluation', 'Structured AI Data Annotation', 'Weekly Technical Reporting'],
    },
  ],
} as const;

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'us-healthcare-qa',
    role: 'Healthcare Research, QA Testing & AI Data Annotation Specialist',
    organization: 'US-Based Remote Team',
    location: 'Remote',
    period: 'Current',
    engagement: 'Research & Engineering QA',
    summary:
      'Supporting a US-based team across healthcare industry research, systematic software quality assurance, AI model evaluation, and structured weekly analytical reporting—building upon prior AI data labeling work.',
    highlights: [
      'Conduct structured healthcare domain research to inform product workflows and compliance-aware evaluation criteria.',
      'Execute QA testing cycles across web features, logging reproducible edge cases, regression checks, and UX defects.',
      'Evaluate AI outputs and contribute high-precision data annotation sets aligned with domain rubrics.',
      'Deliver clear, structured weekly progress and quality reports for cross-functional US stakeholders.',
    ],
    technologies: ['Healthcare Research', 'QA Testing', 'AI Model Evaluation', 'Data Annotation', 'Weekly Reporting'],
  },
  {
    id: 'mesob-center-intern',
    role: 'IT Intern — Full-Stack Systems',
    organization: 'Mesob Center',
    location: 'Addis Ababa, Ethiopia',
    period: '45-Day Intensive Internship',
    engagement: 'On-Site · Public-Sector Systems',
    summary:
      'Designed, built, and shipped a secure inter-agency data-sharing platform featuring granular role-based access control (RBAC) within a focused 45-day engineering sprint.',
    highlights: [
      'Architected multi-agency data exchange workflows allowing authorized staff to request, share, and track institutional records securely.',
      'Implemented role-based access control separating agency administrators, reviewers, and contributors.',
      'Focused on clear auditability, clean operational dashboards, and rapid deployment within institutional constraints.',
    ],
    technologies: ['RBAC', 'Full-Stack Web', 'Authentication', 'Secure Data Exchange', 'TypeScript'],
    certificate: {
      title: 'Certificate of Participation — 45-Day IT Internship',
      issuer: 'Mesob Center · Federal Civil Service Commission (Signed by Anteneh Mamo, Director General)',
      imageUrl: '/assets/aistudio/photo_2026-06-24_08-11-41_187ff6e2.jpg',
      downloadName: 'Mesob-Center-45-Day-IT-Internship-Certificate.jpg',
      vaultAnchor: '#cert-mesob-it-internship',
    },
  },
  {
    id: 'independent-fullstack',
    role: 'Full-Stack & Applied Systems Builder',
    organization: 'Independent Engineering Practice',
    location: 'Addis Ababa · Global',
    period: 'Ongoing',
    engagement: 'End-to-End Product Delivery',
    summary:
      'Shipping practical production web applications and AI-assisted tooling spanning hospital operations, digital hospitality menus, local commerce marketplaces, and Python document conversion pipelines.',
    highlights: [
      'Delivered live web products deployed on Vercel, Netlify, and Firebase Hosting with responsive desktop/mobile UX.',
      'Engineered lean serverless and free-tier architectures balancing cost efficiency with strong authentication and data rules.',
      'Built hybrid TypeScript + Python FastAPI tooling for high-accuracy PDF and DOCX document processing.',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python FastAPI', 'Firebase'],
  },
];

export const LEADERSHIP_ROLES: LeadershipRole[] = [
  {
    id: 'hucisa-head',
    role: 'Former Head of Association',
    organization: 'Haramaya University Computer Science Students Association (HUCISA)',
    scope: '350+ Student Members',
    period: 'University Tenure',
    description:
      'Led executive strategy, technical mentorship programs, and student engineering initiatives for a 350+ member computer science community at Haramaya University.',
    outcomes: [
      'Coordinated peer-led workshops covering web development, version control, and software project delivery.',
      'Managed executive committees, member communications, and partnerships with faculty and tech speakers.',
      'Expanded technical event participation and hands-on collaborative coding across cohorts.',
    ],
  },
  {
    id: 'haramaya-tech-events',
    role: 'Organizer of Technology Events',
    organization: 'Haramaya University',
    scope: 'Campus-Wide Technical Programs',
    period: 'University Tenure',
    description:
      'Planned and executed student technology events, workshops, and showcases connecting computer science students with practical engineering disciplines and entrepreneurship.',
    outcomes: [
      'Structured event agendas, speaker logistics, and technical demo sessions for student builders.',
      'Fostered cross-disciplinary collaboration between software developers and business-minded students.',
    ],
  },
  {
    id: 'unesco-sdg4',
    role: 'Youth Network Contributor',
    organization: 'UNESCO SDG 4 Youth Network',
    scope: 'Global Quality Education Advocacy',
    period: 'Active Contribution',
    description:
      'Contributing to the UNESCO SDG 4 Youth Network in support of inclusive, equitable quality education and digital literacy initiatives.',
    outcomes: [
      'Engaged in youth-led dialogue and knowledge sharing aligned with UN Sustainable Development Goal 4.',
      'Advocated for practical technical education pathways and accessible digital tools for students.',
    ],
  },
];
