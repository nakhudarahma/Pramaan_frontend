import { AlertTriangle, ChevronRight, GraduationCap } from "lucide-react";
import type { FactRow } from "../types";
import { courseLabel } from "../api";

interface Props {
  row: FactRow;
  onResolve: (id: string) => void;
}

export default function ConflictRow({ row, onResolve }: Props) {
  return (
    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
          {row.conflict}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-sm font-semibold text-slate-800 dark:text-night-text">
              {row.factKey}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 dark:text-sky-300 bg-white/70 dark:bg-night-card/70 px-2 py-0.5 rounded-md">
              <GraduationCap className="w-3 h-3" />
              {courseLabel(row.scope.course)}, Sem {row.scope.semester}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-night-muted mt-0.5">
            Proposed: {row.value} • Existing: {row.oldValue}
          </div>
        </div>
        <button
          onClick={() => onResolve(row.id)}
          className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
        >
          Resolve
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
