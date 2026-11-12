import { useState } from "react";
import { Check, X, Pencil, GraduationCap } from "lucide-react";
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
    "btech-cs": "B.Tech CS",
    "btech-it": "B.Tech IT",
    "bsc-ds": "B.Sc DS",
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
        <p className="text-sm text-slate-400">
          All facts reviewed. Upload another notice to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900">
        Extracted Facts ({rows.length})
      </h3>
      {rows.map((row) =>
        row.conflict ? (
          <ConflictRow key={row.id} row={row} onResolve={onResolve} />
        ) : (
          <div
            key={row.id}
            className="bg-white rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900">
                    {row.factKey}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
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
                    <p className="text-[11px] text-slate-400 mt-1">
                      Replaces {row.replaces}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-slate-700 mt-0.5">
                    <span className="font-semibold text-slate-500">Value: </span>
                    {row.value}
                  </div>
                )}

                {editingId === row.id && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 text-sm border border-indigo-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={commitEdit}
                      className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center"
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
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 py-2.5 rounded-xl transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => startEdit(row)}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 py-2.5 px-3 rounded-xl transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onReject(row.id)}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 py-2.5 px-3 rounded-xl transition-colors"
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
