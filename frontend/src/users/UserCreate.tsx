/* eslint react/jsx-key: off */
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    Create,
    SaveButton,
    AutocompleteInput,
    TextInput,
    Toolbar,
    required,
    useNotify,
    useUnique,
    CanAccess,
    useCanAccess, SimpleFormConfigurable, AutocompleteArrayInput, PasswordInput,
} from 'react-admin';
import useRoles from "../roles/useRoles";
import useUsers from "./useUsers";
import {Grid} from "@mui/material";

const UserCreateToolbar = () => {
    const notify = useNotify();
    const { reset } = useFormContext();

    return (
        <Toolbar>
            <SaveButton label="ذخیره" alwaysEnable={true} />
        </Toolbar>
    );
};

const isValidName = async value =>
    new Promise<string | undefined>(resolve =>
        setTimeout(() =>
            resolve(value === 'Admin' ? "Can't be Admin" : undefined)
        )
    );

const UserCreate = () => {
    const roles = useRoles();
    const users = useUsers();
    const { isPending, canAccess: canEditRole } = useCanAccess({
        action: 'edit',
        resource: 'users.role',
    });
    if (isPending) {
        return null;
    }
    return (
        <Create redirect="show">
            <SimpleFormConfigurable
                mode="onBlur"
                warnWhenUnsavedChanges
                toolbar={<UserCreateToolbar />}
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
                            helperText={"حداقل 12 کاراکتر با حروف کوچک و بزرگ و اعداد و کاراکترهای خاص"}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <PasswordInput
                            source="password2"
                            label={"تکرار کلمه عبور"}
                            helperText={"حداقل 12 کاراکتر با حروف کوچک و بزرگ و اعداد و کاراکترهای خاص"}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <AutocompleteArrayInput
                            source="roles"
                            label={"گروه"}
                            choices={roles}
                        />
                    </Grid>
                </Grid>
            </SimpleFormConfigurable>
        </Create>
    );
};

export default UserCreate;
