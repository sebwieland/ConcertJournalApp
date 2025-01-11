import useApiClient from "./apiClient";

const EventsApi = () => {
    const apiClient = useApiClient().apiClient;

    const getAllEvents = async (token: string) => {
        const response = await apiClient.get('/allEvents', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const createEvent = async (data: any, token: string) => {
        const response = await apiClient.post('/event', data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    };

    const updateEvent = async (id: number, data: any, token: string) => {
        const response = await apiClient.put(`/event/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    };

    const deleteEvent = async (id: number, token: string) => {
        const response = await apiClient.delete(`/event/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    };

    return { getAllEvents, createEvent, updateEvent, deleteEvent };
};

export default EventsApi;