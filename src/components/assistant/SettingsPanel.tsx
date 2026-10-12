'use client';

import React from 'react';
import { Volume2, RotateCcw, X, Mic } from 'lucide-react';
import { useAssistantContext } from '@/context/AssistantContext';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { settings, updateSettings, resetSettings, speak, voices, currentVoice, setVoice } = useAssistantContext();

  const handleTestVoice = () => {
    speak("Hello! I'm Ajay's AI voice assistant. How does my voice sound?");
  };

  return (
    <div className="absolute inset-0 z-30 bg-white/95 dark:bg-[#121218]/95 backdrop-blur-md p-5 flex flex-col justify-between text-xs text-neutral-800 dark:text-neutral-200 overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-white/10">
          <span className="font-semibold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
            Voice & Assistant Settings
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Voice Selector */}
        {voices.length > 0 && (
          <div>
            <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
              Synthesis Voice
            </label>
            <select
              value={currentVoice?.name || ''}
              onChange={(e) => {
                const found = voices.find((v) => v.name === e.target.value);
                if (found) setVoice(found);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent,#FF7A00)]"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Rate (Speed) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Speech Speed
            </label>
            <span className="text-[11px] font-mono text-neutral-400">{settings.rate.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={settings.rate}
            onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
            className="w-full accent-[var(--color-accent,#FF7A00)] cursor-pointer"
          />
        </div>

        {/* Pitch */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Voice Pitch
            </label>
            <span className="text-[11px] font-mono text-neutral-400">{settings.pitch.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.05"
            value={settings.pitch}
            onChange={(e) => updateSettings({ pitch: parseFloat(e.target.value) })}
            className="w-full accent-[var(--color-accent,#FF7A00)] cursor-pointer"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-2.5 pt-2 border-t border-neutral-200 dark:border-white/10">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Auto-read replies aloud
            </span>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => updateSettings({ autoSpeak: e.target.checked })}
              className="w-4 h-4 rounded accent-[var(--color-accent,#FF7A00)] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Show speech captions
            </span>
            <input
              type="checkbox"
              checked={settings.captions}
              onChange={(e) => updateSettings({ captions: e.target.checked })}
              className="w-4 h-4 rounded accent-[var(--color-accent,#FF7A00)] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Push-to-talk mode
            </span>
            <input
              type="checkbox"
              checked={settings.pushToTalk}
              onChange={(e) => updateSettings({ pushToTalk: e.target.checked })}
              className="w-4 h-4 rounded accent-[var(--color-accent,#FF7A00)] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Footer action buttons */}
      <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-white/10">
        <button
          type="button"
          onClick={handleTestVoice}
          className="flex-1 py-2 px-3 rounded-xl font-medium bg-[var(--color-accent,#FF7A00)] text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Test Voice
        </button>

        <button
          type="button"
          onClick={resetSettings}
          title="Reset to default settings"
          className="py-2 px-3 rounded-xl font-medium bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/15 transition-all flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
};
