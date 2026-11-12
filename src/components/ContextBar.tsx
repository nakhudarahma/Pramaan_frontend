import { ChevronDown } from "lucide-react";
import type { CourseId, Semester } from "../types";

interface Props {
  course: CourseId;
  semester: Semester;
  courses: { id: CourseId; label: string }[];
  onChange: (course: CourseId, sem: Semester) => void;
}

export default function ContextBar({ course, semester, courses, onChange }: Props) {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const courseLabel = courses.find((c) => c.id === course)?.label || course;

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Viewing as
          </span>
          <span className="text-sm font-semibold text-indigo-600">
            {courseLabel}, Sem {semester}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={course}
              onChange={(e) => onChange(e.target.value as CourseId, semester)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative w-28">
            <select
              value={semester}
              onChange={(e) => onChange(course, Number(e.target.value) as Semester)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3 pr-9 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
