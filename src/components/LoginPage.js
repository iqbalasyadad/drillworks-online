import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const credentials = { username, password };
    
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
                credentials: 'include',  // Ensure cookies are sent with the request
            });
    
            const result = await response.json();
    
            if (response.ok) {
                navigate("/dashboard");
            } else {
                setErrorMessage(result.message || "Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };
    

    return (
        <div id="login-app-container">
            <div id="login-container">
                <div id="login-header">
                    <h2>Sign in</h2>
                </div>
                <form id="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <div id="username-input-container">
                        <input
                            id="login-username-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>

                    <label htmlFor="password">Password:</label>
                    <div id="password-input-container">
                        <input
                            id="login-password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>
                {errorMessage && <div>{errorMessage}</div>}
            </div>
        </div>

    );
};

export default LoginPage;
