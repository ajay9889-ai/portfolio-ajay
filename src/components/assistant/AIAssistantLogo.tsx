'use client';

import React from 'react';

interface AIAssistantLogoProps {
  className?: string;
  compact?: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const AIAssistantLogo: React.FC<AIAssistantLogoProps> = ({
  className = 'w-7 h-7',
  compact = false,
  isListening = false,
  isSpeaking = false,
}) => {
  // If in compact mode (e.g. for small headers or pill avatars)
  if (compact) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
        <circle cx="19" cy="5" r="1.5" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Radiant Star Gradient */}
        <linearGradient id="aiCoreGrad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#FFF9E6" />
          <stop offset="85%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFCA28" />
        </linearGradient>

        {/* Orbit Ring Gradient */}
        <linearGradient id="aiOrbitGrad" x1="4" y1="18" x2="32" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#FFE082" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#FF7A00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>

        {/* Core Glow Radial */}
        <radialGradient id="aiGlowRadial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="50%" stopColor="#FFE082" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Orbiting Cosmic Wave Ring (tilted 3D perspective) */}
      <g transform="rotate(-26 18 18)">
        <ellipse
          cx="18"
          cy="18"
          rx="14.5"
          ry="5.5"
          stroke="url(#aiOrbitGrad)"
          strokeWidth="1.6"
          strokeDasharray={isListening ? '4 2' : '3 2'}
          className="transition-all duration-500"
          style={{
            animation: isListening
              ? 'spin-conic 3s linear infinite'
              : 'spin-conic 14s linear infinite',
            transformOrigin: '18px 18px',
          }}
        />

        {/* Satellite Node 1 */}
        <circle
          cx="3.5"
          cy="18"
          r="1.8"
          fill="#FFFFFF"
          className="animate-pulse"
          style={{ animationDuration: '2s' }}
        />
        {/* Satellite Node 2 */}
        <circle
          cx="32.5"
          cy="18"
          r="1.4"
          fill="#FFE082"
          className="animate-pulse"
          style={{ animationDuration: '2.5s' }}
        />
      </g>

      {/* 2. Main Radiant 4-Point AI Star */}
      <path
        d="M18 3.5C18 11.51 11.51 18 3.5 18C11.51 18 18 24.49 18 32.5C18 24.49 24.49 18 32.5 18C24.49 18 18 11.51 18 3.5Z"
        fill="url(#aiCoreGrad)"
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
      />

      {/* 3. Radiant Core Glow Eye / Iris */}
      <circle cx="18" cy="18" r="4.2" fill="url(#aiGlowRadial)" opacity="0.9" />
      <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />
      <circle cx="18" cy="18" r="1.1" fill="#FF6B00" />

      {/* 4. Integrated Voice Equalizer micro-bars (animate when speaking or listening) */}
      {isSpeaking ? (
        <g transform="translate(14, 15)">
          <rect x="0" y="0" width="1.6" height="6" rx="0.8" fill="#FFFFFF" className="animate-bounce" />
          <rect x="3.2" y="-1.5" width="1.6" height="9" rx="0.8" fill="#FFFFFF" className="animate-bounce [animation-delay:0.15s]" />
          <rect x="6.4" y="1" width="1.6" height="4" rx="0.8" fill="#FFFFFF" className="animate-bounce [animation-delay:0.3s]" />
        </g>
      ) : isListening ? (
        <g transform="translate(13, 14.5)">
          <circle cx="5" cy="3.5" r="3" fill="#FFFFFF" className="animate-ping" opacity="0.8" />
          <circle cx="5" cy="3.5" r="2" fill="#FFFFFF" />
        </g>
      ) : (
        /* Subtle micro sparkle satellites */
        <g opacity="0.9">
          <path
            d="M27.5 7.5C27.5 9.16 26.16 10.5 24.5 10.5C26.16 10.5 27.5 11.84 27.5 13.5C27.5 11.84 28.84 10.5 30.5 10.5C28.84 10.5 27.5 9.16 27.5 7.5Z"
            fill="#FFFFFF"
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <path
            d="M8.5 23.5C8.5 24.6 7.6 25.5 6.5 25.5C7.6 25.5 8.5 26.4 8.5 27.5C8.5 26.4 9.4 25.5 10.5 25.5C9.4 25.5 8.5 24.6 8.5 23.5Z"
            fill="#FFE082"
            className="animate-pulse"
            style={{ animationDuration: '2.2s' }}
          />
        </g>
      )}
    </svg>
  );
};
