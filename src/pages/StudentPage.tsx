import { useState, useEffect, useCallback } from "react";
import { ask, getDeadlines, getChanges } from "../api";
import type { AnswerCardData, Deadline, ChangeItem } from "../types";
import { useContext } from "../useContext";
import ContextBar from "../components/ContextBar";
import DeadlineStrip from "../components/DeadlineStrip";
import ChangeFeed from "../components/ChangeFeed";
import IntentTiles from "../components/IntentTiles";
import ChatBox from "../components/ChatBox";
import SourceDrawer from "../components/SourceDrawer";
import { resetDemo } from "../api";

export default function StudentPage() {
  const { course, semester, update, courses } = useContext();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({ factId: "", notice: "", page: 1 });
  const [pendingQuestion, setPendingQuestion] = useState<{ q: string; n: number } | null>(null);

  const fetchData = useCallback(() => {
    getDeadlines(course, semester).then(setDeadlines);
    getChanges(course, semester).then(setChanges);
  }, [course, semester]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAsk = async (question: string): Promise<AnswerCardData> => {
    const answer = await ask(question, course, semester);
    // After asking, re-fetch changes in case a new fact was published
    fetchData();
    return answer;
  };

  const openSource = (factId: string, notice: string, page: number) => {
    setDrawerData({ factId, notice, page });
    setDrawerOpen(true);
  };

  const handleIntentAsk = (question: string) => {
    setPendingQuestion({ q: question, n: Date.now() });
  };

  const handleReset = () => {
    resetDemo();
    localStorage.removeItem("pramaan-context");
    window.location.reload();
  };

  return (
    <div>
      <ContextBar
        course={course}
        semester={semester}
        courses={courses}
        onChange={update}
      />

      <div className="max-w-2xl mx-auto py-4 pb-24 md:pb-8">
        <DeadlineStrip deadlines={deadlines} />
        <ChangeFeed changes={changes} onSource={openSource} />
        <IntentTiles onAsk={handleIntentAsk} />

        {/* Chat section */}
        <div className="px-4 mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Ask Pramaan
          </h2>
        </div>
        <ChatBox
          onAsk={handleAsk}
          onSource={openSource}
          initialQuestion={pendingQuestion?.q ?? null}
          initialNonce={pendingQuestion?.n}
        />

        {/* Footer with reset */}
        <div className="px-4 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors"
          >
            Reset demo
          </button>
        </div>
      </div>

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
