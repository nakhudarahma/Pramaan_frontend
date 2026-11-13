import { ChevronDown } from "lucide-react";
import type { CourseId, Semester } from "../types";

interface Props {
  course: CourseId;
  semester: Semester;
  courses: { id: CourseId; label: string }[];
  onChange: (course: CourseId, sem: Semester) => void;
}

export default function ContextBar({ course, semester, courses, onChange }: Props) {
  const semesters = [1, 2, 3, 4, 5, 6];

  const courseLabel = courses.find((c) => c.id === course)?.label || course;

  return (
    <div className="bg-white/80 dark:bg-night-card/80 backdrop-blur-md border-b border-slate-200/80 dark:border-night-border transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-night-muted">
            Viewing as
          </span>
          <span className="text-sm font-semibold text-navy-600 dark:text-sky-300">
            {courseLabel}, Sem {semester}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={course}
              onChange={(e) => onChange(e.target.value as CourseId, semester)}
              className="w-full appearance-none bg-slate-50 dark:bg-night-page border border-slate-200 dark:border-night-border rounded-xl py-3 pl-3 pr-9 text-sm font-medium text-slate-700 dark:text-night-text focus:outline-none focus:border-sky-300 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400 cursor-pointer transition-colors"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-night-muted pointer-events-none" />
          </div>
          <div className="relative w-28">
            <select
              value={semester}
              onChange={(e) => onChange(course, Number(e.target.value) as Semester)}
              className="w-full appearance-none bg-slate-50 dark:bg-night-page border border-slate-200 dark:border-night-border rounded-xl py-3 pl-3 pr-9 text-sm font-medium text-slate-700 dark:text-night-text focus:outline-none focus:border-sky-300 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400 cursor-pointer transition-colors"
            >
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-night-muted pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
