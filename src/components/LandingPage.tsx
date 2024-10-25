import React, {useContext, useState} from 'react';
import DefaultLayout from '../theme/DefaultLayout';
import {AuthContext} from "../contexts/AuthContext";
import SignInSide from "./sign-in/SignInSide";

const LandingPage = () => {
    const isLoggedIn = useContext(AuthContext)?.isLoggedIn;

    if (!isLoggedIn) {
        return <SignInSide/>;
    }

    return (
        <DefaultLayout>
            <div>
                <h1>Welcome to your Band Journal!</h1>
            </div>
        </DefaultLayout>

    );
};

export default LandingPage;
