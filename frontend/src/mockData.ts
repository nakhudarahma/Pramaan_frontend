import type {
  Deadline,
  ChangeItem,
  NoticeRecord,
  FactRow,
  UnansweredItem,
  CourseId,
  Semester,
} from "./types";
import { COURSES, SEMESTERS } from "./types";

// Initial seed data. These are the defaults that get written to localStorage
// when the demo starts or is reset.

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function daysLeftFromToday(date: Date): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000));
}

const DEADLINE_TITLES = [
  "Fee payment",
  "Exam form",
  "Project submission",
  "Practical registration",
];

// Base dates within Nov–Dec 2026.
const DEADLINE_BASE_DATES = [
  new Date(2026, 10, 18),
  new Date(2026, 10, 27),
  new Date(2026, 11, 9),
];

function buildDeadlines(): Deadline[] {
  const rows: Deadline[] = [];

  COURSES.forEach((course, ci) => {
    SEMESTERS.forEach((sem, si) => {
      const firstTitle = (ci + si) % DEADLINE_TITLES.length;

      DEADLINE_BASE_DATES.forEach((base, i) => {
        const date = new Date(base);
        date.setDate(base.getDate() + ((ci * 2 + si + i) % 5));

        rows.push({
          id: `d-${course.id}-${sem}-${i}`,
          title: DEADLINE_TITLES[(firstTitle + i) % DEADLINE_TITLES.length],
          date: formatDate(date),
          daysLeft: daysLeftFromToday(date),
          course: course.id,
          semester: sem,
        });
      });
    });
  });

  return rows;
}

export const seedDeadlines: Deadline[] = buildDeadlines();

const CHANGE_TEMPLATES = [
  {
    label: "Exam form deadline",
    oldValue: "25 Nov 2026",
    newValue: "30 Nov 2026",
    factId: "f-examform",
    noticeTitle: "Notice 10 Nov",
    page: 1,
  },
  {
    label: "Late fee",
    oldValue: "Rs. 50",
    newValue: "Rs. 75",
    factId: "f-latefee-new",
    noticeTitle: "Notice 12 Nov",
    page: 2,
  },
];

function buildChanges(): ChangeItem[] {
  const rows: ChangeItem[] = [];

  COURSES.forEach((course, ci) => {
    SEMESTERS.forEach((sem, si) => {
      // Keep the B.Sc Data Science, Sem 4 demo scenario intact.
      if (course.id === "bsc-ds" && sem === 4) {
        rows.push({
          id: "c-bsc-ds-4-latefee",
          label: "Late fee",
          oldValue: "Rs. 50",
          newValue: "Rs. 75",
          noticeDate: "12 Nov 2026",
          factId: "f-latefee-new",
          noticeTitle: "Notice 12 Nov",
          page: 2,
          course: course.id,
          semester: sem,
          approved: true,
        });
        rows.push({
          id: "c-bsc-ds-4-examform",
          label: "Exam form deadline",
          oldValue: "25 Nov 2026",
          newValue: "30 Nov 2026",
          noticeDate: "10 Nov 2026",
          factId: "f-examform",
          noticeTitle: "Notice 10 Nov",
          page: 1,
          course: course.id,
          semester: sem,
          approved: true,
        });
        return;
      }

      const count = (ci + si) % 2 === 0 ? 1 : 2;

      for (let i = 0; i < count; i++) {
        const template =
          CHANGE_TEMPLATES[(ci + si + i) % CHANGE_TEMPLATES.length];
        rows.push({
          id: `c-${course.id}-${sem}-${i}`,
          label: template.label,
          oldValue: template.oldValue,
          newValue: template.newValue,
          noticeDate: i === 0 ? "10 Nov 2026" : "12 Nov 2026",
          factId: template.factId,
          noticeTitle: template.noticeTitle,
          page: template.page,
          course: course.id,
          semester: sem,
          approved: true,
        });
      }
    });
  });

  return rows;
}

export const seedChanges: ChangeItem[] = buildChanges();

