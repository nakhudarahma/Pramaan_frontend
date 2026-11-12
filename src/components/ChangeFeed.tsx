import { ArrowRight, FileText, RefreshCw } from "lucide-react";
import type { ChangeItem } from "../types";

interface Props {
  changes: ChangeItem[];
  loading?: boolean;
  onSource: (factId: string, notice: string, page: number) => void;
}

export default function ChangeFeed({ changes, loading, onSource }: Props) {
  if (loading) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <RefreshCw className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-night-text">What changed for you</span>
        </div>
        <div className="space-y-2 flex-1 min-h-0 overflow-y-auto thin-scrollbar pr-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-night-card rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-5"
            >
              <div className="skeleton h-4 w-2/3 rounded mb-3" />
              <div className="skeleton h-6 w-32 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <RefreshCw className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-night-text">
          What changed for you
        </h2>
      </div>
      {changes.length === 0 ? (
        <div className="flex flex-1 min-h-0 flex-col items-center justify-center bg-white dark:bg-night-card rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-8 text-center">
          <FileText className="w-10 h-10 text-slate-200 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-night-muted">
            No recent changes for your course and semester.
          </p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 min-h-0 overflow-y-auto thin-scrollbar pr-1">
          {changes.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-night-card rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-5 animate-slide-up"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-semibold text-slate-900 dark:text-night-text">
                      {c.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] text-slate-500 dark:text-night-muted line-through">
                        {c.oldValue}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500 dark:text-night-muted" />
                      <span className="text-[15px] font-bold text-sky-600 dark:text-sky-400">
                        {c.newValue}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSource(c.factId, c.noticeTitle, c.page)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-sky-600 dark:text-sky-300 hover:text-sky-700 dark:hover:text-sky-200 bg-sky-50 dark:bg-sky-400/10 px-2.5 py-1.5 rounded-lg transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <FileText className="w-3 h-3" />
                    {c.noticeTitle}, page {c.page}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
