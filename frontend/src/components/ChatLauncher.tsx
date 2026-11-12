import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Bot, Maximize2, Minimize2 } from "lucide-react";
import type { AnswerCardData } from "../types";
import ChatBox from "./ChatBox";

interface Props {
  onAsk: (question: string) => Promise<AnswerCardData>;
  onSource: (factId: string, notice: string, page: number) => void;
  initialQuestion?: string | null;
  initialNonce?: number;
}

export default function ChatLauncher({
  onAsk,
  onSource,
  initialQuestion,
  initialNonce,
}: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Hide the label once the chat has been opened at least once
  const [everOpened, setEverOpened] = useState(false);
  // Ref forwarded into ChatBox so we can focus the input when the panel opens
  const inputFocusRef = useRef<HTMLInputElement | null>(null);

  const openChat = () => {
    setOpen(true);
    setEverOpened(true);
    // Small delay so the panel is visible before we request focus
    setTimeout(() => inputFocusRef.current?.focus(), 120);
  };

  const toggle = () => {
    if (open) {
      setOpen(false);
    } else {
      openChat();
    }
  };

  // If a pending question arrives from IntentTiles, open the chat automatically
  useEffect(() => {
    if (initialQuestion && initialNonce) {
      openChat();
    }
  }, [initialNonce]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // ── Size classes ────────────────────────────────────────────────────
  // Desktop: normal = 440 px / 70vh (max 680px) | expanded = 720 px / 85vh
  // Mobile (<768px): full screen sheet
  const panelSizeClasses = expanded
    ? // expanded desktop, full-screen mobile
      [
        "md:w-[720px] md:h-[min(85vh,900px)]",
        "max-md:inset-0 max-md:w-full max-md:h-full max-md:bottom-0 max-md:right-0 max-md:rounded-none",
      ].join(" ")
    : // normal desktop, full-screen mobile
      [
        "md:w-[440px] md:h-[min(70vh,680px)]",
        "max-md:inset-0 max-md:w-full max-md:h-full max-md:bottom-0 max-md:right-0 max-md:rounded-none",
      ].join(" ");

  return (
    <>
      {/* ── Floating panel (always mounted, hidden when closed) ───────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ask Pramaan chat"
        // Keep it mounted so chat history is preserved; only visually hidden
        aria-hidden={!open}
        className={[
          // base position – desktop anchored bottom-right above button
          "fixed z-40",
          "md:bottom-[5.5rem] md:right-6",
          // size (responsive)
          panelSizeClasses,
          // card chrome
          "flex flex-col",
          "rounded-2xl border border-slate-200 dark:border-night-border",
          "bg-white dark:bg-night-card",
          "shadow-[0_8px_40px_rgba(15,42,74,0.18)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
          "overflow-hidden",
          // open / closed — slide-up + fade
          open
            ? "opacity-100 translate-y-0 pointer-events-auto animate-chat-in"
            : "opacity-0 translate-y-5 pointer-events-none",
          "transition-[opacity,transform] duration-200 ease-out",
        ].join(" ")}
      >
        {/* ── Panel header ─────────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-slate-100 dark:border-night-border px-4 py-3 sm:px-5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-sky-500 dark:text-sky-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-night-text leading-tight">
              Ask Pramaan
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-night-muted leading-tight">
              Verified answers from official notices
            </p>
          </div>

          {/* Expand / collapse — desktop only */}
          <button
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? "Collapse chat" : "Expand chat"}
            className="hidden md:flex rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:text-night-muted dark:hover:text-night-text hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
          >
            {expanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:text-night-muted dark:hover:text-night-text hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Chat content — flex-1 so input sticks to bottom ───────── */}
        {/*
          On mobile the browser shrinks the viewport when the keyboard appears.
          We use pb-safe to push the input above the home indicator, and the
          flex layout naturally keeps the input at the bottom of the visible area.
        */}
        <div className="min-h-0 flex-1 p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <ChatBox
            onAsk={onAsk}
            onSource={onSource}
            initialQuestion={initialQuestion}
            initialNonce={initialNonce}
            focusRef={inputFocusRef}
          />
        </div>
      </div>

      {/* ── Launcher button + label ───────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
        {/* "Have a question?" label — hidden after first open */}
        {!everOpened && (
          <span
            aria-hidden="true"
            className="whitespace-nowrap rounded-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border px-3 py-1 text-xs font-semibold text-slate-600 dark:text-night-text shadow-card animate-fade-in"
          >
            Have a question?
          </span>
        )}

        {/* Pulse ring */}
        {!everOpened && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-[60px] w-[60px] rounded-full bg-sky-400/30 chat-pulse-ring"
          />
        )}

        {/* The button */}
        <button
          onClick={toggle}
          aria-label={open ? "Close chat" : "Open chat"}
          aria-expanded={open}
          className="relative z-10 h-[60px] w-[60px] flex-shrink-0 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
}

