import useApiClient from './apiClient';

interface LoginResponse {
    token: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

const useAuthApi = () => {
    const axiosInstance = useApiClient();

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        const params = new URLSearchParams();
        params.append('email', data.email);
        params.append('password', data.password);

        const response = await axiosInstance.post('/login', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data;
    };

    const register = async (data: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
    }) => {
        const response = await axiosInstance.post('/register', data);
        return response.data;
    };

    return { login, register };
};

export default useAuthApi;