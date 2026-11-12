import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  FileText,
  Clock,
  Repeat,
  Phone,
  Info,
  Copy,
  Share2,
  Check,
} from "lucide-react";
import type { AnswerCardData } from "../types";

interface Props {
  data: AnswerCardData;
  loading?: boolean;
  onSource: (factId: string, notice: string, page: number) => void;
}

export default function AnswerCard({ data, loading, onSource }: Props) {
  const [copied, setCopied] = useState(false);

  const shareText = `${data.text}${data.appliesTo ? ` — ${data.appliesTo}` : ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pramaan answer", text: shareText });
        return;
      } catch {
        /* user cancelled or unsupported */
      }
    }
    handleCopy();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-night-card rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-5 w-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="skeleton h-5 w-32 rounded-lg" />
        </div>
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-3/4 rounded mb-4" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-24 rounded-lg" />
          <div className="skeleton h-6 w-20 rounded-lg" />
        </div>
      </div>
    );
  }

  const config = {
    verified: {
      icon: ShieldCheck,
      badge: "VERIFIED FROM OFFICIAL NOTICE",
      badgeClass: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30",
      iconClass: "text-green-600 dark:text-green-400",
      textClass: "text-slate-900 dark:text-night-text",
      border: "border-green-100 dark:border-green-500/25",
    },
    outdated: {
      icon: AlertTriangle,
      badge: "MAY BE OUTDATED",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
      iconClass: "text-amber-600 dark:text-amber-400",
      textClass: "text-slate-700 dark:text-night-text",
      border: "border-amber-100 dark:border-amber-500/25",
    },
    disputed: {
      icon: AlertCircle,
      badge: "DISPUTED — NOTICES DISAGREE",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
      iconClass: "text-rose-600 dark:text-rose-400",
      textClass: "text-slate-700 dark:text-night-text",
      border: "border-rose-100 dark:border-rose-500/25",
    },
    unavailable: {
      icon: HelpCircle,
      badge: "NOT IN OFFICIAL RECORDS",
      badgeClass: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30",
      iconClass: "text-slate-500 dark:text-slate-500",
      textClass: "text-slate-600 dark:text-night-muted",
      border: "border-slate-200 dark:border-slate-600",
    },
  };

  const c = config[data.state];
  const Icon = c.icon;

  return (
    <div
      className={`bg-white dark:bg-night-card rounded-2xl border ${c.border} shadow-card p-5 w-full animate-slide-up`}
    >
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide border ${c.badgeClass} mb-3`}
      >
        <Icon className={`w-3.5 h-3.5 ${c.iconClass}`} />
        {c.badge}
      </div>

      {/* Main answer text */}
      {data.state === "disputed" ? (
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-3">
          Two notices disagree on this information.
        </p>
      ) : data.state === "unavailable" ? (
        <p className={`text-base font-semibold ${c.textClass} mb-3`}>{data.text}</p>
      ) : (
        <p className={`text-base font-bold ${c.textClass} mb-3`}>{data.text}</p>
      )}

      {/* Notice metadata */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
        {[
          { label: "Issued by", value: data.issuedBy || "—" },
          { label: "Notice no.", value: data.noticeNumber || "—" },
          { label: "Notice date", value: data.noticeDate || "—" },
          { label: "Category", value: data.category || "General" },
        ].map((meta) => (
          <div key={meta.label} className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-night-muted">
              {meta.label}
            </div>
            <div className="text-[13px] font-medium text-slate-700 dark:text-night-text truncate">
              {meta.value}
            </div>
          </div>
        ))}
      </div>

      {/* Outdated banner */}
      {data.state === "outdated" && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-3 mb-3">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            This may be outdated, please confirm with the office.
          </p>
        </div>
      )}

      {/* Metadata for verified/outdated */}
      {(data.state === "verified" || data.state === "outdated") && (
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-night-muted">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Applies to:</span>
            {data.appliesTo}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-night-muted">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-600 dark:text-slate-300">Valid until:</span>
            {data.validUntil}
          </div>
          {data.replaces && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-night-muted">
              <Repeat className="w-3.5 h-3.5" />
              <span>
                Replaces notice of {data.replaces}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Disputed: list both sources */}
      {data.state === "disputed" && (
        <div className="space-y-2 mb-3">
          {data.sources.map((s, i) => (
            <div
              key={s.factId}
              className="flex items-center justify-between bg-rose-50/50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/25 rounded-xl p-2.5"
            >
              <span className="text-xs font-medium text-slate-700 dark:text-night-text">
                {i === 0 ? "Source A:" : "Source B:"} {s.notice}, page {s.page}
              </span>
              <button
                onClick={() => onSource(s.factId, s.notice, s.page)}
                className="text-xs text-sky-600 dark:text-sky-400 font-medium hover:underline"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Source chips for verified/outdated */}
      {(data.state === "verified" || data.state === "outdated") &&
        data.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {data.sources.map((s) => (
              <button
                key={s.factId}
                onClick={() => onSource(s.factId, s.notice, s.page)}
                className="inline-flex items-center gap-1.5 bg-sky-50 dark:bg-sky-400/10 hover:bg-sky-100 dark:hover:bg-sky-400/20 text-sky-700 dark:text-sky-300 text-[13px] font-medium px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                {s.notice}, page {s.page}
              </button>
            ))}
          </div>
        )}

      {/* Contact for disputed/unavailable */}
      {(data.state === "disputed" || data.state === "unavailable") && data.contact && (
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-night-muted bg-slate-50 dark:bg-white/5 rounded-xl p-2.5 mb-2">
          <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-night-muted" />
          <span>
            Contact: <span className="font-semibold">{data.contact}</span>
          </span>
        </div>
      )}

      {/* Note for unavailable */}
      {data.state === "unavailable" && data.note && (
        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-night-muted bg-slate-50/50 dark:bg-white/5 rounded-xl p-2.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{data.note}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-night-border">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-night-muted hover:text-navy-600 dark:hover:text-sky-300 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 active:scale-95"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-night-muted hover:text-navy-600 dark:hover:text-sky-300 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
    </div>
  );
}
