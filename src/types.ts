// Type definitions for Pramaan

export type CourseId = "btech-cs" | "btech-it" | "bsc-ds";
export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type AnswerState = "verified" | "outdated" | "disputed" | "unavailable";

export interface Source {
  factId: string;
  notice: string;
  page: number;
}

export interface AnswerCardData {
  state: AnswerState;
  text: string;
  appliesTo: string;
  validUntil: string;
  replaces?: string;
  sources: Source[];
  contact?: string;
  note?: string;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  course: CourseId;
  semester: Semester;
}

export interface ChangeItem {
  id: string;
  label: string;
  oldValue: string;
  newValue: string;
  noticeDate: string;
  factId: string;
  noticeTitle: string;
  page: number;
  course: CourseId;
  semester: Semester;
  approved: boolean;
}

export interface NoticeRecord {
  id: string;
  title: string;
  issuer: string;
  date: string;
  page: number;
  status: "current" | "superseded" | "expired";
  body: string;
  highlightedSentence: string;
}

export interface FactRow {
  id: string;
  factKey: string;
  value: string;
  oldValue?: string;
  scope: { course: CourseId; semester: Semester };
  replaces?: string;
  status: "pending" | "approved" | "rejected";
  conflict?: string;
  noticeId: string;
}

export interface UnansweredItem {
  id: string;
  question: string;
  count: number;
}

export const COURSES: { id: CourseId; label: string }[] = [
  { id: "btech-cs", label: "B.Tech CS" },
  { id: "btech-it", label: "B.Tech IT" },
  { id: "bsc-ds", label: "B.Sc Data Science" },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
