import {useMutation, useQuery} from 'react-query';
import eventsApi from '../api/apiEvents';
import useAuth from './useAuth';

interface UseEvents {
    data: any;
    error: any;
    isLoading: boolean;
    refetch: () => void;
    createEvent: (data: { /* event data */ }) => Promise<void>;
}

const useEvents = (): UseEvents => {
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
            },
            onError: (error) => {
                console.error('Error creating event:', error);
            },
        }
    );

    const createEvent = async (data: { /* event data */ }) => {
        if (!token) {
            throw new Error('No authentication token found');
        }
        await createEventMutation({ data, token });
    };

    return { data, error, isLoading, refetch, createEvent };
};

export default useEvents;