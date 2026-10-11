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
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Ajay's AI Voice & Chat Assistant. Feel free to speak or type any questions about Ajay's full-stack tech stack, his BrikUp internship, award-winning projects (ElderNest, WisdomPlay), or hiring availability.",
    },
  ]);

  // Voice Chat & TTS States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Available Voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load and filter male voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check Speech Recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }

    // Load available browser TTS voices
    const updateVoices = () => {
      if (!window.speechSynthesis) return;
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices.length) return;

      setVoices(allVoices);

      // Prioritize male English voices
      const maleNames = ['george', 'ravi', 'david', 'mark', 'guy', 'daniel', 'alex', 'oliver', 'rishi', 'male'];
      const femaleNames = ['hazel', 'zira', 'susan', 'heera', 'eva', 'catherina', 'linda', 'female', 'girl'];

      const maleVoice = allVoices.find((v) => {
        const lower = v.name.toLowerCase();
        const isFemale = femaleNames.some((f) => lower.includes(f));
        const isMale = maleNames.some((m) => lower.includes(m));
        return !isFemale && isMale && v.lang.startsWith('en');
      }) || allVoices.find((v) => {
        const lower = v.name.toLowerCase();
        return !femaleNames.some((f) => lower.includes(f)) && v.lang.startsWith('en');
      }) || allVoices[0];

      if (maleVoice) {
        setSelectedVoice(maleVoice);
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
  }, [messages, isLoading]);

  // Speak AI response with chosen Male Voice
  const speakText = (text: string, messageId?: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop current speech

    // Clean markdown symbols for natural human speech
    const spokenText = text
      .replace(/[*_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(spokenText);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = 0.95; // Confident male resonance
    utterance.rate = 1.0;   // Conversational speed

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

  // Start / Stop Microphone Voice Input
  const toggleListening = () => {
    setErrorNotice(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
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
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorNotice(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          sendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorNotice('Microphone access denied. Please allow microphone in browser bar.');
        } else if (event.error === 'no-speech') {
          setErrorNotice('No speech detected. Please tap mic and speak again.');
        } else {
          setErrorNotice(`Microphone error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorNotice('Could not start microphone. Check your browser settings.');
    }
  };

  // Send message to backend /api/chat
  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorNotice(null);
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

      if (!res.ok) {
        throw new Error(`Chat API error`);
      }

      const data = await res.json();
      const reply = data.reply || "Ajay A is a full-stack developer in Bengaluru specializing in React, Next.js, and AI systems. Feel free to connect at ajayhasrb123@gmail.com!";

      const assistantMsgId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, sender: 'assistant', text: reply },
      ]);

      if (voiceEnabled) {
        speakText(reply, assistantMsgId);
      }
    } catch (err: any) {
      console.error('Error in chat request:', err);
      const fallbackId = `err-${Date.now()}`;
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
        className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/25 flex items-center gap-2.5 text-xs font-mono transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        title="Open Ajay's Floating AI Assistant"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>
        <span className="font-medium tracking-wide">
          {isOpen ? 'Close Assistant' : 'AI Assistant'}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </button>

      {/* 2. Floating AI Assistant Popover Card */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[82vh] rounded-3xl bg-[#121218]/95 dark:bg-[#0D0D12]/95 border border-white/12 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Card Header */}
          <div className="p-4 border-b border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center shadow-inner">
                <Bot className="w-4 h-4" />
                {isSpeaking && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-white">Ajay's Assistant</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    Live
                  </span>
                </div>
                {/* Male Voice Selector */}
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-mono text-neutral-400">Voice:</span>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const match = voices.find((v) => v.name === e.target.value);
                      if (match) setSelectedVoice(match);
                    }}
                    className="bg-transparent text-[10px] font-mono text-violet-400 border-b border-violet-500/30 focus:outline-none cursor-pointer max-w-[130px] truncate"
                  >
                    {availableMaleVoices.length > 0 ? (
                      availableMaleVoices.map((v) => (
                        <option key={v.name} value={v.name} className="bg-[#181822] text-neutral-200 text-xs">
                          {v.name.replace('Microsoft ', '').replace(' Desktop', '')} (Male)
                        </option>
                      ))
                    ) : (
                      <option value="" className="bg-[#181822] text-neutral-200">Natural Male Voice</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Mute / Unmute Voice Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-1.5 rounded-full border transition-colors ${
                  voiceEnabled 
                    ? 'border-violet-500/40 text-violet-300 bg-violet-500/15' 
                    : 'border-white/10 text-neutral-400 hover:text-white'
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
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="bg-rose-500/15 border-b border-rose-500/30 px-3.5 py-2 flex items-center justify-between text-xs font-mono text-rose-300">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="leading-tight text-[11px]">{errorNotice}</span>
              </div>
              <button onClick={() => setErrorNotice(null)} className="p-0.5 hover:opacity-80">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Voice Wave Visualizer when Speaking or Listening */}
          {(isSpeaking || isListening) && (
            <div className="bg-violet-500/15 border-b border-violet-500/30 px-3.5 py-1.5 flex items-center justify-between text-xs font-mono text-violet-300">
              <div className="flex items-center gap-2">
                <Radio className="w-3 h-3 animate-pulse" />
                <span className="text-[11px]">{isListening ? 'Listening to voice...' : 'Speaking aloud...'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-2.5 bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-4 bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-3.5 bg-violet-400 animate-bounce" style={{ animationDelay: '450ms' }} />
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="ml-2 px-1.5 py-0.5 rounded bg-violet-500 text-white text-[10px] flex items-center gap-1 hover:opacity-90"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" /> Stop
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Prompt Pills */}
          <div className="p-2.5 border-b border-white/8 bg-white/[0.02] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono">
            <button
              onClick={() => sendMessage("What is Ajay's tech stack and background?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:border-violet-500 transition-colors"
            >
              ⚡ Tech Stack
            </button>
            <button
              onClick={() => sendMessage("Tell me about the ElderNest project.")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:border-violet-500 transition-colors"
            >
              🏆 ElderNest
            </button>
            <button
              onClick={() => sendMessage("What did Ajay do at BrikUp?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:border-violet-500 transition-colors"
            >
              💼 BrikUp
            </button>
            <button
              onClick={() => sendMessage("Is Ajay available for hiring or freelance projects?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:border-violet-500 transition-colors"
            >
              🤝 Hire
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-mono">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="flex flex-col gap-1 max-w-[84%]">
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-white/[0.07] text-neutral-200 rounded-bl-none border border-white/10'
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
                            ? 'bg-violet-600 text-white border-violet-500'
                            : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:border-violet-500 border-white/10'
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
                  <div className="w-6 h-6 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono pl-8 py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-white/[0.02]">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              {/* Mic Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-full border transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-500 animate-pulse shadow-md'
                      : 'bg-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.1] border-white/10'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak into microphone'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening to voice...' : 'Ask about stack, projects, or voice chat...'}
                disabled={isLoading}
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition-colors"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 shadow-md"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
