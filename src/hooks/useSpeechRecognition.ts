'use client';
/**
 * useSpeechRecognition.ts
 * Encapsulates the Web Speech API (SpeechRecognition / webkitSpeechRecognition).
 * Feature-detects on mount; degrades gracefully to chat-only mode.
 *
 * Returned API:
 *   isSupported   — false on Firefox / older Safari
 *   isListening   — currently recording mic
 *   interim       — live in-progress transcript string
 *   start(lang?)  — begin a recognition session
 *   stop()        — force-stop
 *   isEmailMode   — if true, caller wants alphabet-level recognition (email collection)
 *   setEmailMode  — toggle email mode
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** Phonetic corrections for common mis-transcriptions of portfolio nouns */
function normalizeTranscript(raw: string): string {
  let text = raw.trim();
  text = text
    .replace(/\b(elder\s*nest|older\s*nest|alder\s*nest)\b/gi, 'ElderNest')
    .replace(/\b(wisdom\s*play)\b/gi, 'WisdomPlay')
    .replace(/\b(brick\s*up|break\s*up|bric\s*up|brickup)\b/gi, 'BrikUp')
    .replace(/\b(hack\s*verse|hackers?\s*2025)\b/gi, 'HackVerse')
    .replace(/\b(bms\s*it|bmsit\s*m)\b/gi, 'BMSIT')
    .replace(/\b(smart\s*attendance|rfid\s*attendance)\b/gi, 'Smart Attendance')
    .replace(/\b(r\s*j|a\s*j)\b/gi, 'Ajay');
  // Strip filler words
  text = text.replace(/\b(um|uh|hmm|er|like)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
  return text;
}

export type RecognitionError =
  | 'not-allowed'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'aborted'
  | 'service-not-allowed'
  | 'unknown';

export interface UseSpeechRecognitionOptions {
  onFinalTranscript: (text: string) => void;
  onError: (type: RecognitionError, message: string) => void;
  silenceTimeoutMs?: number; // default 8000
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  interim: string;
  isEmailMode: boolean;
  setEmailMode: (v: boolean) => void;
  start: (lang?: string) => void;
  stop: () => void;
}

export function useSpeechRecognition({
  onFinalTranscript,
  onError,
  silenceTimeoutMs = 8000,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [isEmailMode, setEmailMode] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedFinalRef = useRef('');

  // Feature detection — runs once on mount (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SR);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(
    (onSilence: () => void) => {
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(onSilence, silenceTimeoutMs);
    },
    [clearSilenceTimer, silenceTimeoutMs],
  );

  const stop = useCallback(() => {
    clearSilenceTimer();
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
    setInterim('');
  }, [clearSilenceTimer]);

  const start = useCallback(
    (lang = 'en-IN') => {
      if (!isSupported) return;
      if (typeof window === 'undefined') return;

      // Stop any running session first
      try { recognitionRef.current?.stop(); } catch {}
      accumulatedFinalRef.current = '';

      const SR =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SR();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = lang;

      // In email mode, try to attach a grammar for letters/digits (if supported)
      if (isEmailMode && (window as any).SpeechGrammarList) {
        try {
          const grammar =
            '#JSGF V1.0; grammar email; public <email> = ' +
            'a | b | c | d | e | f | g | h | i | j | k | l | m | ' +
            'n | o | p | q | r | s | t | u | v | w | x | y | z | ' +
            '0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | at | dot ;';
          const list = new (window as any).SpeechGrammarList();
          list.addFromString(grammar, 1);
          recognition.grammars = list;
        } catch {}
      }

      recognition.onstart = () => {
        setIsListening(true);
        setInterim('');
        resetSilenceTimer(() => {
          stop();
          // Treat silence as "no speech"
          onError('no-speech', 'No speech detected. Tap to try again.');
        });
      };

      recognition.onresult = (event: any) => {
        clearSilenceTimer();
        let interimChunk = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            accumulatedFinalRef.current = result[0].transcript;
          } else {
            interimChunk += result[0].transcript;
          }
        }

        const displayText = (accumulatedFinalRef.current || interimChunk).trim();
        setInterim(displayText);

        if (accumulatedFinalRef.current.trim()) {
          const cleaned = normalizeTranscript(accumulatedFinalRef.current.trim());
          if (cleaned.length >= 2) {
            setInterim('');
            setIsListening(false);
            clearSilenceTimer();
            try { recognition.stop(); } catch {}
            onFinalTranscript(cleaned);
          }
        } else {
          // Still collecting — reset silence timer
          resetSilenceTimer(() => {
            stop();
            onError('no-speech', 'No speech detected. Tap to try again.');
          });
        }
      };

      recognition.onerror = (event: any) => {
        clearSilenceTimer();
        setIsListening(false);
        setInterim('');
        const err = event.error as RecognitionError;
        const messages: Record<RecognitionError, string> = {
          'not-allowed': 'Microphone access denied. Please allow mic in your browser settings.',
          'no-speech': 'No speech detected. Tap to try again.',
          'audio-capture': 'No microphone found. Please connect a microphone.',
          network: 'Network error during speech recognition. Check your connection.',
          aborted: '',
          'service-not-allowed': 'Speech service not allowed in this context.',
          unknown: 'Unexpected speech recognition error.',
        };
        if (err !== 'aborted') {
          onError(err ?? 'unknown', messages[err] ?? messages.unknown);
        }
      };

      recognition.onend = () => {
        clearSilenceTimer();
        setIsListening(false);
        setInterim('');
        // If we have accumulated final text that wasn't dispatched yet (edge case)
        const text = accumulatedFinalRef.current.trim();
        if (text.length >= 2) {
          const cleaned = normalizeTranscript(text);
          accumulatedFinalRef.current = '';
          onFinalTranscript(cleaned);
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (err: any) {
        setIsListening(false);
        onError('unknown', 'Could not start microphone. Check browser permissions.');
      }
    },
    [isSupported, isEmailMode, onFinalTranscript, onError, resetSilenceTimer, stop, clearSilenceTimer],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, [clearSilenceTimer]);

  return {
    isSupported,
    isListening,
    interim,
    isEmailMode,
    setEmailMode,
    start,
    stop,
  };
}
