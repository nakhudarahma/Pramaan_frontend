// Type definitions for Pramaan

export type CourseId =
  | "bsc-ds"
  | "bsc-cs"
  | "bsc-it"
  | "bcom"
  | "bms"
  | "baf"
  | "ba";
export type Semester = 1 | 2 | 3 | 4 | 5 | 6;

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
  issuedBy?: string;
  noticeNumber?: string;
  noticeDate?: string;
  category?: string;
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
  category: string;
  noticeNumber: string;
  replaces?: string;
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
  { id: "bsc-ds", label: "B.Sc Data Science" },
  { id: "bsc-cs", label: "B.Sc Computer Science" },
  { id: "bsc-it", label: "B.Sc Information Technology" },
  { id: "bcom", label: "B.Com" },
  { id: "bms", label: "BMS" },
  { id: "baf", label: "BAF" },
  { id: "ba", label: "BA" },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6] as const;
