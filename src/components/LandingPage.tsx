import React from 'react';
import DefaultLayout from '../theme/DefaultLayout';
import DataCollector from './journal/DataCollector';
import calculateStatistics from "../utils/calculateStatistics"
import {ConfirmProvider} from "material-ui-confirm";

export default function LandingPage() {
    return (
        <DefaultLayout>
            <ConfirmProvider>
                <DataCollector>
                    {({data}) => {
                        console.log(data)
                        const statistics = calculateStatistics(data);
                        return (
                            <div>
                                <h1>Welcome to your Band Journal!</h1>
                                <div>
                                    <h2>Interesting Facts:</h2>
                                    <div>
                                        <h3>Most Seen Band:</h3>
                                        <p>{statistics.mostSeenBand}</p>
                                    </div>
                                    <div>
                                        <h3>Most Bands on a Single Day:</h3>
                                        <p>{statistics.mostBandsOnASingleDay}</p>
                                    </div>
                                    <div>
                                        <h3>Most Visited Location:</h3>
                                        <p>{statistics.mostVisitedLocation}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </DataCollector>
            </ConfirmProvider>
        </DefaultLayout>
    );
};

