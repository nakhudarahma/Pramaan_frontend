import { HelpCircle, PenSquare } from "lucide-react";
import type { UnansweredItem } from "../types";

interface Props {
  items: UnansweredItem[];
  onWriteFact: (question: string) => void;
}

export default function UnansweredList({ items, onWriteFact }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-900">
          Unanswered questions this week
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">
          No unanswered questions.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-slate-700 truncate">
                  {item.question}
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                  x{item.count}
                </span>
              </div>
              <button
                onClick={() => onWriteFact(item.question)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
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
