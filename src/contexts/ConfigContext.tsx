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
                        setConfig(parsedConfig);
                        setLoading(false);
                        
                        // Still try to fetch fresh config in background
                        fetchFreshConfig();
                        return;
                    } catch (parseError) {
                        // Failed to parse cached config, will fetch fresh config
                        localStorage.removeItem('app_config');
                    }
                }
                
                // If no cached config, fetch it directly
                await fetchFreshConfig();
            } catch (error) {
                // Error handling without logging
                setConfig({ backendURL: "http://localhost:8080" });
                setLoading(false);
            }
        };
        
        const fetchFreshConfig = async () => {
            try {
                console.log("Fetching config.json...");
                const response = await fetch('/config.json');
                
                if (!response.ok) {
                    console.error(`Config fetch error! status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Parse the response
                const text = await response.text();
                console.log("Raw config.json content:", text);
                const data = JSON.parse(text);
                console.log("Parsed config:", data);
                
                setConfig(data);
                setLoading(false);
                
                // Cache the config in localStorage
                localStorage.setItem('app_config', JSON.stringify(data));
            } catch (error) {
                console.error("Error loading config:", error);
                // Error handling without logging
                handleApiError(error);
                console.log("Using fallback config with localhost:8080");
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
