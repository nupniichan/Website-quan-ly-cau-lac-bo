import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!role);
  }, []);

  return (
    <Routes>
      <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth/sign-in" replace />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard/home" : "/auth/sign-in"} replace />} />
    </Routes>
  );
}

export default App;
