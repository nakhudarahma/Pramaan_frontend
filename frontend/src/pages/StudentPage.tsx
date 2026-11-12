import { useState, useEffect, useCallback } from "react";
import { ask, getDeadlines, getChanges } from "../api";
import type { AnswerCardData, Deadline, ChangeItem } from "../types";
import { useContext } from "../useContext";
import ContextBar from "../components/ContextBar";
import DeadlineStrip from "../components/DeadlineStrip";
import ChangeFeed from "../components/ChangeFeed";
import IntentTiles from "../components/IntentTiles";
import ChatLauncher from "../components/ChatLauncher";
import SourceDrawer from "../components/SourceDrawer";

export default function StudentPage() {
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
          <div className="mb-4 flex-shrink-0">
            <p className="text-base font-semibold text-navy-700 dark:text-night-text">
              What do you want to know today?
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-night-card border border-slate-200 dark:border-night-border px-3 py-1 text-xs font-medium text-slate-500 dark:text-night-muted shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Last updated: 12 Nov 2026
            </span>
          </div>

          <div className="flex flex-col flex-1 min-h-0 gap-4 overflow-y-auto thin-scrollbar pr-1">
            <div className="flex-shrink-0">
              <DeadlineStrip deadlines={deadlines} loading={loading} />
            </div>
            <div className="flex-1 min-h-0">
              <ChangeFeed changes={changes} loading={loading} onSource={openSource} />
            </div>
            <div className="flex-shrink-0">
              <IntentTiles onAsk={handleIntentAsk} />
            </div>
          </div>
        </div>
      </div>


      {/* Floating chat launcher */}
      <ChatLauncher
        onAsk={handleAsk}
        onSource={openSource}
        initialQuestion={pendingQuestion?.q ?? null}
        initialNonce={pendingQuestion?.n}
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
