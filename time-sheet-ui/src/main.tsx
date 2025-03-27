import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login/Login.tsx";
import Header from "./components/Header/header.tsx";
import Home from "./components/Home/home.tsx";
import FillAttendance from "./components/FillAttendance/FillAttendance.tsx";

import "./index.css";
import Summary from "./components/Summary/summary.tsx";
import WFHException from "./components/WFHException/WFHException.tsx";
import Report from "./components/Report/Report.tsx";
import Scanner from "./components/Scanner/Scanner.tsx";

function App() {
  const [employeeId, updateEmployeeId] = useState(
    sessionStorage.getItem("employee")
      ? JSON.parse(sessionStorage.getItem("employee")!).employeeId
      : ""
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("employee") !== null
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
    updateEmployeeId(
      sessionStorage.getItem("employee")
        ? JSON.parse(sessionStorage.getItem("employee")!).employeeId
        : ""
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("employee");
    updateEmployeeId("");
  };

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <Header onLogout={handleLogout} employeeId={employeeId ?? ""} />
      )}
      <Routes>
        <Route
          path="/"
          element={<Login onLogin={handleLogin} onLogOut={handleLogout} />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/fill-attendance" element={<FillAttendance />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/file-exception" element={<WFHException />} />
        <Route path="/report" element={<Report />} />
        <Route path="/scan" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
