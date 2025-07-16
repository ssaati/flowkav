import {
    Edit,
    SimpleForm,
    TextInput,
    ReferenceManyField,
    Datagrid,
    TextField,
    Button,
    TopToolbar,
    useRecordContext,
    useRedirect,
    useNotify,
    ArrayInput,
    SimpleFormIterator,
    EditButton,
    AutocompleteArrayInput,
    AutocompleteInput,
    Link,
    SelectField,
    useGetOne,
    Toolbar,
    SaveButton, DeleteWithConfirmButton
} from 'react-admin';
import React, {useState} from "react";
import {Box, Card, CardContent, CardHeader, Grid} from "@mui/material";
import FormPermissionsDialog, {ShowFields} from "./FormPermissionsDialog";
import {formStepTypeChoices} from "../formstep/form-step-type.model";
import useRoles from "../roles/useRoles";
import useUsers from "../users/useUsers";
import {Add, LowPriority, Visibility, EditNote} from "@mui/icons-material";
import {useFormContext} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useLocation} from "react-router";
import {allQuestionNames} from './../surveyjs/SurveyJsUtils'


const EditTitle = () => {
    let record = useRecordContext();
    return record ? ` ویرایش "${record.name}"` : 'Loading...';
};
const FormStartersToolbar = props => {
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
const FormStepsEditor = () => {
    const record = useRecordContext(); // ✅ Gets the current record
    return(<Button component={Link} to={`/form-steps-editor/${record?.id}`} onClick={stopPropagation}>
            <LowPriority />مراحل
        </Button>
    );
}
const FormStarter = () => {
    const record = useRecordContext(); // ✅ Gets the current record
    return(<Button component={Link} to={`/form-starters/${record?.id}`} onClick={stopPropagation}>
            <Visibility />مخاطبین
        </Button>
    );
}
const EditorButton = () => {
    const record = useRecordContext(); // ✅ Gets the current record
    return(<Button component={Link} to={`/form-editor/${record?.id}`} onClick={stopPropagation}>
            <EditNote />طراحی
        </Button>
    );
}

const formStepActions = (
    <TopToolbar>
        <FormStepsEditor/>
        <EditorButton/>
    </TopToolbar>
);

const FormStarters = () => {
    const roles = useRoles();
    const users = useUsers();
    const { id } = useParams(); // Gets the ID from the URL
    const { data, isLoading, error } = useGetOne("forms", { id });
    if(!data)
        return null;
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

        if(data) {
            // if no users nor roles selected, we consider it first time and check all questions
            let allQuestions = allQuestionNames(data.json) || [];
            let viewFields = localRecord?.viewFields || [];
            let editFields = localRecord?.editFields || [];
            if((!record.roles || record.roles.length == 0)
                && (!record.users || record.users.length == 0)) {
                viewFields = allQuestions;
                editFields = allQuestions;
                setValue('viewFields', viewFields);
                setValue('editFields', editFields);
            }
            return <ShowFields
                form={data}
                checkedView={viewFields}
                checkedEdit={editFields}
                onChecked={handleChecked}
            />;
        }
        return null;
    }
    return (
        <Edit
            title={<EditTitle/>}
            actions={formStepActions}
            mutationMode="pessimistic"
            resource={"forms"}>
            <SimpleForm
                toolbar={<FormStartersToolbar/>}
            >
                <TextField
                    autoFocus
                    source="name"
                    label={"عنوان"}
                    sx={{fontSize: "14px"}}
                />
                <Box sx={{ p: 2, width:"100%"}}>
                    <Card variant="outlined">
                        <CardHeader
                            title="کسانی که این فرم را ثبت میکنند"
                            // avatar={<ExpandMoreIcon />}
                            sx={{
                                fontSize: '12px',
                                bgcolor: 'grey.100',
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            }}
                        />
                        <CardContent>
                            <Grid container padding={2} spacing={2}>
                                <Grid sm={12}>
                                    <AutocompleteArrayInput source="roles" choices={roles} label={"گروه های دارای دسترسی"}
                                                            noOptionsText={"گروهی یافت نشد"}/>
                                </Grid>
                                <Grid sm={12}>
                                    <AutocompleteArrayInput source="users" choices={users} label={"کاربران دارای دسترسی"}
                                                            noOptionsText={"کاربری یافت نشد"}/>
                                </Grid>
                                <Grid sm={12}>
                                    <ShowFieldPermissions/>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <br/>
                </Box>

            </SimpleForm>
        </Edit>
    );
};
const stopPropagation = e => e.stopPropagation();

export default FormStarters;