import { CalendarClock, ArrowRight } from "lucide-react";
import type { Deadline } from "../types";

interface Props {
  deadlines: Deadline[];
}

export default function DeadlineStrip({ deadlines }: Props) {
  if (deadlines.length === 0) {
    return (
      <div className="px-4 py-3">
        <p className="text-sm text-slate-400">No upcoming deadlines for your selection.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 px-4 mb-2">
        Next deadlines
      </h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
        {deadlines.map((d) => (
          <div
            key={d.id}
            className="flex-shrink-0 w-44 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-indigo-600" />
              </div>
              <span
                className={`text-xs font-bold ${
                  d.daysLeft <= 7 ? "text-rose-600" : "text-amber-600"
                }`}
              >
                {d.daysLeft}d left
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 leading-tight">
              {d.title}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {d.date}
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
