import axios from 'axios';
import {useContext, useMemo} from "react";
import {ConfigContext} from '../contexts/ConfigContext';

const useApiClient = () => {
    const config = useContext(ConfigContext);
    const API_URL = config?.backendURL ?? 'http://localhost:8080';
    return useMemo(() => {
        console.log("API_URL " + API_URL)
        return axios.create({
            baseURL: API_URL
        });
    }, [API_URL]);
};

export default useApiClient;