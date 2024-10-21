import {ThemeProvider} from "@mui/material";
import Stack from "@mui/material/Stack";
import useTheme from "./useTheme";
import React, {PropsWithChildren, useContext, useEffect, useState} from "react";
import ToggleColorMode from "../components/utilities/ToggleColorMode";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {AuthContext} from "../contexts/AuthContext";

const DefaultLayout = ({children}: PropsWithChildren) => {
    const {theme, mode, toggleColorMode} = useTheme();
    const isLoggedIn = useContext(AuthContext)?.isLoggedIn;
    const navigate = useNavigate()
    const API_URL = 'http://localhost:8080';

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/logout`);
        } catch (error: unknown) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.removeItem('token');
            // setIsLoggedIn(false);
            window.location.href = '/';
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme/>
            {isLoggedIn && (
                <AppBar position="static">
                    <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component="div">
                            Band Journal
                        </Typography>
                        <Button color="inherit" onClick={() => navigate('/new-entry')}>
                            Add Entry
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                        <ToggleColorMode
                            data-screenshot="toggle-mode"
                            mode={mode}
                            toggleColorMode={toggleColorMode}
                        />
                    </Toolbar>
                </AppBar>
            )}

            <Stack
                direction="column"
                component="main"
                sx={[
                    {
                        justifyContent: 'space-between',
                        height: {xs: 'auto', md: '100%'},
                    },
                    (theme) => ({
                        backgroundImage:
                            'radial-gradient(ellipse at 70% 51%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                        backgroundSize: '100vw 100vh',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '100vh',
                        width: '100vw',
                        height: '100vh',
                        overflow: 'auto',
                    }),
                    (theme) => ({
                        ...theme.applyStyles('light', {
                            backgroundImage:
                                'radial-gradient(at 70% 51%, hsla(210, 100%, 97%, 0.5), hsl(0, 0%, 100%))',
                        }),
                        ...theme.applyStyles('dark', {
                            backgroundImage:
                                'radial-gradient(at 70% 51%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                        }),
                    }),
                ]}
            >
                <Stack
                    direction={{xs: 'column-reverse', md: 'row'}}
                    sx={{
                        justifyContent: 'center',
                        gap: {xs: 6, sm: 12},
                        p: 2,
                        m: 'auto',
                    }}
                >

                    {children}
                </Stack>
            </Stack>
        </ThemeProvider>
    );
};

export default DefaultLayout;
