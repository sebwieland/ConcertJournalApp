import { useQuery, useQueryClient } from 'react-query';
import eventsApi from '../api/apiEvents';
import useAuth from './useAuth';

interface UseEvents {
    data: any;
    error: any;
    isLoading: boolean;
    refetch: () => void;
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

    return { data, error, isLoading, refetch };
};

export default useEvents;