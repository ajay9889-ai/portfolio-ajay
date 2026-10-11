'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX, Loader2, Radio, Play, Square, AlertCircle, MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
}

export function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'voice' | 'chat'>('voice');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Ajay's AI Voice & Chat Assistant. Feel free to speak or ask any questions about Ajay's full-stack tech stack, his BrikUp internship, award-winning projects (ElderNest, WisdomPlay), or hiring availability.",
    },
  ]);

  // Voice Chat & TTS States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastSpokenQuery, setLastSpokenQuery] = useState('');

  // Available Voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Phonetic corrections for technical terms in voice speech
  const normalizeVoiceTranscript = (raw: string): string => {
    let text = raw.trim();
    text = text
      .replace(/\b(elder\s*nest|older\s*nest|alder\s*nest)\b/gi, 'ElderNest')
      .replace(/\b(wisdom\s*play)\b/gi, 'WisdomPlay')
      .replace(/\b(brick\s*up|break\s*up|bric\s*up|brickup)\b/gi, 'BrikUp')
      .replace(/\b(hack\s*verse|hackers\s*2025)\b/gi, 'HackVerse')
      .replace(/\b(bms\s*it|bmsit\s*m)\b/gi, 'BMSIT')
      .replace(/\b(smart\s*attendance|rfid\s*attendance)\b/gi, 'Smart Attendance')
      .replace(/\b(r\s*j|a\s*j)\b/gi, 'Ajay');
    return text;
  };

  // Load and filter Indian English voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check Speech Recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }

    // Load available browser TTS voices — prefer Indian English
    const updateVoices = () => {
      if (!window.speechSynthesis) return;
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices.length) return;

      setVoices(allVoices);

      // Priority order for Indian English male voice:
      // 1. en-IN voices named Ravi (Google Indian male)
      // 2. Any en-IN male voice
      // 3. Any en-IN voice
      // 4. en-GB/en-US male voice as last resort
      const femaleNames = ['hazel', 'zira', 'susan', 'heera', 'eva', 'catherina', 'linda', 'female', 'girl', 'priya', 'meera', 'lekha'];
      const maleIndianNames = ['ravi', 'rishi', 'arjun', 'dev', 'karan'];
      const maleFallbackNames = ['george', 'david', 'mark', 'guy', 'daniel', 'alex', 'oliver', 'male'];

      const isFemaleVoice = (v: SpeechSynthesisVoice) =>
        femaleNames.some((f) => v.name.toLowerCase().includes(f));

      // 1. Indian English named male (e.g. "Google हिन्दी" / "Ravi" / "Microsoft Ravi")
      const indianMale = allVoices.find((v) =>
        v.lang === 'en-IN' &&
        !isFemaleVoice(v) &&
        maleIndianNames.some((m) => v.name.toLowerCase().includes(m))
      );

      // 2. Any en-IN non-female voice
      const indianAny = allVoices.find((v) =>
        v.lang === 'en-IN' && !isFemaleVoice(v)
      );

      // 3. Any en-IN voice (even female — better accent than generic)
      const indianFallback = allVoices.find((v) => v.lang === 'en-IN');

      // 4. Generic English male last resort
      const genericMale = allVoices.find((v) =>
        !isFemaleVoice(v) &&
        maleFallbackNames.some((m) => v.name.toLowerCase().includes(m)) &&
        v.lang.startsWith('en')
      );

      const chosenVoice = indianMale || indianAny || indianFallback || genericMale || allVoices[0];

      if (chosenVoice) {
        setSelectedVoice(chosenVoice);
      }
    };

    updateVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeMode]);

  // Speak AI response with Indian English voice
  const speakText = (text: string, messageId?: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop current speech

    // Clean markdown/emoji/URLs for natural spoken delivery
    const spokenText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[*_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/•/g, ',')
      .trim();

    const utterance = new SpeechSynthesisUtterance(spokenText);

    // Apply chosen Indian English voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Tune for natural Indian English delivery
    utterance.lang = 'en-IN';  // Indian English language tag
    utterance.pitch = 1.0;     // Natural, confident tone
    utterance.rate = 0.92;     // Slightly slower — clear and crisp
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (messageId) setCurrentSpeakingId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  };

  // Start / Stop Microphone Voice Input with multi-chunk accuracy
  const toggleListening = () => {
    setErrorNotice(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setLiveTranscript('');
      return;
    }

    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorNotice('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;  // Show interim results for responsiveness
      recognition.lang = 'en-IN';          // Indian English — understands Indian accent
      recognition.maxAlternatives = 1;

      let accumulatedFinal = '';

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
        setErrorNotice(null);
      };

      recognition.onresult = (event: any) => {
        let interimChunk = '';

        for (let i = 0; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            accumulatedFinal = item[0].transcript;
          } else {
            interimChunk += item[0].transcript;
          }
        }

        const displayText = (accumulatedFinal || interimChunk).trim();
        if (displayText) {
          setLiveTranscript(displayText);
        }

        if (accumulatedFinal.trim()) {
          const cleaned = normalizeVoiceTranscript(accumulatedFinal.trim());
          setLastSpokenQuery(cleaned);
          setLiveTranscript('');
          setIsListening(false);
          try {
            recognition.stop();
          } catch {}
          sendMessage(cleaned);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setLiveTranscript('');
        if (event.error === 'not-allowed') {
          setErrorNotice('Microphone access denied. Please allow microphone in browser.');
        } else if (event.error === 'no-speech') {
          setErrorNotice('No speech detected. Tap the animated circle to speak again.');
        } else {
          setErrorNotice(`Microphone: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (accumulatedFinal.trim()) {
          const cleaned = normalizeVoiceTranscript(accumulatedFinal.trim());
          setLastSpokenQuery(cleaned);
          setLiveTranscript('');
          sendMessage(cleaned);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setLiveTranscript('');
      setErrorNotice('Could not start microphone. Check your browser permissions.');
    }
  };

  // Send message to backend /api/chat
  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorNotice(null);
    setLiveTranscript('');
    setLastSpokenQuery(trimmed);
    stopSpeaking();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    const previousHistory = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: previousHistory,
        }),
      });

      let reply = '';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
      }

      if (!reply) {
        reply = "Ajay A is a full-stack developer in Bengaluru specializing in React, Next.js, and AI systems. Feel free to connect at ajayhasrb123@gmail.com!";
      }

      const assistantMsgId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, sender: 'assistant', text: reply },
      ]);

      if (voiceEnabled) {
        speakText(reply, assistantMsgId);
      }
    } catch (err: any) {
      console.warn('Network issue in chat request, using fallback:', err);
      const fallbackId = `fallback-${Date.now()}`;
      const fallback = "Ajay A is a full-stack developer in Bengaluru specializing in React, Next.js, and scalable APIs. Feel free to connect at ajayhasrb123@gmail.com!";
      setMessages((prev) => [
        ...prev,
        { id: fallbackId, sender: 'assistant', text: fallback },
      ]);
      if (voiceEnabled) {
        speakText(fallback, fallbackId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Filter available English male voices
  const availableMaleVoices = voices.filter((v) => {
    const lower = v.name.toLowerCase();
    const femaleNames = ['hazel', 'zira', 'susan', 'heera', 'eva', 'catherina', 'linda', 'female', 'girl'];
    return !femaleNames.some((f) => lower.includes(f)) && v.lang.startsWith('en');
  });

  return (
    <>
      {/* 1. Floating AI Assistant Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl shadow-orange-500/30 flex items-center gap-2.5 text-xs font-mono transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        title="Open Ajay's Floating AI Voice Agent"
      >
        <div className="relative">
          <Radio className="w-4 h-4 text-white animate-pulse" />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>
        <span className="font-medium tracking-wide">
          {isOpen ? 'Close Assistant' : 'AI Voice Agent'}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </button>

      {/* 2. Floating AI Assistant Popover Card */}
      {isOpen && (
        <div className="fixed inset-x-2.5 bottom-2 sm:bottom-20 sm:right-6 sm:inset-x-auto z-50 w-auto sm:w-[410px] h-[86vh] sm:h-[560px] max-h-[88vh] rounded-3xl bg-bg/95 dark:bg-[#0D0D12]/95 border border-line dark:border-white/12 text-ink shadow-2xl dark:shadow-[0_25px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Card Header */}
          <div className="p-3.5 border-b border-line dark:border-white/10 bg-line/20 dark:bg-white/[0.03] backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-inner">
                <Radio className="w-4 h-4" />
                {isSpeaking && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-ink dark:text-white">Ajay&apos;s Assistant</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                {/* Male Voice Selector */}
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-mono text-muted dark:text-neutral-400">Voice:</span>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const match = voices.find((v) => v.name === e.target.value);
                      if (match) setSelectedVoice(match);
                    }}
                    className="bg-transparent text-[10px] font-mono text-orange-600 dark:text-orange-400 border-b border-orange-500/40 focus:outline-none cursor-pointer max-w-[120px] truncate"
                  >
                    {availableMaleVoices.length > 0 ? (
                      availableMaleVoices.map((v) => (
                        <option key={v.name} value={v.name} className="bg-bg text-ink dark:bg-[#181822] dark:text-neutral-200 text-xs">
                          {v.name.replace('Microsoft ', '').replace(' Desktop', '')} (Male)
                        </option>
                      ))
                    ) : (
                      <option value="" className="bg-bg text-ink dark:bg-[#181822] dark:text-neutral-200">Natural Male Voice</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Mode Toggle Switcher */}
              <div className="flex items-center p-0.5 rounded-full bg-line/40 dark:bg-white/[0.06] border border-line dark:border-white/10 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveMode('voice')}
                  className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
                    activeMode === 'voice'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-sm'
                      : 'text-muted hover:text-ink dark:text-neutral-400 dark:hover:text-white'
                  }`}
                  title="Voice Agent (Animated circle mode)"
                >
                  <Radio className="w-2.5 h-2.5" />
                  <span>Voice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('chat')}
                  className={`px-2 py-1 rounded-full transition-all flex items-center gap-1 ${
                    activeMode === 'chat'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-sm'
                      : 'text-muted hover:text-ink dark:text-neutral-400 dark:hover:text-white'
                  }`}
                  title="Text Chat mode"
                >
                  <MessageSquare className="w-2.5 h-2.5" />
                  <span>Chat</span>
                </button>
              </div>

              {/* Mute / Unmute Voice Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-1.5 rounded-full border transition-colors ${
                  voiceEnabled 
                    ? 'border-orange-500/40 text-orange-600 bg-orange-500/10 dark:text-orange-400 dark:bg-orange-500/15' 
                    : 'border-line dark:border-white/10 text-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
                }`}
                title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="text-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white p-1.5 rounded-full hover:bg-line/40 dark:hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="bg-rose-500/15 border-b border-rose-500/30 px-3.5 py-2 flex items-center justify-between text-xs font-mono text-rose-500 dark:text-rose-300">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="leading-tight text-[11px]">{errorNotice}</span>
              </div>
              <button onClick={() => setErrorNotice(null)} className="p-0.5 hover:opacity-80">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* ========================================================
              MODE 1: VOICE AGENT (ANIMATED CIRCLE - NO TEXT)
             ======================================================== */}
          {activeMode === 'voice' ? (
            <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 relative overflow-hidden select-none">
              {/* Ambient Glow Atmosphere Behind Circle */}
              <div 
                aria-hidden="true" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-500/15 dark:bg-gradient-to-tr dark:from-orange-600/30 dark:via-amber-500/20 dark:to-yellow-500/20 blur-3xl pointer-events-none transition-all duration-700" 
              />

              {/* Top Subtitle Status */}
              <div className="relative z-10 text-center space-y-1 pt-0.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-orange-600 dark:text-orange-400 font-semibold block">
                  AI Voice Agent
                </span>
                <p className="text-xs text-muted dark:text-neutral-300 font-mono">
                  {isListening 
                    ? 'Listening... speak to Ajay’s AI' 
                    : isLoading 
                    ? 'Thinking...' 
                    : isSpeaking 
                    ? 'Speaking aloud (Male Voice)...' 
                    : 'Tap the animated circle to speak'}
                </p>
              </div>

              {/* Center Interactive Animated Responding Circle */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
                {/* Expanding Concentric Ripple Rings when Active */}
                {(isSpeaking || isListening) && (
                  <>
                    <div className="absolute w-40 h-40 xs:w-44 xs:h-44 sm:w-52 sm:h-52 rounded-full border border-orange-500/40 dark:border-orange-500/50 animate-voice-ripple-1 pointer-events-none" />
                    <div className="absolute w-40 h-40 xs:w-44 xs:h-44 sm:w-52 sm:h-52 rounded-full border border-amber-400/35 dark:border-amber-400/40 animate-voice-ripple-2 pointer-events-none" />
                    <div className="absolute w-40 h-40 xs:w-44 xs:h-44 sm:w-52 sm:h-52 rounded-full border border-orange-300/30 dark:border-orange-300/35 animate-voice-ripple-3 pointer-events-none" />
                  </>
                )}

                {/* THE CORE ANIMATED CIRCLE */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      toggleListening();
                    }
                  }}
                  className={`relative w-36 h-36 xs:w-40 xs:h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl focus:outline-none ${
                    isListening
                      ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_0_70px_rgba(16,185,129,0.7)] animate-pulse scale-105'
                      : isLoading
                      ? 'bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-500 shadow-[0_0_70px_rgba(245,158,11,0.7)] animate-voice-spin'
                      : isSpeaking
                      ? 'bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 shadow-[0_0_85px_rgba(255,107,0,0.85)] animate-voice-speaking scale-105'
                      : 'bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 shadow-[0_0_55px_rgba(255,107,0,0.55)] dark:shadow-[0_0_60px_rgba(255,107,0,0.6)] animate-voice-breathe hover:scale-105 active:scale-95'
                  }`}
                  title={isSpeaking ? 'Tap to interrupt' : isListening ? 'Tap to stop listening' : 'Tap to speak'}
                >
                  {/* Glossy Spherical Overlay */}
                  <div className="absolute inset-2 rounded-full bg-white/[0.12] dark:bg-white/[0.08] backdrop-blur-sm border border-white/30 dark:border-white/25 flex items-center justify-center overflow-hidden">
                    {/* Internal Light Glare */}
                    <div className="absolute -top-7 -left-7 w-24 h-24 rounded-full bg-white/25 dark:bg-white/20 blur-md pointer-events-none" />
                    
                    {/* State Icon Inside Animated Circle */}
                    {isListening ? (
                      <div className="flex flex-col items-center gap-1.5 text-white">
                        <Mic className="w-10 h-10 animate-bounce" />
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Listening</span>
                      </div>
                    ) : isLoading ? (
                      <div className="flex flex-col items-center gap-1.5 text-white">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Thinking</span>
                      </div>
                    ) : isSpeaking ? (
                      <div className="flex flex-col items-center gap-1.5 text-white">
                        <Radio className="w-9 h-9 animate-pulse text-white" />
                        {/* Dynamic Equalizer Bars inside Orb */}
                        <div className="flex items-center gap-1 h-5 pt-0.5">
                          <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '14px', animationDelay: '0ms' }} />
                          <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '22px', animationDelay: '150ms' }} />
                          <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '10px', animationDelay: '300ms' }} />
                          <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '18px', animationDelay: '450ms' }} />
                          <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '12px', animationDelay: '200ms' }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-white/95">
                        <Mic className="w-9 h-9 text-white drop-shadow" />
                        <span className="text-[10px] font-mono tracking-wide opacity-90 uppercase">Tap Circle</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Animated Soundwave Frequency Bars Underneath */}
                <div className="flex items-center gap-1.5 mt-5 h-7">
                  {[35, 70, 95, 55, 85, 90, 50, 75, 40].map((heightPct, idx) => (
                    <span
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isSpeaking
                          ? 'bg-gradient-to-t from-orange-500 to-amber-400'
                          : isListening
                          ? 'bg-gradient-to-t from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300'
                          : 'bg-line dark:bg-white/15'
                      }`}
                      style={{
                        height: (isSpeaking || isListening) ? `${Math.max(6, heightPct * 0.28)}px` : '4px',
                        animation: (isSpeaking || isListening) ? `wave-bounce 0.8s ease-in-out infinite ${(idx * 90)}ms` : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Real-Time Speech & Spoken Response Subtitle Badge */}
                <div className="w-full max-w-[340px] min-h-[50px] mt-2.5 px-3.5 py-1.5 rounded-2xl bg-line/25 dark:bg-white/[0.04] border border-line dark:border-white/10 flex flex-col items-center justify-center text-center transition-all shadow-sm">
                  {liveTranscript ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 animate-pulse">
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                      <span className="italic truncate">&ldquo;{liveTranscript}&rdquo;</span>
                    </div>
                  ) : isSpeaking || isLoading ? (
                    <div className="space-y-0.5">
                      {lastSpokenQuery && (
                        <p className="text-[10px] font-mono text-muted dark:text-neutral-400 line-clamp-1">
                          You: &ldquo;{lastSpokenQuery}&rdquo;
                        </p>
                      )}
                      <p className="text-xs font-mono text-ink dark:text-neutral-200 line-clamp-2 leading-relaxed">
                        {messages[messages.length - 1]?.sender === 'assistant'
                          ? messages[messages.length - 1].text
                          : 'Synthesizing voice response...'}
                      </p>
                    </div>
                  ) : lastSpokenQuery ? (
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-mono text-muted dark:text-neutral-400 line-clamp-1">
                        Asked: &ldquo;{lastSpokenQuery}&rdquo;
                      </p>
                      <p className="text-xs font-mono text-ink dark:text-neutral-200 line-clamp-2 leading-relaxed">
                        {messages[messages.length - 1]?.sender === 'assistant'
                          ? messages[messages.length - 1].text
                          : 'Tap circle to speak again'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] font-mono text-muted dark:text-neutral-400">
                      Tap circle to speak aloud or select a topic below
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Section: Quick Topics & Control Dock */}
              <div className="relative z-10 space-y-3 pt-1">
                {/* One-Tap Voice Topic Pills - Wrapped & Zero Scrollbar */}
                <div 
                  className="flex flex-wrap items-center justify-center gap-1.5 no-scrollbar text-[11px] font-mono py-0.5"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <button
                    onClick={() => sendMessage("What is Ajay's tech stack and background?")}
                    disabled={isLoading}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500/10 dark:hover:bg-orange-500/15 transition-all active:scale-95 shadow-sm"
                  >
                    ⚡ Tech Stack
                  </button>
                  <button
                    onClick={() => sendMessage("Tell me about the ElderNest project.")}
                    disabled={isLoading}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500/10 dark:hover:bg-orange-500/15 transition-all active:scale-95 shadow-sm"
                  >
                    🏆 ElderNest
                  </button>
                  <button
                    onClick={() => sendMessage("What did Ajay do at BrikUp?")}
                    disabled={isLoading}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500/10 dark:hover:bg-orange-500/15 transition-all active:scale-95 shadow-sm"
                  >
                    💼 BrikUp
                  </button>
                  <button
                    onClick={() => sendMessage("Is Ajay available for hiring?")}
                    disabled={isLoading}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-500/10 dark:hover:bg-orange-500/15 transition-all active:scale-95 shadow-sm"
                  >
                    🤝 Hire
                  </button>
                </div>

                {/* Bottom Control Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-line dark:border-white/10">
                  <span className="text-[10px] font-mono text-muted dark:text-neutral-400">
                    Male Voice &bull; Voice Agent
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveMode('chat')}
                    className="text-[11px] font-mono text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 flex items-center gap-1 transition-colors font-medium"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Switch to Text Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================
                MODE 2: TEXT CHAT MODE
               ======================================================== */
            <>
              {/* Quick Prompt Pills - Clean Smooth Scroll, Zero Scrollbars */}
              <div 
                className="p-2.5 border-b border-line dark:border-white/8 bg-line/20 dark:bg-white/[0.02] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <button
                  onClick={() => sendMessage("What is Ajay's tech stack and background?")}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
                >
                  ⚡ Tech Stack
                </button>
                <button
                  onClick={() => sendMessage("Tell me about the ElderNest project.")}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
                >
                  🏆 ElderNest
                </button>
                <button
                  onClick={() => sendMessage("What did Ajay do at BrikUp?")}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
                >
                  💼 BrikUp
                </button>
                <button
                  onClick={() => sendMessage("Is Ajay available for hiring or freelance projects?")}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-line/30 dark:bg-white/[0.05] border border-line dark:border-white/10 text-ink/80 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
                >
                  🤝 Hire
                </button>
              </div>

              {/* Chat Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-mono no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="flex flex-col gap-1 max-w-[84%]">
                      <div
                        className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none shadow-md'
                            : 'bg-line/40 dark:bg-white/[0.07] text-ink dark:text-neutral-200 rounded-bl-none border border-line dark:border-white/10'
                        }`}
                      >
                        {m.text}
                      </div>

                      {/* Audio Listen / Replay button for Assistant Messages */}
                      {m.sender === 'assistant' && (
                        <div className="flex items-center gap-1.5 pl-1">
                          <button
                            onClick={() => {
                              if (currentSpeakingId === m.id && isSpeaking) {
                                stopSpeaking();
                              } else {
                                speakText(m.text, m.id);
                              }
                            }}
                            className={`text-[10px] font-mono inline-flex items-center gap-1 px-2 py-0.5 rounded-full border transition-colors ${
                              currentSpeakingId === m.id && isSpeaking
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-line/30 dark:bg-white/[0.04] text-muted dark:text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500 dark:hover:border-orange-500 border-line dark:border-white/10'
                            }`}
                          >
                            {currentSpeakingId === m.id && isSpeaking ? (
                              <>
                                <Square className="w-2.5 h-2.5 fill-current" />
                                <span>Stop Voice</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Listen (Male Voice)</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {m.sender === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-line/80 dark:bg-white/15 text-ink dark:text-white flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-muted dark:text-neutral-400 text-xs font-mono pl-8 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                    <span>Thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="p-3 border-t border-line dark:border-white/10 bg-line/10 dark:bg-white/[0.02]">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                  {/* Mic Button: Clicking opens Voice Agent circle mode! */}
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode('voice');
                        toggleListening();
                      }}
                      className="p-2 rounded-full border bg-line/30 dark:bg-white/[0.06] text-muted dark:text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10 border-line dark:border-white/10 transition-all"
                      title="Open Voice Agent (Animated Circle)"
                    >
                      <Mic className="w-4 h-4 text-orange-500" />
                    </button>
                  )}

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about stack, projects, or voice chat..."
                    disabled={isLoading}
                    className="flex-1 bg-line/20 dark:bg-white/[0.06] border border-line dark:border-white/10 rounded-full px-3.5 py-2 text-xs text-ink dark:text-white placeholder-muted/60 dark:placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 transition-opacity shrink-0 shadow-md shadow-orange-500/25"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
