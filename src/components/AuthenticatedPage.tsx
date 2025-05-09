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
        return () => {
            // No need to log unmount here
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
        
        // Use React Router's Navigate component instead of hard redirect
        // This prevents a full page reload which can disrupt the auth flow
        return <Navigate to="/sign-in" replace />;
    }

    return element;
});

export default AuthenticatedPage;