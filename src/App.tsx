import React from 'react';
import LandingPage from "./components/LandingPage";
import CreateNewEntryFormPage from "./components/NewDataEntryPage";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import SignUp from "./components/sign-up/SignUp";
import SignInSide from "./components/sign-in-side/SignInSide";

interface AppProps {
    // No props needed for this component
}

class App extends React.Component<AppProps, {}> {
    render() {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}> {
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage/>}/>
                        <Route path="/new-entry" element={<CreateNewEntryFormPage/>}/>
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/sign-in" element={<SignInSide />} />
                    </Routes>
                </BrowserRouter>
            }
            </LocalizationProvider>
        );
    }
}


export default App;
