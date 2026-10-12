'use client';

import React, { useState, useEffect } from 'react';

interface ProjectReactionsProps {
  slug: string;
  compact?: boolean;
}

export function ProjectReactions({ slug, compact = false }: ProjectReactionsProps) {
  const defaultReactions: Record<string, number> = {
    '🔥': 14,
    '🚀': 21,
    '💡': 11,
    '❤️': 18,
  };

  const [counts, setCounts] = useState<Record<string, number>>(defaultReactions);
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);

  useEffect(() => {
    // Check saved user reaction
    const saved = localStorage.getItem(`reacted-${slug}`);
    if (saved) setUserReacted(saved);

    // Fetch live reaction counts
    fetch(`/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.reactions && typeof data.reactions === 'object') {
          // Guard: verify that all values in reactions are numbers
          const isValidFlat = Object.values(data.reactions).every((v) => typeof v === 'number');
          if (isValidFlat) {
            setCounts(data.reactions as Record<string, number>);
          }
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleReact = async (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setAnimatingEmoji(emoji);
    setTimeout(() => setAnimatingEmoji(null), 400);

    // Optimistic UI update
    setCounts((prev) => ({
      ...prev,
      [emoji]: (typeof prev[emoji] === 'number' ? prev[emoji] : 0) + (userReacted === emoji ? 0 : 1),
    }));
    setUserReacted(emoji);
    localStorage.setItem(`reacted-${slug}`, emoji);

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, emoji }),
      });
    } catch {
      // ignore
    }
  };

  const validEntries = Object.entries(counts).filter(
    ([emoji, count]) => typeof count === 'number' && typeof emoji === 'string'
  );

  return (
    <div className={`flex items-center gap-2 select-none ${compact ? 'py-1' : 'py-3'}`}>
      {validEntries.map(([emoji, count]) => {
        const isSelected = userReacted === emoji;
        const isBouncing = animatingEmoji === emoji;

        return (
          <button
            key={emoji}
            type="button"
            onClick={(e) => handleReact(emoji, e)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200 border ${
              isSelected
                ? 'border-accent bg-accent/15 text-ink font-bold shadow-sm scale-105'
                : 'border-line/70 bg-bg/60 text-muted hover:border-line hover:text-ink hover:scale-105'
            } ${isBouncing ? 'animate-bounce' : ''}`}
            title={`React with ${emoji}`}
          >
            <span className="text-sm leading-none">{emoji}</span>
            <span className="text-[11px] font-mono leading-none">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
