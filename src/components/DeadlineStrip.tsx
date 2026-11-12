import { CalendarClock, ArrowRight } from "lucide-react";
import type { Deadline } from "../types";

interface Props {
  deadlines: Deadline[];
  loading?: boolean;
}

export default function DeadlineStrip({ deadlines, loading }: Props) {
  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-night-text">Next deadlines</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-full min-w-0 bg-white dark:bg-night-card rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-3 xl:p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
              <div className="skeleton h-4 w-32 rounded mb-2" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (deadlines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-night-border bg-white dark:bg-night-card p-6">
        <p className="text-sm text-slate-500 dark:text-night-muted">No upcoming deadlines for your selection.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CalendarClock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-night-text">
          Next deadlines
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {deadlines.map((d) => (
          <div
            key={d.id}
            className="flex h-full min-w-0 flex-col bg-white dark:bg-night-card rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-3 xl:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-1.5 xl:gap-2 mb-2">
              <div className="w-7 h-7 xl:w-9 xl:h-9 rounded-lg xl:rounded-xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                <CalendarClock className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-sky-500 dark:text-sky-400" />
              </div>
              <span
                className={`text-[11px] xl:text-xs font-bold ${
                  d.daysLeft <= 7 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {d.daysLeft}d left
              </span>
            </div>
            <div className="text-[12px] xl:text-[15px] font-semibold text-slate-900 dark:text-night-text leading-tight line-clamp-2">
              {d.title}
            </div>
            <div className="text-[10px] xl:text-xs text-slate-500 dark:text-night-muted mt-1 flex items-center gap-1">
              {d.date}
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
