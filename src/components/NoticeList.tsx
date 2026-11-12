import { Search, FileText } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getNotices } from "../api";
import type { NoticeRecord } from "../types";

const statusConfig = {
  current: { label: "Current", class: "bg-green-50 text-green-700 border-green-200" },
  superseded: { label: "Superseded", class: "bg-slate-100 text-slate-600 border-slate-200" },
  expired: { label: "Expired", class: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default function NoticeList() {
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getNotices().then((n) => {
      setNotices(n);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return notices;
    const q = search.toLowerCase();
    return notices.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.issuer.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q)
    );
  }, [notices, search]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Notices</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notices..."
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="skeleton h-5 w-3/4 rounded mb-2" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const sc = statusConfig[n.status];
            return (
              <div
                key={n.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                        {n.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {n.issuer} • {n.date} • Page {n.page}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border whitespace-nowrap ${sc.class}`}
                  >
                    {sc.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                  {n.body}
                </p>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-400">
              No notices found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
