import { useState } from "react";
import { Check, X, Pencil, GraduationCap, ClipboardCheck } from "lucide-react";
import type { FactRow } from "../types";
import DiffChip from "./DiffChip";
import ConflictRow from "./ConflictRow";

interface Props {
  rows: FactRow[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string, value: string) => void;
  onResolve: (id: string) => void;
}

const scopeLabel = (scope: { course: string; semester: number }) => {
  const map: Record<string, string> = {
    "bsc-ds": "B.Sc Data Science",
    "bsc-cs": "B.Sc Computer Science",
    "bsc-it": "B.Sc Information Technology",
    bcom: "B.Com",
    bms: "BMS",
    baf: "BAF",
    ba: "BA",
  };
  return `${map[scope.course] || scope.course}, Sem ${scope.semester}`;
};

export default function ReviewTable({ rows, onApprove, onReject, onEdit, onResolve }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (row: FactRow) => {
    setEditingId(row.id);
    setEditValue(row.value);
  };

  const commitEdit = () => {
    if (editingId) {
      onEdit(editingId, editValue);
      setEditingId(null);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-slate-500 dark:text-night-muted">
          All facts reviewed. Upload another notice to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-night-text">
          Extracted Facts ({rows.length})
        </h3>
      </div>
      {rows.map((row) =>
        row.conflict ? (
          <ConflictRow key={row.id} row={row} onResolve={onResolve} />
        ) : (
          <div
            key={row.id}
            className="bg-white dark:bg-night-card rounded-2xl border border-slate-200 dark:border-night-border p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-night-text">
                    {row.factKey}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-400/10 px-2 py-0.5 rounded-md">
                    <GraduationCap className="w-3 h-3" />
                    {scopeLabel(row.scope)}
                  </span>
                </div>

                {row.oldValue ? (
                  <div className="mt-1">
                    <DiffChip
                      label="Value"
                      oldValue={row.oldValue}
                      newValue={row.value}
                    />
                    <p className="text-[11px] text-slate-500 dark:text-night-muted mt-1">
                      Replaces {row.replaces}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-slate-700 dark:text-night-text mt-0.5">
                    <span className="font-semibold text-slate-500 dark:text-night-muted">Value: </span>
                    {row.value}
                  </div>
                )}

                {editingId === row.id && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 text-sm bg-white dark:bg-night-page border border-sky-300 dark:border-sky-500 text-slate-900 dark:text-night-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      autoFocus
                    />
                    <button
                      onClick={commitEdit}
                      className="w-8 h-8 bg-navy-600 text-white rounded-lg flex items-center justify-center"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {editingId !== row.id && (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(row.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-500/15 hover:bg-green-100 dark:hover:bg-green-500/25 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => startEdit(row)}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 py-2.5 px-3 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onReject(row.id)}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25 py-2.5 px-3 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
