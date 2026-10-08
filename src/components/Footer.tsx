import React from "react";
import { Terminal, Github, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 bg-surface-300 border-t border-surface-border text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-100 border border-surface-border flex items-center justify-center">
            <Terminal className="w-4 h-4 text-brand-cyan" />
          </div>
          <div>
            <span className="font-bold text-white">Ajay H</span>
            <span className="text-xs text-slate-500 font-mono ml-2">
              Full-Stack & AI Systems
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
          <span>Frontend: Next.js 15</span>
          <span>&bull;</span>
          <span>Backend: Node.js API</span>
          <span>&bull;</span>
          <span>&copy; {year} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://github.com/ajay9889-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="mailto:ajayhasrb123@gmail.com"
            className="hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
