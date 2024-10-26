import React, {memo} from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from "react-router-dom";

interface AuthenticatedPageProps {
    element: React.ReactElement;
}

const AuthenticatedPage = memo(({ element }: AuthenticatedPageProps) => {
    const isLoggedIn = useContext(AuthContext)?.isLoggedIn;

    if (!isLoggedIn) {
        return <Navigate to="/sign-in" replace />;
    }
    return element;
});

export default AuthenticatedPage;