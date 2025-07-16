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
    useCanAccess, SimpleFormConfigurable,
} from 'react-admin';

const RoleCreateToolbar = () => {
    const notify = useNotify();
    const { reset } = useFormContext();

    return (
        <Toolbar>
            <SaveButton label="ذخیره" alwaysEnable={true}/>
        </Toolbar>
    );
};

const RoleCreate = () => {
    const unique = useUnique();
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
                toolbar={<RoleCreateToolbar />}
            >
            <TextInput
                source="name"
                label={"نام گروه"}
                autoFocus
            />
            </SimpleFormConfigurable>
        </Create>
    );
};

export default RoleCreate;
