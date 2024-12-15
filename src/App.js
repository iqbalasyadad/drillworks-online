import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";

function App() {
    const navigate = useNavigate();  // useNavigate hook to navigate programmatically

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:5000/check-session', {
                    method: 'GET',
                    credentials: 'include',  // Include cookies to verify session
                });
                const result = await response.json();

                if (result.logged_in) {
                    navigate('/dashboard');  // Redirect to dashboard if logged in
                } else {
                    navigate('/login');  // Redirect to login if not logged in
                }
            } catch (error) {
                console.error("Error checking session:", error);
                navigate('/login');
            }
        };

        checkSession();  // Check session on load
    }, [navigate]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<div>Loading...</div>} />  {/* Default route */}
        </Routes>
    );
}

export default App;
