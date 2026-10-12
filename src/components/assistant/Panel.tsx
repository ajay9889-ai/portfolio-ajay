'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Mic,
  Settings,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';
import { AvailabilityBadge } from './AvailabilityBadge';
import { ChatView } from './ChatView';
import { VoiceView } from './VoiceView';
import { SettingsPanel } from './SettingsPanel';

export const Panel: React.FC = () => {
  const {
    widgetState,
    closeWidget,
    minimizeWidget,
    activeView,
    setActiveView,
  } = useAssistantContext();

  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else {
          closeWidget();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, closeWidget]);

  if (widgetState !== 'open') return null;

  return (
    <motion.aside
      role="dialog"
      aria-modal="true"
      aria-label="Ajay's AI Voice and Chat Assistant"
      layoutId="assistant-container"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`fixed z-50 flex flex-col backdrop-blur-2xl bg-white/75 dark:bg-[#0c0c14]/80 text-neutral-900 dark:text-neutral-100 border border-white/60 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden transition-all ${
        isFullscreen
          ? 'inset-3 sm:inset-6 rounded-3xl'
          : 'bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[390px] h-[85dvh] sm:h-[580px] rounded-t-3xl sm:rounded-3xl'
      }`}
    >
      {/* Mobile drag handle hint */}
      <div className="sm:hidden w-12 h-1 bg-neutral-300 dark:bg-white/20 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-white/40 dark:border-white/10 shrink-0 backdrop-blur-md bg-white/40 dark:bg-white/[0.03]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-[var(--color-accent,#FF7A00)] to-[#FFA742] text-white shadow-sm shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs tracking-tight">Ajay&apos;s Assistant</span>
              <AvailabilityBadge />
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Typically replies within 24h
            </p>
          </div>
        </div>

        {/* Mode switcher tabs (Chat | Voice) */}
        <div className="flex items-center gap-1">
          <div className="flex p-0.5 rounded-full backdrop-blur-md bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveView('chat')}
              aria-label="Switch to chat view"
              className={`p-1.5 rounded-full transition-all ${
                activeView === 'chat'
                  ? 'bg-white dark:bg-neutral-800 text-[var(--color-accent,#FF7A00)] shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveView('voice')}
              aria-label="Switch to voice view"
              className={`p-1.5 rounded-full transition-all ${
                activeView === 'voice'
                  ? 'bg-white dark:bg-neutral-800 text-[var(--color-accent,#FF7A00)] shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action icon buttons */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Assistant settings"
            title="Settings"
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? 'Restore standard size' : 'Expand full size'}
            title={isFullscreen ? 'Minimize' : 'Maximize'}
            className="hidden sm:inline-flex p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={minimizeWidget}
            aria-label="Minimize into pill"
            title="Minimize"
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={closeWidget}
            aria-label="Close assistant"
            title="Close"
            className="p-1.5 rounded-full text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeView === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <ChatView />
            </motion.div>
          ) : (
            <motion.div
              key="voice"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <VoiceView />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings slide-in modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute inset-0 z-30"
            >
              <SettingsPanel onClose={() => setShowSettings(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
