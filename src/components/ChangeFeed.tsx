import { ArrowRight, FileText } from "lucide-react";
import type { ChangeItem } from "../types";

interface Props {
  changes: ChangeItem[];
  onSource: (factId: string, notice: string, page: number) => void;
}

export default function ChangeFeed({ changes, onSource }: Props) {
  return (
    <div className="mb-6 px-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
        What changed for you
      </h2>
      {changes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            No recent changes for your course and semester.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {changes.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 animate-slide-up"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">
                      {c.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-slate-400 line-through">
                        {c.oldValue}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-sm font-bold text-indigo-600">
                        {c.newValue}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSource(c.factId, c.noticeTitle, c.page)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
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
