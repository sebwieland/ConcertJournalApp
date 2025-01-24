import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useMutation } from 'react-query';
import useAuthApi from "../api/apiAuth";

interface UseAuth {
    token: string;
    login: (data: { email: string; password: string }) => Promise<void>;
    signUp: (data: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
    }) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: any;
}

const useAuth = (): UseAuth => {
    const authApi = useAuthApi();
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not provided');
    }
    const { setIsLoggedIn, setAccessToken, fetchCsrfToken } = authContext;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const setTokenState = (accessToken: string, refreshToken: string) => {
        setAccessToken(accessToken);
        setIsLoggedIn(true);
        document.cookie = `refreshToken=${refreshToken}; path=/`;
    };

    const { mutateAsync: loginMutation } = useMutation(authApi.login, {
        onSuccess: (data) => {
            setTokenState(data.accessToken, data.refreshToken);
            fetchCsrfToken();
        },
        onError: (error: unknown) => {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        },
        onMutate: () => {
            setIsLoading(true);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const { mutateAsync: signUpMutation } = useMutation(authApi.register, {
        onSuccess: (data) => {
            setTokenState(data.accessToken, data.refreshToken);
            fetchCsrfToken();
        },
        onError: (error) => {
            setError(error);
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
            authContext.setIsLoggedIn(false);
            authContext.setAccessToken('');
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            fetchCsrfToken();
        },
        onError: (error) => {
            setError(error);
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
            await loginMutation(data);
        } catch (error) {
            console.error("Failed to login:", error);
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

    const logout = async () => {
        try {
            await logoutMutation();
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return { token: authContext.token, login, logout, signUp, isLoading, error };
};

export default useAuth;