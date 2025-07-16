import { AppBar, UserMenu } from 'react-admin';
import {Button, Toolbar, Typography} from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

const MyUserMenu = (props) => <UserMenu {...props} icon={false} />;
const NoUserMenu = () => null;
const CustomAppBar = (props) => (
    // <div>
    //     <div style={{position: "fixed", left: "0"}}>
    //         <UserMenu/>
    //     </div>
    //     <div style={{position: "fixed", right: "0"}}>
    //         <Typography variant="h1">جریان</Typography>
    //     </div>
    // </div>
    <AppBar {...props} color={"transparent"} userMenu={false}>
        {/*<Toolbar>*/}
        {/*    <Button component={Link} to="/" color="inherit">*/}
        {/*        داشبورد*/}
        {/*    </Button>*/}
        {/*    <Button component={Link} to="/posts" color="inherit">*/}
        {/*        Posts*/}
        {/*    </Button>*/}
        {/*    <Button component={Link} to="/users" color="inherit">*/}
        {/*        Users*/}
        {/*    </Button>*/}
        {/*    <UserMenu />*/}
        {/*</Toolbar>*/}
    </AppBar>
);

export default CustomAppBar;
