import {useMutation, useQuery, useQueryClient} from 'react-query';
import eventsApi from '../api/apiEvents';
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
    const { token } = useAuth();
    const queryClient = useQueryClient();

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

    const { mutateAsync: createEventMutation } = useMutation(
        async (variables: {data: any, token: string}) => {
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await eventsApi.createEvent(variables.data, token);
            return response.data;
        },
        {
            onSuccess: () => {
                console.log('Event created successfully!');
                queryClient.invalidateQueries('allEvents');
            },
            onError: (error) => {
                console.error('Error creating event:', error);
            },
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
            const response = await createEventMutation({ data, token });
            options?.onSuccess?.(response);
        } catch (error) {
            options?.onError?.(error);
        }
    };

    return { data, error, isLoading, refetch, createEvent };
};

export default useEvents;