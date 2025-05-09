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
        // First, ensure client-side logout happens immediately
        setLoggedOut();
        
        // Then try the API call in the background
        logoutMutation()
            .then(() => {
                // No need to log success here
            })
            .catch(error => {
                console.warn("API logout failed, but client-side logout already completed:", error);
            });
    };

    return { token: authContext.token, login, logout, signUp, isLoading, error };
};

export default useAuth;