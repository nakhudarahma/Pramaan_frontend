import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "../useTheme";
import { clearSession, getSession } from "../session";
import Avatar from "./Avatar";

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const session = getSession();
  const isNotices = location.pathname === "/notices";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    clearSession();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="gradient-primary sticky top-0 z-30 bg-navy-600 border-b border-navy-700">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0 mr-3">
          {session && (
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open account menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white/20 hover:ring-white/40 transition-all"
              >
                <Avatar name={session.name} picture={session.picture} size="sm" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-night-border dark:bg-night-card animate-fade-in"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={session.name} picture={session.picture} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-night-text">
                          {session.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-night-muted">
                          {session.email ?? "Demo account"}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-night-muted">
                            {session.role === "admin" ? "Admin" : "Student"}
                          </span>
                          {session.demo && (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                              Demo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-white text-[15px] flex-shrink-0">Pramaan</span>
            <span
              className="hidden md:inline text-[11px] text-white/60 truncate"
              title="B. K. Birla College (Empowered Autonomous Status), Kalyan"
            >
              B. K. Birla College (Empowered Autonomous Status), Kalyan
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {session?.role === "student" && (
            <Link
              to="/notices"
              className={`hidden md:inline-flex text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isNotices
                  ? "bg-white/10 text-accent font-semibold"
                  : "text-sky-100/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Notices
            </Link>
          )}

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
