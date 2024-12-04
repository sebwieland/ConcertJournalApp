import {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import {useQueryClient, useMutation} from 'react-query';
import authApi from '../api/apiAuth';

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
}

const useAuth = (): UseAuth => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not provided');
    }
    const {isLoggedIn, setIsLoggedIn, token, setToken} = authContext;
    const queryClient = useQueryClient();
    const {mutateAsync: loginMutation} = useMutation(authApi.login, {
        onSuccess: (data) => {
            setToken(data.token);
            setIsLoggedIn(true);
            queryClient.invalidateQueries('token');
        },
    });
    const {mutateAsync: signUpMutation} = useMutation(authApi.register, {});

    const login = async (data: { email: string; password: string }) => {
        await loginMutation(data);
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
    };

    return {token, login, logout, signUp};
};

export default useAuth;