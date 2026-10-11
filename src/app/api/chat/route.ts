import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// THIN PROXY — forwards chat requests to the Express backend API
// All AI logic (Gemini API, system prompt, knowledge base) lives server-side
// in the Express backend at /api/v1/chat.
// ─────────────────────────────────────────────────────────────────────────────

const CANDIDATE_BACKEND_URLS = [
  process.env.BACKEND_CHAT_URL,
  process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/v1/chat' : null,
  process.env.BACKEND_API_URL
    ? process.env.BACKEND_API_URL.replace(/\/contact$/, '') + '/chat'
    : null,
  process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/contact$/, '') + '/chat'
    : null,
  'http://localhost:5001/api/v1/chat',
  'https://portfolio-backend-yxfu.onrender.com/api/v1/chat',
].filter(Boolean) as string[];

// Remove duplicate URLs while preserving priority order
const UNIQUE_URLS = Array.from(new Set(CANDIDATE_BACKEND_URLS));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    for (const url of UNIQUE_URLS) {
      try {
        const backendRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(5000), // 5s timeout per candidate
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          if (data && data.reply) {
            return NextResponse.json(data);
          }
        }
      } catch {
        // Try next candidate URL
        continue;
      }
    }
  } catch (err) {
    console.warn('[Chat Proxy] Request parsing issue:', err);
  }

  // Graceful fallback if backend is momentarily unreachable
  return NextResponse.json({
    reply:
      "Ajay A is a Full-Stack Developer & AI Systems Engineer based in Bengaluru. He won 1st place at HackVerse 2025 with ElderNest, interned as an SDE at BrikUp, and specializes in React, Next.js, Node.js, and AI integrations. Feel free to ask about his projects, tech stack, or reach out at ajayhasrb123@gmail.com!",
  });
}
