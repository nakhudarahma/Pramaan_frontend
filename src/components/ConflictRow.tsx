import { AlertTriangle, ChevronRight } from "lucide-react";
import type { FactRow } from "../types";

interface Props {
  row: FactRow;
  onResolve: (id: string) => void;
}

export default function ConflictRow({ row, onResolve }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
          {row.conflict}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800">{row.factKey}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            Proposed: {row.value} • Existing: {row.oldValue}
          </div>
        </div>
        <button
          onClick={() => onResolve(row.id)}
          className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Resolve
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
