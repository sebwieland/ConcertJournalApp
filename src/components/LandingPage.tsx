import React, {useContext, useState} from 'react';
import DataTable from "./journal/DataTable";
import DataCollector, {DataCollectorState} from "./journal/DataCollector";
import Button from '@mui/material/Button';
import SignInSide from "./sign-in/SignInSide";
import DefaultLayout from '../theme/DefaultLayout';
import {AuthContext} from "../contexts/AuthContext";

const LandingPage = () => {
    const [showTable, setShowTable] = useState(false);
    const isLoggedIn = useContext(AuthContext)?.isLoggedIn;

    // if (!isLoggedIn) {
    //     return <SignInSide/>;
    // }

    return (
        <DefaultLayout>
            <div>
                <h1>Welcome to your Band Journal!</h1>
                <p>Choose an option:</p>
            </div>
        </DefaultLayout>

    );
};

export default LandingPage;
