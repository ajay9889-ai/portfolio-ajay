'use client';
/**
 * useAssistant.ts
 * Master state machine for the AI widget.
 * Single source of truth for: messages, UI state, voice, settings, lead draft, contact count.
 *
 * State machine:
 *   idle → listening → thinking → speaking → idle
 *   any state → error (with recovery)
 *   thinking → interrupted (user barge-in)
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { executeSiteAction, isActionEvent, type ActionEvent, type ActionName } from '@/lib/siteActions';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AssistantMode = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error' | 'interrupted';
export type ActiveView = 'voice' | 'chat';
export type WidgetState = 'collapsed' | 'open' | 'pill';
export type AvailabilityStatus = 'available' | 'busy' | 'away';

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  streaming?: boolean;
  vote?: 'up' | 'down' | null;
  actionName?: ActionName;
}

export interface LeadDraft {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  purpose?: 'hiring' | 'freelance' | 'collaboration' | 'other';
  emailRequested?: boolean;
  step?: 'idle' | 'awaiting_message' | 'awaiting_details' | 'confirm' | 'sent';
}

export interface AssistantSettings {
  autoSpeak: boolean;
  voiceEnabled: boolean;
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  captions: boolean;
  pushToTalk: boolean;
  autoListen: boolean;
}

export interface AssistantState {
  mode: AssistantMode;
  widgetState: WidgetState;
  activeView: ActiveView;
  messages: Message[];
  settings: AssistantSettings;
  leadDraft: LeadDraft;
  contactsSentThisSession: number;
  showLeadForm: boolean;
  errorMessage: string | null;
  sessionId: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AssistantSettings = {
  autoSpeak: true,
  voiceEnabled: true,
  lang: 'en-IN',
  rate: 1.0,
  pitch: 0.95,
  volume: 1.0,
  captions: true,
  pushToTalk: false,
  autoListen: false,
};

const WELCOME_MESSAGE: Message = {
  id: 'welcome-0',
  sender: 'assistant',
  text: "Hi! I'm Ajay's portfolio assistant. Ask me about his projects, skills, or how to contact him. You can also speak to me using the Voice tab!",
};

function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadSettings(): AssistantSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem('assistant-settings');
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function persistSettings(s: AssistantSettings): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('assistant-settings', JSON.stringify(s)); } catch {}
}

function loadSavedMessages(): Message[] {
  if (typeof window === 'undefined') return [WELCOME_MESSAGE];
  try {
    const raw = localStorage.getItem('assistant-messages');
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((m: any) => ({ ...m, streaming: false }));
    }
    return [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function persistSavedMessages(msgs: Message[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = msgs.slice(-40).map((m) => ({ ...m, streaming: false }));
    localStorage.setItem('assistant-messages', JSON.stringify(clean));
  } catch {}
}

function loadSavedLeadDraft(): LeadDraft {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('assistant-lead-draft');
    if (!raw) return {};
    return JSON.parse(raw) as LeadDraft;
  } catch {
    return {};
  }
}

function persistSavedLeadDraft(draft: LeadDraft): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('assistant-lead-draft', JSON.stringify(draft));
  } catch {}
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'MINIMIZE' }
  | { type: 'RESTORE' }
  | { type: 'SET_VIEW'; view: ActiveView }
  | { type: 'SET_MODE'; mode: AssistantMode }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'UPDATE_LAST_ASSISTANT'; text: string; streaming?: boolean; actionName?: ActionName }
  | { type: 'FINALIZE_STREAMING' }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_SETTINGS'; patch: Partial<AssistantSettings> }
  | { type: 'UPDATE_LEAD_DRAFT'; patch: Partial<LeadDraft> }
  | { type: 'CLEAR_LEAD_DRAFT' }
  | { type: 'SHOW_LEAD_FORM' }
  | { type: 'HIDE_LEAD_FORM' }
  | { type: 'INCREMENT_CONTACT_COUNT' }
  | { type: 'SET_VOTE'; messageId: string; vote: 'up' | 'down' | null }
  | { type: 'CLEAR_MESSAGES' };

function assistantReducer(state: AssistantState, action: Action): AssistantState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, widgetState: 'open' };
    case 'CLOSE':
      return { ...state, widgetState: 'collapsed', showLeadForm: false };
    case 'MINIMIZE':
      return { ...state, widgetState: 'pill' };
    case 'RESTORE':
      return { ...state, widgetState: 'open' };

    case 'SET_VIEW':
      return { ...state, activeView: action.view };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'ADD_MESSAGE': {
      const nextMsgs = [...state.messages, action.message];
      persistSavedMessages(nextMsgs);
      return { ...state, messages: nextMsgs };
    }

    case 'UPDATE_LAST_ASSISTANT': {
      const msgs = [...state.messages];
      const lastIdx = msgs.length - 1;
      if (lastIdx >= 0 && msgs[lastIdx].sender === 'assistant') {
        msgs[lastIdx] = {
          ...msgs[lastIdx],
          text: action.text,
          streaming: action.streaming ?? false,
          actionName: action.actionName !== undefined ? action.actionName : msgs[lastIdx].actionName,
        };
      }
      persistSavedMessages(msgs);
      return { ...state, messages: msgs };
    }

    case 'FINALIZE_STREAMING': {
      const msgs = state.messages.map((m) =>
        m.streaming ? { ...m, streaming: false } : m,
      );
      persistSavedMessages(msgs);
      return { ...state, messages: msgs };
    }

    case 'SET_ERROR':
      return { ...state, mode: 'error', errorMessage: action.message };

    case 'CLEAR_ERROR':
      return { ...state, mode: 'idle', errorMessage: null };

    case 'UPDATE_SETTINGS': {
      const next = { ...state.settings, ...action.patch };
      persistSettings(next);
      return { ...state, settings: next };
    }

    case 'UPDATE_LEAD_DRAFT': {
      const nextDraft = { ...state.leadDraft, ...action.patch };
      persistSavedLeadDraft(nextDraft);
      return { ...state, leadDraft: nextDraft };
    }

    case 'CLEAR_LEAD_DRAFT': {
      persistSavedLeadDraft({});
      return { ...state, leadDraft: {} };
    }

    case 'SHOW_LEAD_FORM':
      return { ...state, showLeadForm: true };

    case 'HIDE_LEAD_FORM':
      return { ...state, showLeadForm: false };

    case 'INCREMENT_CONTACT_COUNT':
      return { ...state, contactsSentThisSession: state.contactsSentThisSession + 1 };

    case 'SET_VOTE': {
      const msgs = state.messages.map((m) =>
        m.id === action.messageId ? { ...m, vote: action.vote } : m,
      );
      persistSavedMessages(msgs);
      return { ...state, messages: msgs };
    }

    case 'CLEAR_MESSAGES': {
      persistSavedMessages([WELCOME_MESSAGE]);
      return { ...state, messages: [WELCOME_MESSAGE] };
    }

    default:
      return state;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────

function buildInitialState(): AssistantState {
  return {
    mode: 'idle',
    widgetState: 'collapsed',
    activeView: 'chat',
    messages: loadSavedMessages(),
    settings: loadSettings(),
    leadDraft: loadSavedLeadDraft(),
    contactsSentThisSession: 0,
    showLeadForm: false,
    errorMessage: null,
    sessionId: generateSessionId(),
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseAssistantReturn {
  // State
  state: AssistantState;
  widgetState: WidgetState;
  mode: AssistantMode;
  activeView: ActiveView;
  messages: Message[];
  settings: AssistantSettings;
  leadDraft: LeadDraft;
  contactsSentThisSession: number;
  isLeadFormVisible: boolean;
  errorMessage: string | null;
  sessionId: string;

  // Widget control
  open: () => void;
  openWidget: () => void;
  close: () => void;
  closeWidget: () => void;
  minimize: () => void;
  minimizeWidget: () => void;
  restore: () => void;
  toggleWidget: () => void;
  setView: (v: ActiveView) => void;
  setActiveView: (v: ActiveView) => void;

  // Messaging
  send: (text: string) => void;
  sendMessage: (text: string) => void;
  interrupt: () => void;
  speak: (text: string, force?: boolean) => void;
  clearMessages: () => void;
  setVote: (messageId: string, vote: 'up' | 'down' | null) => void;
  sendFeedback: (messageId: string, vote: 'up' | 'down') => void;

  // Settings & lead capture
  updateSettings: (patch: Partial<AssistantSettings>) => void;
  resetSettings: () => void;
  updateLeadDraft: (patch: Partial<LeadDraft>) => void;
  clearLeadDraft: () => void;
  showLeadForm: () => void;
  hideLeadForm: () => void;
  incrementContactCount: () => void;
  submitLeadForm: (overrideDraft?: Partial<LeadDraft>) => Promise<boolean>;

  // Voice (pass-through from sub-hooks)
  isListening: boolean;
  interim: string;
  transcript: string;
  interimTranscript: string;
  isSpeaking: boolean;
  isTTSSupported: boolean;
  isSupported: boolean;
  isSpeechRecognitionSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  currentVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (v: SpeechSynthesisVoice) => void;
  setVoice: (v: SpeechSynthesisVoice) => void;
  amplitude: number[];
  startListening: () => void;
  stopListening: () => void;
  testVoice: () => void;
  speakingMessageId: string | null;
  isEmailMode: boolean;
  setEmailMode: (v: boolean) => void;
}

export function useAssistant(): UseAssistantReturn {
  const [state, dispatch] = useReducer(assistantReducer, undefined, buildInitialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Sub-hooks ──
  const tts = useSpeechSynthesis();

  const handleFinalTranscript = useCallback(
    (text: string) => {
      // voice barge-in: cancel current speech before sending
      if (tts.isSpeaking) tts.cancel();
      dispatch({ type: 'SET_MODE', mode: 'thinking' });
      sendMessage(text); // eslint-disable-line @typescript-eslint/no-use-before-define
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tts],
  );

  const handleRecognitionError = useCallback((type: string, message: string) => {
    if (type === 'aborted') return;
    dispatch({ type: 'SET_MODE', mode: 'idle' });
    if (type !== 'no-speech') {
      dispatch({ type: 'SET_ERROR', message });
      setTimeout(() => dispatch({ type: 'CLEAR_ERROR' }), 6000);
    }
  }, []);

  const stt = useSpeechRecognition({
    onFinalTranscript: handleFinalTranscript,
    onError: handleRecognitionError,
  });

  // ── Core send ─────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Abort any in-flight request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text.trim(),
      };

      const placeholderMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: '',
        streaming: true,
      };

      dispatch({ type: 'ADD_MESSAGE', message: userMessage });
      dispatch({ type: 'SET_MODE', mode: 'thinking' });
      dispatch({ type: 'ADD_MESSAGE', message: placeholderMessage });

      // Build history for backend (last 8 pairs)
      const history = state.messages.slice(-16).filter((m) => !m.streaming);

      let accumulated = '';

      try {
        const res = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            history,
            lang: state.settings.lang,
            mode: state.activeView,
            sessionId: state.sessionId,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === '[DONE]') continue;

            try {
              const event = JSON.parse(raw);

              if (event.type === 'token') {
                const tokenVal = event.value ?? event.payload ?? '';
                accumulated += tokenVal;
                dispatch({ type: 'UPDATE_LAST_ASSISTANT', text: accumulated, streaming: true });

              } else if (event.type === 'action') {
                const actionName = (event.name ?? event.payload?.name) as ActionName | undefined;
                const actionArgs = (event.args ?? event.payload?.args ?? {}) as Record<string, unknown>;

                if (actionName === 'send_message_to_ajay') {
                  dispatch({
                    type: 'UPDATE_LEAD_DRAFT',
                    patch: { ...(actionArgs as Partial<LeadDraft>), step: 'confirm' },
                  });
                  dispatch({ type: 'SHOW_LEAD_FORM' });
                  dispatch({
                    type: 'UPDATE_LAST_ASSISTANT',
                    text: accumulated,
                    streaming: true,
                    actionName: 'send_message_to_ajay',
                  });
                } else if (actionName === 'request_contact_message') {
                  dispatch({
                    type: 'UPDATE_LEAD_DRAFT',
                    patch: { step: 'awaiting_message' },
                  });
                  dispatch({ type: 'SHOW_LEAD_FORM' });
                  dispatch({
                    type: 'UPDATE_LAST_ASSISTANT',
                    text: accumulated,
                    streaming: true,
                    actionName: 'request_contact_message',
                  });
                } else if (actionName === 'request_contact_details') {
                  dispatch({
                    type: 'UPDATE_LEAD_DRAFT',
                    patch: { ...(actionArgs as Partial<LeadDraft>), step: 'awaiting_details', emailRequested: true },
                  });
                  dispatch({ type: 'SHOW_LEAD_FORM' });
                  dispatch({
                    type: 'UPDATE_LAST_ASSISTANT',
                    text: accumulated,
                    streaming: true,
                    actionName: 'request_contact_details',
                  });
                } else if (actionName) {
                  executeSiteAction({ name: actionName, args: actionArgs });
                }

              } else if (event.type === 'done') {
                if (!accumulated && (event.reply || event.payload)) {
                  accumulated = event.reply ?? event.payload ?? '';
                  dispatch({ type: 'UPDATE_LAST_ASSISTANT', text: accumulated, streaming: false });
                }
                break;

              } else if (event.type === 'error') {
                throw new Error(event.error ?? event.payload ?? 'Stream error');
              }

            } catch (parseErr) {
              // Non-JSON line — skip
            }
          }
        }

        dispatch({ type: 'FINALIZE_STREAMING' });
        const shouldSpeak = state.settings.autoSpeak && state.activeView === 'voice';
        dispatch({ type: 'SET_MODE', mode: shouldSpeak ? 'speaking' : 'idle' });

        if (shouldSpeak && accumulated) {
          tts.speak(accumulated, {
            rate: state.settings.rate,
            pitch: state.settings.pitch,
            volume: state.settings.volume,
            lang: state.settings.lang,
          }, placeholderMessage.id);
        }

      } catch (err: any) {
        if (err?.name === 'AbortError') {
          dispatch({ type: 'FINALIZE_STREAMING' });
          return;
        }

        // Fallback: use offline KB via regular POST
        try {
          const fallbackRes = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text.trim(), history }),
          });
          const data = await fallbackRes.json();
          const reply = data.reply || "I'm having trouble connecting. Feel free to email Ajay directly at ajayhasrb123@gmail.com!";
          accumulated = reply;
          dispatch({ type: 'UPDATE_LAST_ASSISTANT', text: reply, streaming: false });
          dispatch({ type: 'FINALIZE_STREAMING' });
          dispatch({ type: 'SET_MODE', mode: 'idle' });

          const shouldSpeak = state.settings.autoSpeak && state.activeView === 'voice';
          if (shouldSpeak) {
            tts.speak(reply, {
              rate: state.settings.rate,
              pitch: state.settings.pitch,
              volume: state.settings.volume,
              lang: state.settings.lang,
            });
          }
        } catch {
          const offline = "I can't reach the server right now. You can email Ajay at ajayhasrb123@gmail.com — he's very responsive!";
          dispatch({ type: 'UPDATE_LAST_ASSISTANT', text: offline, streaming: false });
          dispatch({ type: 'FINALIZE_STREAMING' });
          dispatch({ type: 'SET_MODE', mode: 'idle' });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.messages, state.settings, state.activeView, state.sessionId, tts],
  );

  // ── Voice control ─────────────────────────────────────────────────────────

  const startListening = useCallback(() => {
    if (tts.isSpeaking) tts.cancel();
    dispatch({ type: 'SET_MODE', mode: 'listening' });
    stt.start(state.settings.lang);
  }, [tts, stt, state.settings.lang]);

  const stopListening = useCallback(() => {
    stt.stop();
    dispatch({ type: 'SET_MODE', mode: 'idle' });
  }, [stt]);

  const interrupt = useCallback(() => {
    tts.cancel();
    abortControllerRef.current?.abort();
    dispatch({ type: 'SET_MODE', mode: 'interrupted' });
    setTimeout(() => dispatch({ type: 'SET_MODE', mode: 'idle' }), 300);
  }, [tts]);

  // ── Keyboard shortcut (Ctrl/Cmd+K) ────────────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: state.widgetState === 'open' ? 'CLOSE' : 'OPEN' });
      }
      if (e.key === 'Escape' && state.widgetState === 'open') {
        dispatch({ type: 'CLOSE' });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.widgetState]);

  // ── Page visibility: pause listening when tab hidden ──────────────────────

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden && stt.isListening) {
        stt.stop();
        dispatch({ type: 'SET_MODE', mode: 'idle' });
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [stt]);

  // ── TTS mode sync ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (tts.isSpeaking) {
      dispatch({ type: 'SET_MODE', mode: 'speaking' });
    } else if (state.mode === 'speaking') {
      dispatch({ type: 'SET_MODE', mode: 'idle' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tts.isSpeaking]);

  // ── Auto-mute voice when transitioning to chat mode ──────────────────────
  const ttsRef = useRef(tts);
  ttsRef.current = tts;
  const sttRef = useRef(stt);
  sttRef.current = stt;

  const prevViewRef = useRef(state.activeView);
  useEffect(() => {
    if (prevViewRef.current === 'voice' && state.activeView === 'chat') {
      ttsRef.current.cancel();
      sttRef.current.stop();
    }
    prevViewRef.current = state.activeView;
  }, [state.activeView]);

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ── Direct Lead Submit (Nodemailer API) ───────────────────────────────────

  const submitLeadForm = useCallback(
    async (overrideDraft?: Partial<LeadDraft>): Promise<boolean> => {
      const activeDraft = { ...state.leadDraft, ...overrideDraft };
      const name = activeDraft.name?.trim() || 'Visitor';
      const email = activeDraft.email?.trim() || '';
      const message = activeDraft.message?.trim() || '';

      if (!email || !message) {
        return false;
      }

      dispatch({ type: 'SET_MODE', mode: 'thinking' });

      const endpoints = [
        '/api/contact',
        process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/contact` : null,
        'http://localhost:5001/api/v1/contact',
      ].filter(Boolean) as string[];

      let success = false;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Session-Id': state.sessionId,
            },
            body: JSON.stringify({
              name,
              email,
              message,
              company: activeDraft.company?.trim() || undefined,
              purpose: activeDraft.purpose || 'hiring',
              sessionId: state.sessionId,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.ok || data.success) {
              success = true;
              break;
            }
          }
        } catch {
          continue;
        }
      }

      if (success) {
        dispatch({ type: 'INCREMENT_CONTACT_COUNT' });
        dispatch({ type: 'UPDATE_LEAD_DRAFT', patch: { step: 'sent' } });
        const successMsg: Message = {
          id: `assistant-sent-${Date.now()}`,
          sender: 'assistant',
          text: `Done! Ajay has received your message and will reply to ${email} within 24 hours.`,
        };
        dispatch({ type: 'ADD_MESSAGE', message: successMsg });
        const shouldSpeak = state.settings.autoSpeak && state.activeView === 'voice';
        dispatch({ type: 'SET_MODE', mode: shouldSpeak ? 'speaking' : 'idle' });
        if (shouldSpeak) {
          tts.speak(successMsg.text, {
            rate: state.settings.rate,
            pitch: state.settings.pitch,
            volume: state.settings.volume,
            lang: state.settings.lang,
          });
        }
        return true;
      } else {
        dispatch({ type: 'SET_MODE', mode: 'idle' });
        return false;
      }
    },
    [state.leadDraft, state.sessionId, state.settings, state.activeView, tts]
  );

  // ── Exposed API ───────────────────────────────────────────────────────────

  const exposedApi = useMemo(
    () => ({
      state,
      widgetState: state.widgetState,
      mode: state.mode,
      activeView: state.activeView,
      messages: state.messages,
      settings: state.settings,
      leadDraft: state.leadDraft,
      contactsSentThisSession: state.contactsSentThisSession,
      isLeadFormVisible: state.showLeadForm,
      errorMessage: state.errorMessage,
      sessionId: state.sessionId,

      // Widget control
      open: () => dispatch({ type: 'OPEN' }),
      openWidget: () => dispatch({ type: 'OPEN' }),
      close: () => {
        tts.cancel();
        stt.stop();
        dispatch({ type: 'CLOSE' });
      },
      closeWidget: () => {
        tts.cancel();
        stt.stop();
        dispatch({ type: 'CLOSE' });
      },
      minimize: () => dispatch({ type: 'MINIMIZE' }),
      minimizeWidget: () => dispatch({ type: 'MINIMIZE' }),
      restore: () => dispatch({ type: 'RESTORE' }),
      toggleWidget: () => dispatch({ type: state.widgetState === 'open' ? 'CLOSE' : 'OPEN' }),
      setView: (v: ActiveView) => {
        if (v === 'chat') {
          tts.cancel();
          stt.stop();
        }
        dispatch({ type: 'SET_VIEW', view: v });
      },
      setActiveView: (v: ActiveView) => {
        if (v === 'chat') {
          tts.cancel();
          stt.stop();
        }
        dispatch({ type: 'SET_VIEW', view: v });
      },

      // Chat & messaging
      send: sendMessage,
      sendMessage,
      interrupt,
      speak: (text: string, force = false) => {
        if (state.activeView === 'voice' || force) {
          tts.speak(text, state.settings);
        }
      },
      clearMessages: () => dispatch({ type: 'CLEAR_MESSAGES' }),
      setVote: (messageId: string, vote: 'up' | 'down' | null) =>
        dispatch({ type: 'SET_VOTE', messageId, vote }),
      sendFeedback: (messageId: string, vote: 'up' | 'down') => {
        dispatch({ type: 'SET_VOTE', messageId, vote });
        fetch('/api/v1/chat/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId, vote }),
        }).catch(() => {});
      },

      // Settings & lead capture
      updateSettings: (patch: Partial<AssistantSettings>) => {
        dispatch({ type: 'UPDATE_SETTINGS', patch });
        persistSettings({ ...state.settings, ...patch });
      },
      resetSettings: () => {
        dispatch({ type: 'UPDATE_SETTINGS', patch: DEFAULT_SETTINGS });
        persistSettings(DEFAULT_SETTINGS);
      },
      updateLeadDraft: (patch: Partial<LeadDraft>) =>
        dispatch({ type: 'UPDATE_LEAD_DRAFT', patch }),
      clearLeadDraft: () => dispatch({ type: 'CLEAR_LEAD_DRAFT' }),
      showLeadForm: () => dispatch({ type: 'SHOW_LEAD_FORM' }),
      hideLeadForm: () => dispatch({ type: 'HIDE_LEAD_FORM' }),
      incrementContactCount: () => dispatch({ type: 'INCREMENT_CONTACT_COUNT' }),
      submitLeadForm,

      // Voice recognition & synthesis pass-through
      isListening: stt.isListening,
      interim: stt.interim,
      transcript: stt.interim || '',
      interimTranscript: stt.interim,
      isSpeaking: tts.isSpeaking,
      isTTSSupported: tts.isTTSSupported,
      isSupported: stt.isSupported,
      isSpeechRecognitionSupported: stt.isSupported,
      voices: tts.voices,
      selectedVoice: tts.selectedVoice,
      currentVoice: tts.selectedVoice,
      setSelectedVoice: tts.setSelectedVoice,
      setVoice: tts.setSelectedVoice,
      amplitude: tts.amplitude,
      startListening,
      stopListening,
      testVoice: () =>
        tts.testVoice({
          rate: state.settings.rate,
          pitch: state.settings.pitch,
          volume: state.settings.volume,
          lang: state.settings.lang,
        }),
      speakingMessageId: tts.speakingMessageId,
      isEmailMode: stt.isEmailMode,
      setEmailMode: stt.setEmailMode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, stt, tts, sendMessage, interrupt, startListening, stopListening],
  );

  return exposedApi;
}
