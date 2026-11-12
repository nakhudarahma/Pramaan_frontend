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
} from "lucide-react";
import type { AnswerCardData } from "../types";

interface Props {
  data: AnswerCardData;
  loading?: boolean;
  onSource: (factId: string, notice: string, page: number) => void;
}

export default function AnswerCard({ data, loading, onSource }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 w-full">
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
      badgeClass: "bg-green-50 text-green-700 border-green-200",
      iconClass: "text-green-600",
      textClass: "text-slate-900",
      border: "border-green-100",
    },
    outdated: {
      icon: AlertTriangle,
      badge: "MAY BE OUTDATED",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      iconClass: "text-amber-600",
      textClass: "text-slate-700",
      border: "border-amber-100",
    },
    disputed: {
      icon: AlertCircle,
      badge: "DISPUTED — NOTICES DISAGREE",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      iconClass: "text-rose-600",
      textClass: "text-slate-700",
      border: "border-rose-100",
    },
    unavailable: {
      icon: HelpCircle,
      badge: "NOT IN OFFICIAL RECORDS",
      badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
      iconClass: "text-slate-500",
      textClass: "text-slate-600",
      border: "border-slate-200",
    },
  };

  const c = config[data.state];
  const Icon = c.icon;

  return (
    <div
      className={`bg-white rounded-2xl border ${c.border} shadow-sm p-4 w-full animate-slide-up`}
    >
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide border ${c.badgeClass} mb-3`}
      >
        <Icon className={`w-3.5 h-3.5 ${c.iconClass}`} />
        {c.badge}
      </div>

      {/* Main answer text */}
      {data.state === "disputed" ? (
        <p className="text-sm font-semibold text-rose-700 mb-3">
          Two notices disagree on this information.
        </p>
      ) : data.state === "unavailable" ? (
        <p className={`text-base font-semibold ${c.textClass} mb-3`}>{data.text}</p>
      ) : (
        <p className={`text-base font-bold ${c.textClass} mb-3`}>{data.text}</p>
      )}

      {/* Outdated banner */}
      {data.state === "outdated" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
          <p className="text-xs text-amber-700 font-medium">
            This may be outdated, please confirm with the office.
          </p>
        </div>
      )}

      {/* Metadata for verified/outdated */}
      {(data.state === "verified" || data.state === "outdated") && (
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Applies to:</span>
            {data.appliesTo}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-600">Valid until:</span>
            {data.validUntil}
          </div>
          {data.replaces && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
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
              className="flex items-center justify-between bg-rose-50/50 border border-rose-100 rounded-xl p-2.5"
            >
              <span className="text-xs font-medium text-slate-700">
                {i === 0 ? "Source A:" : "Source B:"} {s.notice}, page {s.page}
              </span>
              <button
                onClick={() => onSource(s.factId, s.notice, s.page)}
                className="text-xs text-indigo-600 font-medium hover:underline"
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
                className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                {s.notice}, page {s.page}
              </button>
            ))}
          </div>
        )}

      {/* Contact for disputed/unavailable */}
      {(data.state === "disputed" || data.state === "unavailable") && data.contact && (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-2.5 mb-2">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Contact: <span className="font-semibold">{data.contact}</span>
          </span>
        </div>
      )}

      {/* Note for unavailable */}
      {data.state === "unavailable" && data.note && (
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50/50 rounded-xl p-2.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{data.note}</span>
        </div>
      )}
    </div>
  );
}
