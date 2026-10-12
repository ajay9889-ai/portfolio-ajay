'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';

export const Launcher: React.FC = () => {
  const { openWidget, widgetState, isListening, isSpeaking } = useAssistantContext();
  const [showProactive, setShowProactive] = useState(false);

  useEffect(() => {
    // Only show proactive bubble once per session after 8 seconds
    try {
      const alreadyShown = sessionStorage.getItem('assistant_proactive_shown');
      if (!alreadyShown && widgetState === 'collapsed') {
        const timer = setTimeout(() => {
          setShowProactive(true);
          sessionStorage.setItem('assistant_proactive_shown', 'true');
        }, 8000);
        return () => clearTimeout(timer);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [widgetState]);

  if (widgetState !== 'collapsed') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end select-none">
      {/* Proactive Greeting Bubble */}
      <AnimatePresence>
        {showProactive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20 }}
            className="absolute right-16 bottom-1 max-w-[260px] bg-white dark:bg-[#15151D] text-neutral-900 dark:text-neutral-100 p-3 rounded-2xl shadow-xl border border-neutral-200 dark:border-white/10 text-xs flex items-start gap-2.5"
          >
            <div className="p-1 rounded-lg bg-[var(--color-accent,#FF7A00)]/10 text-[var(--color-accent,#FF7A00)] shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="font-medium leading-relaxed">
                Need details on Ajay&apos;s projects, tech stack, or availability? Chat or speak anytime!
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowProactive(false);
              }}
              aria-label="Dismiss greeting"
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        type="button"
        layoutId="assistant-container"
        onClick={() => {
          setShowProactive(false);
          openWidget();
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AI Voice and Chat Assistant (Press Ctrl+K)"
        title="Open AI Assistant (Ctrl+K)"
        className="relative group w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent,#FF7A00)]"
        style={{
          background: 'linear-gradient(135deg, #FFA742 0%, #FF7A00 50%, #D44E00 100%)',
          boxShadow: '0 8px 25px -4px rgba(255,122,0,0.45)',
        }}
      >
        {/* Breathing pulse ring */}
        <span className="absolute inset-0 rounded-full border border-[var(--color-accent,#FF7A00)] animate-launcher-pulse pointer-events-none" />

        {/* Dynamic Icon */}
        <div className="relative flex items-center justify-center">
          {isListening ? (
            <span className="w-3 h-3 rounded-full bg-white animate-ping" />
          ) : isSpeaking ? (
            <div className="flex gap-0.5 items-center h-4">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          ) : (
            <Sparkles className="w-6 h-6 transition-transform duration-200 group-hover:rotate-12" />
          )}
        </div>

        {/* Keyboard shortcut badge on hover */}
        <span className="absolute -top-7 px-2 py-0.5 rounded-md text-[10px] font-mono tracking-tight bg-neutral-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none border border-white/10 whitespace-nowrap">
          Ctrl+K
        </span>
      </motion.button>
    </div>
  );
};
