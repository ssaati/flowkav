// In src/MyMenu.js
import { Menu, usePermissions } from 'react-admin';
import React from "react";
import HomeIcon from '@mui/icons-material/Home';

const MyMenu = () => {
    const { permissions } = usePermissions();

    return (
        <Menu>
            <Menu.Item to={"/"} primaryText={"صفحه اصلی"} title={"صفحه اصلی"} leftIcon={<HomeIcon/>}/>
            <Menu.ResourceItem name="forms" />
            <Menu.ResourceItem name="users" />
            <Menu.ResourceItem name="roles" />
            <Menu.ResourceItem name="cartable" />
            {permissions === 'admin' && <Menu.ResourceItem name="users" />}
        </Menu>
    );
};
export default MyMenu;