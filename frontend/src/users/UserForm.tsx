import React, { useState } from 'react';
import {
    Create,
    Edit,
    SimpleForm,
    TextInput,
    PasswordInput,
    BooleanInput,
    SelectInput,
    useNotify,
    useRedirect,
    regex,
    minLength,
    required,
    Toolbar,
    SaveButton, AutocompleteArrayInput
} from 'react-admin';
import useRoles from "../roles/useRoles";

// Password strength validator
const validatePassword = [
    // required(),
    // minLength(12, 'Password must be at least 12 characters'),
    // regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //     'Password must contain uppercase, lowercase, number, and special character'
    // )
];

const UserForm = ({ isCreate }) => {
    const [showPassword, setShowPassword] = useState(isCreate);
    const notify = useNotify();
    const redirect = useRedirect();
    const roles = useRoles();

    return (
        <SimpleForm
            toolbar={
                <CustomToolbar
                    isCreate={isCreate}
                    onShowPasswordToggle={() => setShowPassword(!showPassword)}
                />
            }
            onSubmit={async (values) => {
                try {
                    if (!isCreate && !values.password) {
                        const { password, ...data } = values;
                        return data;
                    }
                    return values;
                } catch (error) {
                    notify('Error processing password', { type: 'error' });
                    throw error;
                }
            }}
        >
            <TextInput source="name" label={"نام و نام خانوادگی"}  fullWidth />
            <TextInput source="username" label={"نام کاربری"}  fullWidth />
            <TextInput source="email" label={"پست الکترونیک"}  fullWidth />

            {showPassword && (
                <PasswordInput
                    source="password"
                    label={"کلمه عبور"}
                    // validate={isCreate ? validatePassword : undefined}
                    helperText={
                        isCreate
                            ? "حداقل 12 کاراکتر با حروف کوچک و بزرگ و اعداد و کاراکترهای خاص"
                            : "اگر نمیخواهید پسورد تغییر کند خالی بگذارید"
                    }
                    fullWidth
                />
            )}

            <AutocompleteArrayInput
                source="role"
                choices={roles}
                label={"گروه ها"}
            />

            {/*<BooleanInput source="isActive" label="فعال" />*/}
        </SimpleForm>
    );
};

const CustomToolbar = ({ isCreate, onShowPasswordToggle }) => (
    <Toolbar>
        <SaveButton label={isCreate ? "ایجاد کاربر" : "ذخیره"} alwaysEnable={true} />
        {!isCreate && (
            <button
                type="button"
                onClick={onShowPasswordToggle}
                style={{
                    marginLeft: '16px',
                    background: 'none',
                    border: 'none',
                    color: '#1976d2',
                    cursor: 'pointer'
                }}
            >
                {isCreate ? '' : 'تغییر کلمه عبور'}
            </button>
        )}
    </Toolbar>
);

// Create Component
export const UserCreate = () => (
    <Create redirect="list">
        <UserForm isCreate={true} />
    </Create>
);

// Edit Component
export const UserEdit = () => (
    <Edit redirect="list" >
        <UserForm isCreate={false} />
    </Edit>
);