import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";
import AnimatedBackground from "./components/AnimatedBackground";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SelectCoursePage from "./pages/SelectCoursePage";
import NoticeList from "./components/NoticeList";
import { getSession } from "./session";
import type { SessionRole } from "./session";

function RequireRole({ role, children }: { role: SessionRole; children: ReactNode }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.role !== role) {
    if (role === "admin") {
      return <Navigate to="/login" replace state={{ message: "Admin access only" }} />;
    }
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-[100dvh] bg-transparent text-slate-800 dark:text-night-text relative">
        <AnimatedBackground />
        <TopNav />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/select-course"
            element={
              <RequireRole role="student">
                <SelectCoursePage />
              </RequireRole>
            }
          />
          <Route
            path="/"
            element={
              <RequireRole role="student">
                <StudentPage />
              </RequireRole>
            }
          />
          <Route
            path="/ask"
            element={
              <RequireRole role="student">
                <StudentPage />
              </RequireRole>
            }
          />
          <Route
            path="/notices"
            element={
              <RequireRole role="student">
                <NoticeList />
              </RequireRole>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <AdminPage />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
