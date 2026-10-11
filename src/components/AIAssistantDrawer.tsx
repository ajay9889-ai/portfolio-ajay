'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX, Loader2, Radio 
} from 'lucide-react';

interface ChatMessage {
  sender: 'assistant' | 'user';
  text: string;
}

export function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Hello! I am Ajay's AI Voice & Chat Assistant powered by Gemini. You can chat with me or speak directly using voice chat to learn about Ajay's technical stack, projects, internship at BrikUp, or hire availability.",
    },
  ]);

  // Voice Chat States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Find best natural Male Voice
  const getMaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Preference list for top-quality natural male English voices
    const maleVoiceNames = [
      'guy', 'david', 'mark', 'george', 'daniel', 'alex', 'oliver', 'rishi', 'male'
    ];

    // 1. Search for English male voices by name keyword
    for (const name of maleVoiceNames) {
      const match = voices.find(
        (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes(name)
      );
      if (match) return match;
    }

    // 2. Fallback to any English voice
    const enVoice = voices.find((v) => v.lang.startsWith('en'));
    return enVoice || voices[0] || null;
  };

  // Speak AI response with Male Voice
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voice = getMaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = 0.95; // Confident, deep masculine pitch
    utterance.rate = 1.0;   // Natural conversational cadence

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech synthesis
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Start / Stop Microphone Listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          sendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Send message to Gemini /api/chat
  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    stopSpeaking();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: updatedMessages,
        }),
      });

      if (!res.ok) {
        throw new Error('API response failed');
      }

      const data = await res.json();
      const reply = data.reply || "I'm Ajay's portfolio AI. How can I assist you with Ajay's work today?";

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
      speakText(reply);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      const fallback = "Ajay A is a full-stack developer in Bengaluru specializing in React, Next.js, and scalable APIs. You can reach him directly at ajayhasrb123@gmail.com!";
      setMessages((prev) => [...prev, { sender: 'assistant', text: fallback }]);
      speakText(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 sm:right-28 z-40 px-3.5 py-2 rounded-full border border-line bg-bg/90 backdrop-blur-xl text-xs font-mono text-muted hover:text-ink shadow-md flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        title="Ask Ajay's AI Assistant"
      >
        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span className="hidden sm:inline">Ask AI & Voice</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-bg border-l border-line h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-line flex items-center justify-between bg-bg/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                  {isSpeaking && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-ink">Ajay's AI Assistant</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-accent/10 text-accent border border-accent/20">
                      Gemini Voice
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted block">
                    {isSpeaking ? 'Speaking in AI male voice...' : isListening ? 'Listening to your voice...' : 'Online • Ask anything'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Voice Audio Toggle */}
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setVoiceEnabled(!voiceEnabled);
                  }}
                  className={`p-1.5 rounded-full border transition-colors ${
                    voiceEnabled 
                      ? 'border-accent/30 text-accent bg-accent/10' 
                      : 'border-line text-muted hover:text-ink'
                  }`}
                  title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close Drawer */}
                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsOpen(false);
                  }}
                  className="text-muted hover:text-ink p-1.5 rounded-full hover:bg-line/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voice Wave Visualizer Banner when Speaking or Listening */}
            {(isSpeaking || isListening) && (
              <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center justify-between text-xs font-mono text-accent">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>{isListening ? 'Listening... Speak now' : 'AI speaking...'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-5 bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-4 bg-accent animate-bounce" style={{ animationDelay: '450ms' }} />
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="ml-2 text-[10px] underline hover:opacity-80"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Prompt Suggestions */}
            <div className="p-3 border-b border-line bg-line/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono">
              <button
                onClick={() => handleQuickPrompt("What is Ajay's background & stack?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-bg border border-line text-muted hover:text-accent hover:border-accent transition-colors"
              >
                ⚡ Ajay's Stack
              </button>
              <button
                onClick={() => handleQuickPrompt("Tell me about the ElderNest Hackathon project.")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-bg border border-line text-muted hover:text-accent hover:border-accent transition-colors"
              >
                🏆 ElderNest (1st Place)
              </button>
              <button
                onClick={() => handleQuickPrompt("What did Ajay do at BrikUp?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-bg border border-line text-muted hover:text-accent hover:border-accent transition-colors"
              >
                💼 BrikUp Internship
              </button>
              <button
                onClick={() => handleQuickPrompt("Is Ajay available for hiring or freelance projects?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-bg border border-line text-muted hover:text-accent hover:border-accent transition-colors"
              >
                🤝 Hire Availability
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-accent text-white rounded-br-none shadow-sm'
                        : 'bg-line/40 text-ink rounded-bl-none border border-line/60'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-ink/10 text-ink flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-muted text-xs font-mono pl-8">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  <span>Thinking with Gemini...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Voice Mic */}
            <div className="p-3 border-t border-line bg-bg">
              <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                {/* Voice Mic Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2.5 rounded-full border transition-all ${
                      isListening
                        ? 'bg-red-500 text-white border-red-500 animate-pulse shadow-md'
                        : 'bg-line/30 text-muted hover:text-ink hover:bg-line/50 border-line'
                    }`}
                    title={isListening ? 'Stop listening' : 'Speak to AI'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? 'Listening to voice...' : 'Type or use mic to talk...'}
                  disabled={isLoading}
                  className="flex-1 bg-line/20 border border-line rounded-full px-4 py-2.5 text-xs text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
                />

                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 rounded-full bg-accent text-white hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 shadow-sm"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
