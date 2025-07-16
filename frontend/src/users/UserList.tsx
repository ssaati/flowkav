/* eslint react/jsx-key: off */
import PeopleIcon from '@mui/icons-material/People';
import {useMediaQuery, Theme, Chip} from '@mui/material';
import * as React from 'react';
import {
    BulkDeleteWithConfirmButton,
    CanAccess, ChipField,
    DataTable, EditButton,
    List, ReferenceArrayField, ReferenceField,
    SearchInput, ShowButton,
    SimpleList, SingleFieldList,
    TextInput,
    useCanAccess,
} from 'react-admin';

import UserEditEmbedded from './UserEditEmbedded';
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

const UserList = () => {
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
            filters={getUserFilters(canSeeRole ?? false)}
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
                    <DataTable.Col source="username" label={"نام کاربری"}/>
                    <DataTable.Col source="name" label={"نام "}/>
                    <DataTable.Col source="boss" label={"رئیس"}>
                        <ReferenceField reference="users" source="boss" >
                            <ChipField source="name" />
                        </ReferenceField>
                    </DataTable.Col>
                    <DataTable.Col source="email" label={"پست الکترونیک"}/>
                    <CanAccess resource="users.roles" action="show">
                        <DataTable.Col source="roles" label={"گروه ها"}>
                            <ReferenceArrayField reference="roles" source="roles" >
                                <SingleFieldList>
                                    <ChipField source="name" />
                                </SingleFieldList>
                            </ReferenceArrayField>
                        </DataTable.Col>
                    </CanAccess>
                    <DataTable.Col sx={{ textAlign: 'center' }}>
                        <EditButton />
                        <ShowButton />
                    </DataTable.Col>
                </DataTable>
            )}
        </List>
    );
};

export default UserList;
