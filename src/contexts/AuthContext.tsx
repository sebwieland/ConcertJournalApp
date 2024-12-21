import React, {createContext, useState, useEffect, useCallback} from 'react';
import useApiClient from '../api/apiClient';

interface AuthContextInterface {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    token: string;
    setToken: (token: string) => void;
    refreshToken: () => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string>('');
    const apiClient = useApiClient();

    const refreshToken = useCallback(async () => {
        if (!token) return;
        try {
            const response = await apiClient.post('/refresh-token', {}, {
                'withCredentials': true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setToken(response.data.accessToken);
        } catch (error) {
            console.error(error);
        }
    }, [apiClient, token]);

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            const intervalId = setInterval(refreshToken, 2 * 60 * 1000); // 2 minutes
            return () => clearInterval(intervalId);
        }
    }, [token, refreshToken]);

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, token, setToken, refreshToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};