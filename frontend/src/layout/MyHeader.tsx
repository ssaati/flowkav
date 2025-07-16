// MyHeader.js
import {Toolbar, IconButton, Typography, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {Link, UserMenu} from "react-admin";

const MyHeader = () => {
    const navigate = useNavigate();

    return (
        // <div style={{ backgroundColor: '#2196f3', color: '#fff', zIndex:"1000", position:"fixed", width:"100%", height:"48px"}}>
        <div style={{ backgroundColor: 'white', zIndex:"1000", position:"fixed", width:"100%", height:"48px"}}>
            <div style={{position:"fixed", right: "auto", top:"0", width:"30px"}}>
                <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <div style={{position:"fixed", left: "10px", top:"0", width:"30px"}}>
                <UserMenu/>
            </div>
            <div style={{position:"fixed", right: "50px", padding: "5px"}}>
                <Button component={Link} to="/" color="inherit">
                    صفحه اصلی
                </Button>
                <Button component={Link} to="/users" color="inherit">
                    کاربران
                </Button>
                <Button component={Link} to="/roles" color="inherit">
                    گروه ها
                </Button>
                <Button component={Link} to="/forms" color="inherit">
                    فرم ها
                </Button>
                <Button component={Link} to="/cartable" color="inherit">
                    کارتابل
                </Button>
            </div>
            {/*<Typography variant="h6" sx={{ ml: 2 }}>*/}
            {/*    Back*/}
            {/*</Typography>*/}
        </div>
    );
};

export default MyHeader;
