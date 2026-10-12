'use client';

import React from 'react';

interface SuggestionChipsProps {
  chips?: string[];
  onSelect: (text: string) => void;
  className?: string;
}

const DEFAULT_CHIPS = [
  'Tell me about ElderNest 🏆',
  'What is Ajay’s tech stack?',
  'Is Ajay available for hire?',
  'Send Ajay a message ✉️',
];

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  chips = DEFAULT_CHIPS,
  onSelect,
  className = '',
}) => {
  if (!chips || chips.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Suggested questions"
      className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      {chips.map((chip, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(chip.replace(/[^\w\s?]/g, '').trim())}
          className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] select-none shrink-0"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};
