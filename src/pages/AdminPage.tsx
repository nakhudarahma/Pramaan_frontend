import { useState, useEffect } from "react";
import { ShieldCheck, ArrowLeft, Send, RotateCcw } from "lucide-react";
import UploadZone from "../components/UploadZone";
import ReviewTable from "../components/ReviewTable";
import UnansweredList from "../components/UnansweredList";
import Toast, { LoadingToast } from "../components/Toast";
import {
  uploadNotice,
  getUnanswered,
  approveFact,
  rejectFact,
  editFact,
  publishFacts,
  resetDemo,
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

  useEffect(() => {
    getUnanswered().then(setUnanswered);
  }, []);

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
    const result = await publishFacts(approvedIds);
    setLoadingToast(null);
    setToast(
      `${result.count} fact${result.count > 1 ? "s" : ""} published. Affected students notified: ${result.affected}.`
    );
    setApprovedIds([]);
    setStage("upload");
  };

  const handleWriteFact = (_question: string) => {
    setToast("Fact drafting opened (demo).");
  };

  const handleReset = () => {
    resetDemo();
    window.location.reload();
  };

  // ---------- Login screen ----------
  if (stage === "login") {
    return (
      <div className="max-w-md mx-auto px-4 py-10 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h1>
        <p className="text-sm text-slate-500 text-center mb-8">
          Demo access — no password needed. Upload notices and verify extracted facts.
        </p>
        <button
          onClick={() => setStage("upload")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl transition-colors active:scale-95"
        >
          Continue as Admin
        </button>
        <button
          onClick={handleReset}
          className="mt-6 text-xs text-slate-400 hover:text-rose-500 font-medium flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset demo data
        </button>
      </div>
    );
  }

  // ---------- Upload screen ----------
  if (stage === "upload") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setStage("login")}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Upload a notice</h1>
        </div>

        <UploadZone onUpload={handleUpload} extracting={extracting} />

        <div className="mt-6">
          <UnansweredList items={unanswered} onWriteFact={handleWriteFact} />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-rose-500 font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset demo data
          </button>
        </div>
      </div>
    );
  }

  // ---------- Review screen ----------
  return (
    <div className="max-w-5xl mx-auto px-4 py-4 pb-24 md:pb-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setStage("upload")}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Review extracted facts</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: notice preview */}
        <div className="md:sticky md:top-20 self-start">
          {reviewData && (
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-indigo-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-indigo-200 flex items-center justify-center">
                  <div className="text-[8px] font-bold text-indigo-400 text-center leading-tight">
                    OFFICIAL<br />SEAL
                  </div>
                </div>
              </div>

              <div className="text-center mb-4 pr-16">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {reviewData.issuer}
                </div>
                <div className="text-sm font-bold text-slate-700 mt-1">
                  {reviewData.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {reviewData.date} • Page {reviewData.page}
                </div>
                <div className="mt-2 w-12 h-0.5 bg-indigo-200 mx-auto" />
              </div>

              <div className="text-xs text-slate-600 leading-relaxed text-justify">
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
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl shadow-lg transition-colors active:scale-95"
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

function renderHighlighted(body: string, highlight: string) {
  if (!highlight) return body;
  const idx = body.indexOf(highlight);
  if (idx === -1) return body;
  return (
    <>
      {body.substring(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5 text-slate-900 font-medium">
        {highlight}
      </mark>
      {body.substring(idx + highlight.length)}
    </>
  );
}
