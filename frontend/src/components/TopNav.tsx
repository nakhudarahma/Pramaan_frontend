import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Sun, Moon } from "lucide-react";
import { useTheme } from "../useTheme";

export default function TopNav() {
  const location = useLocation();
  const isNotices = location.pathname === "/notices";
  const isAdmin = location.pathname === "/admin";
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="gradient-primary sticky top-0 z-30 bg-navy-600 border-b border-navy-700">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 min-w-0 flex-1 mr-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-accent" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-white text-[15px] flex-shrink-0">Pramaan</span>
            <span
              className="text-[11px] text-white/70 truncate"
              title="B. K. Birla College (Empowered Autonomous Status), Kalyan"
            >
              B. K. Birla College (Empowered Autonomous Status), Kalyan
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            to="/notices"
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isNotices
                ? "bg-white/10 text-accent font-semibold"
                : "text-sky-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Notices
          </Link>
          <Link
            to="/admin"
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isAdmin
                ? "bg-white/10 text-accent font-semibold"
                : "text-sky-100/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Admin
          </Link>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sky-100/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
