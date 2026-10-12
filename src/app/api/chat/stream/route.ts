import { NextRequest } from 'next/server';

const CANDIDATE_STREAM_URLS = [
  process.env.BACKEND_STREAM_URL,
  process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/v1/chat/stream' : null,
  process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/contact$/, '') + '/chat/stream'
    : null,
  'http://localhost:5001/api/v1/chat/stream',
  'https://portfolio-backend-yxfu.onrender.com/api/v1/chat/stream',
].filter(Boolean) as string[];

const UNIQUE_STREAM_URLS = Array.from(new Set(CANDIDATE_STREAM_URLS));

export async function POST(req: NextRequest) {
  let body: any = null;
  try {
    body = await req.json();

    for (const url of UNIQUE_STREAM_URLS) {
      try {
        const backendRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(req.headers.get('x-session-id') ? { 'x-session-id': req.headers.get('x-session-id')! } : {}),
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(10000),
        });

        if (backendRes.ok && backendRes.body) {
          return new Response(backendRes.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
              'X-Accel-Buffering': 'no',
            },
          });
        }
      } catch {
        continue;
      }
    }
  } catch (err) {
    console.warn('[Stream Proxy] Error:', err);
  }

  // Fallback SSE stream if backend is down
  const userMsg = (body?.message || body?.messages?.slice(-1)[0]?.text || '').toLowerCase().trim();
  const isMail =
    userMsg.includes('send message') ||
    userMsg.includes('send mail') ||
    userMsg.includes('email ajay') ||
    userMsg.includes('mail him');

  let fallbackText =
    "Ajay A is a Full-Stack Developer & AI Systems Engineer based in Bengaluru. He won 1st place at HackVerse 2025 with ElderNest, interned as an SDE at BrikUp, and specializes in React, Next.js, Node.js, and AI integrations. Feel free to connect at ajayhasrb123@gmail.com!";
  let actionEvent: object | null = null;

  if (isMail) {
    fallbackText = "What message would you like to send to Ajay? Please tell or type your message.";
    actionEvent = { type: 'action', name: 'request_contact_message', args: {} };
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = fallbackText.split(' ');
      for (let i = 0; i < words.length; i++) {
        const token = words[i] + (i < words.length - 1 ? ' ' : '');
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', value: token })}\n\n`));
        await new Promise((r) => setTimeout(r, 20));
      }
      if (actionEvent) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(actionEvent)}\n\n`));
      }
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'done', reply: fallbackText, source: 'offline' })}\n\n`)
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
