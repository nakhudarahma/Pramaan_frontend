import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import NoticeList from "./components/NoticeList";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <TopNav />
        <Routes>
          <Route path="/" element={<StudentPage />} />
          <Route path="/ask" element={<StudentPage />} />
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
