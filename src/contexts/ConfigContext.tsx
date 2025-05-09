import React, { useState, useEffect, ReactNode } from 'react';
import { handleApiError } from '../api/apiErrors';

interface Config {
    backendURL: string;
}

const ConfigContext = React.createContext<Config | null>(null);

const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                // First try to load from localStorage if available
                const cachedConfig = localStorage.getItem('app_config');
                if (cachedConfig) {
                    try {
                        const parsedConfig = JSON.parse(cachedConfig);
                        console.log('Using cached config from localStorage');
                        setConfig(parsedConfig);
                        setLoading(false);
                        
                        // Still try to fetch fresh config in background
                        fetchFreshConfig();
                        return;
                    } catch (parseError) {
                        console.warn('Failed to parse cached config, will fetch fresh config');
                        localStorage.removeItem('app_config');
                    }
                }
                
                // If no cached config, fetch it directly
                await fetchFreshConfig();
            } catch (error) {
                console.error("Error in loadConfig:", error);
                setConfig({ backendURL: "http://localhost:8080" });
                setLoading(false);
            }
        };
        
        const fetchFreshConfig = async () => {
            try {
                const response = await fetch('/config.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Log the raw response for debugging
                const text = await response.text();
                console.log('Raw config response:', text);
                
                // Parse the text to JSON
                const data = JSON.parse(text);
                
                setConfig(data);
                setLoading(false);
                
                // Cache the config in localStorage
                localStorage.setItem('app_config', JSON.stringify(data));
                
                if (process.env.NODE_ENV === 'development') {
                    console.log('Successfully loaded config:', data);
                }
            } catch (error) {
                const processedError = handleApiError(error);
                console.error("Failed to load config:", processedError);
                setConfig({ backendURL: "http://localhost:8080" });
                setLoading(false);
            }
        };
        
        loadConfig();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export { ConfigContext, ConfigProvider };
