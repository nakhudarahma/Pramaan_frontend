import type {
  AnswerCardData,
  CourseId,
  Semester,
  Deadline,
  ChangeItem,
  NoticeRecord,
  FactRow,
  UnansweredItem,
} from "./types";
import {
  seedDeadlines,
  seedChanges,
  seedNotices,
  seedFacts,
  seedFactRows,
  seedUnanswered,
  seedNoticesForReview,
} from "./mockData";

const USE_MOCK = true;
const MOCK_DELAY = 600;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- localStorage persistence ----------

const STORAGE_KEY = "pramaan-demo-state-v3";

interface PersistedState {
  facts: typeof seedFacts;
  factRows: FactRow[];
  changes: ChangeItem[];
  unanswered: UnansweredItem[];
  notices: NoticeRecord[];
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    /* ignore */
  }
  const fresh: PersistedState = {
    facts: structuredClone(seedFacts),
    factRows: structuredClone(seedFactRows),
    changes: structuredClone(seedChanges),
    unanswered: structuredClone(seedUnanswered),
    notices: structuredClone(seedNotices),
  };
  saveState(fresh);
  return fresh;
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function resetDemo() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---------- keyword matching ----------

function matchFact(
  question: string
): { key: string; data: (typeof seedFacts)[string] } | null {
  const state = loadState();
  const q = question.toLowerCase();
  const scored: { key: string; data: (typeof seedFacts)[string]; score: number }[] = [];

  for (const [key, data] of Object.entries(state.facts)) {
    let score = 0;
    for (const kw of data.keywords) {
      if (q.includes(kw)) score += kw.split(" ").length;
    }
    if (score > 0) scored.push({ key, data, score });
  }

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  return { key: scored[0].key, data: scored[0].data };
}

const FACT_TO_NOTICE: Record<string, string> = {
  "f-latefee": "n10",
  "f-examform": "n25",
  "f-labexam-a": "n18",
  "f-labexam-b": "n19",
  "f-hostel": "n07",
  "f-latefee-new": "n12",
};

const CATEGORY_BY_FACT: Record<string, string> = {
  lateFee: "Fees",
  examForm: "Exams",
  labExam: "Exams",
  hostelFee: "Hostel",
};

// ---------- API functions ----------

export async function ask(
  question: string,
  course: CourseId,
  sem: Semester
): Promise<AnswerCardData> {
  if (!USE_MOCK) {
    const res = await fetch(
      `/api/ask?q=${encodeURIComponent(question)}&course=${course}&sem=${sem}`
    );
    return res.json();
  }
  await delay(MOCK_DELAY);
  const match = matchFact(question);
  const state = loadState();

  // No match -> unavailable, and log to unanswered
  if (!match) {
    const existing = state.unanswered.find(
      (u) => u.question.toLowerCase() === question.toLowerCase().trim()
    );
    if (existing) {
      existing.count += 1;
    } else {
      state.unanswered.unshift({
        id: `u${Date.now()}`,
        question: question.trim(),
        count: 1,
      });
    }
    saveState(state);
    return {
      state: "unavailable",
      text: "Not in official records yet.",
      appliesTo: `${courseLabel(course)}, Sem ${sem}`,
      validUntil: "—",
      sources: [],
      contact: "Exam Cell",
      note: "Your question was logged for the admin.",
    };
  }

  const f = match.data;

  const primaryNotice =
    state.notices.find((n) => n.id === FACT_TO_NOTICE[f.sources[0]?.factId]) ||
    state.notices[0];
  const noticeMeta = primaryNotice
    ? {
        issuedBy: primaryNotice.issuer,
        noticeNumber: primaryNotice.id.toUpperCase(),
        noticeDate: primaryNotice.date,
        category: CATEGORY_BY_FACT[match.key] || "General",
      }
    : {};

  // Hostel fee scope check — only sem 1-2
  if (match.key === "hostelFee" && (sem > 2)) {
    return {
      state: "unavailable",
      text: "This applies to a different semester. Change your selection?",
      appliesTo: "All courses, Sem 1–2",
      validUntil: "15 Nov 2026",
      sources: f.sources,
      contact: "Hostel Office",
      note: "Your question was logged for the admin.",
      ...noticeMeta,
    };
  }

  // Disputed state — lab exam
  if (f.value === "DISPUTED") {
    return {
      state: "disputed",
      text: "Two notices disagree on this fact.",
      appliesTo: f.appliesTo,
      validUntil: f.validUntil,
      sources: f.sources,
      contact: "Examination Cell",
      ...noticeMeta,
    };
  }

  // Check if outdated — if there's a pending approved change that supersedes
  const supersedingChange = state.changes.find(
    (c) => c.factId === f.factId && c.approved
  );
  if (supersedingChange) {
    // The fact should already be updated — return verified with new value
  }

  return {
    state: "verified",
    text: f.value,
    appliesTo: f.appliesTo,
    validUntil: f.validUntil,
    replaces: f.replaces,
    sources: f.sources,
    contact: f.contact,
    ...noticeMeta,
  };
}

