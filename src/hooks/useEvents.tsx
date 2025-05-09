import { useQuery, useMutation } from 'react-query';
import EventsApi from '../api/apiEvents';
import useAuth from './useAuth';
import { ConcertEvent, CreateEventData, UpdateEventData } from '../types/events';
import { ApiError, handleApiError } from '../api/apiErrors';

interface UseEvents {
    data: ConcertEvent[] | undefined;
    error: ApiError | null;
    isLoading: boolean;
    refetch: () => void;
    createEvent: (
        data: CreateEventData,
        options?: {
            onSuccess?: (data: ConcertEvent) => void;
            onError?: (error: ApiError) => void;
        }
    ) => Promise<void>;
    updateEvent: (
        id: number,
        data: UpdateEventData,
        options?: {
            onSuccess?: (data: ConcertEvent) => void;
            onError?: (error: ApiError) => void;
        }
    ) => Promise<void>;
    deleteEvent: (
        id: number,
        options?: {
            onSuccess?: () => void;
            onError?: (error: ApiError) => void;
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
                throw handleApiError(new Error('No authentication token found'));
            }
            try {
                const response = await eventsApi.getAllEvents(token);
                if (process.env.NODE_ENV === 'development') {
                    console.log('Successfully fetched events:', response);
                    
                    // Add detailed logging to help diagnose data structure issues
                    if (Array.isArray(response)) {
                        console.log(`Received ${response.length} events`);
                        
                        // Check for any items with missing or malformed properties
                        const itemsWithIssues = response.filter(item =>
                            !item ||
                            typeof item !== 'object' ||
                            !item.appUser ||
                            typeof item.appUser !== 'object' ||
                            !item.appUser.username
                        );
                        
                        if (itemsWithIssues.length > 0) {
                            console.warn('Found items with missing or malformed properties:', itemsWithIssues);
                        }
                    } else {
                        console.warn('API response is not an array:', response);
                    }
                }
                return response;
            } catch (error) {
                throw handleApiError(error);
            }
        },
        {
            enabled: !!token, // only fetch when token is available
        }
    );

    const createEventMutation = useMutation(
        async (data: CreateEventData) => {
            if (!token) {
                throw handleApiError(new Error('No authentication token found'));
            }
            try {
                const response = await eventsApi.createEvent(data, token);
                if (process.env.NODE_ENV === 'development') {
                    console.log('Successfully created event:', response);
                }
                return response;
            } catch (error) {
                throw handleApiError(error);
            }
        }
    );

    const updateEventMutation = useMutation(
        async ({ id, data }: { id: number; data: UpdateEventData }) => {
            if (!token) {
                throw handleApiError(new Error('No authentication token found'));
            }
            try {
                const response = await eventsApi.updateEvent(id, data, token);
                if (process.env.NODE_ENV === 'development') {
                    console.log('Successfully updated event:', response);
                }
                return response;
            } catch (error) {
                throw handleApiError(error);
            }
        }
    );

    const deleteEventMutation = useMutation(
        async (id: number) => {
            if (!token) {
                throw handleApiError(new Error('No authentication token found'));
            }
            try {
                const response = await eventsApi.deleteEvent(id, token);
                if (process.env.NODE_ENV === 'development') {
                    console.log('Successfully deleted event:', response);
                }
                return response;
            } catch (error) {
                throw handleApiError(error);
            }
        }
    );

    const createEvent = async (
        data: CreateEventData,
        options?: {
            onSuccess?: (data: ConcertEvent) => void;
            onError?: (error: ApiError) => void;
        }
    ) => {
        try {
            const response = await createEventMutation.mutateAsync(data);
            options?.onSuccess?.(response);
        } catch (error) {
            options?.onError?.(error as ApiError);
        }
    };

    const updateEvent = async (
        id: number,
        data: UpdateEventData,
        options?: {
            onSuccess?: (data: ConcertEvent) => void;
            onError?: (error: ApiError) => void;
        }
    ) => {
        try {
            const response = await updateEventMutation.mutateAsync({ id, data });
            options?.onSuccess?.(response);
        } catch (error) {
            options?.onError?.(error as ApiError);
        }
    };

    const deleteEvent = async (
        id: number,
        options?: {
            onSuccess?: () => void;
            onError?: (error: ApiError) => void;
        }
    ) => {
        try {
            await deleteEventMutation.mutateAsync(id);
            options?.onSuccess?.();
        } catch (error) {
            options?.onError?.(error as ApiError);
        }
    };

    return { data, error: error as ApiError | null, isLoading, refetch, createEvent, updateEvent, deleteEvent };
};

export default useEvents;