import type {
  Deadline,
  ChangeItem,
  NoticeRecord,
  FactRow,
  UnansweredItem,
  CourseId,
  Semester,
} from "./types";

// Initial seed data. These are the defaults that get written to localStorage
// when the demo starts or is reset.

export const seedDeadlines: Deadline[] = [
  {
    id: "d1",
    title: "Fee payment",
    date: "20 Nov 2026",
    daysLeft: 9,
    course: "btech-cs",
    semester: 4,
  },
  {
    id: "d2",
    title: "Exam form",
    date: "25 Nov 2026",
    daysLeft: 14,
    course: "btech-cs",
    semester: 4,
  },
  {
    id: "d3",
    title: "Fee payment",
    date: "20 Nov 2026",
    daysLeft: 9,
    course: "btech-it",
    semester: 3,
  },
  {
    id: "d4",
    title: "Exam form",
    date: "25 Nov 2026",
    daysLeft: 14,
    course: "bsc-ds",
    semester: 2,
  },
];

export const seedChanges: ChangeItem[] = [
  // Notice 2 (12 Nov) is pending — shows in admin review, not in student feed until approved
];

export const seedNotices: NoticeRecord[] = [
  {
    id: "n10",
    title: "Late Fee Circular — November 2026",
    issuer: "Accounts Office",
    date: "10 Nov 2026",
    page: 1,
    status: "current",
    body: "This is to inform all students that a late fee of Rs. 50 will be charged for fee payments made after the due date of 20 November 2026. This applies to B.Tech CS Semester 4 students.",
    highlightedSentence:
      "a late fee of Rs. 50 will be charged for fee payments made after the due date of 20 November 2026",
  },
  {
    id: "n12",
    title: "Revised Late Fee Circular — November 2026",
    issuer: "Accounts Office",
    date: "12 Nov 2026",
    page: 2,
    status: "current",
    body: "Pursuant to the earlier circular dated 10 November 2026, the late fee has been revised to Rs. 75 for all late fee payments. This supersedes the previous circular. Applies to B.Tech CS Semester 4 students.",
    highlightedSentence:
      "the late fee has been revised to Rs. 75 for all late fee payments",
  },
  {
    id: "n25",
    title: "Exam Form Submission Deadline",
    issuer: "Examination Cell",
    date: "05 Nov 2026",
    page: 1,
    status: "current",
    body: "All students of Semester 4 are required to submit their examination forms on or before 25 November 2026. Forms submitted after this date will not be accepted.",
    highlightedSentence:
      "submit their examination forms on or before 25 November 2026",
  },
  {
    id: "n18",
    title: "Lab Examination Timings — Semester 4",
    issuer: "Examination Cell",
    date: "08 Nov 2026",
    page: 3,
    status: "current",
    body: "The laboratory examinations for Semester 4 will be conducted from 9:00 AM to 12:00 PM in the respective labs.",
    highlightedSentence:
      "laboratory examinations for Semester 4 will be conducted from 9:00 AM to 12:00 PM",
  },
  {
    id: "n19",
    title: "Revised Lab Examination Timings",
    issuer: "Academic Section",
    date: "11 Nov 2026",
    page: 1,
    status: "current",
    body: "The laboratory examinations for Semester 4 will now be conducted from 2:00 PM to 5:00 PM. Students should report to their labs by 1:45 PM.",
    highlightedSentence:
      "laboratory examinations for Semester 4 will now be conducted from 2:00 PM to 5:00 PM",
  },
  {
    id: "n07",
    title: "Hostel Fee Payment Notice",
    issuer: "Hostel Office",
    date: "03 Nov 2026",
    page: 1,
    status: "current",
    body: "Hostel fee for the current semester is due by 15 November 2026. This applies to Semester 1 and Semester 2 students only. Fee amount is Rs. 12,000.",
    highlightedSentence:
      "Hostel fee for the current semester is due by 15 November 2026",
  },
];

// Facts are the approved answers the chatbot can use.
// factId -> fact data
export const seedFacts: Record<string, {
  factId: string;
  key: string;
  value: string;
  appliesTo: string;
  validUntil: string;
  replaces?: string;
  sources: { factId: string; notice: string; page: number }[];
  contact?: string;
  keywords: string[];
  scope: { course: CourseId; semester: Semester } | "all";
}> = {
  lateFee: {
    factId: "f-latefee",
    key: "late fee",
    value: "Rs. 50",
    appliesTo: "B.Tech CS, Sem 4",
    validUntil: "20 Nov 2026",
    sources: [{ factId: "f-latefee", notice: "Notice 10 Nov", page: 1 }],
    keywords: ["fee", "late", "late fee", "penalty"],
    scope: { course: "btech-cs", semester: 4 },
  },
  examForm: {
    factId: "f-examform",
    key: "exam form",
    value: "25 November 2026",
    appliesTo: "B.Tech CS, Sem 4",
    validUntil: "25 Nov 2026",
    sources: [{ factId: "f-examform", notice: "Notice 05 Nov", page: 1 }],
    keywords: ["exam form", "form", "submission", "last date"],
    scope: { course: "btech-cs", semester: 4 },
  },
  labExam: {
    factId: "f-labexam",
    key: "lab exam time",
    value: "DISPUTED",
    appliesTo: "B.Tech CS, Sem 4",
    validUntil: "—",
    sources: [
      { factId: "f-labexam-a", notice: "Notice 08 Nov", page: 3 },
      { factId: "f-labexam-b", notice: "Notice 11 Nov", page: 1 },
    ],
    keywords: ["lab", "lab exam", "practical", "timing", "time"],
    scope: { course: "btech-cs", semester: 4 },
  },
  hostelFee: {
    factId: "f-hostel",
    key: "hostel fee",
    value: "Rs. 12,000 due 15 November 2026",
    appliesTo: "All courses, Sem 1–2",
    validUntil: "15 Nov 2026",
    sources: [{ factId: "f-hostel", notice: "Notice 03 Nov", page: 1 }],
    keywords: ["hostel", "hostel fee", "dorm", "accommodation"],
    scope: "all",
  },
};

export const seedFactRows: FactRow[] = [
  {
    id: "fr1",
    factKey: "Late fee",
    value: "Rs. 75",
    oldValue: "Rs. 50",
    scope: { course: "btech-cs", semester: 4 },
    replaces: "Notice 10 Nov",
    status: "pending",
    noticeId: "n12",
  },
  {
    id: "fr2",
    factKey: "Lab exam time",
    value: "2:00 PM – 5:00 PM",
    oldValue: "9:00 AM – 12:00 PM",
    scope: { course: "btech-cs", semester: 4 },
    replaces: "Notice 08 Nov",
    status: "pending",
    conflict: "Conflict with notice #18",
    noticeId: "n19",
  },
];

export const seedUnanswered: UnansweredItem[] = [
  { id: "u1", question: "Re-exam date?", count: 14 },
  { id: "u2", question: "Hostel gate timing?", count: 6 },
];

export const seedNoticesForReview = {
  title: "Revised Late Fee Circular — November 2026",
  issuer: "Accounts Office",
  date: "12 Nov 2026",
  page: 2,
  body: "Pursuant to the earlier circular dated 10 November 2026, the late fee has been revised to Rs. 75 for all late fee payments. This supersedes the previous circular. Applies to B.Tech CS Semester 4 students.",
  highlightedSentence:
    "the late fee has been revised to Rs. 75 for all late fee payments",
};
