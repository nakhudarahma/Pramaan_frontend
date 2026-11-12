import { GraduationCap, Calendar, Clock, ClipboardList, Trophy } from "lucide-react";

interface Props {
  onAsk: (question: string) => void;
}

const TILES = [
  { label: "Fees", icon: GraduationCap, question: "What is the late fee?" },
  { label: "Exams", icon: ClipboardList, question: "Exam form last date?" },
  { label: "Timetable", icon: Clock, question: "Lab exam time?" },
  { label: "Admissions", icon: Calendar, question: "Admission deadline?" },
  { label: "Activities", icon: Trophy, question: "What activities are happening?" },
];

export default function IntentTiles({ onAsk }: Props) {
  return (
    <div className="mb-6 px-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
        Quick topics
      </h2>
      <div className="grid grid-cols-5 gap-2">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.label}
              onClick={() => onAsk(tile.question)}
              className="flex flex-col items-center gap-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm p-2.5 hover:shadow-md hover:border-indigo-200 transition-all active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
