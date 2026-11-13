import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  GraduationCap,
  LogIn,
  Moon,
  ShieldCheck,
  Sun,
  UserPlus,
} from "lucide-react";
import { useTheme } from "../useTheme";
import { setSession } from "../session";
import { googleSignIn } from "../api";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const POINTS = [
  { icon: BadgeCheck, text: "Admin-approved changes" },
  { icon: GraduationCap, text: "Answers for your course and semester" },
  { icon: FileText, text: "Every answer shows its source" },
];

type Mode = "signin" | "signup";
type Step = "method" | "role";
type Source = "google" | "demo";
type Role = "student" | "admin";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>("method");
  const [source, setSource] = useState<Source>("demo");
  const [googleError, setGoogleError] = useState<string | null>(null);

  const message = (location.state as { message?: string } | null)?.message;

  const resetToMethod = () => {
    setStep("method");
    setSource("demo");
    setGoogleError(null);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    resetToMethod();
  };

  const startGoogle = () => {
    setSource("google");
    setGoogleError(null);
    setStep("role");
  };

  const startDemo = () => {
    setSource("demo");
    setGoogleError(null);
    setStep("role");
  };

  const completeDemo = (role: Role) => {
    setSession({
      role,
      demo: true,
      name: role === "admin" ? "Meera Iyer" : "Aarav Sharma",
      email: role === "admin" ? "demo.admin@pramaan.demo" : "demo.student@pramaan.demo",
    });
    navigate(role === "admin" ? "/admin" : "/select-course", { replace: true });
  };

  const chooseRole = async (role: Role) => {
    setGoogleError(null);
    if (source === "demo") {
      completeDemo(role);
      return;
    }

    const result = await googleSignIn(role);
    if (!result.ok) {
      setGoogleError(
        "Google sign-in will be available once the backend is connected. Please use the demo account."
      );
      setStep("role");
      return;
    }

    setSession({
      role: result.user.role,
      demo: false,
      name: result.user.name,
      email: result.user.email,
      picture: result.user.picture,
    });
    navigate(result.user.role === "admin" ? "/admin" : "/select-course", { replace: true });
  };

  const tabClass = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors ${
      active
        ? "bg-white dark:bg-night-card text-navy-700 dark:text-night-text shadow-sm"
        : "text-slate-500 dark:text-night-muted hover:text-slate-700 dark:hover:text-night-text"
    }`;

  const roleCardClass =
    "w-full min-h-[84px] flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-night-border bg-white dark:bg-night-page p-3.5 text-left transition-colors hover:border-sky-300 dark:hover:border-sky-500";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-navy-700 via-navy-600 to-sky dark:from-night-page dark:via-navy-900 dark:to-navy-700">
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky/30 blur-3xl dark:bg-sky/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-navy-300/25 blur-3xl dark:bg-navy-500/20"
        aria-hidden="true"
      />

      <div className="relative flex min-h-full flex-col pb-[env(safe-area-inset-bottom)]">
        <header className="flex items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={2.5} />
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-[15px] font-bold text-white">Pramaan</span>
              <span
                className="truncate text-[10px] text-white/60 sm:text-[11px]"
                title="B. K. Birla College (Empowered Autonomous Status), Kalyan"
              >
                B. K. Birla College (Empowered Autonomous Status), Kalyan
              </span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-5 px-5 py-5 sm:px-8 md:grid md:grid-cols-2 md:items-center md:gap-8 md:py-6">
          <section className="hidden md:block">
            <h1 className="font-serif text-4xl font-bold leading-tight text-white">
              Every notice, verified.
            </h1>
            <p className="mt-4 max-w-md text-base text-sky-100/80">
              Answers you can check, from official college notices.
            </p>
            <ul className="mt-6 space-y-4">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-base text-sky-50/90">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-4 w-4 text-accent" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </section>

          <div className="mx-auto w-full max-w-sm md:mx-0 md:justify-self-end">
            <h1 className="mb-3 text-center font-serif text-xl font-bold text-white md:hidden">
              Every notice, verified.
            </h1>

            <div className="rounded-3xl border border-white/20 bg-white p-7 shadow-2xl dark:border-night-border dark:bg-night-card">
              {message && (
                <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 px-3 py-2.5 text-center text-xs font-medium text-amber-700 dark:text-amber-300">
                  {message}
                </div>
              )}

              <div className="flex rounded-xl bg-slate-100 dark:bg-night-page p-1">
                <button type="button" onClick={() => switchMode("signin")} className={tabClass(mode === "signin")}>
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </button>
                <button type="button" onClick={() => switchMode("signup")} className={tabClass(mode === "signup")}>
                  <UserPlus className="h-3.5 w-3.5" />
                  Create Account
                </button>
              </div>

              {step === "method" && (
                <div className="mt-4">
                  <h2 className="text-center text-xl font-bold text-navy-700 dark:text-night-text">
                    {mode === "signin"
                      ? "Sign in to Pramaan"
                      : "Create your Pramaan account"}
                  </h2>
                  <p className="mt-1 text-center text-sm text-slate-500 dark:text-night-muted">
                    {mode === "signin"
                      ? "Access verified answers for your course."
                      : "Set up your account to get started."}
                  </p>

                  <div className="mt-4 space-y-2.5">
                    <button
                      type="button"
                      onClick={startGoogle}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-night-border bg-white dark:bg-night-page text-sm font-semibold text-slate-700 dark:text-night-text hover:border-sky-300 dark:hover:border-sky-500 transition-colors"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-slate-200 dark:bg-night-border" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-night-muted">
                        OR
                      </span>
                      <span className="h-px flex-1 bg-slate-200 dark:bg-night-border" />
                    </div>

                    <button
                      type="button"
                      onClick={startDemo}
                      className="h-11 w-full rounded-xl border border-slate-200 dark:border-night-border bg-white dark:bg-night-page text-sm font-semibold text-slate-700 dark:text-night-text hover:border-sky-300 dark:hover:border-sky-500 transition-colors"
                    >
                      Try demo account
                    </button>
                    <p className="text-center text-xs text-slate-400 dark:text-night-muted">
                      Sample data, no sign-up.
                    </p>
                  </div>
                </div>
              )}

              {step === "role" && (
                <div className="mt-4">
                  <h2 className="text-center text-xl font-bold text-navy-700 dark:text-night-text">
                    Continue as
                  </h2>
                  <p className="mt-1 text-center text-sm text-slate-500 dark:text-night-muted">
                    Choose how you want to continue.
                  </p>

                  <div className="mt-3 space-y-2.5">
                    <button type="button" onClick={() => chooseRole("student")} className={roleCardClass}>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky/10">
                        <GraduationCap className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base font-bold text-slate-900 dark:text-night-text">
                          {source === "demo" ? "Student demo" : "Student"}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-night-muted">
                          See notices for your course
                        </span>
                      </span>
                    </button>

                    <button type="button" onClick={() => chooseRole("admin")} className={roleCardClass}>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky/10">
                        <ShieldCheck className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base font-bold text-slate-900 dark:text-night-text">
                          {source === "demo" ? "Admin demo" : "Admin"}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-night-muted">
                          Upload and approve notices
                        </span>
                      </span>
                    </button>
                  </div>

                  {googleError && (
                    <p className="mt-2.5 text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                      {googleError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={resetToMethod}
                    className="mx-auto mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-night-muted hover:text-slate-700 dark:hover:text-night-text"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
