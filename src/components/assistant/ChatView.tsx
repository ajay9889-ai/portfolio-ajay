'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Mic, ArrowDown, Download, Briefcase, FileText } from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';
import type { Message } from '@/hooks/useAssistant';
import { MessageBubble } from './MessageBubble';
import { SuggestionChips } from './SuggestionChips';

export const ChatView: React.FC = () => {
  const {
    messages,
    sendMessage,
    mode,
    startListening,
    stopListening,
    isListening,
    isSupported,
  } = useAssistantContext();

  const [inputText, setInputText] = useState('');
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [jdModeDetected, setJdModeDetected] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current && !showScrollBottom) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showScrollBottom]);

  // Handle scroll detection
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      setShowScrollBottom(false);
    }
  };

  // Recruiter Mode detector (Phase 5.1)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    const isJobDesc =
      val.length > 180 &&
      (val.toLowerCase().includes('requirement') ||
        val.toLowerCase().includes('experience') ||
        val.toLowerCase().includes('responsibilities') ||
        val.toLowerCase().includes('qualifications') ||
        val.toLowerCase().includes('looking for'));

    setJdModeDetected(isJobDesc);
  };

  const handleSend = () => {
    if (!inputText.trim() || mode === 'thinking') return;
    const textToSend = inputText.trim();
    setInputText('');
    setJdModeDetected(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    sendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Export Transcript as .txt (Phase 5.3)
  const handleExportChat = () => {
    const lines = messages.map(
      (m: Message) => `[${m.sender.toUpperCase()}] ${m.text}`
    );
    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ajay-portfolio-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        aria-live="polite"
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 no-scrollbar"
      >
        {messages.map((msg: Message, index: number) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isLast={index === messages.length - 1}
            onRegenerate={
              index === messages.length - 1 && msg.sender === 'assistant'
                ? () => {
                    const lastUserMsg = [...messages].reverse().find((m: Message) => m.sender === 'user');
                    if (lastUserMsg) sendMessage(lastUserMsg.text);
                  }
                : undefined
            }
          />
        ))}

        {/* Thinking Indicator */}
        {mode === 'thinking' && (
          <div className="flex items-center gap-2 my-2 text-xs text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent,#FF7A00)] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent,#FF7A00)] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent,#FF7A00)] animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 text-[11px]">Thinking...</span>
          </div>
        )}
      </div>

      {/* Floating Scroll-to-bottom button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to newest messages"
          className="absolute bottom-24 right-5 p-2 rounded-full bg-neutral-900/90 text-white shadow-lg border border-white/10 hover:bg-neutral-800 transition-all active:scale-95 z-10"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Recruiter JD Notice (Phase 5.1) */}
      {jdModeDetected && (
        <div className="px-4 py-1.5 mx-3 mb-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-600 dark:text-orange-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Job description detected — assessing fit with Ajay&apos;s stack
          </span>
        </div>
      )}

      {/* Footer Area: Suggestion Chips & Input */}
      <div className="p-3 border-t border-white/40 dark:border-white/10 backdrop-blur-xl bg-white/50 dark:bg-black/30 space-y-2">
        {/* Suggestion Chips */}
        <SuggestionChips onSelect={(text) => sendMessage(text)} />

        {/* Input bar */}
        <div className="flex items-end gap-1.5 backdrop-blur-md bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl px-3 py-2 shadow-inner focus-within:ring-1 focus-within:ring-[var(--color-accent,#FF7A00)] transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            maxLength={600}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about projects, stack, hire..."
            className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none resize-none max-h-28 py-0.5 leading-relaxed"
          />

          {/* Quick Voice mic button */}
          {isSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Stop recording' : 'Dictate with voice'}
              aria-label="Voice input"
              className={`p-1.5 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {/* Export Chat */}
          {messages.length > 2 && (
            <button
              type="button"
              onClick={handleExportChat}
              title="Download chat transcript (.txt)"
              aria-label="Export chat"
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() || mode === 'thinking'}
            aria-label="Send message"
            className="p-1.5 rounded-xl bg-[var(--color-accent,#FF7A00)] text-white hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
