import useApiClient from "./apiClient";
import { ConcertEvent, CreateEventData, UpdateEventData } from '../types/events';
import { handleApiError } from './apiErrors';

const EventsApi = () => {
    const apiClient = useApiClient().apiClient;

    const getAllEvents = async (token: string): Promise<ConcertEvent[]> => {
        console.log("apiEvents: getAllEvents called with token", {
            hasToken: !!token,
            tokenLength: token?.length || 0,
            baseURL: apiClient?.defaults?.baseURL || 'undefined'
        });
        
        try {
            console.log("apiEvents: Making GET request to /allEvents");
            const response = await apiClient.get('/allEvents', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            console.log("apiEvents: Response received", {
                status: response.status,
                hasData: !!response.data,
                dataLength: Array.isArray(response.data) ? response.data.length : 'not an array'
            });
            
            return response.data;
        } catch (error) {
            console.error("apiEvents: Error in getAllEvents", error);
            throw handleApiError(error);
        }
    };

    const createEvent = async (data: CreateEventData, token: string): Promise<ConcertEvent> => {
        try {
            const response = await apiClient.post('/event', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    };

    const updateEvent = async (id: number, data: UpdateEventData, token: string): Promise<ConcertEvent> => {
        try {
            const response = await apiClient.put(`/event/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    };

    const deleteEvent = async (id: number, token: string): Promise<void> => {
        try {
            await apiClient.delete(`/event/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
        } catch (error) {
            throw handleApiError(error);
        }
    };

    return { getAllEvents, createEvent, updateEvent, deleteEvent };
};

export default EventsApi;