import React from 'react';
import DefaultLayout from '../theme/DefaultLayout';
import DataCollector from './journal/DataCollector';
import calculateStatistics from "../utils/calculateStatistics"
import {ConfirmProvider} from "material-ui-confirm";
import StatCard from './utilities/StatCard';
import {MusicNote, Group, LocationOn, PlaylistAddCheck} from '@mui/icons-material';

export default function LandingPage() {
    return (
        <DefaultLayout>
            <ConfirmProvider>
                <DataCollector>
                    {({data}) => {
                        const statistics = calculateStatistics(data);
                        return (
                            <div>
                                <h1>Welcome to your Concert Journal!</h1>
                                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                                    <StatCard title="Concerts attended" value={statistics.totalCount.toString()} icon={<PlaylistAddCheck />} />
                                    <StatCard title="Most Seen Artist" value={statistics.mostSeenArtist} icon={<MusicNote />} />
                                    <StatCard title="Most Artists on a Single Day" value={statistics.mostArtistsOnASingleDay.toString()} icon={<Group />} />
                                    <StatCard title="Most Visited Location:" value={statistics.mostVisitedLocation} icon={<LocationOn />} />
                                </div>
                            </div>
                        );
                    }}
                </DataCollector>
            </ConfirmProvider>
        </DefaultLayout>
    );
};