export const seedNotices: NoticeRecord[] = [
  {
    id: "n14",
    title: "Annual Sports Day — Call for Entries",
    issuer: "Principal's Office",
    date: "13 Nov 2026",
    page: 1,
    status: "current",
    category: "Activities",
    noticeNumber: "PRM/2026/014",
    body: "Students interested in participating in the Annual Sports Day on 5 December 2026 must register with the Sports Office by 25 November 2026. Team events require a minimum of four participants.",
    highlightedSentence:
      "must register with the Sports Office by 25 November 2026",
  },
  {
    id: "n12",
    title: "Revised Late Fee Circular — November 2026",
    issuer: "Accounts Office",
    date: "12 Nov 2026",
    page: 2,
    status: "current",
    category: "Fees",
    noticeNumber: "PRM/2026/012",
    replaces: "Notice 10 Nov",
    body: "Pursuant to the earlier circular dated 10 November 2026, the late fee has been revised to Rs. 75 for all late fee payments. This supersedes the previous circular. Applies to B.Sc Data Science Semester 4 students.",
    highlightedSentence:
      "the late fee has been revised to Rs. 75 for all late fee payments",
  },
  {
    id: "n19",
    title: "Revised Lab Examination Timings",
    issuer: "Exam Cell",
    date: "11 Nov 2026",
    page: 1,
    status: "current",
    category: "Exams",
    noticeNumber: "PRM/2026/019",
    replaces: "Notice 08 Nov",
    body: "The laboratory examinations for Semester 4 will now be conducted from 2:00 PM to 5:00 PM. Students should report to their labs by 1:45 PM.",
    highlightedSentence:
      "laboratory examinations for Semester 4 will now be conducted from 2:00 PM to 5:00 PM",
  },
  {
    id: "n10",
    title: "Late Fee Circular — November 2026",
    issuer: "Accounts Office",
    date: "10 Nov 2026",
    page: 1,
    status: "superseded",
    category: "Fees",
    noticeNumber: "PRM/2026/010",
    body: "This is to inform all students that a late fee of Rs. 50 will be charged for fee payments made after the due date of 20 November 2026. This applies to B.Sc Data Science Semester 4 students.",
    highlightedSentence:
      "a late fee of Rs. 50 will be charged for fee payments made after the due date of 20 November 2026",
  },
  {
    id: "n21",
    title: "Fee Payment Window Extended",
    issuer: "Accounts Office",
    date: "10 Nov 2026",
    page: 1,
    status: "current",
    category: "Fees",
    noticeNumber: "PRM/2026/021",
    body: "The fee payment window for Semester 4 has been extended to 26 November 2026. Students who have already paid need not take any action.",
    highlightedSentence:
      "The fee payment window for Semester 4 has been extended to 26 November 2026",
  },
  {
    id: "n16",
    title: "Practical Registration — Semester 4",
    issuer: "Exam Cell",
    date: "09 Nov 2026",
    page: 2,
    status: "current",
    category: "Exams",
    noticeNumber: "PRM/2026/016",
    body: "Semester 4 students must complete practical registration by 4 December 2026. Registration is mandatory for all laboratory-based subjects.",
    highlightedSentence:
      "must complete practical registration by 4 December 2026",
  },
  {
    id: "n18",
    title: "Lab Examination Timings — Semester 4",
    issuer: "Exam Cell",
    date: "08 Nov 2026",
    page: 3,
    status: "superseded",
    category: "Exams",
    noticeNumber: "PRM/2026/018",
    body: "The laboratory examinations for Semester 4 will be conducted from 9:00 AM to 12:00 PM in the respective labs.",
    highlightedSentence:
      "laboratory examinations for Semester 4 will be conducted from 9:00 AM to 12:00 PM",
  },
  {
    id: "n08",
    title: "Library Fine Waiver Notice",
    issuer: "Principal's Office",
    date: "06 Nov 2026",
    page: 2,
    status: "expired",
    category: "General",
    noticeNumber: "PRM/2026/008",
    body: "Library fines accrued between 1 and 30 September 2026 may be waived if cleared by 10 November 2026. No further extensions will be granted.",
    highlightedSentence:
      "may be waived if cleared by 10 November 2026",
  },
  {
    id: "n25",
    title: "Exam Form Submission Deadline",
    issuer: "Exam Cell",
    date: "05 Nov 2026",
    page: 1,
    status: "current",
    category: "Exams",
    noticeNumber: "PRM/2026/025",
    body: "All students of Semester 4 are required to submit their examination forms on or before 25 November 2026. Forms submitted after this date will not be accepted.",
    highlightedSentence:
      "submit their examination forms on or before 25 November 2026",
  },
  {
    id: "n05",
    title: "Admission Applications Open — 2027-28",
    issuer: "Principal's Office",
    date: "04 Nov 2026",
    page: 1,
    status: "current",
    category: "Admissions",
    noticeNumber: "PRM/2026/005",
    body: "Applications for undergraduate programmes for the 2027-28 academic year open on 1 December 2026. Applicants must complete the online form before 15 January 2027.",
    highlightedSentence:
      "Applications for undergraduate programmes for the 2027-28 academic year open on 1 December 2026",
  },
  {
    id: "n07",
    title: "Hostel Fee Payment Notice",
    issuer: "Accounts Office",
    date: "03 Nov 2026",
    page: 1,
    status: "current",
    category: "Hostel",
    noticeNumber: "PRM/2026/007",
    body: "Hostel fee for the current semester is due by 15 November 2026. This applies to Semester 1 and Semester 2 students only. Fee amount is Rs. 12,000.",
    highlightedSentence:
      "Hostel fee for the current semester is due by 15 November 2026",
  },
  {
    id: "n03",
    title: "Revised Semester 4 Timetable",
    issuer: "Exam Cell",
    date: "02 Nov 2026",
    page: 1,
    status: "current",
    category: "Timetable",
    noticeNumber: "PRM/2026/003",
    body: "The revised timetable for Semester 4 is effective from 16 November 2026. Practical batches will follow the lab schedule displayed on the department noticeboard.",
    highlightedSentence:
      "The revised timetable for Semester 4 is effective from 16 November 2026",
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
    appliesTo: "B.Sc Data Science, Sem 4",
    validUntil: "20 Nov 2026",
    sources: [{ factId: "f-latefee", notice: "Notice 10 Nov", page: 1 }],
    keywords: ["fee", "late", "late fee", "penalty"],
    scope: { course: "bsc-ds", semester: 4 },
  },
  examForm: {
    factId: "f-examform",
    key: "exam form",
    value: "25 November 2026",
    appliesTo: "B.Sc Data Science, Sem 4",
    validUntil: "25 Nov 2026",
    sources: [{ factId: "f-examform", notice: "Notice 05 Nov", page: 1 }],
    keywords: ["exam form", "form", "submission", "last date"],
    scope: { course: "bsc-ds", semester: 4 },
  },
  labExam: {
    factId: "f-labexam",
    key: "lab exam time",
    value: "DISPUTED",
    appliesTo: "B.Sc Data Science, Sem 4",
    validUntil: "—",
    sources: [
      { factId: "f-labexam-a", notice: "Notice 08 Nov", page: 3 },
      { factId: "f-labexam-b", notice: "Notice 11 Nov", page: 1 },
    ],
    keywords: ["lab", "lab exam", "practical", "timing", "time"],
    scope: { course: "bsc-ds", semester: 4 },
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
  libraryFee: {
    factId: "f-library",
    key: "library membership fee",
    value: "Rs. 500 per year",
    appliesTo: "All courses",
    validUntil: "31 Oct 2026",
    sources: [{ factId: "f-library", notice: "Notice 06 Nov", page: 2 }],
    keywords: ["library", "library fee", "library membership", "membership"],
    scope: "all",
  },
};

export const seedFactRows: FactRow[] = [
  {
    id: "fr1",
    factKey: "Late fee",
    value: "Rs. 75",
    oldValue: "Rs. 50",
    scope: { course: "bsc-ds", semester: 4 },
    replaces: "Notice 10 Nov",
    status: "pending",
    noticeId: "n12",
  },
  {
    id: "fr3",
    factKey: "Exam form deadline",
    value: "30 Nov 2026",
    oldValue: "25 Nov 2026",
    scope: { course: "bsc-ds", semester: 4 },
    replaces: "Notice 05 Nov",
    status: "pending",
    noticeId: "n25",
  },
  {
    id: "fr2",
    factKey: "Lab exam time",
    value: "2:00 PM – 5:00 PM",
    oldValue: "9:00 AM – 12:00 PM",
    scope: { course: "bsc-ds", semester: 4 },
    replaces: "Notice 08 Nov",
    status: "pending",
    conflict: "Conflict with notice #19",
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
  body: "Pursuant to the earlier circular dated 10 November 2026, the late fee has been revised to Rs. 75 for all late fee payments. This supersedes the previous circular. Applies to B.Sc Data Science Semester 4 students.",
  highlightedSentence:
    "the late fee has been revised to Rs. 75 for all late fee payments",
};
