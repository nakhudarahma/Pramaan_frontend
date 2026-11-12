import { HelpCircle, PenSquare } from "lucide-react";
import type { UnansweredItem } from "../types";

interface Props {
  items: UnansweredItem[];
  onWriteFact: (question: string) => void;
}

export default function UnansweredList({ items, onWriteFact }: Props) {
  return (
    <div className="bg-white dark:bg-night-card rounded-2xl border border-slate-200 dark:border-night-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-night-text">
          Unanswered questions this week
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-night-muted py-4 text-center">
          No unanswered questions.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-white/5 rounded-xl p-3.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-slate-700 dark:text-night-text truncate">
                  {item.question}
                </span>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-400/10 px-2 py-0.5 rounded-md whitespace-nowrap">
                  x{item.count}
                </span>
              </div>
              <button
                onClick={() => onWriteFact(item.question)}
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-300 hover:text-sky-700 dark:hover:text-sky-200 bg-white dark:bg-night-card border border-sky-200 dark:border-sky-500/30 hover:bg-sky-50 dark:hover:bg-sky-400/10 px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
              >
                <PenSquare className="w-3 h-3" />
                Write a fact
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
