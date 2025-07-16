/* eslint react/jsx-key: off */
import * as React from 'react';
import {Show, SimpleShowLayout, TextField, useCanAccess} from 'react-admin';

const RoleShow = () => {
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
                {canSeeRole ? (
                    <TextField source="role" />
                ) : null}
            </SimpleShowLayout>
        </Show>
    );
};

export default RoleShow;
