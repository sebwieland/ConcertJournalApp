import axios from 'axios';
import { useContext, useMemo } from 'react';
import { ConfigContext } from '../contexts/ConfigContext';
import { handleApiError } from './apiErrors';

const useApiClient = () => {
    const config = useContext(ConfigContext);
    const API_URL = config?.backendURL ?? 'http://localhost:8080';

    return useMemo(() => {
        const apiClient = axios.create({
            baseURL: API_URL,
            withCredentials: true,
            timeout: 10000, // 10 seconds timeout
        });

        // Request interceptor
        apiClient.interceptors.request.use(
            (config) => {
                // Development logging removed
                return config;
            },
            (error) => {
                return Promise.reject(handleApiError(error));
            }
        );

        // Response interceptor
        apiClient.interceptors.response.use(
            (response) => {
                // Development logging removed
                return response;
            },
            (error) => {
                const processedError = handleApiError(error);
                
                // Development logging removed
                
                return Promise.reject(processedError);
            }
        );

        return { apiClient };
    }, [API_URL]);
};

export default useApiClient;