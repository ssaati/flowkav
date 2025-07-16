/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    CanAccess,
    CloneButton,
    DeleteWithConfirmButton,
    Edit,
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

/**
 * Custom Toolbar for the Edit form
 *
 * Save with undo, but delete with confirm
 */
const UserEditToolbar = props => {
    return (
        <Toolbar
            sx={{ display: 'flex', justifyContent: 'space-between' }}
            {...props}
        >
            <SaveButton alwaysEnable={true} />
            <DeleteWithConfirmButton />
        </Toolbar>
    );
};

const EditActions = () => (
    <TopToolbar>
        {/*<CloneButton className="button-clone" />*/}
        <ShowButton />
    </TopToolbar>
);

const UserEditForm = () => {
    const { isPending, canAccess: canEditRole } = useCanAccess({
        action: 'edit',
        resource: 'users.role',
    });
    const { save } = useSaveContext();
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
            toolbar={<UserEditToolbar />}
            onSubmit={newSave}
        >
                <CanAccess action="edit" resource="users.id">
                    <TextInput source="id" InputProps={{ disabled: true }} label={"شناسه"}/>
                </CanAccess>
                <TextInput
                    source="name"
                    label={"نام گروه"}
                    validate={required()}
                />
        </SimpleFormConfigurable>
    );
};
const RoleEdit = () => {
    return (
        <Edit actions={<EditActions />}>
            <UserEditForm />
        </Edit>
    );
};

export default RoleEdit;
