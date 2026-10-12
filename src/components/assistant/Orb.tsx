'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { AssistantMode } from '@/hooks/useAssistant';

interface OrbProps {
  mode: AssistantMode;
  micLevel?: number; // 0 to 1
  onClick?: () => void;
  className?: string;
}

export const Orb: React.FC<OrbProps> = ({ mode, micLevel = 0, onClick, className = '' }) => {
  // Map mode to animation variants
  const getScale = () => {
    switch (mode) {
      case 'listening':
        return 1 + micLevel * 0.25;
      case 'thinking':
        return [1, 1.05, 0.98, 1];
      case 'speaking':
        return [1, 1.08, 1.02, 1.1];
      default:
        return 1;
    }
  };

  const getTransition = () => {
    if (mode === 'thinking') {
      return { repeat: Infinity, duration: 1.8, ease: 'easeInOut' as const };
    }
    if (mode === 'speaking') {
      return { repeat: Infinity, duration: 0.9, ease: 'easeInOut' as const };
    }
    return { type: 'spring' as const, stiffness: 300, damping: 25 };
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`AI Voice Orb, current state: ${mode}. Click to interact.`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`relative flex items-center justify-center cursor-pointer select-none outline-none group ${className}`}
    >
      {/* Outer ambient glow rings */}
      <motion.div
        animate={{
          scale: mode === 'listening' ? 1.4 : mode === 'speaking' ? 1.3 : 1.1,
          opacity: mode === 'idle' ? 0.2 : 0.45,
        }}
        transition={{ duration: 0.5 }}
        className="absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(255,122,0,0.35)_0%,rgba(255,122,0,0)_70%)] blur-xl pointer-events-none"
      />

      {/* Pulsing ring for listening / speaking */}
      {(mode === 'listening' || mode === 'speaking') && (
        <span className="absolute w-40 h-40 rounded-full border border-[var(--color-accent,#FF7A00)] opacity-40 animate-breath-ring pointer-events-none" />
      )}

      {/* Rotating gradient ring for thinking */}
      {mode === 'thinking' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute w-36 h-36 rounded-full border-2 border-dashed border-[var(--color-accent,#FF7A00)] opacity-60 pointer-events-none"
        />
      )}

      {/* Core Orb Body */}
      <motion.div
        animate={{ scale: getScale() }}
        transition={getTransition()}
        className="relative w-32 h-32 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border border-white/20 dark:border-white/10"
        style={{
          background:
            mode === 'error'
              ? 'radial-gradient(circle at 35% 35%, #EF4444 0%, #7F1D1D 90%)'
              : 'radial-gradient(circle at 35% 35%, #FFA742 0%, #FF7A00 55%, #D44E00 100%)',
          boxShadow: '0 0 35px rgba(255,122,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
        }}
      >
        {/* Specular highlight */}
        <div className="absolute top-2 left-4 w-12 h-6 bg-white/30 rounded-full blur-[2px] transform -rotate-12 pointer-events-none" />

        {/* Center state icon / symbol */}
        <div className="text-white drop-shadow-md flex flex-col items-center justify-center">
          {mode === 'listening' && (
            <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}

          {mode === 'thinking' && (
            <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}

          {mode === 'speaking' && (
            <div className="flex items-center gap-1 h-6">
              <span className="w-1 bg-white rounded-full animate-bounce h-4" />
              <span className="w-1 bg-white rounded-full animate-bounce h-6 [animation-delay:0.15s]" />
              <span className="w-1 bg-white rounded-full animate-bounce h-3 [animation-delay:0.3s]" />
              <span className="w-1 bg-white rounded-full animate-bounce h-5 [animation-delay:0.45s]" />
            </div>
          )}

          {mode === 'idle' && (
            <svg className="w-8 h-8 opacity-90 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}

          {mode === 'error' && (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
      </motion.div>
    </div>
  );
};
