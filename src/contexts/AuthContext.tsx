import React, {createContext, useState, useEffect, useCallback} from 'react';
import useApiClient from '../api/apiClient';

interface AuthContextInterface {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    token: string;
    setToken: (token: string) => void;
    refreshToken: () => void;
    csrfToken: string;
    updateCsrfToken: () => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState<string>('');
    const apiClient = useApiClient().apiClient;
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
        if (cookie && cookie[1]) {
            setCsrfToken(cookie[1]);
        } else {
            console.warn('CSRF token not found in cookies');
        }
    }, []);

    const updateCsrfToken = () => {
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
        if (cookie && cookie[1]) {
            setCsrfToken(cookie[1]);
        }
    };

    const refreshToken = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const response = await apiClient.post('/refresh-token', {}, {
                'withCredentials': true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setAccessToken(response.data.accessToken);
        } catch (error) {
            console.error(error);
        }
    }, [apiClient]);

    useEffect(() => {
        if (isLoggedIn) {
            refreshToken().catch((error) => console.error(error));
        }
    }, [refreshToken]);

    useEffect(() => {
        const refreshAccessToken = async () => {
            if (accessToken) {
                try {
                    await refreshToken();
                } catch (error) {
                    console.error(error);
                }
            }
        };
        refreshAccessToken();
    }, [accessToken, refreshToken]);

    useEffect(() => {
        if (accessToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            const intervalId = setInterval(refreshToken, 2 * 60 * 1000); // 2 minutes
            return () => clearInterval(intervalId);
        }
    }, [accessToken, refreshToken]);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            token: accessToken,
            setToken: setAccessToken,
            refreshToken,
            csrfToken,
            updateCsrfToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};