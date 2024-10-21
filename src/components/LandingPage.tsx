import React, {useContext, useEffect, useState} from 'react';
import DataTable from "./DataTable";
import DataCollector, {DataCollectorState} from "./DataCollector";
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";
import SignInSide from "./sign-in/SignInSide";
import DefaultLayout from '../theme/DefaultLayout';
import {AuthContext} from "../contexts/AuthContext";

const LandingPage = () => {
    const [showTable, setShowTable] = useState(false);
    const navigate = useNavigate()
    const isLoggedIn = useContext(AuthContext)?.isLoggedIn;

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
