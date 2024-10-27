import React, {memo, useEffect} from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from "react-router-dom";
import LoadingIndicator from "./utilities/LoadingIndicator";

interface AuthenticatedPageProps {
    element: React.ReactElement;
}

const AuthenticatedPage = memo(({ element }: AuthenticatedPageProps) => {
    const isLoggedIn = useContext(AuthContext)?.isLoggedIn;
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        if (element) {
            setIsLoading(false);
        }
    }, [element]);

    if (!isLoggedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return element;
});

export default AuthenticatedPage;