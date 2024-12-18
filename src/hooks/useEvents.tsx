import {useQuery} from 'react-query';
import EventsApi from '../api/apiEvents';
import useAuth from './useAuth';


interface UseEvents {
    data: any;
    error: any;
    isLoading: boolean;
    refetch: () => void;
    createEvent: (
        data: { /* event data */ },
        options?: {
            onSuccess?: (data: any) => void;
            onError?: (error: any) => void;
        }
    ) => Promise<void>;
}


const useEvents = (): UseEvents => {
    const eventsApi = EventsApi();

    const { token } = useAuth();

    const { data, error, isLoading, refetch } = useQuery(
        'allEvents',
        async () => {
            if (!token) {
                throw new Error('No authentication token found');
            }
            return eventsApi.getAllEvents(token);
        },
        {
            enabled: !!token, // only fetch when token is available
        }
    );

    const createEvent = async (
        data: { /* event data */ },
        options?: {
            onSuccess?: (data: any) => void;
            onError?: (error: any) => void;
        }
    ) => {
        if (!token) {
            throw new Error('No authentication token found');
        }
        try {
            const response = await eventsApi.createEvent(data, token);
            options?.onSuccess?.(response);
        } catch (error) {
            options?.onError?.(error);
        }
    };

    return { data, error, isLoading, refetch, createEvent };
};

export default useEvents;