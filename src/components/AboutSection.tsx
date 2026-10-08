import React from 'react';
import { PROFILE } from '@/data/portfolioData';

export function AboutSection() {
  const words = PROFILE.about.split(' ');

  return (
    <section id="about" className="py-28 sm:py-36 px-6 sm:px-8 max-w-6xl mx-auto border-t border-border">
      <div className="max-w-4xl">
        <span className="text-xs uppercase tracking-widest text-text-muted font-mono mb-8 block">
          about
        </span>

        <h2 className="sr-only">About Ajay A</h2>

        <p className="font-heading text-2xl sm:text-4xl md:text-5xl font-normal leading-[1.35] tracking-tight text-text">
          {words.map((word, index) => (
            <span
              key={index}
              className="inline-block mr-[0.28em] transition-colors duration-200"
              data-about-word
            >
              {word}
            </span>
          ))}
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-text-muted leading-relaxed font-light">
          <div>
            <h3 className="font-heading text-text font-medium text-base mb-2">Philosophy</h3>
            <p>
              I believe in calm code, resilient APIs, and interfaces that respect human attention. Every system should be quiet until needed and rock-solid when tested.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-text font-medium text-base mb-2">Background</h3>
            <p>
              MCA graduate from BMSITM Bangalore. Experienced in shipping production web features under real-world constraints at BrikUp, and building award-winning hackathon solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
