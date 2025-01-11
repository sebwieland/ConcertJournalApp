import axios from 'axios';
import {useContext, useMemo} from "react";
import {ConfigContext} from '../contexts/ConfigContext';

const useApiClient = () => {
    const config = useContext(ConfigContext);
    const API_URL = config?.backendURL ?? 'http://localhost:8080';

    return useMemo(() => {
        const apiClient = axios.create({
            baseURL: API_URL,
            withCredentials: true,
        });

        // Request interceptor to add CSRF token to headers
        apiClient.interceptors.request.use((config) => {
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // Response interceptor to update CSRF token
        apiClient.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            return Promise.reject(error);
        });

        return {apiClient};
    }, [API_URL]);
};

export default useApiClient;