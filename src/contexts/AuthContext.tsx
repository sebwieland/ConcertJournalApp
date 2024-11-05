// AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';

interface AuthContextInterface {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    token: string;
    setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);


    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };