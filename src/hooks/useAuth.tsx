import { useContext, useState} from 'react';
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

    const { mutateAsync: loginMutation } = useMutation(authApi.login, {
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            setIsLoggedIn(true);
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
        onSuccess: () => {
            // Handle sign-up success if needed
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
            setIsLoggedIn(false);
            setAccessToken('');
            fetchCsrfToken(); // fetch new CSRF token if user want to directly re-login without reloading the page
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