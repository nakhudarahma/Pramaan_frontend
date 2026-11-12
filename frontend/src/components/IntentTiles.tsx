import { useState } from "react";
import { GraduationCap, Calendar, Clock, ClipboardList, Trophy, LayoutGrid } from "lucide-react";

interface Props {
  onAsk: (question: string) => void;
}

const TILES = [
  { label: "Fees", icon: GraduationCap, question: "What is the late fee?", count: 4 },
  { label: "Exams", icon: ClipboardList, question: "Exam form last date?", count: 6 },
  { label: "Timetable", icon: Clock, question: "Lab exam time?", count: 3 },
  { label: "Admissions", icon: Calendar, question: "Admission deadline?", count: 2 },
  { label: "Activities", icon: Trophy, question: "What activities are happening?", count: 4 },
];

export default function IntentTiles({ onAsk }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <LayoutGrid className="w-4 h-4 text-sky-500 dark:text-sky-400" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-night-text">
          Quick topics
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.label}
              onClick={() => {
                setSelected(tile.label);
                onAsk(tile.question);
              }}
              className={`flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border shadow-card p-2 sm:p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
                selected === tile.label
                  ? "border-navy-600 bg-sky-50 dark:border-sky-400 dark:bg-sky-400/10"
                  : "bg-white dark:bg-night-card border-slate-100 dark:border-night-border hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-md"
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                  selected === tile.label ? "bg-white dark:bg-sky-400/15" : "bg-sky-50 dark:bg-sky-400/10"
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    selected === tile.label ? "text-navy-600 dark:text-sky-300" : "text-sky-500 dark:text-sky-400"
                  }`}
                />
              </div>
              <span className="w-full truncate text-[9px] sm:text-[11px] font-medium text-slate-600 dark:text-night-text text-center leading-tight">
                {tile.label}
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 dark:text-night-muted leading-none">
                {tile.count} notices
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
