import apiClient from "./apiClient";

const eventsApi = {
    getAllEvents: async (token: string) => {
        const response = await apiClient.get('/allEvents', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        console.log("allEventsResponse: ", response.data)
        return response.data;
    },

    createEvent: async (data: any, token: string) => {
        const response = await apiClient.post('/event', data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        console.log("createEventResponse: ", response.data)
        return response.data;
    },

    deleteEvent: async (id: number, token: string) => {
        const response = await apiClient.delete(`/event/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        console.log("deleteEventResponse: ", response.data)
        return response.data;
    },

}

export default eventsApi;
