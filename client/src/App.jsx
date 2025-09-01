// import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import { useEffect, useState } from 'react';
import Register from './pages/Register.jsx';
import Todos from './pages/Todos.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
    const { user, logout } = useAuth();
    const location = useLocation();
    // const onLoginPage = location.pathname === '/login';
    const isAuthRoute = /^\/(login|register)\/?$/.test(location.pathname);
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    return (
        <div className="container">
            <header className="header">
                <Link to="/" className="brand">
                    <img src="/Logo.png" alt="To-Do logo" className="logo" />
                    <span>To-Do</span>
                </Link>
                <nav>
                    <button onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                        {theme === 'dark' ? '☀️ ' : '🌙 '}
                    </button>
                    {user ? (
                        <button onClick={logout}>Logout</button>
                    ) : !isAuthRoute && (   // 👈 hide Login/Register on login page
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Todos />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}
