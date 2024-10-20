import React, {useEffect, useState} from 'react';
import DataTable from "./DataTable";
import DataCollector, {DataCollectorState} from "./DataCollector";
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";
import SignInSide from "./sign-in/SignInSide";
import axios, {AxiosError} from "axios";
import useTheme from './theme/useTheme';
import DefaultLayout from  './theme/DefaultLayout';

const LandingPage = () => {
    const [showTable, setShowTable] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate()


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [localStorage.getItem('token')]);

    if (!isLoggedIn) {
        return <SignInSide/>;
    }

    const handleToggleTable = () => {
        setShowTable(!showTable);
    };

    return (
        <DefaultLayout>
            <div>
                <h1>Welcome to your Band Journal!</h1>
                <p>Choose an option:</p>
                <Button variant="contained" onClick={handleToggleTable}>
                    {showTable ? "Hide Table" : "Show Table"}
                </Button>

                {showTable &&
                    <DataCollector>
                        {({data}: DataCollectorState) => (
                            <DataTable data={data}/>
                        )}
                    </DataCollector>}
            </div>
        </DefaultLayout>

    );
};

export default LandingPage;
