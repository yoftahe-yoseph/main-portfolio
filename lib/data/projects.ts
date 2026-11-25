import type { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'leku-primary-hospital-hms',
    slug: 'leku-primary-hospital-hms',
    title: 'Leku Primary Hospital Management System',
    subtitle: 'Role-Based Clinical Operations & Attendance Platform',
    category: 'Healthcare & Gov',
    year: '2025',
    role: 'Lead Full-Stack Engineer',
    featured: true,
    summary:
      'Responsive hospital management web application featuring role-based dashboards, email authentication, clinical workflows, and automated staff attendance with night-shift bonus calculations.',
    challenge:
      'Primary hospitals often rely on fragmented paper registers for patient triage, departmental handoffs, and shift payroll—leading to delayed clinical visibility and manual errors in night-shift compensation.',
    solution:
      'Built a unified, responsive web system with strict email-authenticated role separation for administrators, clinicians, and staff, combining patient workflow tracking with attendance logging and automated night-shift bonus logic.',
    impact:
      'Streamlines daily hospital administration and shift accounting into a single fast browser interface accessible from clinical workstations and tablets.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Firebase Auth', 'Firestore', 'Vercel'],
    deliverables: [
      'Role-based dashboards tailored to administrative and clinical permissions',
      'Email authentication and protected operational routes',
      'Clinical workflow coordination modules for primary care teams',
      'Staff attendance tracking with automated night-shift bonus calculation rules',
    ],
    architecture: [
      {
        layer: 'Access & Identity',
        detail: 'Email-based authentication paired with role-scoped dashboard guards to keep clinical and HR records cleanly isolated.',
      },
      {
        layer: 'Payroll & Shift Engine',
        detail: 'Deterministic attendance and night-shift bonus calculation logic designed for transparent monthly reconciliation.',
      },
      {
        layer: 'Deployment Footprint',
        detail: 'Deployed on Vercel with lean serverless reads/writes optimized for reliable low-bandwidth hospital environments.',
      },
    ],
    liveUrl: 'https://leku-primary-hospital-hms.vercel.app/',
    imageKey: 'hospital_hms',
    imageAlt: 'Leku Primary Hospital HMS executive dashboard showing EMR patient count, ward occupancy, pharmacy alerts, and patient flow analytics',
    statusLabel: 'Live Production',
  },
  {
    id: 'menuvista',
    slug: 'menuvista',
    title: 'MenuVista',
    subtitle: 'QR Code Digital Menu & Printable Poster Platform',
    category: 'Full-Stack',
    year: '2025',
    role: 'Creator & Full-Stack Developer',
    featured: true,
    summary:
      'Next.js and TypeScript QR code digital menu platform for hotels and restaurants featuring instant category filtering, live search, rich item detail modals, and a printable QR poster generator.',
    challenge:
      'Hotels and restaurants lose printing budget every time prices or seasonal dishes change, while generic PDF menus provide a poor mobile reading experience for guests.',
    solution:
      'Engineered an editorial mobile-first web menu experience with instant category filtering, fast keyword search, item detail modals, and a built-in printable QR poster generator ready for tabletop stands.',
    impact:
      'Allows hospitality operators to update menus cleanly and print branded QR table posters directly from the browser with zero third-party design tools.',
    techStack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'QR Generation', 'Vercel'],
    deliverables: [
      'Instant category filters and live menu search',
      'Clean dish detail modals with pricing and dietary context',
      'Printable tabletop QR poster generator for hotels and cafes',
      'Responsive layout engineered for fast guest scanning on mobile devices',
    ],
    architecture: [
      {
        layer: 'Client UX & Filtering',
        detail: 'Typed menu catalog with zero-latency client filtering and accessible modal disclosures.',
      },
      {
        layer: 'Print & QR Pipeline',
        detail: 'Structured print-ready poster generator producing crisp high-contrast QR codes formatted for immediate hospitality printing.',
      },
      {
        layer: 'Hosting & Speed',
        detail: 'Edge-deployed on Vercel for sub-second load times when guests scan QR codes over cellular connections.',
      },
    ],
    liveUrl: 'https://menuvista-omega.vercel.app',
    imageKey: 'menuvista_qr',
    imageAlt: 'MenuVista digital menu interface for Hawassa Lake Hotel displaying category filters, search, dietary filters, and culinary item cards',
    statusLabel: 'Live Production',
  },
  {
    id: 'affin-connect',
    slug: 'affin-connect',
    title: 'Affin Connect',
    subtitle: 'Multi-Vendor Local Marketplace (formerly Hawasa Gebeya)',
    category: 'Full-Stack',
    year: '2025',
    role: 'Full-Stack Architect & Developer',
    featured: true,
    summary:
      'End-to-end marketplace web application featuring login-first Google and email authentication, admin-supervised buyer-seller messaging, virtual seller shops, geolocation-based nearby shop recommendations, an order/payment flow, and an interactive popup assistant.',
    challenge:
      'Local merchants and buyers often transact over unstructured social chats without trusted storefronts, transparent order status, or safe moderation.',
    solution:
      'Designed a structured multi-vendor platform combining login-first authentication, dedicated virtual seller shops, location-aware shop discovery, moderated buyer-seller messaging, complete order and payment tracking, and guided onboarding via an interactive popup assistant.',
    impact:
      'Bridges informal local commerce into a trustworthy, searchable digital marketplace while preserving direct merchant relationships.',
    techStack: ['React', 'Next.js', 'TypeScript', 'Firebase Auth', 'Cloud Firestore', 'Geolocation API', 'Tailwind CSS'],
    deliverables: [
      'Login-first Google and email authentication with role onboarding',
      'Virtual seller shops with inventory and merchant profiles',
      'Geolocation-based nearby shop recommendations',
      'Admin-supervised buyer-seller messaging threads',
      'End-to-end order lifecycle, payment flow, and interactive popup assistant',
    ],
    architecture: [
      {
        layer: 'Identity & Moderation',
        detail: 'Firebase Google/Email auth coupled with Firestore security boundaries supporting admin supervision over buyer-seller conversations.',
      },
      {
        layer: 'Discovery & Commerce',
        detail: 'Browser geolocation distance calculations powering nearby virtual shop discovery alongside structured order state transitions.',
      },
      {
        layer: 'Guided UX',
        detail: 'Contextual popup assistant helping first-time buyers and sellers navigate shop setup and checkout flows.',
      },
    ],
    imageKey: 'affin_marketplace',
    imageAlt: 'Affin Connect mobile marketplace interface for Hawassa showing chat supervision, admin governance console, neighborhood search, and shopping categories',
    statusLabel: 'Featured Case Study',
  },
  {
    id: 'mesob-inter-agency-platform',
    slug: 'mesob-inter-agency-platform',
    title: 'Inter-Agency Data-Sharing Platform',
    subtitle: 'Secure RBAC Exchange Portal — Mesob Center (Addis Ababa)',
    category: 'Healthcare & Gov',
    year: '2025',
    role: 'IT Intern (45-Day Delivery)',
    featured: false,
    summary:
      'Secure role-based inter-agency data exchange platform engineered and shipped during a 45-day IT internship at Mesob Center in Addis Ababa.',
    challenge:
      'Partner agencies needed a controlled way to exchange institutional records without relying on ad-hoc email attachments or exposing sensitive datasets to unauthorized departments.',
    solution:
      'Engineered an access-controlled data-sharing portal enforcing strict role-based access control (RBAC), structured agency scoping, and transparent exchange tracking.',
    impact:
      'Delivered a working, security-first institutional exchange workflow on schedule within a 45-day internship timeline.',
    techStack: ['TypeScript', 'React', 'RBAC Architecture', 'Secure APIs', 'Tailwind CSS'],
    deliverables: [
      'Multi-role authorization matrix separating agency admins, reviewers, and staff',
      'Structured inter-agency dataset request and sharing workflows',
      'Clear operational interface focused on accountability and rapid staff adoption',
    ],
    architecture: [
      {
        layer: 'Authorization Model',
        detail: 'Role-Based Access Control (RBAC) gating dataset visibility, approval actions, and agency-level boundaries.',
      },
      {
        layer: 'Workflow Integrity',
        detail: 'Explicit request, review, and exchange states reducing ambiguity between collaborating institutions.',
      },
    ],
    imageKey: 'mesob_rbac',
    imageAlt: 'Architectural blueprint representation of an inter-agency RBAC data-sharing system',
    statusLabel: 'Internship Delivery',
    certificate: {
      title: '45-Day IT Internship Certificate — Mesob Center',
      issuer: 'Federal Civil Service Commission · MESOB One Stop Shopping Service',
      signatory: 'Signed by Anteneh Mamo, Director General at Mesob Center',
      imageUrl: '/assets/aistudio/photo_2026-06-24_08-11-41_187ff6e2.jpg',
      downloadName: 'Mesob-Center-45-Day-IT-Internship-Certificate.jpg',
      vaultHref: '/credentials#cert-mesob-it-internship',
    },
  },
  {
    id: 'ai-urban-traffic-control',
    slug: 'ai-urban-traffic-control',
    title: 'AI-Powered Urban Traffic Control',
    subtitle: 'Applied Traffic Monitoring & Decision-Support System',
    category: 'AI & Tooling',
    year: '2024',
    role: 'Computer Science Researcher & Developer',
    featured: false,
    summary:
      'Applied traffic monitoring and intelligent decision-support system designed to analyze intersection congestion patterns and recommend adaptive signal timing adjustments.',
    challenge:
      'Static urban traffic light cycles fail to adapt to asymmetric peak-hour lane congestion, increasing idle time and corridor bottlenecks.',
    solution:
      'Built an applied decision-support architecture pairing traffic density indicators with structured priority logic to surface actionable signal phase recommendations for operators.',
    impact:
      'Demonstrates practical application of computer science modeling and real-time visualization to urban infrastructure bottlenecks.',
    techStack: ['Python', 'Applied AI Logic', 'TypeScript', 'Web Visualization', 'Decision Support'],
    deliverables: [
      'Intersection congestion modeling and lane density state evaluation',
      'Adaptive signal timing recommendation logic',
      'Operator decision-support dashboard visualizing corridor flow',
    ],
    architecture: [
      {
        layer: 'Analysis & Scoring',
        detail: 'Evaluates directional queue pressure and priority rules to compute adaptive signal timing windows.',
      },
      {
        layer: 'Operator Interface',
        detail: 'Clear monitoring view translating model recommendations into interpretable traffic management actions.',
      },
    ],
    imageKey: 'traffic_ai',
    imageAlt: 'Architectural schematic of an AI-powered urban traffic control system modeling lane queue density and adaptive signal phase timing',
    statusLabel: 'Applied AI System',
  },
  {
    id: 'convertify-pdf-tooling',
    slug: 'convertify-pdf-tooling',
    title: 'Convertify PDF & Document Tooling',
    subtitle: 'Full-Stack Document Conversion Pipeline & Experimental Utilities',
    category: 'AI & Tooling',
    year: '2025',
    role: 'Full-Stack & Python Backend Developer',
    featured: false,
    summary:
      'Full-stack document processing tool built with React, Vite, TypeScript, Python FastAPI, PyMuPDF, and python-docx, alongside experimental decision-support and productivity web builds.',
    challenge:
      'Users frequently struggle with ad-heavy online converters that degrade formatting, impose steep paywalls, or mishandle complex multi-page PDF layouts.',
    solution:
      'Engineered a clean, responsive React + TypeScript frontend paired with a dedicated Python FastAPI processing backend leveraging PyMuPDF and python-docx for reliable document extraction and conversion.',
    impact:
      'Provides a fast, transparent document conversion architecture that cleanly decouples browser UX from Python document-parsing libraries.',
    techStack: ['React', 'Vite', 'TypeScript', 'Python FastAPI', 'PyMuPDF', 'python-docx', 'Tailwind CSS'],
    deliverables: [
      'Interactive React + Vite upload and conversion workspace',
      'FastAPI endpoints orchestrating PyMuPDF extraction and python-docx generation',
      'Modular frontend/backend contract extensible to additional document utilities',
    ],
    architecture: [
      {
        layer: 'Frontend Client',
        detail: 'Vite + React + TypeScript interface handling file validation, upload progress, and clean download delivery.',
      },
      {
        layer: 'Python Processing API',
        detail: 'FastAPI service utilizing PyMuPDF for layout-aware PDF parsing and python-docx for structured Word document synthesis.',
      },
    ],
    imageKey: 'convertify_pdf',
    imageAlt: 'Structured technical representation of a PDF to DOCX conversion pipeline',
    statusLabel: 'Full-Stack Tooling',
  },
];
