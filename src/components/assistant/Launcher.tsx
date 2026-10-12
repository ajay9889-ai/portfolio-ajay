'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic } from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';
import { AIAssistantLogo } from './AIAssistantLogo';

const PROMPTS = [
  '🎙️ Voice & Chat Ready',
  '⚡ Ask about ElderNest & BrikUp',
  '✨ Explore Ajay’s tech stack',
  '📬 Leave a direct message',
  '💼 Check availability for hire',
];

export const Launcher: React.FC = () => {
  const { openWidget, widgetState, isListening, isSpeaking } = useAssistantContext();
  const [showTeaser, setShowTeaser] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);

  // Show magnetic teaser pill after 1.8 seconds if not dismissed previously
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('assistant_teaser_dismissed');
      if (!dismissed && widgetState === 'collapsed') {
        const timer = setTimeout(() => setShowTeaser(true), 1800);
        return () => clearTimeout(timer);
      }
    } catch {
      setShowTeaser(true);
    }
  }, [widgetState]);

  // Cycle through engaging prompts every 3.8 seconds
  useEffect(() => {
    if (!showTeaser) return;
    const interval = setInterval(() => {
      setPromptIdx((prev) => (prev + 1) % PROMPTS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [showTeaser]);

  if (widgetState !== 'collapsed') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end gap-3 select-none pointer-events-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. ATTENTION-GRABBING MAGNETIC TEASER PILL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTeaser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.88, x: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            onClick={() => {
              setShowTeaser(false);
              openWidget();
            }}
            className="hidden sm:flex items-center gap-2.5 pl-3.5 pr-2 py-2 rounded-full cursor-pointer backdrop-blur-2xl bg-[#0F1017]/90 hover:bg-[#151624]/95 text-white border border-white/15 hover:border-[var(--color-accent,#FF7A00)]/60 shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_20px_rgba(255,122,0,0.15)] transition-all duration-300 group/pill"
          >
            {/* Glowing mini avatar icon */}
            <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FFA742] flex items-center justify-center shadow-[0_0_12px_rgba(255,122,0,0.5)] shrink-0">
              <AIAssistantLogo className="w-4 h-4 text-white" compact />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0F1017]" />
            </div>

            {/* Prompt text */}
            <div className="flex flex-col text-left pr-1">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[11px] font-semibold tracking-wide text-white group-hover/pill:text-[var(--color-accent,#FF7A00)] transition-colors">
                  Ask Ajay’s AI
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <motion.span
                key={promptIdx}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.25 }}
                className="text-[10px] text-neutral-400 font-mono tracking-tight mt-0.5"
              >
                {PROMPTS[promptIdx]}
              </motion.span>
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
                try {
                  sessionStorage.setItem('assistant_teaser_dismissed', 'true');
                } catch {
                  /* ignore */
                }
              }}
              aria-label="Dismiss message"
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING & ANIMATED AI LAUNCHER BUTTON
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative flex items-center justify-center"
      >
        {/* Ambient Warm Nebula Glow behind button */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF7A00] via-[#FF5500] to-[#FF007A] opacity-70 blur-2xl animate-pulse pointer-events-none scale-125" />

        {/* Dual Staggered Sonar Radar Rings (Draws peripheral vision) */}
        <span className="absolute inset-0 rounded-full border-2 border-[#FF7A00] animate-sonar-1 pointer-events-none" />
        <span className="absolute inset-0 rounded-full border-2 border-[#FFA742] animate-sonar-2 pointer-events-none" />

        {/* Rotating Prismatic Conic Neon Halo */}
        <div className="absolute -inset-[2.5px] rounded-full bg-[conic-gradient(from_0deg,#FF7A00,#FFD166,#FF3D00,#FF007A,#00F0FF,#FF7A00)] animate-spin-conic opacity-90 blur-[1px] pointer-events-none" />

        {/* Main 3D Glossy Button Body */}
        <motion.button
          type="button"
          layoutId="assistant-container"
          onClick={() => {
            setShowTeaser(false);
            openWidget();
          }}
          whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
          whileTap={{ scale: 0.92 }}
          aria-label="Open AI Voice and Chat Assistant (Press Ctrl+K)"
          title="Open AI Assistant (Ctrl+K)"
          className="relative group w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_12px_36px_-4px_rgba(255,122,0,0.65),0_4px_16px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent,#FF7A00)] overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #FFB347 0%, #FF7A00 45%, #D44000 100%)',
          }}
        >
          {/* Inner 3D Spherical Radial Highlight */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 35% 26%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, transparent 68%)',
            }}
          />

          {/* Specular Shimmer Sheen Sweep (Light gleam across button face) */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none" />

          {/* Dynamic AI Logo */}
          <div className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <AIAssistantLogo
              className="w-8 h-8 text-white filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              isListening={isListening}
              isSpeaking={isSpeaking}
            />
          </div>

          {/* Live Online Emerald Beacon Badge (Top-Right) */}
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white/90 shadow-sm" />
            </span>
          </div>

          {/* Micro Voice/Chat Cue Indicator (Bottom-Right) */}
          <div className="absolute bottom-1 right-2 z-20 opacity-80 group-hover:opacity-100 transition-opacity">
            <Mic className="w-2.5 h-2.5 text-white/90 drop-shadow" />
          </div>

          {/* Keyboard shortcut tooltip on hover */}
          <span className="absolute -top-8 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-tight bg-neutral-950/95 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/15 whitespace-nowrap shadow-xl">
            Press Ctrl+K
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};
