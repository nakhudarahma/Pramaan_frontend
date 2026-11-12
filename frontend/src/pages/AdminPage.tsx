import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Send,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
} from "lucide-react";
import UploadZone from "../components/UploadZone";
import ReviewTable from "../components/ReviewTable";
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
} from "../api";
import type { FactRow, UnansweredItem } from "../types";

type Stage = "login" | "upload" | "review";

interface ReviewData {
  title: string;
  issuer: string;
  date: string;
  page: number;
  body: string;
  highlightedSentence: string;
}

export default function AdminPage() {
  const [stage, setStage] = useState<Stage>("login");
  const [extracting, setExtracting] = useState(false);
  const [factRows, setFactRows] = useState<FactRow[]>([]);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [unanswered, setUnanswered] = useState<UnansweredItem[]>([]);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [loadingToast, setLoadingToast] = useState<string | null>(null);
  const [stats, setStats] = useState({ notices: 0, pending: 0, conflicts: 0 });

  useEffect(() => {
    getUnanswered().then(setUnanswered);
  }, []);

  useEffect(() => {
    Promise.all([getNotices(), getReview("n12")]).then(([notices, review]) => {
      setStats({
        notices: notices.length,
        pending: review.factRows.length,
        conflicts: review.factRows.filter((r) => r.conflict).length,
      });
    });
  }, [factRows]);

  const refreshUnanswered = () => getUnanswered().then(setUnanswered);

  const handleUpload = async (file: File) => {
    setExtracting(true);
    const result = await uploadNotice(file);
    setExtracting(false);
    setReviewData(result.review);
    setFactRows(result.factRows);
    setApprovedIds([]);
    setStage("review");
  };

  const handleApprove = async (id: string) => {
    setLoadingToast("Approving fact...");
    const updated = await approveFact(id);
    setFactRows(updated);
    setApprovedIds((prev) => [...prev, id]);
    setLoadingToast(null);
    setToast("Fact approved.");
    refreshUnanswered();
  };

  const handleReject = async (id: string) => {
    setLoadingToast("Rejecting fact...");
    const updated = await rejectFact(id);
    setFactRows(updated);
    setLoadingToast(null);
    setToast("Fact rejected.");
  };

  const handleEdit = async (id: string, value: string) => {
    const updated = await editFact(id, value);
    setFactRows(updated);
    setToast("Fact updated.");
  };

  const handleResolve = (id: string) => {
    // For demo: resolving a conflict just approves the new value
    handleApprove(id);
  };

  const handlePublish = async () => {
    if (approvedIds.length === 0) return;
    setLoadingToast("Publishing...");
    await publishFacts(approvedIds);
    setLoadingToast(null);
    setToast("Published. Students notified.");
    celebratePublish();
    setApprovedIds([]);
    setStage("upload");
  };

  const handleWriteFact = (_question: string) => {
    setToast("Fact drafting opened (demo).");
  };

  // ---------- Login screen ----------
  if (stage === "login") {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-10 md:py-16 min-h-[75vh] flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-night-card border border-slate-200 dark:border-night-border rounded-3xl shadow-card p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-navy-600 flex items-center justify-center mb-5 mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-night-text mb-2">Admin Portal</h1>
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

  // ---------- Upload screen ----------
  if (stage === "upload") {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-6 pb-24 lg:pb-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setStage("login")}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-night-muted" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-night-text">Upload a notice</h1>
        </div>

        <StatsRow stats={stats} unansweredCount={unanswered.length} />

        <UploadZone onUpload={handleUpload} extracting={extracting} />

        <div className="mt-6">
          <UnansweredList items={unanswered} onWriteFact={handleWriteFact} />
        </div>

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        {loadingToast && <LoadingToast message={loadingToast} />}
      </div>
    );
  }

  // ---------- Review screen ----------
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-4 pb-24 lg:pb-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setStage("upload")}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-night-muted" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-night-text">Review extracted facts</h1>
      </div>

      <StatsRow stats={stats} unansweredCount={unanswered.length} />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: notice preview */}
        <div className="md:sticky md:top-20 self-start">
          {reviewData && (
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-night-page dark:to-[#152238] rounded-2xl p-8 border border-slate-200 dark:border-night-border">
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-navy-300 dark:border-slate-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-navy-200 dark:border-slate-600 flex items-center justify-center">
                  <div className="text-[8px] font-bold text-navy-400 dark:text-slate-500 text-center leading-tight">
                    OFFICIAL<br />SEAL
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
                {renderHighlighted(reviewData.body, reviewData.highlightedSentence)}
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
            onResolve={handleResolve}
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

      {/* Unanswered panel */}
      <div className="mt-8">
        <UnansweredList items={unanswered} onWriteFact={handleWriteFact} />
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {loadingToast && <LoadingToast message={loadingToast} />}
    </div>
  );
}

function StatsRow({
  stats,
  unansweredCount,
}: {
  stats: { notices: number; pending: number; conflicts: number };
  unansweredCount: number;
}) {
  const items = [
    {
      label: "Notices uploaded",
      value: stats.notices,
      icon: FileText,
      tone: "text-navy-600 bg-navy-50 dark:text-sky-300 dark:bg-sky-400/10",
    },
    {
      label: "Facts pending review",
      value: stats.pending,
      icon: ClipboardCheck,
      tone: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/15",
    },
    {
      label: "Conflicts",
      value: stats.conflicts,
      icon: AlertTriangle,
      tone: "text-rose-600 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/15",
    },
    {
      label: "Unanswered",
      value: unansweredCount,
      icon: HelpCircle,
      tone: "text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-sky-400/15",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="bg-white dark:bg-night-card rounded-2xl border border-slate-200 dark:border-night-border shadow-card p-4"
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
        </div>
      ))}
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
