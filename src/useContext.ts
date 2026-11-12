import { useState, useEffect, useCallback } from "react";
import type { CourseId, Semester } from "./types";
import { COURSES } from "./types";

const CONTEXT_KEY = "pramaan-context";

export function useContext() {
  const [course, setCourse] = useState<CourseId>("btech-cs");
  const [semester, setSemester] = useState<Semester>(4);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTEXT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.course) setCourse(parsed.course);
        if (parsed.semester) setSemester(parsed.semester);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback((c: CourseId, s: Semester) => {
    setCourse(c);
    setSemester(s);
    localStorage.setItem(CONTEXT_KEY, JSON.stringify({ course: c, semester: s }));
  }, []);

  return { course, semester, update, courses: COURSES };
}
