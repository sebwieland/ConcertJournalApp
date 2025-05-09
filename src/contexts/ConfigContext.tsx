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
        fetch('/config.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setConfig(data);
                setLoading(false);
                if (process.env.NODE_ENV === 'development') {
                    console.log('Successfully loaded config:', data);
                }
            })
            .catch(error => {
                const processedError = handleApiError(error);
                console.error("Failed to load config:", processedError);
                setConfig({ backendURL: "http://localhost:8080" });
                setLoading(false);
            });
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
