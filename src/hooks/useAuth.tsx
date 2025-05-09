import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useMutation } from 'react-query';
import useAuthApi from "../api/apiAuth";
import { ApiError, handleApiError } from '../api/apiErrors';

// Define the login response type
interface LoginResponse {
    accessToken: string;
    // Add other fields that might be in the response
}

interface UseAuth {
    token: string;
    login: (data: { email: string; password: string }) => Promise<LoginResponse | void>;
    signUp: (data: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
    }) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: ApiError | null;
}

const useAuth = (): UseAuth => {
    const authApi = useAuthApi();
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not provided');
    }
    const { setIsLoggedIn, setAccessToken, fetchCsrfToken, setLoggedOut } = authContext;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const { mutateAsync: loginMutation } = useMutation(authApi.login, {
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            setIsLoggedIn(true);
            fetchCsrfToken();
            if (process.env.NODE_ENV === 'development') {
                console.log('Successfully logged in:', data);
            }
        },
        onError: (error: unknown) => {
            setError(handleApiError(error));
        },
        onMutate: () => {
            setIsLoading(true);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const { mutateAsync: signUpMutation } = useMutation(authApi.register, {
        onSuccess: () => {
            fetchCsrfToken();
            if (process.env.NODE_ENV === 'development') {
                console.log('Successfully signed up');
            }
        },
        onError: (error: unknown) => {
            setError(handleApiError(error));
        },
        onMutate: () => {
            setIsLoading(true);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const { mutateAsync: logoutMutation } = useMutation(authApi.logout, {
        onSuccess: () => {
            console.log('Logout API call successful, calling setLoggedOut');
            // Use the setLoggedOut function directly
            setLoggedOut();
            fetchCsrfToken();
            if (process.env.NODE_ENV === 'development') {
                console.log('Successfully logged out');
            }
        },
        onError: (error: unknown) => {
            console.error('Logout API call failed, but still calling setLoggedOut');
            // Even if the API call fails, we should still log out on the client side
            setLoggedOut();
            setError(handleApiError(error));
        },
        onMutate: () => {
            setIsLoading(true);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const login = async (data: { email: string; password: string }) => {
        try {
            // Return the result of the mutation so we can await it
            const result = await loginMutation(data);
            return result;
        } catch (error) {
            console.error("Failed to login:", error);
            throw error; // Re-throw the error so the caller can handle it
        }
    };

    const signUp = async (data: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
    }) => {
        try {
            await signUpMutation(data);
        } catch (error) {
            console.error("Failed to sign up:", error);
        }
    };

    const logout = () => {
        console.log("Starting logout process");
        console.log("Before logout - isLoggedIn:", authContext.isLoggedIn);
        
        // Store the current interval IDs to check if they're cleared
        const intervalsBefore = Object.keys(window).filter(key => key.startsWith('setInterval')).length;
        console.log("Active intervals before logout:", intervalsBefore);
        
        // First, ensure client-side logout happens immediately
        setLoggedOut();
        
        console.log("Client-side logout completed");
        
        // Then try the API call in the background
        logoutMutation()
            .then(() => {
                console.log("API logout successful");
            })
            .catch(error => {
                console.warn("API logout failed, but client-side logout already completed:", error);
            });
        
        console.log("After logout - isLoggedIn:", authContext.isLoggedIn);
        
        // Double-check that isLoggedIn is set to false
        if (authContext.isLoggedIn) {
            console.warn("Warning: isLoggedIn is still true after logout");
            console.log("Forcing isLoggedIn to false again");
            setIsLoggedIn(false);
            
            // Check if the refresh token cookie still exists
            console.log("Checking cookies after logout:", document.cookie);
        }
        
        // Check if intervals are still running
        const intervalsAfter = Object.keys(window).filter(key => key.startsWith('setInterval')).length;
        console.log("Active intervals after logout:", intervalsAfter);
        
        // Force a check of the auth state after a short delay
        setTimeout(() => {
            console.log("Auth state 500ms after logout - isLoggedIn:", authContext.isLoggedIn);
            if (authContext.isLoggedIn) {
                console.warn("isLoggedIn is STILL true 500ms after logout, forcing logout again");
                setLoggedOut();
            }
        }, 500);
    };

    return { token: authContext.token, login, logout, signUp, isLoading, error };
};

export default useAuth;