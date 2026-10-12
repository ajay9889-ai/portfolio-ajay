'use client';
/**
 * AssistantContext.tsx
 * Provides the assistant state to the whole app via React Context.
 * All widget components read from `useAssistantContext()` — they never hold
 * their own chat state.
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useAssistant, type UseAssistantReturn } from '@/hooks/useAssistant';

const AssistantContext = createContext<UseAssistantReturn | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const assistant = useAssistant();
  return (
    <AssistantContext.Provider value={assistant}>
      {children}
    </AssistantContext.Provider>
  );
}

/**
 * Consume assistant context from any component.
 * Throws if used outside <AssistantProvider>.
 */
export function useAssistantContext(): UseAssistantReturn {
  const ctx = useContext(AssistantContext);
  if (!ctx) {
    throw new Error('useAssistantContext must be used inside <AssistantProvider>');
  }
  return ctx;
}
