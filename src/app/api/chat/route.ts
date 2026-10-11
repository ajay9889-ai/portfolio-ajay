import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

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
- Keep responses conversational, crisp, and direct (2-3 sentences typically) so it sounds great when spoken aloud by the voice agent.
- Always provide helpful direct answers and encourage reaching out via the contact form or email (ajayhasrb123@gmail.com).
`.trim();

function getIntelligentPortfolioReply(message: string): string {
  const query = message.toLowerCase();

  if (query.includes('eldernest') || query.includes('hackverse') || query.includes('elder') || query.includes('award') || query.includes('prize') || query.includes('winner')) {
    return "ElderNest won 1st Place at HackVerse 2025! It is an empathetic, accessible web application designed for senior citizens featuring emergency SOS dispatching, high-contrast WCAG-compliant UI, and voice-assisted navigation built with React, Node.js, and Express.";
  }

  if (query.includes('brikup') || query.includes('intern') || query.includes('experience') || query.includes('work') || query.includes('company')) {
    return "Ajay worked as a Software Development Engineer Intern at BrikUp in Bengaluru. He shipped core production features using Next.js and TypeScript, engineered secure REST authentication flows, and resolved complex data hydration and state synchronization across primary views.";
  }

  if (query.includes('wisdomplay') || query.includes('game') || query.includes('unity')) {
    return "WisdomPlay is an educational multilingual game engineered in Unity. It features dynamic JSON-driven quizzes, responsive 2D animation controllers, audio cues, and modular level architectures designed to enhance cognitive engagement.";
  }

  if (query.includes('attendance') || query.includes('iot') || query.includes('rfid')) {
    return "The Smart Attendance System is an IoT automation solution connecting RFID card hardware to a Python bridge and MySQL database, executing rapid contactless attendance scans in under 400ms with automated logging.";
  }

  if (query.includes('tech stack') || query.includes('skill') || query.includes('stack') || query.includes('technology') || query.includes('frontend') || query.includes('backend') || query.includes('framework')) {
    return "Ajay's core tech stack spans frontend (React, Next.js 15/16 App Router, TypeScript, TailwindCSS, Three.js), backend (Node.js, Express, REST APIs, WebSockets), and databases (PostgreSQL, MongoDB, MySQL). He also builds AI-integrated features with modern LLM APIs.";
  }

  if (query.includes('hire') || query.includes('available') || query.includes('freelance') || query.includes('contact') || query.includes('email') || query.includes('job') || query.includes('opportunity')) {
    return "Yes! Ajay is actively available for full-time Software Engineering roles, contracts, and freelance projects. You can reach out directly using the Contact form below or email him at ajayhasrb123@gmail.com.";
  }

  if (query.includes('education') || query.includes('degree') || query.includes('college') || query.includes('mca') || query.includes('bca') || query.includes('bmsit')) {
    return "Ajay holds an MCA from BMS Institute of Technology and Management, Bengaluru (8.5 CGPA, 2023–2025) and a BCA from Government First Grade College, Sorab (8.2 CGPA, 2020–2023).";
  }

  if (query.includes('who are you') || query.includes('ajay') || query.includes('about') || query.includes('introduce')) {
    return "Ajay A is a Bengaluru-based Full-Stack Developer & AI Systems Engineer who builds high-impact web products from frontend interfaces to scalable backend APIs. Feel free to ask about his projects or hire him!";
  }

  return "Hello! Ajay A is a Full-Stack Developer specializing in Next.js, React, Node.js, and AI systems. Feel free to ask about his HackVerse-winning ElderNest project, his BrikUp SDE internship, or get in touch at ajayhasrb123@gmail.com!";
}

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

    let replyText = '';

    // Attempt Gemini API if key is available
    if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        } else {
          const errData = await geminiRes.text();
          console.warn('Gemini API notice (status ' + geminiRes.status + '):', errData);
        }
      } catch (geminiErr) {
        console.warn('Gemini fetch error, using built-in portfolio intelligence:', geminiErr);
      }
    }

    // Fallback to intelligent portfolio rule-engine if Gemini key is revoked, rate-limited, or failed
    if (!replyText) {
      replyText = getIntelligentPortfolioReply(message);
    }

    return NextResponse.json({ reply: replyText });
  } catch (err: unknown) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { reply: "Ajay A is a full-stack developer based in Bengaluru specializing in React, Next.js, and AI systems. Feel free to connect at ajayhasrb123@gmail.com!" },
      { status: 200 }
    );
  }
}
