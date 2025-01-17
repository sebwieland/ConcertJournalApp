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
    logout: () => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState<string>('');
    const apiClient = useApiClient().apiClient;
    const [csrfToken, setCsrfToken] = useState('');
    const [shouldRefreshToken, setShouldRefreshToken] = useState(true);

    useEffect(() => {
        if (!shouldRefreshToken) return;
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
        if (cookie && cookie[1]) {
            setCsrfToken(cookie[1]);
        }

        const refreshAccessToken = async () => {
            if (!accessToken) {
                try {
                    const response = await apiClient.post('/refresh-token', {}, {
                        'withCredentials': true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    setAccessToken(response.data.accessToken);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        refreshAccessToken();
    }, [apiClient, accessToken, shouldRefreshToken]);

    const updateCsrfToken = () => {
        const cookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
        if (cookie && cookie[1]) {
            setCsrfToken(cookie[1]);
        }
    };

    const refreshToken = useCallback(async () => {
        if (!isLoggedIn || !shouldRefreshToken) return;
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
    }, [apiClient, isLoggedIn, shouldRefreshToken]);

    useEffect(() => {
        if (isLoggedIn) {
            refreshToken().catch((error) => console.error(error));
        }
    }, [refreshToken, isLoggedIn]);

    useEffect(() => {
        if (accessToken) {
            const intervalId = setInterval(refreshToken, 2 * 60 * 1000); // 2 minutes
            return () => clearInterval(intervalId);
        }
    }, [accessToken, refreshToken]);

    const logout = useCallback(() => {
        setShouldRefreshToken(false); // Set the flag to false when logging out
        // setIsLoggedIn(false);
        // setAccessToken('');
    }, []);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            token: accessToken,
            setToken: setAccessToken,
            refreshToken,
            csrfToken,
            updateCsrfToken,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};