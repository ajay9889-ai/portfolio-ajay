'use client';

import React from 'react';

interface WaveformProps {
  amplitudes?: number[]; // Values 0 to 1
  barsCount?: number;
  className?: string;
  active?: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({
  amplitudes,
  barsCount = 20,
  className = '',
  active = false,
}) => {
  const bars = Array.from({ length: barsCount }, (_, i) => {
    let amp = 0.15;
    if (active) {
      if (amplitudes && amplitudes.length > 0) {
        amp = amplitudes[i % amplitudes.length] ?? 0.2;
      } else {
        // Fallback smooth sine wave
        const time = Date.now() / 400;
        amp = 0.2 + 0.6 * Math.abs(Math.sin(time + i * 0.4));
      }
    }
    const heightPercent = Math.min(100, Math.max(15, Math.round(amp * 100)));
    return (
      <span
        key={i}
        className="w-[3px] rounded-full transition-all duration-100 ease-out bg-[var(--color-accent,#FF7A00)]"
        style={{
          height: `${heightPercent}%`,
          opacity: active ? 0.9 : 0.35,
        }}
      />
    );
  });

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-[3px] h-8 px-2 ${className}`}
    >
      {bars}
    </div>
  );
};
