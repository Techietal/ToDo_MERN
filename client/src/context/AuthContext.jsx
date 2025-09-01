import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api.js';


const AuthCtx = createContext();


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const setUserFromAuthResponse = ({ token, user }) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    useEffect(() => {
        async function bootstrap() {
            try {
                if (token) {
                    const { data } = await api.get('/auth/me');
                    setUser(data.user);
                }
            } catch (e) {
                logout();
            } finally {
                setLoading(false);
            }
        }
        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        // localStorage.setItem('token', data.token);
        // setToken(data.token);
        // setUser(data.user);
        setUserFromAuthResponse(data);
    };
    const register = async (email, password) => {
        const { data } = await api.post('/auth/register', { email, password });
        // localStorage.setItem('token', data.token);
        // setToken(data.token);
        // setUser(data.user);
        setUserFromAuthResponse(data);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };


    // return (
    // <AuthCtx.Provider value={{ user, token, loading, login, register, logout }}>
    // {children}
    // </AuthCtx.Provider>
    // );
    return (
        <AuthCtx.Provider value={{ user, token, loading, login, register, logout, setUserFromAuthResponse }}>
            {children}
        </AuthCtx.Provider>
    );
}


export const useAuth = () => useContext(AuthCtx);