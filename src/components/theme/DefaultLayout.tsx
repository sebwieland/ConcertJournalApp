import {ThemeProvider} from "@mui/material";
import Stack from "@mui/material/Stack";
import useTheme from "./useTheme";
import React, {PropsWithChildren} from "react";
import ToggleColorMode from "../sign-up/ToggleColorMode";
import CssBaseline from "@mui/material/CssBaseline";

const DefaultLayout = ({children}: PropsWithChildren) => {
    const {theme, mode, toggleColorMode} = useTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme/>

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
                    <ToggleColorMode
                        data-screenshot="toggle-mode"
                        mode={mode}
                        toggleColorMode={toggleColorMode}
                    />
                    {children}
                </Stack>
            </Stack>
        </ThemeProvider>
    );
};

export default DefaultLayout;
