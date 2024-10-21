import * as React from 'react';
import SignInCard from './SignInCard';
import Content from './Content';
import useTheme from "../../theme/useTheme";
import DefaultLayout from "../../theme/DefaultLayout";

export default function SignInSide() {
    return (
        <DefaultLayout>
            <Content/>
            <SignInCard/>
        </DefaultLayout>
    );
}
