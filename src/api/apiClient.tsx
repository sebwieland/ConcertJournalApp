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
                // Add logging in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
                }
                return config;
            },
            (error) => {
                return Promise.reject(handleApiError(error));
            }
        );

        // Response interceptor
        apiClient.interceptors.response.use(
            (response) => {
                // Add logging in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(`API Response: ${response.status} ${response.config.url}`);
                }
                return response;
            },
            (error) => {
                const processedError = handleApiError(error);
                
                // Log errors in development
                if (process.env.NODE_ENV === 'development') {
                    console.error('API Error:', processedError);
                }
                
                return Promise.reject(processedError);
            }
        );

        return { apiClient };
    }, [API_URL]);
};

export default useApiClient;