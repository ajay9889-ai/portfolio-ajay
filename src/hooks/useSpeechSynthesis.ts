'use client';
/**
 * useSpeechSynthesis.ts
 * Manages browser SpeechSynthesis with:
 *   - Sentence-level queuing (avoids Chrome's ~220-char truncation bug)
 *   - Chrome keep-alive ping (pause/resume every 14s for long utterances)
 *   - Voice preference: en-IN male → en-IN any → en-* male → any
 *   - Simulated amplitude array for orb animation during speech
 *   - Pronunciation map applied before speaking
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { cleanForTTS, splitIntoSentences } from '@/lib/textCleaner';
import { applyPronunciation } from '@/lib/pronunciation';

const FEMALE_VOICE_NAMES = [
  'hazel', 'zira', 'susan', 'heera', 'eva', 'catherina', 'linda',
  'female', 'girl', 'priya', 'meera', 'lekha', 'neerja', 'raveena',
];
const MALE_INDIAN_NAMES = ['ravi', 'rishi', 'arjun', 'dev', 'karan'];
const MALE_FALLBACK_NAMES = ['george', 'david', 'mark', 'guy', 'daniel', 'alex', 'oliver'];

function isFemale(v: SpeechSynthesisVoice): boolean {
  const lower = v.name.toLowerCase();
  return FEMALE_VOICE_NAMES.some((f) => lower.includes(f));
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
  if (!englishVoices.length) return voices[0] ?? null;

  const indianMale = englishVoices.find(
    (v) => v.lang === 'en-IN' && !isFemale(v) && MALE_INDIAN_NAMES.some((m) => v.name.toLowerCase().includes(m)),
  );
  const indianAny = englishVoices.find((v) => v.lang === 'en-IN' && !isFemale(v));
  const indianFallback = englishVoices.find((v) => v.lang === 'en-IN');
  const genericMale = englishVoices.find(
    (v) => !isFemale(v) && MALE_FALLBACK_NAMES.some((m) => v.name.toLowerCase().includes(m)),
  );
  return indianMale ?? indianAny ?? indianFallback ?? genericMale ?? englishVoices[0];
}

export interface VoiceSettings {
  rate: number;   // 0.8 – 1.3
  pitch: number;  // 0.8 – 1.2
  volume: number; // 0 – 1
  lang: string;   // e.g. 'en-IN'
}

export interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isTTSSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (v: SpeechSynthesisVoice) => void;
  amplitude: number[];   // 12-element array [0-1] for orb animation
  speak: (text: string, settings: VoiceSettings, messageId?: string) => void;
  cancel: () => void;
  testVoice: (settings: VoiceSettings) => void;
  speakingMessageId: string | null;
}

const AMP_BARS = 12;

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isTTSSupported, setIsTTSSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [amplitude, setAmplitude] = useState<number[]>(Array(AMP_BARS).fill(0));
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const queueRef = useRef<string[]>([]);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ampAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSpeakingRef = useRef(false);
  const settingsRef = useRef<VoiceSettings>({ rate: 1.0, pitch: 0.95, volume: 1.0, lang: 'en-IN' });

  // Feature detect + voice loading
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    setIsTTSSupported(true);

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      setVoices(all);
      setSelectedVoice((prev) => prev ?? pickBestVoice(all));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopAmpAnimation = useCallback(() => {
    if (ampAnimRef.current) {
      clearInterval(ampAnimRef.current);
      ampAnimRef.current = null;
      setAmplitude(Array(AMP_BARS).fill(0));
    }
  }, []);

  const startAmpAnimation = useCallback(() => {
    stopAmpAnimation();
    // Simulate speech amplitude with random sine envelope
    let phase = 0;
    ampAnimRef.current = setInterval(() => {
      phase += 0.25;
      const bars = Array.from({ length: AMP_BARS }, (_, i) =>
        Math.max(0.08, Math.abs(Math.sin(phase + i * 0.55) * (0.4 + Math.random() * 0.6))),
      );
      setAmplitude(bars);
    }, 80);
  }, [stopAmpAnimation]);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
  }, []);

  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    // Chrome bug: utterances > ~14s stall. Pause/resume every 14s.
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 14000);
  }, [stopKeepAlive]);

  const cancel = useCallback(() => {
    if (typeof window === 'undefined') return;
    queueRef.current = [];
    window.speechSynthesis?.cancel();
    if (isSpeakingRef.current) {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
    stopKeepAlive();
    stopAmpAnimation();
  }, [stopKeepAlive, stopAmpAnimation]);

  /** Speak the next sentence chunk in the queue */
  const playNext = useCallback(
    (settings: VoiceSettings, voice: SpeechSynthesisVoice | null, msgId?: string) => {
      if (!queueRef.current.length) {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        stopKeepAlive();
        stopAmpAnimation();
        return;
      }

      const chunk = queueRef.current.shift()!;
      const utterance = new SpeechSynthesisUtterance(chunk);
      if (voice) utterance.voice = voice;
      utterance.lang = settings.lang ?? 'en-IN';
      utterance.rate = settings.rate ?? 1.0;
      utterance.pitch = settings.pitch ?? 0.95;
      utterance.volume = settings.volume ?? 1.0;

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        setIsSpeaking(true);
        if (msgId) setSpeakingMessageId(msgId);
        startAmpAnimation();
        startKeepAlive();
      };

      utterance.onend = () => {
        playNext(settings, voice, msgId);
      };

      utterance.onerror = () => {
        playNext(settings, voice, msgId);
      };

      window.speechSynthesis.speak(utterance);
    },
    [startAmpAnimation, startKeepAlive, stopAmpAnimation, stopKeepAlive],
  );

  const speak = useCallback(
    (text: string, settings: VoiceSettings, messageId?: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;

      // Cancel any ongoing speech
      cancel();

      settingsRef.current = settings;

      // Process text through cleaner and pronunciation map
      const cleaned = applyPronunciation(cleanForTTS(text));
      const sentences = splitIntoSentences(cleaned).filter(Boolean);
      if (!sentences.length) return;

      queueRef.current = sentences;
      playNext(settings, selectedVoice, messageId);
    },
    [cancel, playNext, selectedVoice],
  );

  const testVoice = useCallback(
    (settings: VoiceSettings) => {
      speak(
        "Hi! I'm Ajay's portfolio assistant. Ask me anything about his projects, skills, or how to contact him.",
        settings,
      );
    },
    [speak],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    isSpeaking,
    isTTSSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    amplitude,
    speak,
    cancel,
    testVoice,
    speakingMessageId,
  };
}
