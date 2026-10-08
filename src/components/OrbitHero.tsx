'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const OrbitCanvas = dynamic(
  () => import('./OrbitCanvas').then((mod) => mod.OrbitCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] sm:h-[440px] flex items-center justify-center text-xs font-mono text-muted">
        Loading 3D Orbit engine...
      </div>
    ),
  }
);

export function OrbitHero() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 -my-4">
      <OrbitCanvas />
    </div>
  );
}
