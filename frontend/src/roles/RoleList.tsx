/* eslint react/jsx-key: off */
import PeopleIcon from '@mui/icons-material/People';
import { useMediaQuery, Theme } from '@mui/material';
import * as React from 'react';
import {
    BulkDeleteWithConfirmButton,
    CanAccess,
    DataTable, EditButton,
    List,
    SearchInput, ShowButton,
    SimpleList,
    TextInput,
    useCanAccess,
} from 'react-admin';

export const UserIcon = PeopleIcon;

const getUserFilters = (canSeeRole: boolean): React.ReactElement[] => {
    const filters = [
        <SearchInput source="q" alwaysOn />,
        <TextInput source="name" />,
    ];
    return filters;
};

const UserBulkActionButtons = props => (
    <BulkDeleteWithConfirmButton {...props} />
);

const RoleList = () => {
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );
    const { isPending, canAccess: canSeeRole } = useCanAccess({
        action: 'show',
        resource: 'users.role',
    });
    if (isPending) {
        return null;
    }
    return (
        <List
            // filters={getUserFilters(canSeeRole ?? false)}
            filterDefaultValues={{ role: 'user' }}
            sort={{ field: 'name', order: 'ASC' }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => (canSeeRole ? record.role : null)}
                />
            ) : (
                <DataTable
                    // expand={<UserEditEmbedded />}
                    // bulkActionButtons={<UserBulkActionButtons />}
                >
                    <DataTable.Col source="name" label={"نام "}/>
                    <DataTable.Col sx={{ textAlign: 'center' }}>
                        <EditButton />
                        <ShowButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export default RoleList;
