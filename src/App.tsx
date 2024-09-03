import React from 'react';
import LandingPage from "./components/LandingPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateNewEntryFormPage from "./components/NewDataEntryPage";

interface AppProps {
    // No props needed for this component
}

class App extends React.Component<AppProps, {}> {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/new-entry" element={<CreateNewEntryFormPage />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
