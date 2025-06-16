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
    
    // Add a custom setter without logging
    const setIsLoggedInWithLogging = (value: boolean) => {
        setIsLoggedIn(value);
    };

    const fetchCsrfToken = useCallback(async () => {
        try {
            // Only log in non-test environments
            if (process.env.NODE_ENV !== 'test') {
                console.log("=== CSRF Token Fetch ===");
                console.log("Current domain:", window.location.hostname);
                
                // Safely check API domain
                try {
                    if (apiClient?.defaults?.baseURL) {
                        const apiUrl = new URL(apiClient.defaults.baseURL);
                        console.log("API domain:", apiUrl.hostname);
                        console.log("Protocol:", window.location.protocol);
                        console.log("API protocol:", apiUrl.protocol);
                    }
                } catch (e) {
                    console.log("Could not parse API URL");
                }
                
                console.log("Current cookies:", document.cookie);
            }
            
            // Check if we already have a CSRF token before making the API call
            const existingCookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
            if (existingCookie && existingCookie[1]) {
                if (process.env.NODE_ENV !== 'test') {
                    console.log("Found existing CSRF token:", existingCookie[1]);
                }
                setCsrfToken(existingCookie[1]);
                return; // Return early if we already have a token
            }
            
            // If no token exists, fetch a new one
            if (process.env.NODE_ENV !== 'test') {
                console.log("No CSRF token found, fetching new one");
            }
            
            try {
                const response = await apiClient.get("/get-xsrf-cookie", {
                    withCredentials: true,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (process.env.NODE_ENV !== 'test') {
                    console.log("CSRF token response status:", response.status);
                    console.log("CSRF token response headers:", response.headers);
                }
            } catch (fetchError) {
                if (process.env.NODE_ENV !== 'test') {
                    console.error("Error fetching CSRF token:", fetchError);
                }
            }
            
            const cookie = document.cookie.match(/XSRF-TOKEN=([^;]*)/);
            if (process.env.NODE_ENV !== 'test') {
                console.log("After fetch, cookies:", document.cookie);
            }
            
            if (cookie && cookie[1]) {
                if (process.env.NODE_ENV !== 'test') {
                    console.log("New CSRF token received:", cookie[1]);
                }
                setCsrfToken(cookie[1]);
            } else if (process.env.NODE_ENV !== 'test') {
                console.warn("Failed to get CSRF token after fetch");
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error("CSRF token fetch error:", error);
            }
            handleApiError(error);
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
                // Clear cookie without domain specification
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
                
                // Clear with current domain
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
                
                // Clear with parent domain (with leading dot)
                const domainParts = window.location.hostname.split('.');
                if (domainParts.length >= 2) {
                    const parentDomain = '.' + domainParts.slice(-2).join('.');
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + parentDomain;
                }
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
            return;
        }
        
        if (process.env.NODE_ENV !== 'test') {
            console.log("=== Token Refresh Attempt ===");
            console.log("Current path:", window.location.pathname);
            console.log("Current cookies:", document.cookie);
        }
        
        // Check for refresh token cookie regardless of isLoggedIn state
        // This allows token refresh to work on page reload
        const hasRefreshToken = document.cookie.split(';')
            .some(cookie => cookie.trim().startsWith('refreshToken='));
            
        if (process.env.NODE_ENV !== 'test') {
            console.log("Has refresh token cookie:", hasRefreshToken);
            console.log("Current auth state:", { isLoggedIn, hasToken: !!token });
        }
        
        if (!hasRefreshToken) {
            if (process.env.NODE_ENV !== 'test') {
                console.log("No refresh token found, logging out");
            }
            setLoggedOut();
            return;
        }
        
        setIsLoading(true); // Start loading state
        try {
            // Ensure we have a CSRF token before making the request
            if (!csrfToken) {
                if (process.env.NODE_ENV !== 'test') {
                    console.log("No CSRF token, fetching one before refresh");
                }
                await fetchCsrfToken();
            }
            
            if (process.env.NODE_ENV !== 'test') {
                console.log("Using CSRF token for refresh:", csrfToken);
            }
            
            const headers = {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            };
            
            if (process.env.NODE_ENV !== 'test') {
                console.log("Refresh token request headers:", headers);
            }
            
            const response = await apiClient.post('/refresh-token', {}, {
                withCredentials: true,
                headers
            });
            
            if (process.env.NODE_ENV !== 'test') {
                console.log("Refresh token response:", {
                    status: response.status,
                    hasAccessToken: !!response.data.accessToken
                });
                
                console.log("Cookies after refresh:", document.cookie);
            }
            
            setIsLoggedInWithLogging(true);
            setAccessToken(response.data.accessToken);
            
            if (process.env.NODE_ENV !== 'test') {
                console.log("Auth state updated after refresh:", { isLoggedIn: true, hasToken: !!response.data.accessToken });
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.error("Token refresh error:", error);
            }
            setLoggedOut();
            handleApiError(error);
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
                handleApiError(error);
            } finally {
                setIsLoading(false); // Ensure isLoading is set to false after attempt
            }
        };
        setupAuth();

        // Only set up the refresh interval if we're not already running one AND we're logged in
        if (refreshIntervalId === null && isLoggedIn) {
            const intervalId = window.setInterval(refreshTokenApiCall, 2 * 60 * 1000); // 2 minutes
            setRefreshIntervalId(intervalId);
        } else if (refreshIntervalId !== null && !isLoggedIn) {
            // If we have an interval but we're not logged in, clear it
            clearInterval(refreshIntervalId);
            setRefreshIntervalId(null);
        }

        return () => {
            if (refreshIntervalId !== null) {
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