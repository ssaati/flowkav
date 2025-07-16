// MyAppBar.js
import { AppBar, UserMenu } from 'react-admin';
import { IconButton, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const MyAppBar = (props) => {
    const navigate = useNavigate();

    return (
        <AppBar {...props} userMenu={<UserMenu />}>
            <Toolbar>
                <IconButton color="inherit" onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                {/* Spacer to push user menu to the right */}
                <div style={{ flex: 1 }} />
                {props.userMenu}
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;
