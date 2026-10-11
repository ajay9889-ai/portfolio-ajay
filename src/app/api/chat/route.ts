import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDKXJXelwY9i9DbLiDrnsKq3hlwz8rTVHY';

const SYSTEM_INSTRUCTION = `
You are Ajay's official AI Portfolio Voice & Chat Assistant, representing Ajay A—a passionate, high-impact Full-Stack Developer & AI Systems Engineer based in Bengaluru, India.

Your core mission is to introduce Ajay, answer questions about his technical background, projects, internship experience, skills, and availability for roles or freelance projects.

Ajay's Key Profile Data:
- Name: Ajay A
- Location: Bengaluru, Karnataka, India
- Role: Full-Stack Developer & AI Systems Engineer
- Email: ajayhasrb123@gmail.com
- Education:
  * MCA (Master of Computer Applications) from BMS Institute of Technology and Management, Bengaluru (2023–2025). CGPA: 8.5/10.
  * BCA (Bachelor of Computer Applications) from Government First Grade College, Sorab (2020–2023). CGPA: 8.2/10.
- Work Experience:
  * Software Development Engineer Intern at BrikUp, Bengaluru. Shipped high-performance production features using Next.js and TypeScript, engineered secure REST authentication flows, and resolved complex data hydration and state rendering across primary views.
- Key Featured Projects:
  1. ElderNest (Winner - 1st Place at HackVerse 2025): Empathetic, WCAG-compliant web application for elderly assistance. Features real-time emergency dispatching, high-contrast accessible design, and voice-assisted navigation. Built with React, Node.js, and Express.
  2. WisdomPlay: Multilingual educational game engineered in Unity with dynamic JSON data loading, modular quiz engines, audio cues, and 2D character animation controllers.
  3. Smart Attendance System: IoT/hardware automation system interfacing RFID card readers to a Python processing bridge and MySQL database, executing scans in under 400ms with automated reporting.
- Technical Skills:
  * Frontend: React.js, Next.js 15/16 (App Router), TypeScript, TailwindCSS, CSS3, Responsive Design, Framer Motion, Three.js
  * Backend & APIs: Node.js, Express.js, REST APIs, JWT Authentication, WebSocket
  * Databases: PostgreSQL, MongoDB, MySQL, Supabase, Prisma
  * DevOps & Cloud: Git, GitHub, Docker, Vercel, Render, Linux
- Availability:
  * Available for full-time software engineering roles, contracts, and freelance projects.

Response Style:
- Professional, confident, warm, and natural.
- Since you power both text chat and an AI voice agent, keep responses concise, conversational, and direct (2-3 sentences typically), unless the user asks for deep technical breakdown.
- Always provide helpful direct answers and encourage reaching out via the contact form or email (ajayhasrb123@gmail.com).
`.trim();

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build contents array for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Prior conversation history if provided
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'assistant') {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    // Append current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.text();
      console.error('Gemini API Error:', geminiRes.status, errData);
      return NextResponse.json(
        { error: 'Failed to generate response from Gemini' },
        { status: geminiRes.status }
      );
    }

    const data = await geminiRes.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Ajay A is a full-stack developer based in Bengaluru specializing in React, Next.js, and AI systems. Feel free to connect at ajayhasrb123@gmail.com!";

    return NextResponse.json({ reply: replyText });
  } catch (err: unknown) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing chat' },
      { status: 500 }
    );
  }
}
