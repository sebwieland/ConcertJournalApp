import React, { memo, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from "react-router-dom";
import LoadingIndicator from "./utilities/LoadingIndicator";

interface AuthenticatedPageProps {
    element: React.ReactElement;
}

const AuthenticatedPage = memo(({ element }: AuthenticatedPageProps) => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext is not provided');
    }
    const { isLoggedIn, isLoading: authLoading } = authContext;
    const [isLoading, setIsLoading] = React.useState(authLoading);

    useEffect(() => {
        setIsLoading(authLoading);
        if (process.env.NODE_ENV === 'development') {
            console.log('AuthenticatedPage component mounted');
            console.log('AuthenticatedPage isLoggedIn:', isLoggedIn);
            console.log('AuthenticatedPage authLoading:', authLoading);
        }
        return () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('AuthenticatedPage component unmounted');
            }
        };
    }, [authLoading, isLoggedIn]);

    // Add a more robust check for authentication state
    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            console.log('AuthenticatedPage: User not logged in, will redirect to sign-in page');
        }
    }, [isLoading, isLoggedIn]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (!isLoggedIn) {
        console.log('User not logged in, redirecting to sign-in page NOW');
        // Clear any lingering auth state before redirecting
        try {
            if (authContext.setLoggedOut) {
                console.log('Calling setLoggedOut from AuthenticatedPage');
                authContext.setLoggedOut();
            }
        } catch (error) {
            console.error('Error calling setLoggedOut:', error);
        }
        
        // Force a hard redirect to ensure the page changes
        window.location.href = '/sign-in';
        return null;
    }

    return element;
});

export default AuthenticatedPage;