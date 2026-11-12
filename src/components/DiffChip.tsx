import { ArrowRight } from "lucide-react";

interface Props {
  label: string;
  oldValue: string;
  newValue: string;
}

export default function DiffChip({ label, oldValue, newValue }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-slate-600">{label}:</span>
      <span className="text-sm text-slate-400 line-through">{oldValue}</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-sm font-bold text-indigo-600">{newValue}</span>
    </div>
  );
}
