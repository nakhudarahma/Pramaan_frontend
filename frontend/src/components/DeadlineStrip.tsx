import { useEffect, useRef, useState } from "react";
import { CalendarClock, CalendarPlus, ArrowRight, Check } from "lucide-react";
import type { Deadline } from "../types";
import Toast from "./Toast";

interface Props {
  deadlines: Deadline[];
  loading?: boolean;
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? value
      : 0
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const duration = 700;

    setDisplay(0);
    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDeadlineDate(value: string): Date | null {
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = MONTH_INDEX[match[2]];
  const year = Number(match[3]);
  if (month === undefined) return null;
  return new Date(year, month, day);
}

function toIcsDate(date: Date): string {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function toIcsTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function downloadDeadlineIcs(deadline: Deadline): void {
  const start = parseDeadlineDate(deadline.date);
  if (!start) return;
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pramaan//Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${deadline.id}@pramaan`,
    `DTSTAMP:${toIcsTimestamp(new Date())}`,
    `DTSTART;VALUE=DATE:${toIcsDate(start)}`,
    `DTEND;VALUE=DATE:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(deadline.title)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n") + "\r\n"], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `deadline-${deadline.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function DeadlineStrip({ deadlines, loading }: Props) {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState(0);
  const addedTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current !== null) {
        window.clearTimeout(addedTimer.current);
      }
    };
  }, []);

  const handleAddToCalendar = (deadline: Deadline) => {
    downloadDeadlineIcs(deadline);
    setAddedId(deadline.id);
    setAddedToast((count) => count + 1);

    if (addedTimer.current !== null) {
      window.clearTimeout(addedTimer.current);
    }
    addedTimer.current = window.setTimeout(() => setAddedId(null), 1000);
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-night-text">Next deadlines</span>
        </div>
        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-3 sm:gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[155px] flex-shrink-0 sm:w-auto sm:flex-1 sm:min-w-0 bg-white/90 dark:bg-night-card/90 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-3 xl:p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
              <div className="skeleton h-4 w-32 rounded mb-2" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (deadlines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-night-border bg-white dark:bg-night-card p-6">
        <p className="text-sm text-slate-500 dark:text-night-muted">No upcoming deadlines for your selection.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-night-text">
            Next deadlines
          </h2>
        </div>
        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-3 sm:gap-3">
          {deadlines.map((d) => {
            const countdownTone =
              d.daysLeft < 7
                ? "text-rose-600 dark:text-rose-400"
                : d.daysLeft <= 14
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400";

            return (
              <div
                key={d.id}
                className="student-card flex w-[155px] flex-shrink-0 flex-col justify-between bg-white/90 dark:bg-night-card/90 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-night-border shadow-card p-3 xl:p-5 sm:w-auto sm:flex-1 sm:min-w-0 sm:h-full"
              >
                <div>
                  <div className="flex items-center gap-1.5 xl:gap-2 mb-2">
                    <div className="w-7 h-7 xl:w-9 xl:h-9 rounded-lg xl:rounded-xl bg-sky-50 dark:bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                      <CalendarClock className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-sky-500 dark:text-sky-400" />
                    </div>
                    <span
                      aria-label={`${d.daysLeft} days left`}
                      className={`inline-flex items-center gap-1 text-[11px] xl:text-xs font-bold ${countdownTone} ${
                        d.daysLeft < 7 ? "deadline-pulse" : ""
                      }`}
                    >
                      <CountUp value={d.daysLeft} />d left
                      {d.daysLeft < 5 && (
                        <span className="relative flex h-1.5 w-1.5" aria-label="Urgent">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-[12px] xl:text-[15px] font-semibold text-slate-900 dark:text-night-text leading-tight line-clamp-2 min-h-[2rem] sm:min-h-0">
                    {d.title}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60 dark:border-night-border/40 sm:border-0 sm:pt-0 sm:mt-1">
                  <div className="text-[10px] xl:text-xs text-slate-500 dark:text-night-muted flex items-center gap-1">
                    {d.date}
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCalendar(d)}
                    aria-label={
                      addedId === d.id
                        ? `Added ${d.title} to calendar file`
                        : `Add ${d.title} to calendar`
                    }
                    title="Add to calendar"
                    className="inline-flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:text-night-muted dark:hover:text-sky-400 dark:hover:bg-sky-400/10 transition-colors flex-shrink-0"
                  >
                    {addedId === d.id ? (
                      <Check className="calendar-check w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <CalendarPlus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {addedToast > 0 && (
        <Toast
          key={addedToast}
          message="Added to calendar file"
          duration={1800}
          onDone={() => setAddedToast(0)}
        />
      )}
    </>
  );
}
