import React, { createContext, useState, useEffect, useCallback } from 'react';
import useApiClient from '../api/apiClient';
import { handleApiError } from '../api/apiErrors';

export interface AuthContextInterface {
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    token: string;
    setAccessToken: (token: string) => void;
    csrfToken: string;
    fetchCsrfToken: () => void;
    setLoggedOut: () => void;
    refreshTokenApiCall: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setAccessToken] = useState<string>('');
    const [, setRefreshToken] = useState<string>('');
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshIntervalId, setRefreshIntervalId] = useState<number | null>(null);
    const apiClient = useApiClient().apiClient;
    
    // Add a custom setter that logs state changes
    const setIsLoggedInWithLogging = (value: boolean) => {
        console.log('Setting isLoggedIn to:', value);
        setIsLoggedIn(value);
    };

    const fetchCsrfToken = useCallback(async () => {
        try {
            // Check if we already have a CSRF token before making the API call
            const existingCookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
            if (existingCookie && existingCookie[1]) {
                setCsrfToken(existingCookie[1]);
                if (process.env.NODE_ENV === 'development') {
                    console.log('Using existing XSRF token:', existingCookie[1]);
                }
                return; // Return early if we already have a token
            }
            
            // If no token exists, fetch a new one
            await apiClient.get("/get-xsrf-cookie", { withCredentials: true });
            const cookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
            if (cookie && cookie[1]) {
                setCsrfToken(cookie[1]);
                if (process.env.NODE_ENV === 'development') {
                    console.log('Successfully fetched XSRF token:', cookie[1]);
                }
            }
        } catch (error) {
            console.error("Error fetching XSRF cookie:", handleApiError(error));
        }
    }, [apiClient]);

    const setLoggedOut = useCallback(() => {
        setIsLoggedInWithLogging(false);
        setAccessToken('');
        setRefreshToken('');
        setIsLoading(false);
        
        // Clear the token refresh interval
        if (refreshIntervalId !== null) {
            clearInterval(refreshIntervalId);
            setRefreshIntervalId(null);
        }
        
        // Clear only authentication-related cookies, preserve CSRF token
        const authCookies = ['refreshToken', 'accessToken', 'auth', 'session'];
        const cookies = document.cookie.split(";");
        
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            
            // Only clear auth-related cookies, preserve CSRF token
            if (authCookies.some(authCookie => name.toLowerCase().includes(authCookie.toLowerCase()))) {
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
            }
        }
        
        // Clear auth-related local storage items
        const authStorageKeys = ['token', 'auth', 'user', 'session'];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && authStorageKeys.some(authKey => key.toLowerCase().includes(authKey.toLowerCase()))) {
                localStorage.removeItem(key);
            }
        }
    }, [setAccessToken, setRefreshToken, setIsLoading, refreshIntervalId]);

    const refreshTokenApiCall = useCallback(async () => {
        // If we're on the sign-in page, don't try to refresh the token
        if (window.location.pathname.includes('sign-in') || window.location.pathname.includes('sign-up')) {
            console.log('Skipping token refresh - user is on authentication page');
            return;
        }
        
        // Check for refresh token cookie regardless of isLoggedIn state
        // This allows token refresh to work on page reload
        const hasRefreshToken = document.cookie.split(';')
            .some(cookie => cookie.trim().startsWith('refreshToken='));
            
        if (!hasRefreshToken) {
            console.log('No refresh token cookie found, cannot refresh token');
            setLoggedOut();
            return;
        }
        
        console.log('Attempting to refresh token');
        setIsLoading(true); // Start loading state
        try {
            
            // Ensure we have a CSRF token before making the request
            if (!csrfToken) {
                console.log('No CSRF token available, fetching one before refresh');
                await fetchCsrfToken();
            }
            
            const response = await apiClient.post('/refresh-token', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                },
            });
            console.log('Token refresh API call succeeded');
            setIsLoggedInWithLogging(true);
            setAccessToken(response.data.accessToken);
            if (process.env.NODE_ENV === 'development') {
                console.log('Successfully refreshed token:', response.data.accessToken);
            }
        } catch (error) {
            console.log('Token refresh API call failed, setting logged out state');
            setLoggedOut();
            console.error("Failed to refresh token:", handleApiError(error));
        } finally {
            setIsLoading(false); // Ensure isLoading is set to false after attempt
        }
    }, [csrfToken, apiClient, setLoggedOut, setAccessToken, setIsLoggedIn, fetchCsrfToken]);

    useEffect(() => {
        const setupAuth = async () => {
            try {
                await fetchCsrfToken();
                await refreshTokenApiCall();
            } catch (error) {
                setLoggedOut();
                console.error("Error during setupAuth:", handleApiError(error));
            } finally {
                setIsLoading(false); // Ensure isLoading is set to false after attempt
            }
        };
        setupAuth();

        // Only set up the refresh interval if we're not already running one AND we're logged in
        if (refreshIntervalId === null && isLoggedIn) {
            console.log('Setting up token refresh interval (isLoggedIn:', isLoggedIn, ')');
            const intervalId = window.setInterval(refreshTokenApiCall, 2 * 60 * 1000); // 2 minutes
            setRefreshIntervalId(intervalId);
            
            console.log('Token refresh interval ID:', intervalId);
        } else if (refreshIntervalId !== null && !isLoggedIn) {
            // If we have an interval but we're not logged in, clear it
            console.log('Clearing token refresh interval because user is logged out:', refreshIntervalId);
            clearInterval(refreshIntervalId);
            setRefreshIntervalId(null);
        }

        return () => {
            if (refreshIntervalId !== null) {
                console.log('Clearing token refresh interval on unmount:', refreshIntervalId);
                clearInterval(refreshIntervalId);
                setRefreshIntervalId(null);
            }
        };
    }, [fetchCsrfToken, refreshTokenApiCall, setLoggedOut, refreshIntervalId, isLoggedIn]);

    return (
        <AuthContext.Provider value={{
            isLoading,
            isLoggedIn,
            setIsLoggedIn: setIsLoggedInWithLogging,
            token,
            setAccessToken,
            csrfToken,
            fetchCsrfToken,
            setLoggedOut,
            refreshTokenApiCall
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };