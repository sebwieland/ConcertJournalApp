import apiClient from "./apiClient";

const eventsApi = {
    getAllEvents: async (token: string) => {
        console.log("token: ", token)
        const response = await apiClient.get('/allEvents', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        console.log("allEventsResponse: ", response.data)
        return response.data;
    },
};

export default eventsApi;
