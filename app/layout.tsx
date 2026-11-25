import type { Metadata } from 'next';
import './globals.css';
import PortfolioShell from '@/components/PortfolioShell';

export const metadata: Metadata = {
  title: 'Yoftahe Yoseph — Full-Stack Engineer',
  description:
    'Portfolio of Yoftahe Yoseph, Computer Science graduate (with distinction), full-stack web engineer, AI & healthcare research contributor, and technology community leader.',
  openGraph: {
    title: 'Yoftahe Yoseph — Full-Stack Engineer',
    description:
      'Portfolio of Yoftahe Yoseph, Computer Science graduate (with distinction), full-stack web engineer, AI & healthcare research contributor, and technology community leader.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yoftahe Yoseph — Full-Stack Engineer',
    description:
      'Portfolio of Yoftahe Yoseph, Computer Science graduate (with distinction), full-stack web engineer, AI & healthcare research contributor, and technology community leader.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <PortfolioShell>{children}</PortfolioShell>
      </body>
    </html>
  );
}
