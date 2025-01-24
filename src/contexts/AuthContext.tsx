import React, { createContext, useState, useEffect, useCallback } from 'react';
import useApiClient from '../api/apiClient';

interface AuthContextInterface {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    token: string;
    setAccessToken: (token: string) => void;
    refreshToken: () => void;
    csrfToken: string;
    fetchCsrfToken: () => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setAccessToken] = useState<string>('');
    const [csrfToken, setCsrfToken] = useState('');
    const apiClient = useApiClient().apiClient;

    const fetchCsrfToken = useCallback(async () => {
        try {
            await apiClient.get("/get-xsrf-cookie", { withCredentials: true });
            const cookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
            if (cookie && cookie[1]) {
                setCsrfToken(cookie[1]);
            }
        } catch (error) {
            console.error("Error fetching XSRF cookie:", error);
        }
    }, [apiClient]);

    const refreshToken = useCallback(async () => {
        if (!isLoggedIn || !token) return;
        try {
            const response = await apiClient.post('/refresh-token', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
                },
            });
            setAccessToken(response.data.accessToken);
        } catch (error) {
            setIsLoggedIn(false);
            setAccessToken('');
            console.error("Failed to refresh token:", error);
        }
    }, [isLoggedIn, token, csrfToken, apiClient]);

    useEffect(() => {
        const setupAuth = async () => {
            await fetchCsrfToken();
            // await obtainAccessTokenUsingRefreshToken(); // If needed, implement this
        };
        setupAuth();
    }, [fetchCsrfToken]);

    useEffect(() => {
        if (token) {
            const intervalId = setInterval(refreshToken, 2 * 60 * 1000); // 2 minutes
            return () => clearInterval(intervalId);
        }
    }, [token, refreshToken]);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            token,
            setAccessToken,
            refreshToken,
            csrfToken,
            fetchCsrfToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };