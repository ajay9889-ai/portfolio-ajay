'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X, Mic, Volume2 } from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';
import { Waveform } from './Waveform';

export const Pill: React.FC = () => {
  const { widgetState, openWidget, closeWidget, mode, isListening, isSpeaking } = useAssistantContext();

  if (widgetState !== 'pill') return null;

  return (
    <motion.div
      layoutId="assistant-container"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-2xl bg-neutral-900/80 text-white shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20 select-none"
    >
      {/* State icon or indicator */}
      <div className="flex items-center gap-2">
        {isListening ? (
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-accent,#FF7A00)] font-medium">
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            Listening
          </span>
        ) : isSpeaking ? (
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-accent,#FF7A00)] font-medium">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            Speaking
          </span>
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        )}

        {/* Mini waveform */}
        <Waveform active={isListening || isSpeaking} barsCount={8} className="h-4 !px-0" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 border-l border-white/15 pl-2">
        <button
          type="button"
          onClick={openWidget}
          aria-label="Expand assistant panel"
          title="Expand"
          className="p-1 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={closeWidget}
          aria-label="Close assistant"
          title="Close"
          className="p-1 rounded-full text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
