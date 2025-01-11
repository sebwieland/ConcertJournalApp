import {useContext, useState} from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useQueryClient, useMutation } from 'react-query';
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
    const { setIsLoggedIn, token, setToken } = authContext;
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const { mutateAsync: loginMutation } = useMutation(authApi.login, {
        onSuccess: (data) => {
            console.log(data)
            setToken(data.accessToken);
            setIsLoggedIn(true);
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
            // Handle sign-up success
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
        await authApi.fetchXSRFtoken()
        await loginMutation(data);
        await authApi.fetchXSRFtoken()
    };

    const signUp = async (data: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
    }) => {
        await signUpMutation(data);
    };

    const logout = () => {
        setToken('');
        setIsLoggedIn(false);
        queryClient.invalidateQueries('token');
        document.cookie.split(';').forEach((cookie) => {
            const cookieName = cookie.split('=')[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    };

    return { token, login, logout, signUp, isLoading, error };
};

export default useAuth;