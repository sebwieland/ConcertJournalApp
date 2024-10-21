import React, { useState, useEffect } from 'react';
import useEvents from "../../hooks/useEvents";

interface DataCollectorProps {
    children: (state: DataCollectorState) => JSX.Element;
}

export interface DataCollectorState {
    data: {
        id: number,
        bandName: string,
        place: string,
        date: Date
        comment: string,
        rating: number,
        appUser: {
            firstName: string,
            lastName: string,
            username: string
        }
    }[];
}

const DataCollector = ({ children }: DataCollectorProps) => {
    const { data } = useEvents();
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    return children({ data: localData });
};

export default DataCollector;