import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import type { CourseId, Semester } from "../types";

interface Props {
  courses: { id: CourseId; label: string }[];
  initialCourse?: CourseId;
  initialSemester?: Semester;
  onContinue: (course: CourseId, semester: Semester) => void;
}

const SEMESTERS: Semester[] = [1, 2, 3, 4, 5, 6];

export default function WelcomeScreen({
  courses,
  initialCourse,
  initialSemester,
  onContinue,
}: Props) {
  const [course, setCourse] = useState<CourseId | "">(initialCourse ?? "");
  const [semester, setSemester] = useState<Semester | "">(initialSemester ?? "");

  const ready = course !== "" && semester !== "";

  const handleContinue = () => {
    if (course !== "" && semester !== "") {
      onContinue(course, semester);
    }
  };

  const selectClass =
    "w-full appearance-none bg-slate-50 dark:bg-night-page border border-slate-200 dark:border-night-border rounded-xl py-3 pl-3 pr-9 text-sm font-medium text-slate-700 dark:text-night-text focus:outline-none focus:border-sky-300 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400 cursor-pointer transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-page dark:bg-night-page p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 dark:border-night-border bg-white dark:bg-night-card p-6 sm:p-8 shadow-card animate-fade-in">
        <div className="mb-5 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-sky/40 blur-xl" aria-hidden="true" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-600">
              <ShieldCheck className="h-8 w-8 text-accent" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h1 className="text-center text-xl sm:text-2xl font-bold text-navy-700 dark:text-night-text">
          Welcome to Pramaan
        </h1>
        <p className="mt-1.5 text-center text-sm text-slate-500 dark:text-night-muted">
          Pick your course and semester to see only what applies to you.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="welcome-course"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-night-muted"
            >
              Course
            </label>
            <div className="relative">
              <select
                id="welcome-course"
                value={course}
                onChange={(e) => setCourse(e.target.value as CourseId | "")}
                className={selectClass}
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-night-muted" />
            </div>
          </div>

          <div>
            <label
              htmlFor="welcome-semester"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-night-muted"
            >
              Semester
            </label>
            <div className="relative">
              <select
                id="welcome-semester"
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value ? (Number(e.target.value) as Semester) : "")
                }
                className={selectClass}
              >
                <option value="">Select semester</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-night-muted" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!ready}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky to-navy-600 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>

        <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-night-muted">
          Your choice is saved on this device.
        </p>
      </div>
    </div>
  );
}
