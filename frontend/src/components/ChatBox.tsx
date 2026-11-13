import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import type { AnswerCardData } from "../types";
import AnswerCard from "./AnswerCard";

interface Message {
  id: string;
  question: string;
  answer?: AnswerCardData;
  loading?: boolean;
}

interface Props {
  onAsk: (question: string) => Promise<AnswerCardData>;
  onSource: (factId: string, notice: string, page: number) => void;
  initialQuestion?: string | null;
  initialNonce?: number;
  focusRef?: React.RefObject<HTMLInputElement | null>;
}

const SUGGESTIONS = [
  { label: "What's the late fee?", question: "What's the late fee?" },
  { label: "Exam form kab tak hai?", question: "When's the exam form due?" },
  { label: "Re-exam kab hai?", question: "Re-exam date?" },
  { label: "Library fee?", question: "Library fee?" },
];

const MIN_TYPING_MS = 600;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="Typing…"
      className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-100 dark:border-night-border bg-white dark:bg-night-card shadow-card px-4 py-3 animate-answer-in"
    >
      <span className="text-xs font-medium text-slate-500 dark:text-night-muted">typing</span>
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-night-muted"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    </div>
  );
}

export default function ChatBox({ onAsk, onSource, initialQuestion, initialNonce, focusRef }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Wire external focusRef to our input
  useEffect(() => {
    if (focusRef) {
      (focusRef as React.MutableRefObject<HTMLInputElement | null>).current = inputRef.current;
    }
  });

  useEffect(() => {
    if (initialQuestion && initialNonce) {
      handleAsk(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNonce]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async (question: string) => {
    const msgId = `m${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: msgId, question, loading: true },
    ]);
    setInput("");

    const startedAt = Date.now();
    const finishTyping = async () => {
      const remaining = MIN_TYPING_MS - (Date.now() - startedAt);
      if (remaining > 0) await wait(remaining);
    };

    try {
      const answer = await onAsk(question);
      await finishTyping();
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, answer, loading: false } : m))
      );
    } catch {
      await finishTyping();
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          loading: false,
          answer: {
            state: "unavailable",
            text: "Something went wrong.",
            appliesTo: "",
            validUntil: "",
            sources: [],
          },
        }))
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) handleAsk(input.trim());
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between mb-2 flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-night-muted">
            Chat history
          </span>
          <button
            onClick={clearChat}
            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline"
          >
            Clear chat
          </button>
        </div>
      )}
      {messages.length > 0 && (
        <div ref={scrollRef} className="space-y-4 mb-4 flex-1 min-h-0 overflow-y-auto thin-scrollbar pr-1">
          {messages.map((m) => (
            <div key={m.id} className="space-y-2 animate-fade-in">
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="bg-navy-600 text-white text-[13px] font-medium px-3.5 py-2 rounded-xl rounded-br-sm max-w-[75%]">
                  {m.question}
                </div>
              </div>
              {/* Answer card */}
              {m.answer && (
                <div className="flex justify-start">
                  <AnswerCard data={m.answer} onSource={onSource} />
                </div>
              )}
              {m.loading && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div className="flex-1 min-h-0 overflow-y-auto thin-scrollbar pr-1 mb-4">
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-night-border bg-slate-50/70 dark:bg-white/5 p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center mb-3">
              <Bot className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-night-text">
              Ask about fees, exams or deadlines
            </p>
            <p className="text-xs text-slate-500 dark:text-night-muted mt-1">
              Get answers verified against official notices.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleAsk(s.question)}
                  className="bg-white dark:bg-night-card border border-slate-200 dark:border-night-border hover:border-sky-300 dark:hover:border-sky-500 text-slate-700 dark:text-night-text hover:text-sky-600 dark:hover:text-sky-300 text-[13px] font-medium px-3.5 py-2 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 pt-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              enterKeyHint="send"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={(e) => e.target.scrollIntoView({ block: "nearest", behavior: "smooth" })}
              placeholder="Ask about fees, exams, timetable..."
              className="w-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-xl py-3 pl-4 pr-4 text-[15px] text-slate-700 dark:text-night-text placeholder:text-slate-500 dark:placeholder:text-night-muted focus:outline-none focus:border-sky-300 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="gradient-primary w-12 h-12 flex-shrink-0 bg-navy-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white disabled:text-slate-600 dark:disabled:text-slate-300 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 hover:brightness-110 active:scale-95 disabled:hover:translate-y-0 disabled:hover:brightness-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
