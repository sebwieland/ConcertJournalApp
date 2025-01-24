import React, { createContext, useState, useEffect, useCallback } from 'react';
import useApiClient from '../api/apiClient';

interface AuthContextInterface {
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    token: string;
    setAccessToken: (token: string) => void;
    csrfToken: string;
    fetchCsrfToken: () => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setAccessToken] = useState<string>('');
    const [, setRefreshToken] = useState<string>('');
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

    const setLoggedOut = useCallback(() => {
        setIsLoggedIn(false);
        setAccessToken('');
        setRefreshToken('');
        setIsLoading(false);
    }, [setIsLoggedIn, setAccessToken, setRefreshToken, setIsLoading]);

    const refreshTokenApiCall = useCallback(async () => {
        setIsLoading(true); // Start loading state
        try {
            const response = await apiClient.post('/refresh-token', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                },
            });
            setAccessToken(response.data.accessToken);
            setIsLoggedIn(true);
        } catch (error) {
            setLoggedOut();
            console.error("Failed to refresh token:", error);
        } finally {
            setIsLoading(false); // Ensure isLoading is set to false after attempt
        }
    }, [csrfToken, apiClient, setLoggedOut, setAccessToken, setIsLoggedIn]);

    useEffect(() => {
        console.log('useEffect is running'); // Debug log for useEffect execution

        const setupAuth = async () => {
            console.log('setupAuth is starting'); // Debug log for setupAuth start

            try {
                await fetchCsrfToken();
                console.log('CSRF token fetched successfully'); // Debug log for CSRF token fetch

                const storedRefreshToken = document.cookie.match(/refreshToken=([^;]*)/)?.[1] || '';
                console.log("document:", document.cookie);
                console.log('Stored refreshToken:', storedRefreshToken); // Debug log for stored refresh token

                if (storedRefreshToken) {
                    setRefreshToken(storedRefreshToken);
                    await refreshTokenApiCall();
                    console.log('Refresh token API call completed'); // Debug log for API call completion
                } else {
                    setLoggedOut();
                    console.log('No refresh token found, setting logged out'); // Debug log for no refresh token
                }
            } catch (error) {
                console.error("Error during setupAuth:", error);
                setLoggedOut();
            } finally {
                setIsLoading(false); // Ensure isLoading is set to false after attempt
            }
        };
        setupAuth();

        const intervalId = setInterval(refreshTokenApiCall, 2 * 60 * 1000); // 2 minutes
        console.log('Set up interval for token refresh'); // Debug log for setting up interval

        return () => {
            clearInterval(intervalId);
            console.log('Interval cleared on component unmount'); // Debug log for clearing interval
        };
    }, [fetchCsrfToken, refreshTokenApiCall, setLoggedOut]);

    return (
        <AuthContext.Provider value={{
            isLoading,
            isLoggedIn,
            setIsLoggedIn,
            token,
            setAccessToken,
            csrfToken,
            fetchCsrfToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };