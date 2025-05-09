import React, { useEffect, useState } from 'react';
import useEvents from "../../hooks/useEvents";
import { useConfirm } from "material-ui-confirm";
import EventsApi from "../../api/apiEvents";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { JSX } from "react";
import { ConcertEvent } from "../../types/events";
import { ApiError, handleApiError } from "../../api/apiErrors";

interface DataCollectorProps {
    children: (state: DataCollectorState) => JSX.Element;
}

export interface DataCollectorState {
    data: ConcertEvent[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const DataCollector = ({ children }: DataCollectorProps) => {
    const eventsApi = EventsApi();
    const { data, refetch } = useEvents();
    const confirm = useConfirm();
    const { token } = useAuth();
    const navigate = useNavigate();
    
    // Add logging to help diagnose data structure issues
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && data) {
            console.log('DataCollector received data:', data);
            // Check for any items missing the appUser property
            const missingAppUser = data.filter(item => !item.appUser);
            if (missingAppUser.length > 0) {
                console.warn('Found items missing appUser property:', missingAppUser);
            }
        }
    }, [data]);

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('DataCollector component mounted');
        }
        return () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('DataCollector component unmounted');
            }
        };
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/edit-entry/${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            await confirm({ description: "This action is permanent!" });
            await eventsApi.deleteEvent(id, token);
            refetch();
            if (process.env.NODE_ENV === 'development') {
                console.log('Successfully deleted event with ID:', id);
            }
        } catch (error) {
            const processedError = handleApiError(error);
            console.error('Error deleting event:', processedError);
        }
    };

    return children({
        data: data || [],
        onEdit: handleEdit,
        onDelete: handleDelete
    });
};

export default DataCollector;