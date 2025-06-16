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
            // Cleanup function
        };
    }, [authLoading, isLoggedIn]);

    // Check for authentication state
    useEffect(() => {
        // Authentication state monitoring without logging
    }, [isLoading, isLoggedIn]);

    if (isLoading) {
        console.log("AuthenticatedPage: Loading state, showing loading indicator");
        return <LoadingIndicator />;
    }

    if (!isLoggedIn) {
        console.log("AuthenticatedPage: Not logged in, redirecting to sign-in");
        console.log("Auth context state:", {
            isLoggedIn: authContext.isLoggedIn,
            hasToken: !!authContext.token,
            cookies: typeof document !== 'undefined' ? document.cookie : 'not available in test'
        });
        
        // Clear any lingering auth state before redirecting
        try {
            if (authContext.setLoggedOut) {
                console.log("AuthenticatedPage: Calling setLoggedOut");
                authContext.setLoggedOut();
            }
        } catch (error) {
            console.error("AuthenticatedPage: Error in setLoggedOut", error);
        }
        
        // Use React Router's Navigate component instead of hard redirect
        // This prevents a full page reload which can disrupt the auth flow
        console.log("AuthenticatedPage: Redirecting to /sign-in");
        return <Navigate to="/sign-in" replace />;
    }

    console.log("AuthenticatedPage: User is logged in, rendering protected content");

    return element;
});

export default AuthenticatedPage;