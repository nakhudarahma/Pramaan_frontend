import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Send,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
  CheckCircle2,
  X,
  Search,
} from "lucide-react";
import UploadZone from "../components/UploadZone";
import ReviewTable from "../components/ReviewTable";
import ConflictRow from "../components/ConflictRow";
import UnansweredList from "../components/UnansweredList";
import Toast, { LoadingToast } from "../components/Toast";
import { celebratePublish } from "../celebrate";
import {
  uploadNotice,
  getUnanswered,
  getNotices,
  getReview,
  approveFact,
  rejectFact,
  editFact,
  publishFacts,
  resolveConflictNotice,
  saveCustomFact,
} from "../api";
import type { FactRow, UnansweredItem, NoticeRecord, CourseId, Semester } from "../types";

type Stage = "login" | "upload" | "review";
type ActiveTab = "notices" | "pending" | "conflicts" | "unanswered" | null;

interface ReviewData {
  title: string;
  issuer: string;
  date: string;
  page: number;
  body: string;
  highlightedSentence: string;
}

const statusConfig = {
  current: {
    label: "Current",
    class:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30",
  },
  superseded: {
    label: "Superseded",
    class:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30",
  },
  expired: {
    label: "Expired",
    class:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
};

export default function AdminPage() {
  const [stage, setStage] = useState<Stage>("login");
  const [activeTab, setActiveTab] = useState<ActiveTab>(null);
  const [extracting, setExtracting] = useState(false);
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [factRows, setFactRows] = useState<FactRow[]>([]);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [unanswered, setUnanswered] = useState<UnansweredItem[]>([]);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loadingToast, setLoadingToast] = useState<string | null>(null);
  const [conflictModalRow, setConflictModalRow] = useState<FactRow | null>(null);
  const [noticeSearch, setNoticeSearch] = useState("");

  const refreshData = useCallback(async () => {
    const [noticesData, reviewResp, unansweredData] = await Promise.all([
      getNotices(),
      getReview("n12"),
      getUnanswered(),
    ]);
    setNotices(noticesData);
    setFactRows(reviewResp.factRows);
    setUnanswered(unansweredData);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Derived counts
  const pendingCount = factRows.filter((r) => r.status === "pending").length;
  const conflictsCount = factRows.filter(
    (r) => r.conflict && r.status === "pending"
  ).length;
  const stats = {
    notices: notices.length,
    pending: pendingCount,
    conflicts: conflictsCount,
    unanswered: unanswered.length,
  };

  const handleCardClick = (tab: ActiveTab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const handleUpload = async (file: File) => {
    setExtracting(true);
    const result = await uploadNotice(file);
    setExtracting(false);
    setReviewData(result.review);
    setFactRows(result.factRows);
    setApprovedIds([]);
    setActiveTab(null);
    setStage("review");
  };

  const handleApprove = async (id: string) => {
    setLoadingToast("Approving fact...");
    const updated = await approveFact(id);
    setFactRows(updated);
    setApprovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setLoadingToast(null);
    setToast("Fact approved.");
    const updatedUnanswered = await getUnanswered();
    setUnanswered(updatedUnanswered);
  };

  const handleReject = async (id: string) => {
    setLoadingToast("Rejecting fact...");
    const updated = await rejectFact(id);
    setFactRows(updated);
    setApprovedIds((prev) => prev.filter((i) => i !== id));
    setLoadingToast(null);
    setToast("Fact rejected.");
  };

  const handleEdit = async (id: string, value: string) => {
    const updated = await editFact(id, value);
    setFactRows(updated);
    setToast("Fact updated.");
  };

  const handleResolveOpen = (id: string) => {
    const row = factRows.find((r) => r.id === id);
    if (row) {
      setConflictModalRow(row);
    }
  };

  const handleConfirmResolve = async (winningNotice: string) => {
    if (!conflictModalRow) return;
    setLoadingToast("Resolving conflict...");
    const updated = await resolveConflictNotice(conflictModalRow.id, winningNotice);
    setFactRows(updated);
    setApprovedIds((prev) =>
      prev.includes(conflictModalRow.id) ? prev : [...prev, conflictModalRow.id]
    );
    setConflictModalRow(null);
    setLoadingToast(null);
    setToast(`Conflict resolved. ${winningNotice} selected.`);
  };

  const handlePublish = async () => {
    if (approvedIds.length === 0) return;
    setLoadingToast("Publishing...");
    await publishFacts(approvedIds);
    setLoadingToast(null);
    setToast("Published. Students notified.");
    celebratePublish();
    setApprovedIds([]);
    await refreshData();
    setStage("upload");
  };

  const handleSaveFact = async (data: {
    question: string;
    answerValue: string;
    course: CourseId;
    semester: Semester;
    validUntil?: string;
  }) => {
    setLoadingToast("Saving verified fact...");
    const updated = await saveCustomFact(data);
    setUnanswered(updated);
    setLoadingToast(null);
    setToast("Fact saved. Question resolved.");
  };

  // Filtered notices for the "Notices uploaded" panel
  const filteredNotices = notices.filter((n) => {
    const q = noticeSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.issuer.toLowerCase().includes(q) ||
      n.noticeNumber.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  const pendingFacts = factRows.filter((r) => r.status === "pending");
  const conflictFacts = factRows.filter(
    (r) => r.conflict && r.status === "pending"
  );

  // ---------- Login screen ----------
  if (stage === "login") {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-10 md:py-16 min-h-[75vh] flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-3xl shadow-card p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-navy-600 flex items-center justify-center mb-5 mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-night-text mb-2">
            Admin Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-night-muted leading-relaxed mb-6">
            Demo access — no password needed. Upload notices and verify extracted facts.
          </p>

          <ul className="space-y-2.5 text-left mb-7">
            {[
              { label: "Upload notices", icon: UploadCloud },
              { label: "Review extracted facts", icon: ClipboardCheck },
              { label: "Publish verified facts", icon: Send },
            ].map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 px-3.5 py-3"
              >
                <span className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-400/10 text-sky-500 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[13px] font-medium text-slate-700 dark:text-night-text">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setStage("upload")}
            className="gradient-primary w-full bg-navy-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            Continue as Admin
          </button>
        </div>
      </div>
    );
  }

  // ---------- Upload screen (Main Dashboard) ----------
  if (stage === "upload") {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-6 pb-24 md:pb-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab(null);
              setStage("login");
            }}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
            aria-label="Back to login"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-night-muted" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-night-text">
            Admin Dashboard
          </h1>
        </div>

        {/* 4 Clickable Stat Cards */}
        <StatsRow
          stats={stats}
          activeTab={activeTab}
          onSelectTab={handleCardClick}
        />

        {/* ACTIVE PANEL or UPLOAD ZONE */}
        {activeTab === null ? (
          <>
            <UploadZone onUpload={handleUpload} extracting={extracting} />
            <div className="mt-8">
              <UnansweredList items={unanswered} onSaveFact={handleSaveFact} />
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-night-card rounded-2xl border border-slate-200 dark:border-night-border shadow-card p-6 animate-fade-in mb-8">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-night-border">
              <div className="flex items-center gap-2.5">
                {activeTab === "notices" && (
                  <FileText className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                )}
                {activeTab === "pending" && (
                  <ClipboardCheck className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                )}
                {activeTab === "conflicts" && (
                  <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                )}
                {activeTab === "unanswered" && (
                  <HelpCircle className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                )}
                <h2 className="text-lg font-bold text-slate-900 dark:text-night-text">
                  {activeTab === "notices" && `Notices uploaded (${notices.length})`}
                  {activeTab === "pending" && `Facts pending review (${pendingCount})`}
                  {activeTab === "conflicts" && `Conflicts (${conflictsCount})`}
                  {activeTab === "unanswered" &&
                    `Unanswered questions (${unanswered.length})`}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to upload
              </button>
            </div>

            {/* Panel 1: Notices uploaded */}
            {activeTab === "notices" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-night-muted" />
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder="Search notices by title, number, issuer, category..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-night-border rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-700 dark:text-night-text placeholder:text-slate-400 dark:placeholder:text-night-muted focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2.5 max-h-[600px] overflow-y-auto thin-scrollbar pr-1">
                  {filteredNotices.map((n) => {
                    const sc = statusConfig[n.status] || statusConfig.current;
                    return (
                      <div
                        key={n.id}
                        className="bg-slate-50/60 dark:bg-white/[0.03] rounded-xl border border-slate-200/70 dark:border-night-border p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-night-muted">
                                {n.noticeNumber}
                              </span>
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-night-text">
                                {n.title}
                              </h3>
                              <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-400/10 border border-sky-100 dark:border-sky-500/30 px-1.5 py-0.5 rounded">
                                {n.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-night-muted">
                              Issued by {n.issuer} • {n.date} • Page {n.page}
                            </p>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${sc.class}`}
                          >
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-night-muted line-clamp-2 mt-2 leading-relaxed">
                          {n.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Panel 2: Facts pending review */}
            {activeTab === "pending" && (
              <div className="space-y-4">
                <ReviewTable
                  rows={pendingFacts}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onEdit={handleEdit}
                  onResolve={handleResolveOpen}
                />

                {approvedIds.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-night-border">
                    <button
                      onClick={handlePublish}
                      className="gradient-primary w-full flex items-center justify-center gap-2 bg-navy-600 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
                    >
                      <Send className="w-4 h-4" />
                      Publish approved facts ({approvedIds.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Panel 3: Conflicts */}
            {activeTab === "conflicts" && (
              <div className="space-y-3">
                {conflictFacts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-night-text">
                      No active conflicts
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-night-muted mt-1">
                      All notices and schedules are currently aligned.
                    </p>
                  </div>
                ) : (
                  conflictFacts.map((row) => (
                    <ConflictRow
                      key={row.id}
                      row={row}
                      onResolve={handleResolveOpen}
                    />
                  ))
                )}
              </div>
            )}

            {/* Panel 4: Unanswered questions */}
            {activeTab === "unanswered" && (
              <UnansweredList items={unanswered} onSaveFact={handleSaveFact} />
            )}
          </div>
        )}

        {/* Resolve Conflict Modal Dialog */}
        {conflictModalRow && (
          <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scale-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-night-text">
                    Resolve Notice Conflict
                  </h3>
                </div>
                <button
                  onClick={() => setConflictModalRow(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-night-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-night-muted leading-relaxed mb-4">
                A scheduling conflict exists for{" "}
                <strong className="text-slate-900 dark:text-night-text font-semibold">
                  {conflictModalRow.factKey}
                </strong>
                . Choose which notice takes precedence:
              </p>

              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleConfirmResolve("Notice #19")}
                  className="w-full text-left p-4 rounded-2xl border-2 border-sky-300 dark:border-sky-500/40 bg-sky-50/50 dark:bg-sky-500/10 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                      Notice #19 (11 Nov 2026)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-200 dark:bg-sky-400/20 text-sky-800 dark:text-sky-200">
                      Newer notice (Recommended)
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-night-text">
                    Lab timing: 2:00 PM – 5:00 PM
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-night-muted mt-0.5">
                    Supersedes the earlier morning schedule
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmResolve("Notice #18")}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-night-border bg-slate-50/60 dark:bg-white/5 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-night-muted">
                      Notice #18 (08 Nov 2026)
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Earlier notice
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-night-text">
                    Lab timing: 9:00 AM – 12:00 PM
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-night-muted mt-0.5">
                    Retain original morning timing
                  </p>
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setConflictModalRow(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-night-muted hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        {loadingToast && <LoadingToast message={loadingToast} />}
      </div>
    );
  }

  // ---------- Review screen (5-step demo upload flow) ----------
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-4 pb-24 md:pb-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setStage("upload")}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
          aria-label="Back to upload"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-night-muted" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-night-text">
          Review extracted facts
        </h1>
      </div>

      <StatsRow
        stats={stats}
        activeTab={activeTab}
        onSelectTab={handleCardClick}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: notice preview */}
        <div className="md:sticky md:top-20 self-start">
          {reviewData && (
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-night-page dark:to-[#152238] rounded-2xl p-8 border border-slate-200 dark:border-night-border">
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-navy-300 dark:border-slate-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-navy-200 dark:border-slate-600 flex items-center justify-center">
                  <div className="text-[8px] font-bold text-navy-400 dark:text-slate-500 text-center leading-tight">
                    OFFICIAL
                    <br />
                    SEAL
                  </div>
                </div>
              </div>

              <div className="text-center mb-4 pr-16">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-night-muted">
                  {reviewData.issuer}
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-night-text mt-1">
                  {reviewData.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-night-muted mt-0.5">
                  {reviewData.date} • Page {reviewData.page}
                </div>
                <div className="mt-2 w-12 h-0.5 bg-navy-200 dark:bg-night-border mx-auto" />
              </div>

              <div className="text-xs text-slate-600 dark:text-night-text leading-relaxed text-justify">
                {renderHighlighted(
                  reviewData.body,
                  reviewData.highlightedSentence
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: review table */}
        <div>
          <ReviewTable
            rows={factRows}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={handleEdit}
            onResolve={handleResolveOpen}
          />

          {/* Publish button */}
          {approvedIds.length > 0 && (
            <div className="mt-6 sticky bottom-4">
              <button
                onClick={handlePublish}
                className="gradient-primary w-full flex items-center justify-center gap-2 bg-navy-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                Publish approved facts ({approvedIds.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {loadingToast && <LoadingToast message={loadingToast} />}
    </div>
  );
}

function StatsRow({
  stats,
  activeTab,
  onSelectTab,
}: {
  stats: {
    notices: number;
    pending: number;
    conflicts: number;
    unanswered: number;
  };
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}) {
  const items: {
    id: ActiveTab;
    label: string;
    value: number;
    icon: typeof FileText;
    tone: string;
  }[] = [
    {
      id: "notices",
      label: "Notices uploaded",
      value: stats.notices,
      icon: FileText,
      tone: "text-navy-600 bg-navy-50 dark:text-sky-300 dark:bg-sky-400/10",
    },
    {
      id: "pending",
      label: "Facts pending review",
      value: stats.pending,
      icon: ClipboardCheck,
      tone: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15",
    },
    {
      id: "conflicts",
      label: "Conflicts",
      value: stats.conflicts,
      icon: AlertTriangle,
      tone: "text-rose-600 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/15",
    },
    {
      id: "unanswered",
      label: "Unanswered",
      value: stats.unanswered,
      icon: HelpCircle,
      tone: "text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-sky-400/15",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
      {items.map(({ id, label, value, icon: Icon, tone }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelectTab(id)}
            className={`bg-white dark:bg-night-card rounded-2xl border shadow-card p-4 text-left cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.98] ${
              isActive
                ? "border-sky-400 dark:border-sky-500 ring-2 ring-sky-400/20 dark:ring-sky-500/20"
                : "border-slate-200 dark:border-night-border hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-night-text leading-none">
                {value}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-night-muted mt-2 leading-tight">
              {label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function renderHighlighted(body: string, highlight: string) {
  if (!highlight) return body;
  const idx = body.indexOf(highlight);
  if (idx === -1) return body;
  return (
    <>
      {body.substring(0, idx)}
      <mark className="bg-yellow-200 dark:bg-amber-400/30 rounded px-0.5 text-slate-900 dark:text-amber-100 font-medium">
        {highlight}
      </mark>
      {body.substring(idx + highlight.length)}
    </>
  );
}
