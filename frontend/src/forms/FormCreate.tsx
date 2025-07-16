import * as React from 'react';
import {JSX, useMemo} from 'react';
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
    CanAccess, AutocompleteArrayInput, SelectArrayInput,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import {Box, BoxProps, Button, Dialog, DialogActions, DialogContent, Stack} from '@mui/material';
import useRoles from "../roles/useRoles";
import useUsers from "../users/useUsers";
import {FormStepType, formStepTypeChoices} from "../formstep/form-step-type.model";
import {formStepActionChoices} from "../formstep/form-step-actions.model";


const SanitizedBox = ({
                          fullWidth,
                          ...props
                      }: BoxProps & { fullWidth?: boolean }) => <Box {...props} />;

const FormCreate = () => {
    const defaultValues = useMemo(
        () => ({
            average_note: 0,
        }),
        []
    );
    const dateDefaultValue = useMemo(() => new Date(), []);
    const roles = useRoles();
    const users = useUsers();
    // const formStepType = useWatch({ name: "formStepType"}); // Watch the checkbox
    return (
        <Create resource={"form"} redirect="edit">
            <SimpleFormConfigurable
                defaultValues={defaultValues}
            >
                <SanitizedBox
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    justifyContent="space-between"
                    fullWidth
                >
                <TextInput
                    autoFocus
                        source="name"
                        label={"عنوان"}
                        InputProps={{ disabled: true }}
                />

                    {/*<DateInput*/}
                    {/*    source="published_at" label={"تاریخ انتشار"}*/}
                    {/*/>*/}
                    <AutocompleteArrayInput source="roles" choices={roles} label={"گروه های دارای دسترسی"} noOptionsText={"گروهی یافت نشد"}/>

                    <ArrayInput source="steps" label={"مراحل تایید فرایند"}>
                    <SimpleFormIterator >
                        <Stack direction="row" spacing={2} padding={2}>
                                <AutocompleteInput source="category" choices={formStepTypeChoices} label={"نوع تایید کننده"}/>
                                <AutocompleteArrayInput source="users" choices={users} label={"کاربران"} noOptionsText={"کاربری یافت نشد"}/>
                                <AutocompleteInput source="actions" choices={formStepActionChoices} label={"اقدامات"}/>
                        </Stack>
                    </SimpleFormIterator>
                </ArrayInput>
                </SanitizedBox>
            </SimpleFormConfigurable>
        </Create>
    );
};

export default FormCreate;
