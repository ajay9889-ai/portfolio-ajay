'use client';

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAssistantContext } from '@/context/AssistantContext';
import { Launcher } from './Launcher';
import { Pill } from './Pill';
import { Panel } from './Panel';

export const AssistantWidget: React.FC = () => {
  const { widgetState, toggleWidget, stopListening, isListening } = useAssistantContext();

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleWidget();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleWidget]);

  // Pause recognition when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isListening) {
        stopListening();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isListening, stopListening]);

  return (
    <>
      <AnimatePresence mode="wait">
        {widgetState === 'collapsed' && <Launcher key="launcher" />}
        {widgetState === 'pill' && <Pill key="pill" />}
        {widgetState === 'open' && <Panel key="panel" />}
      </AnimatePresence>
    </>
  );
};
