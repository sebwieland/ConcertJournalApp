import React, { useEffect } from 'react';
import DefaultLayout from '../theme/DefaultLayout';
import DataCollector from './journal/DataCollector';
import calculateStatistics from "../utils/calculateStatistics";
import { ConcertEvent } from "../types/events";
import { ConfirmProvider } from "material-ui-confirm";
import StatCard from './utilities/StatCard';
import { MusicNote, Group, LocationOn, PlaylistAddCheck } from '@mui/icons-material';
import { Alert, Divider } from "@mui/material";
import useEvents from "../hooks/useEvents";
import { handleApiError } from '../api/apiErrors';
import LoadingIndicator from "./utilities/LoadingIndicator";
import SearchComponent from './journal/SearchComponent';

export default function LandingPage() {
    console.log("LandingPage: Component rendering");
    const { data, error, isLoading, refetch } = useEvents();
    console.log("LandingPage: useEvents hook result", {
        hasData: !!data,
        dataLength: data?.length,
        hasError: !!error,
        isLoading
    });

    useEffect(() => {
        console.log("LandingPage: Component mounted");
        return () => {
            console.log("LandingPage: Component unmounting");
        };
    }, []);

    if (isLoading) {
        console.log("LandingPage: Showing loading indicator");
        return <DefaultLayout><LoadingIndicator /></DefaultLayout>;
    }

    if (error) {
        console.log("LandingPage: Showing error", error);
        return (
            <DefaultLayout>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error.message}
                </Alert>
            </DefaultLayout>
        );
    }

    const events = data || [];
    console.log("LandingPage: Events data available", { count: events.length });
    const statistics = calculateStatistics(events);
    console.log("LandingPage: Statistics calculated", statistics);

    return (
        <DefaultLayout>
            <ConfirmProvider>
                <div>
                    <h1>Welcome to your Concert Journal!</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <StatCard title="Concerts attended" value={statistics.totalCount.toString()} icon={<PlaylistAddCheck />} />
                        <StatCard title="Most Seen Artist" value={statistics.mostSeenArtist} icon={<MusicNote />} />
                        <StatCard title="Most Artists on a Single Day" value={statistics.mostArtistsOnASingleDay.toString()} icon={<Group />} />
                        <StatCard title="Most Visited Location" value={statistics.mostVisitedLocation} icon={<LocationOn />} />
                    </div>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <h2>Search Your Journal</h2>
                    {/* Force the SearchComponent to be included in all builds */}
                    <div data-testid="search-component-container">
                        {events && events.length > 0 ? (
                            <SearchComponent data={events} />
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No concert data available for search. Add some concerts to get started!
                            </Alert>
                        )}
                    </div>
                </div>
            </ConfirmProvider>
        </DefaultLayout>
    );
}