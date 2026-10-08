'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { PROFILE, PROJECTS } from '@/data/portfolioData';

export function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'assistant' | 'user'; text: string }>>([
    {
      sender: 'assistant',
      text: "Hello! I am Ajay's portfolio assistant. You can ask me about Ajay's technical stack, projects like ElderNest, his BrikUp internship, or availability.",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInput('');

    // Instant grounded answer
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = "Ajay A is a full-stack developer based in Bengaluru, India specializing in React.js, Next.js, REST APIs, and scalable database integrations.";

      if (q.includes('eldernest') || q.includes('hackverse')) {
        reply = "ElderNest won 1st Place at HackVerse 2025! It is an empathetic React web platform for senior citizens featuring high-contrast WCAG-compliant design and real-time one-tap assistance dispatching.";
      } else if (q.includes('wisdomplay') || q.includes('unity') || q.includes('game')) {
        reply = "WisdomPlay is a multilingual educational game created in Unity with dynamic JSON data loading, modular question handling, audio cues, and 2D animation controllers.";
      } else if (q.includes('attendance') || q.includes('rfid') || q.includes('iot')) {
        reply = "The Smart Attendance System connects high-frequency RFID hardware readers to a Python processing bridge and MySQL database, completing entry scans in under 400ms with automated report generation.";
      } else if (q.includes('brikup') || q.includes('intern') || q.includes('experience')) {
        reply = "Ajay interned as a Software Development Engineer at BrikUp in Bengaluru, where he shipped production features in Next.js, built REST authentication flows, and debugged data rendering across core views.";
      } else if (q.includes('education') || q.includes('college') || q.includes('mca')) {
        reply = "Ajay completed his MCA at BMS Institute of Technology and Management (2023–2025) and BCA at Government First Grade College, Sorab (2020–2023).";
      } else if (q.includes('hire') || q.includes('available') || q.includes('contact') || q.includes('email')) {
        reply = `Ajay is actively open for full-stack engineering roles and projects! You can reach him directly at ${PROFILE.email} or use the Contact form on this page.`;
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 400);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-28 z-40 px-3.5 py-2 rounded-full border border-line bg-bg/90 backdrop-blur-xl text-xs font-mono text-muted hover:text-ink shadow-md flex items-center gap-2"
        title="Ask Ajay's Assistant"
      >
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span className="hidden sm:inline">Ask Assistant</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-bg border-l border-line h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent" />
                <span className="font-display font-bold text-ink">Ajay's Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-ink p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-accent text-white rounded-br-none'
                        : 'bg-line/40 text-ink rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-ink/10 text-ink flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-line flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, stack, or experience..."
                className="flex-1 bg-transparent px-3 py-2 text-xs text-ink placeholder-muted/50 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-accent text-white hover:opacity-90 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