export async function getDeadlines(
  course: CourseId,
  sem: Semester
): Promise<Deadline[]> {
  if (!USE_MOCK) {
    const res = await fetch(`/api/deadlines?course=${course}&sem=${sem}`);
    return res.json();
  }
  await delay(MOCK_DELAY);
  return seedDeadlines.filter(
    (d) => d.course === course && d.semester === sem
  );
}

export async function getChanges(
  course: CourseId,
  sem: Semester
): Promise<ChangeItem[]> {
  if (!USE_MOCK) {
    const res = await fetch(`/api/changes?course=${course}&sem=${sem}`);
    return res.json();
  }
  await delay(MOCK_DELAY);
  return loadState().changes.filter(
    (c) => c.course === course && c.semester === sem && c.approved
  );
}

export async function getSource(factId: string): Promise<NoticeRecord> {
  if (!USE_MOCK) {
    const res = await fetch(`/api/source/${factId}`);
    return res.json();
  }
  await delay(300);
  const state = loadState();
  const noticeId = FACT_TO_NOTICE[factId] || "n10";
  const notice = state.notices.find((n) => n.id === noticeId) || state.notices[0];
  return notice;
}

export async function uploadNotice(
  _file: File
): Promise<{ noticeId: string; review: typeof seedNoticesForReview; factRows: FactRow[] }> {
  if (!USE_MOCK) {
    const formData = new FormData();
    formData.append("file", _file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    return res.json();
  }
  await delay(2000);
  const state = loadState();
  return {
    noticeId: "n12",
    review: seedNoticesForReview,
    factRows: state.factRows.filter((r) => r.status === "pending"),
  };
}

export async function getReview(
  noticeId: string
): Promise<{ review: typeof seedNoticesForReview; factRows: FactRow[] }> {
  if (!USE_MOCK) {
    const res = await fetch(`/api/review/${noticeId}`);
    return res.json();
  }
  await delay(300);
  const state = loadState();
  return {
    review: seedNoticesForReview,
    factRows: state.factRows.filter((r) => r.status === "pending"),
  };
}

export async function approveFact(id: string): Promise<FactRow[]> {
  if (!USE_MOCK) {
    const res = await fetch(`/api/facts/${id}/approve`, { method: "POST" });
    return res.json();
  }
  await delay(300);
  const state = loadState();
  const row = state.factRows.find((r) => r.id === id);
  if (row) {
    row.status = "approved";

    // Update the live fact and add a change feed item
    if (row.factKey.toLowerCase().includes("late fee")) {
      state.facts.lateFee = {
        ...state.facts.lateFee,
        value: row.value,
        replaces: "Notice 10 Nov (Rs. 50)",
        sources: [{ factId: "f-latefee-new", notice: "Notice 12 Nov", page: 2 }],
      };
      state.changes.unshift({
        id: `c${Date.now()}`,
        label: "Late fee",
        oldValue: row.oldValue || "Rs. 50",
        newValue: row.value,
        noticeDate: "12 Nov",
        factId: "f-latefee-new",
        noticeTitle: "Notice 12 Nov",
        page: 2,
        course: row.scope.course,
        semester: row.scope.semester,
        approved: true,
      });
    }
  }
  saveState(state);
  return state.factRows.filter((r) => r.status === "pending");
}

export async function rejectFact(id: string): Promise<FactRow[]> {
  if (!USE_MOCK) {
    const res = await fetch(`/api/facts/${id}/reject`, { method: "POST" });
    return res.json();
  }
  await delay(300);
  const state = loadState();
  const row = state.factRows.find((r) => r.id === id);
  if (row) row.status = "rejected";
  saveState(state);
  return state.factRows.filter((r) => r.status === "pending");
}

export async function editFact(id: string, value: string): Promise<FactRow[]> {
  if (!USE_MOCK) {
    const res = await fetch(`/api/facts/${id}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    return res.json();
  }
  await delay(300);
  const state = loadState();
  const row = state.factRows.find((r) => r.id === id);
  if (row) row.value = value;
  saveState(state);
  return state.factRows.filter((r) => r.status === "pending");
}

export async function getUnanswered(): Promise<UnansweredItem[]> {
  if (!USE_MOCK) {
    const res = await fetch("/api/unanswered");
    return res.json();
  }
  await delay(300);
  return loadState().unanswered;
}

export async function getNotices(): Promise<NoticeRecord[]> {
  if (!USE_MOCK) {
    const res = await fetch("/api/notices");
    return res.json();
  }
  await delay(400);
  return loadState().notices;
}

export async function publishFacts(
  approvedIds: string[]
): Promise<{ count: number; affected: string }> {
  if (!USE_MOCK) {
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: approvedIds }),
    });
    return res.json();
  }
  await delay(500);
  return { count: approvedIds.length, affected: "B.Sc Data Science Sem 4" };
}

// ---------- helpers ----------

export function courseLabel(id: CourseId): string {
  const map: Record<CourseId, string> = {
    "bsc-ds": "B.Sc Data Science",
    "bsc-cs": "B.Sc Computer Science",
    "bsc-it": "B.Sc Information Technology",
    bcom: "B.Com",
    bms: "BMS",
    baf: "BAF",
    ba: "BA",
  };
  return map[id];
}
