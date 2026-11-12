import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, X, Loader2 } from "lucide-react";

interface Props {
  message: string;
  onDone?: () => void;
  duration?: number;
}

export default function Toast({ message, onDone, duration = 4000 }: Props) {
  const [visible, setVisible] = useState(true);

  const dismiss = useCallback(() => {
    setVisible(false);
    onDone?.();
  }, [onDone]);

  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [dismiss, duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-slide-up">
      <div className="bg-slate-900 dark:bg-night-card border border-transparent dark:border-night-border text-white rounded-2xl shadow-xl px-4 py-3.5 flex items-center gap-3 max-w-sm">
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{message}</span>
        <button onClick={dismiss} className="text-slate-500 dark:text-night-muted hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function LoadingToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-slide-up">
      <div className="bg-slate-900 dark:bg-night-card border border-transparent dark:border-night-border text-white rounded-2xl shadow-xl px-4 py-3.5 flex items-center gap-3 max-w-sm">
        <Loader2 className="w-5 h-5 text-sky-400 flex-shrink-0 animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
