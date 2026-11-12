import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
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
}

const SUGGESTIONS = ["Late fee?", "Exam form last date?", "Re-exam date?", "Hostel fee?", "Lab exam time?"];

export default function ChatBox({ onAsk, onSource, initialQuestion, initialNonce }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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

    try {
      const answer = await onAsk(question);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, answer, loading: false } : m))
      );
    } catch {
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

  return (
    <div className="flex flex-col">
      {/* Messages */}
      {messages.length > 0 && (
        <div ref={scrollRef} className="space-y-4 px-4 mb-4 max-h-[400px] overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="space-y-2 animate-fade-in">
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white text-sm font-medium px-3.5 py-2.5 rounded-2xl rounded-br-md max-w-[80%]">
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
                  <AnswerCard
                    data={{
                      state: "unavailable",
                      text: "",
                      appliesTo: "",
                      validUntil: "",
                      sources: [],
                    }}
                    loading
                    onSource={onSource}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">Try asking</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleAsk(s)}
                className="bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-sm font-medium px-3.5 py-2 rounded-xl transition-colors active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 sticky bottom-16 md:bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fees, exams, timetable..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
