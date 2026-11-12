import { useState, useEffect } from "react";
import {
  X,
  FileText,
  Calendar,
  User,
  BookOpen,
  Highlighter,
  Hash,
  Repeat,
} from "lucide-react";
import { getSource } from "../api";
import type { NoticeRecord } from "../types";

interface Props {
  open: boolean;
  factId: string;
  noticeLabel: string;
  page: number;
  onClose: () => void;
}

export default function SourceDrawer({ open, factId, onClose }: Props) {
  const [notice, setNotice] = useState<NoticeRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && factId) {
      setLoading(true);
      getSource(factId).then((n) => {
        setNotice(n);
        setLoading(false);
      });
    }
  }, [open, factId]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom sheet on mobile, side panel on desktop */}
      <div className="fixed z-50 inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[420px] bg-white dark:bg-night-card rounded-t-3xl md:rounded-t-none md:rounded-l-3xl shadow-2xl animate-slide-up md:animate-slide-in-right max-h-[85vh] md:max-h-none overflow-y-auto">
        {/* Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-slate-200 dark:bg-night-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-night-border sticky top-0 bg-white dark:bg-night-card z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-night-text">Source</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-night-muted" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            <div className="skeleton h-6 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-48 w-full rounded-2xl" />
          </div>
        ) : notice ? (
          <div className="p-6 space-y-5">
            {/* Notice title */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-night-text leading-tight">
                {notice.title}
              </h3>
            </div>

            {/* Meta */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-night-muted">
                <Hash className="w-4 h-4 text-slate-500 dark:text-night-muted" />
                <span className="font-medium">{notice.noticeNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-night-muted">
                <User className="w-4 h-4 text-slate-500 dark:text-night-muted" />
                <span className="font-medium">{notice.issuer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-night-muted">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-night-muted" />
                <span>{notice.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-night-muted">
                <BookOpen className="w-4 h-4 text-slate-500 dark:text-night-muted" />
                <span>Page {notice.page}</span>
              </div>
            </div>

            {/* Replacement chain */}
            {notice.replaces && (
              <div className="flex items-center gap-2 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-400/10 border border-sky-100 dark:border-sky-500/30 rounded-xl p-3">
                <Repeat className="w-4 h-4 flex-shrink-0" />
                <span>
                  Notice {notice.date.split(" ").slice(0, 2).join(" ")} replaces{" "}
                  {notice.replaces}
                </span>
              </div>
            )}

            {/* Fake notice document */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-night-page dark:to-[#152238] rounded-2xl p-7 border border-slate-200 dark:border-night-border">
              {/* Circular seal */}
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-navy-300 dark:border-slate-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-navy-200 dark:border-slate-600 flex items-center justify-center">
                  <div className="text-[8px] font-bold text-navy-400 dark:text-slate-500 text-center leading-tight">
                    OFFICIAL<br />SEAL
                  </div>
                </div>
              </div>

              <div className="text-center mb-4 pr-16">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-night-muted">
                  {notice.issuer}
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-night-text mt-1">
                  {notice.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-night-muted mt-0.5">
                  Ref: {notice.noticeNumber}
                </div>
                <div className="mt-2 w-12 h-0.5 bg-navy-200 dark:bg-night-border mx-auto" />
              </div>

              {/* Body with highlight */}
              <div className="text-xs text-slate-600 dark:text-night-text leading-relaxed text-justify">
                {renderHighlighted(notice.body, notice.highlightedSentence)}
              </div>

              {/* Signature line */}
              <div className="mt-6 flex justify-end">
                <div className="text-center">
                  <div className="text-[10px] italic text-slate-500 dark:text-night-muted mb-6">
                    Authorized Signatory
                  </div>
                  <div className="w-24 h-0.5 bg-slate-300 dark:bg-slate-600" />
                  <div className="text-[9px] text-slate-500 dark:text-night-muted mt-1">{notice.issuer}</div>
                </div>
              </div>
            </div>

            {/* Highlight legend */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-night-muted bg-yellow-50 dark:bg-amber-500/10 border border-yellow-200 dark:border-amber-500/30 rounded-xl p-3">
              <Highlighter className="w-4 h-4 text-yellow-600 dark:text-amber-400" />
              <span>The highlighted sentence is the source of this answer.</span>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-slate-500 dark:text-night-muted">
            Could not load source.
          </div>
        )}
      </div>
    </>
  );
}

function renderHighlighted(body: string, highlight: string) {
  if (!highlight) return body;
  const idx = body.indexOf(highlight);
  if (idx === -1) return body;
  return (
    <>
      {body.substring(0, idx)}
      <mark className="bg-yellow-200 dark:bg-amber-400/30 rounded px-0.5 py-0.5 text-slate-900 dark:text-amber-100 font-medium">
        {highlight}
      </mark>
      {body.substring(idx + highlight.length)}
    </>
  );
}
