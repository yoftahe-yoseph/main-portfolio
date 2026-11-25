'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  CHAT_MODEL_LABELS,
  MAX_CHAT_MESSAGE_LENGTH,
  PORTFOLIO_STARTER_PROMPTS,
  type ChatMode,
  type ClientChatMessage,
} from '@/lib/chat-utils';

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ClientChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('balanced');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isStreaming, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed || isStreaming) return;

      if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
        setErrorMessage(`Please keep messages under ${MAX_CHAT_MESSAGE_LENGTH} characters.`);
        return;
      }

      setErrorMessage(null);
      setLastFailedPrompt(null);
      setInput('');

      const historySnapshot = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const userId = createId('user');
      const userMsg: ClientChatMessage = {
        id: userId,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const assistantId = createId('model');
      const assistantPlaceholder: ClientChatMessage = {
        id: assistantId,
        role: 'model',
        content: '',
        createdAt: new Date().toISOString(),
        modelLabel: CHAT_MODEL_LABELS[mode],
      };

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: historySnapshot,
            mode,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let errText = 'Unable to get a response right now. Please try again.';
          try {
            const errJson = (await res.json()) as { error?: string };
            if (errJson?.error) {
              errText = errJson.error;
            }
          } catch {
            // Keep fallback error text
          }
          setMessages((prev) =>
            prev.filter((item) => item.id !== assistantId && item.id !== userId)
          );
          setLastFailedPrompt(trimmed);
          setErrorMessage(errText);
          return;
        }

        const headerModelLabel = res.headers.get('X-Chat-Model-Label') || CHAT_MODEL_LABELS[mode];
        const reader = res.body?.getReader();

        if (!reader) {
          const fullText = await res.text();
          setMessages((prev) =>
            prev.map((item) =>
              item.id === assistantId
                ? { ...item, content: fullText || 'No response returned.', modelLabel: headerModelLabel }
                : item
            )
          );
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const currentText = accumulated;
          setMessages((prev) =>
            prev.map((item) =>
              item.id === assistantId
                ? { ...item, content: currentText, modelLabel: headerModelLabel }
                : item
            )
          );
        }

        accumulated += decoder.decode();
        if (!accumulated.trim()) {
          setMessages((prev) =>
            prev.filter((item) => item.id !== assistantId && item.id !== userId)
          );
          setLastFailedPrompt(trimmed);
          setErrorMessage('The assistant returned an empty response. Please try again.');
        } else {
          setMessages((prev) =>
            prev.map((item) =>
              item.id === assistantId
                ? { ...item, content: accumulated, modelLabel: headerModelLabel }
                : item
            )
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setMessages((prev) =>
          prev.filter((item) => item.id !== assistantId && item.id !== userId)
        );
        setLastFailedPrompt(trimmed);
        setErrorMessage('Network error while contacting the portfolio assistant. Please try again.');
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, mode]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  const handleReset = () => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setErrorMessage(null);
    setLastFailedPrompt(null);
    setIsStreaming(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Yoftahe Yoseph Portfolio Assistant"
            aria-modal="false"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[min(calc(100vw-2rem),420px)] h-[min(calc(100vh-6.5rem),580px)] bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold text-slate-900 tracking-tight truncate">
                    Portfolio Assistant
                  </h2>
                  <p className="text-xs text-slate-500 truncate">
                    Ask about Yoftahe&apos;s projects, stack &amp; experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset conversation"
                    title="Reset conversation"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close portfolio assistant"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Model Speed Selector */}
            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500">Response mode</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  aria-pressed={mode === 'balanced'}
                  onClick={() => setMode('balanced')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === 'balanced'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  <span>Gemini 4 Flash</span>
                </button>
                <button
                  type="button"
                  aria-pressed={mode === 'fast'}
                  onClick={() => setMode('fast')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === 'fast'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3 h-3" aria-hidden="true" />
                  <span>Flash Lite</span>
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#fafafb]"
              data-testid="chatbot-thread"
            >
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Hi! I&apos;m Yoftahe Yoseph&apos;s Portfolio Assistant.
                    </p>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Ask me anything about Yoftahe&apos;s full-stack builds, Mesob Center RBAC internship, healthcare research &amp; QA experience, verified certifications, or how to get in touch.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500">Suggested questions</p>
                    <div className="grid grid-cols-1 gap-2">
                      {PORTFOLIO_STARTER_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void sendMessage(prompt)}
                          disabled={isStreaming}
                          className="text-left text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-700 rounded-xl px-3.5 py-2.5 transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      ) : msg.content ? (
                        <div className="prose prose-sm prose-slate max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-headings:font-display prose-headings:text-slate-900">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-xs text-slate-500 py-0.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" aria-hidden="true" />
                          <span>Thinking…</span>
                        </span>
                      )}
                    </div>
                    {msg.role === 'model' && msg.modelLabel && msg.content && (
                      <span className="mt-1 px-1 text-[11px] text-slate-400">
                        {msg.modelLabel}
                      </span>
                    )}
                  </div>
                ))
              )}

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start justify-between gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                  {lastFailedPrompt && (
                    <button
                      type="button"
                      onClick={() => void sendMessage(lastFailedPrompt)}
                      disabled={isStreaming}
                      className="shrink-0 font-semibold text-rose-700 hover:text-rose-900 underline underline-offset-2"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* Input Composer */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-slate-200 bg-white flex items-end gap-2"
            >
              <label htmlFor="portfolio-chat-input" className="sr-only">
                Ask a question about Yoftahe Yoseph&apos;s portfolio
              </label>
              <textarea
                ref={textareaRef}
                id="portfolio-chat-input"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                maxLength={MAX_CHAT_MESSAGE_LENGTH}
                disabled={isStreaming}
                placeholder="Ask about projects, skills, or experience..."
                className="flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 disabled:bg-slate-50 max-h-28"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                aria-label="Send message"
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors shrink-0"
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Portfolio Assistant' : 'Open Portfolio Assistant'}
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-sm font-medium shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Close Assistant</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            <span>Ask Portfolio AI</span>
          </>
        )}
      </button>
    </div>
  );
}
