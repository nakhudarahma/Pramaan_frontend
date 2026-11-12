import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircleQuestion, FileText } from "lucide-react";
import { useState, useEffect } from "react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleChatState = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      if (custom.detail !== undefined) {
        setChatOpen(Boolean(custom.detail.open));
      }
    };
    window.addEventListener("pramaan:chat-state", handleChatState);
    return () => window.removeEventListener("pramaan:chat-state", handleChatState);
  }, []);

  const handleAskClick = () => {
    if (location.pathname === "/admin") {
      navigate("/ask");
    } else {
      window.dispatchEvent(new CustomEvent("pramaan:open-chat"));
    }
  };

  const isHome = location.pathname === "/" && !chatOpen;
  const isAsk = chatOpen || location.pathname === "/ask";
  const isNotices = location.pathname === "/notices" && !chatOpen;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-night-card border-t border-slate-200 dark:border-night-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        <Link
          to="/"
          className={`flex-1 max-w-[120px] flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 ${
            isHome ? "text-sky-500 dark:text-sky-400" : "text-slate-500 dark:text-night-muted"
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-xs font-medium">Home</span>
        </Link>

        <button
          type="button"
          onClick={handleAskClick}
          aria-label="Ask a question"
          className={`flex-1 max-w-[120px] flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 ${
            isAsk ? "text-sky-500 dark:text-sky-400" : "text-slate-500 dark:text-night-muted"
          }`}
        >
          <MessageCircleQuestion className="w-5 h-5" strokeWidth={isAsk ? 2.5 : 2} />
          <span className="text-xs font-medium">Ask</span>
        </button>

        <Link
          to="/notices"
          className={`flex-1 max-w-[120px] flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 ${
            isNotices ? "text-sky-500 dark:text-sky-400" : "text-slate-500 dark:text-night-muted"
          }`}
        >
          <FileText className="w-5 h-5" strokeWidth={isNotices ? 2.5 : 2} />
          <span className="text-xs font-medium">Notices</span>
        </Link>
      </div>
    </nav>
  );
}
