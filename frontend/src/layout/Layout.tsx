import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppBar, Layout, InspectorButton, TitlePortal } from 'react-admin';
import '../../assets/app.css';
import MyMenu from "./MyMenu";

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <InspectorButton />
    </AppBar>
);

export default ({ children }) => (
    <>
        <Layout appBar={MyAppBar} menu={MyMenu}>{children}</Layout>
        <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
        />
    </>
);
