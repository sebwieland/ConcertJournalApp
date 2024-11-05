import React from 'react';
import LandingPage from "./components/LandingPage";
import CreateNewEntryFormPage from "./components/NewDataEntryPage";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import SignInSide from "./components/sign-in/SignInSide";
import Journal from "./components/journal/Journal";
import {AuthProvider} from "./contexts/AuthContext";
import AuthenticatedPage from "./components/AuthenticatedPage";

interface AppProps {
    // No props needed for this component
}

class App extends React.Component<AppProps, {}> {
    render() {
        return (
            <AuthProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}> {
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<AuthenticatedPage element={<LandingPage />} />} />
                            <Route path="/new-entry" element={<AuthenticatedPage element={<CreateNewEntryFormPage />} />} />
                            <Route path="/your-journal" element={<AuthenticatedPage element={<Journal />} />} />
                            {/*<Route path="/sign-up" element={<SignUp />} />*/}
                            <Route path="/sign-in" element={<SignInSide/>}/>
                        </Routes>
                    </BrowserRouter>
                }
                </LocalizationProvider>
            </AuthProvider>
        );
    }
}


export default App;
