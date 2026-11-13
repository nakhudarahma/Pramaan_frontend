import { useState, useEffect, useCallback } from "react";
import type { CourseId, Semester } from "./types";
import { COURSES, SEMESTERS } from "./types";

const CONTEXT_KEY = "pramaan-context";

export function getSavedContext(): { course: CourseId; semester: Semester } | null {
  try {
    const raw = localStorage.getItem(CONTEXT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validCourse = COURSES.some((c) => c.id === parsed.course);
    const validSem = SEMESTERS.includes(parsed.semester);
    if (validCourse && validSem) {
      return { course: parsed.course, semester: parsed.semester };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function hasSavedContext(): boolean {
  return getSavedContext() !== null;
}

export function useContext() {
  const [course, setCourse] = useState<CourseId>("bsc-ds");
  const [semester, setSemester] = useState<Semester>(4);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTEXT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const validCourse = COURSES.some((c) => c.id === parsed.course);
        const validSem = SEMESTERS.includes(parsed.semester);
        if (validCourse) setCourse(parsed.course);
        if (validSem) setSemester(parsed.semester);
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
