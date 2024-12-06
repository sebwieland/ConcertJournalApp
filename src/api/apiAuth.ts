import apiClient from './apiClient';

interface LoginResponse {
    token: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append('email', data.email);
    params.append('password', data.password);

    const response = await apiClient.post('/login', params.toString(), {
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
    const response = await apiClient.post('/register', data);
    return response.data;
};

const authApi = { login, register };

export default authApi;