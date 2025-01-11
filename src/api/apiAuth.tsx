import useApiClient from './apiClient';
import {useContext} from "react";
import {AuthContext} from "../contexts/AuthContext";

interface LoginResponse {
    accessToken: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

const useAuthApi = () => {
    const apiClient = useApiClient().apiClient;
    const updateCsrfToken = useContext(AuthContext)?.updateCsrfToken;

    const fetchXSRFtoken = async () => {
        const response = await apiClient.get("/login");
        if (response.status !== 200) {
            throw new Error("Error fetching XSRF token")
        }
        if (updateCsrfToken) {
            updateCsrfToken();
        }
    };

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        const params = new URLSearchParams();
        params.append('email', data.email);
        params.append('password', data.password);

        const response = await apiClient.post('/login', params.toString(), {
            'withCredentials': true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data;
    };

    const logout = async () : Promise<void> => {
        const response = await apiClient.post('/logout', {
            'withCredentials': true,
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

    return {login, register, fetchXSRFtoken, logout};
};

export default useAuthApi;