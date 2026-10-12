import { NextResponse } from 'next/server';

const CANDIDATE_AVAILABILITY_URLS = [
  process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/v1/availability' : null,
  process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/contact$/, '') + '/availability'
    : null,
  'http://localhost:5001/api/v1/availability',
  'https://portfolio-backend-yxfu.onrender.com/api/v1/availability',
].filter(Boolean) as string[];

const UNIQUE_AVAILABILITY_URLS = Array.from(new Set(CANDIDATE_AVAILABILITY_URLS));

export async function GET() {
  for (const url of UNIQUE_AVAILABILITY_URLS) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      continue;
    }
  }

  // Graceful fallback config
  return NextResponse.json({
    ok: true,
    data: {
      status: 'available',
      note: 'Open to full-time and freelance roles',
      workingHours: 'Mon–Fri, 10am–7pm IST',
      preferredRoles: ['Full-Stack Engineer', 'AI Systems Engineer'],
      updatedAt: new Date().toISOString(),
    },
  });
}
