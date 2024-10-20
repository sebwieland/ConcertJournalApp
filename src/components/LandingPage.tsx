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

    const handleCreateNewEntry = () => {
        navigate('/new-entry');
    };

    const API_URL = 'http://localhost:8080';

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${API_URL}/logout`);
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            navigate('/'); // or wherever you want to redirect after logout

        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.error('Error logging in:', axiosError.response.status);
            } else {
                console.error('Error logging in:', axiosError.message);
            }
        }
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

                {/*<SpeedDial*/}
                {/*    ariaLabel="SpeedDial example"*/}
                {/*    icon={<SpeedDialIcon />}*/}
                {/*    sx={{ position: 'absolute', bottom: 16, right: 16 }}*/}
                {/*    onClose={() => console.log('SpeedDial closed')}*/}
                {/*    onOpen={() => console.log('SpeedDial opened')}*/}
                {/*    open={false}*/}
                {/*>*/}
                {/*<SpeedDialAction*/}
                {/*        icon={<AddCircleIcon />}*/}
                {/*        tooltipTitle="Create New Entry"*/}
                {/*        onClick={handleCreateNewEntry}*/}
                {/*    />*/}
                {/*</SpeedDial>*/}
                {/*<br/>*/}

                <Button variant="contained" onClick={handleCreateNewEntry}>
                    {"Add Entry"}
                </Button>

                <Button variant="contained" onClick={handleLogout}>
                    {"Logout"}
                </Button>

            </div>
        </DefaultLayout>

    );
};

export default LandingPage;
