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
    CanAccess, AutocompleteArrayInput, SimpleForm, useGetOne, useRecordContext,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import {formStepTypeChoices} from "./form-step-type.model";
import {formStepActionChoices} from "./form-step-actions.model";
import useUsers from "../users/useUsers";
import {useLocation} from "react-router";
import {ShowFields} from "../forms/FormPermissionsDialog";
import {allQuestionNames} from './../surveyjs/SurveyJsUtils'

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
const FormStepCreate = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const formId = searchParams.get('formId');

    const users = useUsers();
    const { data, isLoading, error } = useGetOne("forms", { id:formId });
    if(!formId || !data)
        return null;

    function ShowFieldPermissions() {
        const { setValue } = useFormContext();
        const handleChecked = (viewFields, editFields) => {
            setValue('viewFields', viewFields);
            setValue('editFields', editFields);
        }
        if(data)
            {
                let allQuestions = allQuestionNames(data.json);
                setValue('viewFields', allQuestions);
                setValue('editFields', allQuestions);

                return <ShowFields
                                form={data}
                                checkedView={allQuestions}
                                checkedEdit={allQuestions}
                                onChecked={handleChecked}
                            />;
            }
        return null;
    }
    return (
        <Create redirect={`/form-steps-editor/${formId}`}>
            <SimpleForm
                toolbar={<FormStepCreateToolbar />}
                defaultValues={{ formId: formId }}>
                <input type="hidden" name="formId" value={formId} />
                <AutocompleteInput source="formStepType" choices={formStepTypeChoices} label={"گیرنده"}/>
                <UserSelect/>
                {/*<AutocompleteInput source="actions" choices={formStepActionChoices} label={"اقدامات"}/>*/}
                <ShowFieldPermissions/>

            </SimpleForm>
        </Create>
    );
};

export default FormStepCreate;

