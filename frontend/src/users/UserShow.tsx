/* eslint react/jsx-key: off */
import * as React from 'react';
import {Show, ShowView, SimpleShowLayout, TextField, useCanAccess} from 'react-admin';

const UserShow = () => {
    const { isPending, canAccess: canSeeRole } = useCanAccess({
        action: 'show',
        resource: 'users.role',
    });
    if (isPending) {
        return null;
    }
    return (
        <Show>
            <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="name" />
                    <TextField source="roles" />
            </SimpleShowLayout>
        </Show>
    );
};

export default UserShow;
