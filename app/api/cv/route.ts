import { NextRequest, NextResponse } from 'next/server';
import { generateMarkdownCV, generatePrintableHtmlCV } from '@/lib/cv-export';

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get('format') || 'html';

  if (format === 'md') {
    const markdown = generateMarkdownCV();
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Yoftahe-Yoseph-CV.md"',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  const html = generatePrintableHtmlCV();
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Yoftahe-Yoseph-CV.html"',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
