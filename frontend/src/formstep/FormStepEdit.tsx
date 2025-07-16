import * as React from 'react';
import {JSX, useMemo, useState} from 'react';
import { RichTextInput } from 'ra-input-rich-text';
import {
    ArrayInput,
    AutocompleteInput,
    BooleanInput,
    Create,
    DateInput,
    FileField,
    FileInput,
    FormDataConsumer,
    maxValue,
    minValue,
    NumberInput,
    required,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleFormConfigurable,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    useNotify,
    useRedirect,
    useCreate,
    useCreateSuggestionContext,
    CanAccess, AutocompleteArrayInput, SimpleForm, useGetOne, Edit, useRecordContext,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import {formStepTypeChoices} from "./form-step-type.model";
import {formStepActionChoices} from "./form-step-actions.model";
import useUsers from "../users/useUsers";
import {useLocation} from "react-router";
import {ShowFields} from "../forms/FormPermissionsDialog";

const FormStepCreateToolbar = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const { reset } = useFormContext();

    return (
        <Toolbar>
            <SaveButton label="ذخیره" variant="text" alwaysEnable={true} />
        </Toolbar>
    );
};

function UserSelect() {
    const users = useUsers();
    const { watch } = useFormContext();
    const formStepType = watch('formStepType');
    if(formStepType === 'USER')
        return (<AutocompleteInput source="user" choices={users} label={"کاربر را انتخاب کنید"}
                            noOptionsText={"کاربری یافت نشد"}/>)
    // return (<AutocompleteArrayInput source="users" choices={users} label={"کاربران"}
    //                                 noOptionsText={"کاربری یافت نشد"}/>)
    return null;
}

const FormStepEdit = () => {
    // const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);
    // const formId = searchParams.get('formId');

    // const { watch } = useFormContext();
    const formStepType =''; //= useWatch({ name: 'formStepType'});

    function ShowFieldPermissions() {
        const record = useRecordContext();
        const [localRecord, setLocalRecord] = useState(record);
        const { setValue } = useFormContext();
        if(!record)
            return null;
        const handleChecked = (viewFields, editFields) => {
            if(!localRecord)
                return;
            setValue('viewFields', viewFields);
            setValue('editFields', editFields);
        }
        const { data, isLoading, error } = useGetOne("forms", { id:record?.formId });
        if(data)
            return <ShowFields
                form={data}
                checkedView={localRecord?.viewFields || []}
                checkedEdit={localRecord?.editFields || []}
                // onChecked={handleChecked}
                onChecked={handleChecked}
            />;
        return null;
    }

    return (
        <Edit
            redirect={(resource, id, data) => {
                return `/form-steps-editor/${data?.formId}`;
            }}>
            <SimpleForm
                toolbar={<FormStepCreateToolbar/>}>
                <AutocompleteInput source="formStepType" choices={formStepTypeChoices} label={"گیرنده"}/>
                <UserSelect/>
                {/*<AutocompleteInput source="actions" choices={formStepActionChoices} label={"اقدامات"}/>*/}
                <ShowFieldPermissions/>

            </SimpleForm>
        </Edit>
    );
};

export default FormStepEdit;

