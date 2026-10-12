'use client';

import React, { useState } from 'react';
import { Mic, MicOff, MessageSquare, Square, Mail, Send } from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';
import { Orb } from './Orb';
import { Waveform } from './Waveform';
import { LeadForm } from './LeadForm';

export const VoiceView: React.FC = () => {
  const {
    mode,
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    interrupt,
    transcript,
    interimTranscript,
    setActiveView,
    leadDraft,
    updateLeadDraft,
    isSupported,
  } = useAssistantContext();

  const [typedEmail, setTypedEmail] = useState('');

  const handleOrbClick = () => {
    if (isSpeaking) {
      interrupt();
    } else if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedEmail.trim()) {
      updateLeadDraft({ email: typedEmail.trim(), emailRequested: false });
      setTypedEmail('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 text-center select-none">
      {/* Top Status & Tip */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent,#FF7A00)]">
          {mode === 'listening' ? 'Listening to you...' : mode === 'thinking' ? 'Thinking...' : mode === 'speaking' ? 'Speaking...' : 'Tap Orb to Speak'}
        </p>
        <p className="text-[11px] text-neutral-400">
          Ask about projects, work experience, or ask to contact Ajay
        </p>
      </div>

      {/* Center Interactive Orb */}
      <div className="py-4 my-auto flex flex-col items-center justify-center">
        <Orb
          mode={mode}
          onClick={handleOrbClick}
          className="hover:scale-105 transition-transform"
        />

        {/* Real-time speech visualizer */}
        <Waveform
          active={isListening || isSpeaking}
          className="mt-6 w-44"
          barsCount={20}
        />
      </div>

      {/* Voice Lead Capture Glassmorphism Card */}
      {((leadDraft.step && leadDraft.step !== 'idle') || leadDraft.emailRequested) && (
        <div className="w-full max-w-sm mb-3 z-20 text-left">
          <LeadForm initialDraft={leadDraft} />
        </div>
      )}

      {/* Live Captions with frosted glass styling */}
      <div className="min-h-[50px] max-h-[70px] w-full px-4 py-2 overflow-hidden flex flex-col justify-center text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 backdrop-blur-md bg-white/40 dark:bg-white/[0.04] border border-white/40 dark:border-white/10 rounded-2xl shadow-sm">
        {transcript || interimTranscript ? (
          <p className="italic">
            &ldquo;{transcript} <span className="opacity-60">{interimTranscript}</span>&rdquo;
          </p>
        ) : !isSupported ? (
          <p className="text-amber-500 text-[11px]">
            Browser speech input not supported. You can still use full text chat!
          </p>
        ) : (
          <p className="text-neutral-400 dark:text-neutral-500 text-[11px]">
            &ldquo;Tell me about Ajay&apos;s HackVerse winner ElderNest...&rdquo;
          </p>
        )}
      </div>

      {/* Control Actions Row */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-neutral-200 dark:border-white/10 w-full">
        {/* Toggle Listening */}
        <button
          type="button"
          onClick={handleOrbClick}
          aria-label={isListening ? 'Stop listening' : 'Start speaking'}
          className={`p-3 rounded-full text-white transition-all shadow-md active:scale-95 ${
            isListening
              ? 'bg-rose-500 hover:bg-rose-600'
              : 'bg-[var(--color-accent,#FF7A00)] hover:brightness-110'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Barge-in Stop speaking */}
        {isSpeaking && (
          <button
            type="button"
            onClick={interrupt}
            title="Interrupt AI speech"
            aria-label="Stop audio"
            className="p-3 rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-white/20 transition-all shadow-sm active:scale-95"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        )}

        {/* Switch to Chat */}
        <button
          type="button"
          onClick={() => setActiveView('chat')}
          title="Switch to Text Chat"
          aria-label="Switch to Text Chat"
          className="p-3 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/15 transition-all shadow-sm active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
