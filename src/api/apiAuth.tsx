import useApiClient from './apiClient';
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { handleApiError } from './apiErrors';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

const useAuthApi = () => {
    const apiClient = useApiClient().apiClient;
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext is not provided');
    }
    const { csrfToken } = authContext;

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        const params = new URLSearchParams();
        params.append('email', data.email);
        params.append('password', data.password);

        try {
            const response = await apiClient.post('/login', params.toString(), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-XSRF-TOKEN': csrfToken
                }
            });

            if (response.status === 200) {
                return response.data;
            } else {
                // Development logging removed
                throw handleApiError(new Error(response.statusText));
            }
        } catch (error) {
            // Development logging removed
            throw handleApiError(error);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            const response = await apiClient.post('/logout', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-XSRF-TOKEN': csrfToken
                }
            });

            if (response.status !== 200) {
                // Development logging removed
                throw handleApiError(new Error(response.statusText));
            }
        } catch (error) {
            // Development logging removed
            throw handleApiError(error);
        }
    };

    const register = async (data: RegisterRequest): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('/register', data, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            // Development logging removed
            throw handleApiError(error);
        }
    };

    return { login, register, logout };
};

export default useAuthApi;