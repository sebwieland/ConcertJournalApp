import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import {ThemeProvider} from '@mui/material/styles';
import SignInCard from './SignInCard';
import Content from './Content';
import ToggleColorMode from "../utilities/ToggleColorMode";
import useTheme from "../theme/useTheme";
import DefaultLayout from "../theme/DefaultLayout";

export default function SignInSide() {
    const {theme, mode, toggleColorMode} = useTheme();

    return (
        <DefaultLayout>
            <Content/>
            <SignInCard/>
        </DefaultLayout>
    );
}
