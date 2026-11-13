import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import WelcomePage from "./pages/WelcomePage";
import NoticeList from "./components/NoticeList";
import { hasSavedContext } from "./useContext";

function HomeRoute() {
  return hasSavedContext() ? <StudentPage /> : <Navigate to="/welcome" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-[100dvh] bg-page dark:bg-night-page">
        <TopNav />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/ask" element={<HomeRoute />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
