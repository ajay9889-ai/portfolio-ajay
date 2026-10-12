'use client';

import React from 'react';

interface AIAssistantLogoProps {
  className?: string;
  compact?: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const AIAssistantLogo: React.FC<AIAssistantLogoProps> = ({
  className = 'w-8 h-8',
  compact = false,
  isListening = false,
  isSpeaking = false,
}) => {
  // Compact version for teaser pills and small badges
  if (compact) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Left Hemisphere */}
        <path
          d="M11 4.5C8 4.2 5.5 5.5 4.5 8C3.5 10 3.5 12.5 4.2 14.5C5 16.5 6.5 18.5 9 19.5C10.2 20 11 20.2 11 20.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Right Hemisphere */}
        <path
          d="M13 4.5C16 4.2 18.5 5.5 19.5 8C20.5 10 20.5 12.5 19.8 14.5C19 16.5 17.5 18.5 15 19.5C13.8 20 13 20.2 13 20.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Central Fissure */}
        <line x1="12" y1="4" x2="12" y2="20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        {/* Synapse Nodes */}
        <circle cx="8" cy="11.5" r="1.3" fill="currentColor" />
        <circle cx="16" cy="11.5" r="1.3" fill="currentColor" />
        <circle cx="12" cy="7" r="1.3" fill="#FFFFFF" />
        <circle cx="12" cy="17" r="1.3" fill="#FFFFFF" />
      </svg>
    );
  }

  // Full High-Tech Neural AI Brain with Illuminated Synapse Nodes
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Glowing Synapse Filter */}
        <filter id="synapseGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Neural Circuit Gradient */}
        <linearGradient id="neuralTraceGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF8E7" />
          <stop offset="100%" stopColor="#FFE082" />
        </linearGradient>
      </defs>

      {/* ─────────────────────────────────────────────────────────────
          1. OUTER CEREBRAL HEMISPHERES (Smooth Brain Lobes)
          ───────────────────────────────────────────────────────────── */}
      {/* Left Hemisphere Outer Lobe Contour */}
      <path
        d="M 14.5 5.5 C 10.5 5 6.8 6.8 5.2 10.2 C 3.8 13.2 4 16.8 5.2 19.8 C 6.5 22.8 9 25.2 12.5 26.5 C 13.5 26.8 14.5 27 14.5 27"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Hemisphere Outer Lobe Contour */}
      <path
        d="M 17.5 5.5 C 21.5 5 25.2 6.8 26.8 10.2 C 28.2 13.2 28 16.8 26.8 19.8 C 25.5 22.8 23 25.2 19.5 26.5 C 18.5 26.8 17.5 27 17.5 27"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Longitudinal Fissure (Center Stem) */}
      <path
        d="M 16 4.5 V 27.5"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={isListening ? '3 1.5' : undefined}
        className={isListening ? 'animate-pulse' : undefined}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. INTERNAL SYNAPTIC CIRCUIT PATHWAYS
          ───────────────────────────────────────────────────────────── */}
      {/* Left Hemisphere Neural Traces */}
      <path
        d="M 15 9.5 H 10.5 C 8.8 9.5 7.5 10.8 7.5 12.5 V 13.5"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 7.5 17.5 V 18.5 C 7.5 20.2 8.8 21.5 10.5 21.5 H 15"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 11.5 15.5 H 15"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Right Hemisphere Neural Traces */}
      <path
        d="M 17 9.5 H 21.5 C 23.2 9.5 24.5 10.8 24.5 12.5 V 13.5"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 24.5 17.5 V 18.5 C 24.5 20.2 23.2 21.5 21.5 21.5 H 17"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 20.5 15.5 H 17"
        stroke="url(#neuralTraceGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* ─────────────────────────────────────────────────────────────
          3. ILLUMINATED SYNAPSE NODES (Firing Neural Points)
          ───────────────────────────────────────────────────────────── */}
      {/* Left Hemisphere Synapses */}
      <g filter="url(#synapseGlowFilter)">
        {/* Node L1 - Frontal Cortex */}
        <circle
          cx="10.5"
          cy="9.5"
          r="1.7"
          fill="#FFFFFF"
          className="animate-pulse"
          style={{ animationDuration: isSpeaking ? '0.8s' : '2.2s' }}
        />
        {/* Node L2 - Mid Cortex */}
        <circle
          cx="7.5"
          cy="15.5"
          r="1.8"
          fill="#FFE082"
          className="animate-pulse"
          style={{ animationDuration: isSpeaking ? '0.6s' : '2.8s', animationDelay: '0.4s' }}
        />
        {/* Node L3 - Occipital Base */}
        <circle
          cx="10.5"
          cy="21.5"
          r="1.7"
          fill="#FFFFFF"
          className="animate-pulse"
          style={{ animationDuration: isSpeaking ? '0.9s' : '2.4s', animationDelay: '0.8s' }}
        />
        {/* Node L4 - Medial Center */}
        <circle
          cx="12"
          cy="15.5"
          r="1.4"
          fill="#FFFFFF"
        />

        {/* Right Hemisphere Synapses */}
        {/* Node R1 - Frontal Cortex */}
        <circle
          cx="21.5"
          cy="9.5"
          r="1.7"
          fill="#FFFFFF"
          className="animate-pulse"
          style={{ animationDuration: isSpeaking ? '0.7s' : '2.5s', animationDelay: '0.2s' }}
        />
        {/* Node R2 - Mid Cortex */}
        <circle
          cx="24.5"
          cy="15.5"
          r="1.8"
          fill="#FFE082"
          className="animate-pulse"
          style={{ animationDuration: isSpeaking ? '0.6s' : '2.7s', animationDelay: '0.6s' }}
        />
        {/* Node R3 - Occipital Base */}
        <circle
          cx="21.5"
          cy="21.5"
          r="1.7"
          fill="#FFFFFF"
          className="animate-pulse"
          style={{ animationDuration: isSpeaking ? '0.85s' : '2.3s', animationDelay: '1s' }}
        />
        {/* Node R4 - Medial Center */}
        <circle
          cx="20"
          cy="15.5"
          r="1.4"
          fill="#FFFFFF"
        />

        {/* Central Core Nodes (Crown & Stem) */}
        <circle
          cx="16"
          cy="5"
          r="2"
          fill="#FFFFFF"
          className="animate-pulse"
          style={{ animationDuration: '1.8s' }}
        />
        <circle
          cx="16"
          cy="15.5"
          r="2"
          fill="#FFFFFF"
          className={isSpeaking || isListening ? 'animate-ping' : undefined}
          style={{ animationDuration: '1.4s' }}
        />
        <circle
          cx="16"
          cy="26.5"
          r="1.8"
          fill="#FFE082"
        />
      </g>
    </svg>
  );
};
