import React, { createContext, useState, useEffect, useCallback } from 'react';
import useApiClient from '../api/apiClient';

interface AuthContextInterface {
    isLoading: boolean;
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
    const [refreshToken, setRefreshToken] = useState<string>('');
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
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

    const setTokenState = useCallback((accessToken: string, refreshToken: string) => {
        setAccessToken(accessToken);
        setIsLoggedIn(true);
        setRefreshToken(refreshToken);
    }, [setAccessToken, setIsLoggedIn, setRefreshToken]);

    const setLoggedOut = useCallback(() => {
        setIsLoggedIn(false);
        setAccessToken('');
        setRefreshToken('');
        setIsLoading(false);
    }, [setIsLoggedIn, setAccessToken, setRefreshToken, setIsLoading]);

    const refreshTokenApiCall = useCallback(async () => {
        if (!refreshToken) return;
        try {
            const response = await apiClient.post('/refresh-token', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'Refresh-Token': refreshToken
                },
            });
            setTokenState(response.data.accessToken, refreshToken);
            setIsLoading(false);
        } catch (error) {
            setLoggedOut();
            console.error("Failed to refresh token:", error);
        }
    }, [refreshToken, csrfToken, apiClient, setTokenState, setLoggedOut]);

    useEffect(() => {
        const setupAuth = async () => {
            await fetchCsrfToken();
            const storedRefreshToken = document.cookie.match(/refreshToken=([^;]*)/)?.[1] || '';
            if (storedRefreshToken) {
                setRefreshToken(storedRefreshToken);
                await refreshTokenApiCall();
            } else {
                setIsLoading(false);
            }
        };
        setupAuth();
    }, [fetchCsrfToken, refreshTokenApiCall]);

    return (
        <AuthContext.Provider value={{
            isLoading,
            isLoggedIn,
            setIsLoggedIn,
            token,
            setAccessToken,
            refreshToken: refreshTokenApiCall,
            csrfToken,
            fetchCsrfToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };