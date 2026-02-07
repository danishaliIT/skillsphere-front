import { createContext, useState, useEffect, useContext } from 'react';
import { loginUser } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // App load hote hi check karein ke kya tokens maujood hain
        const token = localStorage.getItem('access_token');
        const role = localStorage.getItem('user_role');
        if (token) {
            setUser({ role });
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        const { access, refresh, role, username } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', role);

        setUser({ username, role });
        return response.data;
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);