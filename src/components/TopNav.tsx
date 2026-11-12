import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function TopNav() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-slate-900 text-[15px]">Pramaan</div>
            <div className="text-[10px] text-slate-500 -mt-0.5">Verified notices</div>
          </div>
        </Link>
        <Link
          to="/admin"
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            isAdmin
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
          }`}
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
