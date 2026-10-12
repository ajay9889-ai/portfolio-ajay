'use client';

import React, { useState } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import type { Message } from '@/hooks/useAssistant';
import { LeadForm } from './LeadForm';
import { useAssistantContext } from '@/context/AssistantContext';

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRegenerate,
  isLast = false,
}) => {
  const { speak, sendFeedback, leadDraft } = useAssistantContext();
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<'up' | 'down' | null>(message.vote ?? null);

  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = (v: 'up' | 'down') => {
    const nextVote = vote === v ? null : v;
    setVote(nextVote);
    if (nextVote) {
      sendFeedback(message.id, nextVote);
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group flex flex-col gap-1 w-full my-2.5 ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div className="flex items-end gap-2 max-w-[85%]">
        {!isUser && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-1 bg-gradient-to-tr from-[var(--color-accent,#FF7A00)] to-[#FFA742] text-white shadow-sm">
            <Sparkles className="w-3 h-3" />
          </div>
        )}

        <div
          className={`relative px-4 py-2.5 rounded-2xl text-xs leading-relaxed transition-all ${
            isUser
              ? 'bg-gradient-to-r from-[var(--color-accent,#FF7A00)] to-[#FF9028] text-white rounded-br-sm shadow-md shadow-orange-500/20'
              : 'backdrop-blur-xl bg-white/70 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-100 rounded-bl-sm border border-white/50 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4)]'
          }`}
        >
          {/* Main message text */}
          <div className="whitespace-pre-wrap break-words">
            {message.text}
            {message.streaming && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-[var(--color-accent,#FF7A00)] animate-pulse align-middle" />
            )}
          </div>

          {/* If the message triggered the contact form action */}
          {!isUser &&
            (message.actionName === 'send_message_to_ajay' ||
              message.actionName === 'request_contact_message' ||
              message.actionName === 'request_contact_details') && (
              <div className="mt-3">
                <LeadForm initialDraft={leadDraft} />
              </div>
            )}
        </div>
      </div>

      {/* Action buttons on hover for assistant messages */}
      {!isUser && !message.streaming && (
        <div className="flex items-center gap-1 ml-8 text-[11px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy response"
            className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={() => speak(message.text, true)}
            title="Read aloud"
            className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <Volume2 className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => handleVote('up')}
            title="Helpful"
            className={`p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors ${
              vote === 'up' ? 'text-emerald-500 font-semibold' : ''
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => handleVote('down')}
            title="Unhelpful"
            className={`p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors ${
              vote === 'down' ? 'text-rose-500 font-semibold' : ''
            }`}
          >
            <ThumbsDown className="w-3 h-3" />
          </button>

          {isLast && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              title="Regenerate reply"
              className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
