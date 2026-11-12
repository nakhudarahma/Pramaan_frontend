import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import { ask, getDeadlines, getChanges } from "../api";
import type { AnswerCardData, Deadline, ChangeItem } from "../types";
import { useContext } from "../useContext";
import ContextBar from "../components/ContextBar";
import DeadlineStrip from "../components/DeadlineStrip";
import ChangeFeed from "../components/ChangeFeed";
import IntentTiles from "../components/IntentTiles";
import ChatBox from "../components/ChatBox";
import SourceDrawer from "../components/SourceDrawer";

export default function StudentPage() {
  const location = useLocation();
  const isAskView = location.pathname === "/ask";
  const { course, semester, update, courses } = useContext();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({ factId: "", notice: "", page: 1 });
  const [pendingQuestion, setPendingQuestion] = useState<{ q: string; n: number } | null>(null);

  const fetchData = useCallback(
    (showLoading = true) => {
      if (showLoading) setLoading(true);
      Promise.all([
        getDeadlines(course, semester),
        getChanges(course, semester),
      ])
        .then(([nextDeadlines, nextChanges]) => {
          setDeadlines(nextDeadlines);
          setChanges(nextChanges);
        })
        .finally(() => {
          if (showLoading) setLoading(false);
        });
    },
    [course, semester]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAsk = async (question: string): Promise<AnswerCardData> => {
    const answer = await ask(question, course, semester);
    // After asking, re-fetch changes in case a new fact was published
    fetchData(false);
    return answer;
  };

  const openSource = (factId: string, notice: string, page: number) => {
    setDrawerData({ factId, notice, page });
    setDrawerOpen(true);
  };

  const handleIntentAsk = (question: string) => {
    setPendingQuestion({ q: question, n: Date.now() });
  };

  return (
    <div className="flex h-[calc(100dvh_-_7.5rem_-_env(safe-area-inset-bottom))] flex-col overflow-hidden lg:h-[calc(100dvh_-_3.5rem_-_1px)]">
      <ContextBar
        course={course}
        semester={semester}
        courses={courses}
        onChange={update}
      />

      <div className="flex-1 min-h-0">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-4 md:px-8 xl:px-12 py-4">
          <div className={`mb-4 flex-shrink-0 ${isAskView ? "hidden lg:block" : ""}`}>
            <p className="text-base font-semibold text-navy-700 dark:text-night-text">
              What do you want to know today?
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border px-3 py-1 text-xs font-medium text-slate-500 dark:text-night-muted shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Last updated: 12 Nov 2026
            </span>
          </div>

          <div className="grid flex-1 min-h-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div
              className={`${isAskView ? "hidden lg:flex" : "flex"} min-h-0 flex-col gap-4 overflow-y-auto thin-scrollbar pr-1 lg:overflow-visible lg:pr-0`}
            >
              <div className="flex-shrink-0">
                <DeadlineStrip deadlines={deadlines} loading={loading} />
              </div>
              <div className="lg:flex-1 lg:min-h-0">
                <ChangeFeed changes={changes} loading={loading} onSource={openSource} />
              </div>
              <div className="flex-shrink-0">
                <IntentTiles onAsk={handleIntentAsk} />
              </div>
            </div>

            <div
              className={`${isAskView ? "flex" : "hidden lg:flex"} min-h-0 flex-col`}
            >
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-night-border bg-white dark:bg-night-card shadow-card">
                <div className="flex flex-shrink-0 items-center gap-3 border-b border-slate-100 dark:border-night-border px-4 py-3 sm:px-5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-night-text">
                      Ask Pramaan
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-night-muted">
                      Verified answers from official notices
                    </p>
                  </div>
                </div>
                <div className="min-h-0 flex-1 p-4 sm:p-5">
                  <ChatBox
                    onAsk={handleAsk}
                    onSource={openSource}
                    initialQuestion={pendingQuestion?.q ?? null}
                    initialNonce={pendingQuestion?.n}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex-shrink-0 border-t border-slate-100 dark:border-night-border bg-white/90 dark:bg-night-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 md:px-8 xl:px-12 py-2">
          <p className="text-[11px] text-slate-500 dark:text-night-muted">
            Sample data for demo purposes
          </p>
        </div>
      </footer>

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
