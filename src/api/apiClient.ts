import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_IP;

console.log("API_URL: " + API_URL)

const apiClient = axios.create({
    baseURL: API_URL,
});

export default apiClient;