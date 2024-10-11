import { useQueryClient, useMutation } from 'react-query';
import authApi from '../api/apiAuth';

interface UseAuth {
    token: string | null;
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const useAuth = (): UseAuth => {
    const queryClient = useQueryClient();
    const { mutateAsync: loginMutation } = useMutation(authApi.login, {
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.invalidateQueries('token');
        },
    });

    const token = localStorage.getItem('token');

    const login = async (data: { email: string; password: string }) => {
        await loginMutation(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        queryClient.invalidateQueries('token');
    };

    return { token, login, logout };
};

export default useAuth;