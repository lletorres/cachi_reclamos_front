import { Routes, Route, Navigate } from "react-router-dom";
import ReportarIncidente from "./pages/ReportarIncidente";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/reportar" element={<ReportarIncidente />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
