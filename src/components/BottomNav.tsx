import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircleQuestion, FileText } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/ask", label: "Ask", icon: MessageCircleQuestion },
    { to: "/notices", label: "Notices", icon: FileText },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-night-card border-t border-slate-200 dark:border-night-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 ${
                active ? "text-sky-500 dark:text-sky-400" : "text-slate-500 dark:text-night-muted"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
