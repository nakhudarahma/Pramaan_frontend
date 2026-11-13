import { Search, FileText } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getNotices, ask } from "../api";
import type { NoticeRecord } from "../types";
import { useContext } from "../useContext";
import ChatLauncher from "./ChatLauncher";
import SourceDrawer from "./SourceDrawer";

const statusConfig = {
  current: { label: "Current", class: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30" },
  superseded: { label: "Superseded", class: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30" },
  expired: { label: "Expired", class: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30" },
};

const CATEGORY_FILTERS = [
  "All",
  "Fees",
  "Exams",
  "Timetable",
  "Admissions",
  "Hostel",
  "Activities",
  "General",
];

export default function NoticeList() {
  const { course, semester } = useContext();
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({ factId: "", notice: "", page: 1 });

  const handleAsk = (question: string) => ask(question, course, semester);

  const openSource = (factId: string, notice: string, page: number) => {
    setDrawerData({ factId, notice, page });
    setDrawerOpen(true);
  };

  useEffect(() => {
    getNotices().then((n) => {
      setNotices(n);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notices.filter((n) => {
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.issuer.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.noticeNumber.toLowerCase().includes(q);
      const matchesCategory = category === "All" || n.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [notices, search, category]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-6 pb-24 md:pb-8">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-5 h-5 text-sky-500 dark:text-sky-400" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-night-text">Notices</h1>
      </div>

      {/* Search + category filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-night-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices..."
            className="w-full bg-white/90 dark:bg-night-card/90 backdrop-blur-sm border border-slate-200 dark:border-night-border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-700 dark:text-night-text placeholder:text-slate-500 dark:placeholder:text-night-muted focus:outline-none focus:border-sky-300 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                category === cat
                  ? "bg-navy-600 text-white border-navy-600 shadow-sm"
                  : "bg-white/90 dark:bg-night-card/90 backdrop-blur-sm text-slate-500 dark:text-night-muted border-slate-200 dark:border-night-border hover:border-sky-300 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-300 active:scale-95"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/90 dark:bg-night-card/90 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-night-border p-5">
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
                className="bg-white/90 dark:bg-night-card/90 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-night-text leading-tight">
                          {n.title}
                        </h3>
                        <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-400/10 border border-sky-100 dark:border-sky-500/30 px-1.5 py-0.5 rounded">
                          {n.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-night-muted mt-0.5">
                        {n.noticeNumber} • {n.issuer} • {n.date} • Page {n.page}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border whitespace-nowrap ${sc.class}`}
                  >
                    {sc.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-night-muted line-clamp-2 mt-2">
                  {n.body}
                </p>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-500 dark:text-night-muted">
              No notices found.
            </div>
          )}
        </div>
      )}

      {/* Floating chat launcher */}
      <ChatLauncher
        onAsk={handleAsk}
        onSource={openSource}
      />

      <SourceDrawer
        open={drawerOpen}
        factId={drawerData.factId}
        noticeLabel={drawerData.notice}
        page={drawerData.page}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
