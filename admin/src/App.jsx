import { Navigate, Route, Routes } from "react-router-dom";
import { Auth, Dashboard } from "@/layouts";
import { useEffect, useState } from "react";
import "./App.css";
import { message, notification } from "antd";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        setIsAuthenticated(!!role);
    }, []);

    useEffect(() => {
        message.config({
            duration: 3,
            maxCount: 3,
        });
    }, []);

    useEffect(() => {
        notification.config({
            duration: 3,
            placement: "bottomRight",
            pauseOnHover: true,
            maxCount: 3
        });
    });

    return (
        <Routes>
            <Route
                path="/dashboard/*"
                element={isAuthenticated
                    ? <Dashboard />
                    : <Navigate to="/auth/sign-in" replace />}
            />
            <Route path="/auth/*" element={<Auth />} />
            <Route
                path="*"
                element={
                    <Navigate
                        to={isAuthenticated
                            ? "/dashboard/home"
                            : "/auth/sign-in"}
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default App;
