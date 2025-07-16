/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    CloneButton,
    DeleteWithConfirmButton,
    Edit, PasswordInput,
    required,
    SaveButton,
    SelectInput,
    ShowButton,
    SimpleFormConfigurable,
    TextInput,
    Toolbar,
    TopToolbar,
    useCanAccess,
    useSaveContext,
} from 'react-admin';
import useRoles from "../roles/useRoles";
import {useState} from "react";
import useUsers from "./useUsers";
import {Grid} from "@mui/material";

/**
 * Custom Toolbar for the Edit form
 *
 * Save with undo, but delete with confirm
 */
const UserEditToolbar = ({onShowPasswordToggle}) => {
    return (
        <Toolbar
            sx={{display: 'flex', justifyContent: 'space-between'}}
        >
            <SaveButton alwaysEnable={true}/>
            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={onShowPasswordToggle}*/}
            {/*    style={{*/}
            {/*        marginLeft: '16px',*/}
            {/*        background: 'none',*/}
            {/*        border: 'none',*/}
            {/*        color: '#1976d2',*/}
            {/*        cursor: 'pointer'*/}
            {/*    }}*/}
            {/*>*/}
            {/*    {'تغییر کلمه عبور'}*/}
            {/*</button>*/}
            <DeleteWithConfirmButton/>
        </Toolbar>
    );
};

const EditActions = () => (
    <TopToolbar>
        {/*<CloneButton className="button-clone"/>*/}
        {/*<ShowButton/>*/}
    </TopToolbar>
);

const UserEditForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const roles = useRoles();
    const users = useUsers();
    const {isPending, canAccess: canEditRole} = useCanAccess({
        action: 'edit',
        resource: 'users.role',
    });
    const {save} = useSaveContext();
    if (isPending) {
        return null;
    }
    if (!save) return null;

    const newSave = values =>
        new Promise(resolve => {
            if (values.name === 'test') {
                return resolve({
                    name: {
                        message: 'ra.validation.minLength',
                        args: { min: 10 },
                    },
                });
            }
            return save(values);
        });

    return (
        <SimpleFormConfigurable
            defaultValues={{ role: 'user' }}
            toolbar={<UserEditToolbar
                onShowPasswordToggle={() => setShowPassword(!showPassword)}
            />}
            onSubmit={newSave}
        >
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                    <TextInput source="name" label={"نام"} validate={required()}/>
                </Grid>
                <Grid item xs={6} sm={6}>
                    <TextInput source="username" label={"نام کاربری"}  fullWidth />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <TextInput source="email" label={"پست الکترونیک"}  fullWidth />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <AutocompleteInput
                        source="boss"
                        label={"رئیس"}
                        choices={users}
                    />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <PasswordInput
                        source="password"
                        label={"کلمه عبور"}
                        // validate={isCreate ? validatePassword : undefined}
                        helperText={"اگر نمیخواهید پسورد تغییر کند خالی بگذارید"}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <PasswordInput
                        source="password2"
                        label={"تکرار کلمه عبور"}
                        // validate={isCreate ? validatePassword : undefined}
                        helperText={"اگر نمیخواهید پسورد تغییر کند خالی بگذارید"}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <AutocompleteArrayInput
                source="roles"
                label={"گروه"}
                // validate={required()}
                choices={roles}
            />
        </SimpleFormConfigurable>
    );
};
const UserEdit = () => {
    return (
        <Edit actions={<EditActions />}>
            <UserEditForm />
        </Edit>
    );
};

export default UserEdit;
