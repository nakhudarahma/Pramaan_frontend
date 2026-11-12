import { useState } from "react";
import { HelpCircle, PenSquare, X, Check } from "lucide-react";
import type { UnansweredItem, CourseId, Semester } from "../types";
import { COURSES, SEMESTERS } from "../types";

interface Props {
  items: UnansweredItem[];
  onWriteFact?: (question: string) => void;
  onSaveFact?: (data: {
    question: string;
    answerValue: string;
    course: CourseId;
    semester: Semester;
    validUntil?: string;
  }) => void;
}

export default function UnansweredList({ items, onWriteFact, onSaveFact }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerValue, setAnswerValue] = useState("");
  const [course, setCourse] = useState<CourseId>("bsc-ds");
  const [semester, setSemester] = useState<Semester>(4);
  const [validUntil, setValidUntil] = useState("");

  const handleToggle = (item: UnansweredItem) => {
    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
      setAnswerValue("");
      setCourse("bsc-ds");
      setSemester(4);
      setValidUntil("");
      onWriteFact?.(item.question);
    }
  };

  const handleSave = (question: string) => {
    if (!answerValue.trim()) return;
    onSaveFact?.({
      question,
      answerValue: answerValue.trim(),
      course,
      semester,
      validUntil: validUntil.trim() || undefined,
    });
    setExpandedId(null);
  };

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
        <div className="space-y-3">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-night-border overflow-hidden transition-all"
              >
                <div className="flex items-center justify-between gap-3 p-3.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-night-text truncate">
                      {item.question}
                    </span>
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-400/10 px-2 py-0.5 rounded-md whitespace-nowrap">
                      x{item.count}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggle(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-300 hover:text-sky-700 dark:hover:text-sky-200 bg-white dark:bg-night-card border border-sky-200 dark:border-sky-500/30 hover:bg-sky-50 dark:hover:bg-sky-400/10 px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                  >
                    <PenSquare className="w-3 h-3" />
                    {isExpanded ? "Close" : "Write a fact"}
                  </button>
                </div>

                {/* Inline form */}
                {isExpanded && (
                  <div className="p-4 bg-white dark:bg-night-card border-t border-slate-200 dark:border-night-border space-y-3 animate-fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-night-muted mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={item.question}
                        readOnly
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-night-border rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-night-muted cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-night-text mb-1">
                        Answer value <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={answerValue}
                        onChange={(e) => setAnswerValue(e.target.value)}
                        placeholder="e.g. 12 Dec 2026"
                        autoFocus
                        className="w-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-night-text placeholder:text-slate-500 dark:placeholder:text-night-muted focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-night-text mb-1">
                          Scope: Course
                        </label>
                        <select
                          value={course}
                          onChange={(e) => setCourse(e.target.value as CourseId)}
                          className="w-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-night-text focus:outline-none focus:border-sky-400"
                        >
                          {COURSES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-night-text mb-1">
                          Scope: Semester
                        </label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(Number(e.target.value) as Semester)}
                          className="w-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-night-text focus:outline-none focus:border-sky-400"
                        >
                          {SEMESTERS.map((sem) => (
                            <option key={sem} value={sem}>
                              Semester {sem}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-night-text mb-1">
                        Valid until (optional)
                      </label>
                      <input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="w-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-night-text focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-night-border">
                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-night-muted hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!answerValue.trim()}
                        onClick={() => handleSave(item.question)}
                        className="gradient-primary inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save fact
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
