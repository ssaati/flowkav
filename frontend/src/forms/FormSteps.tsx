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
    ReferenceField,
    ChipField
} from 'react-admin';
import React from "react";
import {Box, Card, CardContent, CardHeader, Grid} from "@mui/material";
import FormPermissionsDialog from "./FormPermissionsDialog";
import {formStepTypeChoices} from "../formstep/form-step-type.model";
import useRoles from "../roles/useRoles";
import useUsers from "../users/useUsers";
import {Add, EditNote, LowPriority, Visibility} from "@mui/icons-material";

// Custom Actions for FormSteps List
const FormStepActions = () => {
    const redirect = useRedirect();
    const notify = useNotify();
    const record = useRecordContext();

    const handleCreate = () => {
        redirect(`/formsteps/create?formId=${record?.id}`);
    };

    return (
        <TopToolbar>
            <Button
                label="ایجاد مرحله جدید"
                onClick={handleCreate}
                color="primary"
            />
        </TopToolbar>
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
        <FormStarter/>
        <EditorButton/>
    </TopToolbar>
);

const FormStepEditButton = () => {
    const record = useRecordContext();
    return <EditButton to={`/formsteps/${record?.id}/edit`} />;
};

// Main Form Edit Component
const EditTitle = () => {
    let record = useRecordContext();
    return record ? ` ویرایش "${record.name}"` : 'Loading...';
};
const FormSteps = () => {
    const roles = useRoles();
    const users = useUsers();
    return (
        <Edit
            title={<EditTitle/>}
            actions={formStepActions}
            mutationMode="pessimistic"
            resource={"forms"}>
            <SimpleForm>
                <TextField
                    autoFocus
                    source="name"
                    label={"عنوان"}
                    sx={{fontSize: "20pفx"}}
                />
                <Box sx={{ p: 2, width:"100%"}}>
                    {/*<Card variant="outlined">*/}
                    {/*    <CardHeader*/}
                    {/*        title="کسانی که این فرم را ثبت میکنند"*/}
                    {/*        // avatar={<ExpandMoreIcon />}*/}
                    {/*        sx={{*/}
                    {/*            fontSize: '12px',*/}
                    {/*            bgcolor: 'grey.100',*/}
                    {/*            borderBottom: '1px solid',*/}
                    {/*            borderColor: 'divider'*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*    <CardContent>*/}
                    {/*        <Grid container padding={2} spacing={2}>*/}
                    {/*            <Grid sm={12}>*/}
                    {/*                <AutocompleteArrayInput source="roles" choices={roles} label={"گروه های دارای دسترسی"}*/}
                    {/*                                        noOptionsText={"گروهی یافت نشد"}/>*/}
                    {/*            </Grid>*/}
                    {/*            <Grid sm={12}>*/}
                    {/*                <AutocompleteArrayInput source="users" choices={users} label={"کاربران دارای دسترسی"}*/}
                    {/*                                        noOptionsText={"کاربری یافت نشد"}/>*/}
                    {/*            </Grid>*/}
                    {/*            <Grid sm={12}>*/}
                    {/*                /!*<FormPermissions/>*!/*/}
                    {/*            </Grid>*/}
                    {/*        </Grid>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                    {/*<br/>*/}
                    <Card variant="outlined">
                        <CardHeader
                            title="مراحل فرایند"
                            // avatar={<ExpandMoreIcon />}
                            sx={{
                                bgcolor: 'grey.100',
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            }}
                        />
                        <CardContent>
                            <ReferenceManyField
                                label="Steps"
                                reference="formsteps"
                                target="formId"
                            >
                                <Datagrid rowClick={"edit"}>
                                    <SelectField source="formStepType" choices={formStepTypeChoices} label="گیرنده" />
                                    <ReferenceField reference="users" source="user" label={"کاربر"}>
                                        <ChipField source="name" />
                                    </ReferenceField>
                                    <FormStepEditButton />
                                </Datagrid>
                            </ReferenceManyField>

                        </CardContent>
                        <AddStepButton/>
                    </Card>
                </Box>

                {/* List of existing FormSteps */}
            </SimpleForm>
        </Edit>
    );
};
const AddStepButton = () => {
    const record = useRecordContext(); // ✅ Gets the current record
    return(<Button component={Link} to={`/formsteps/create?formId=${record?.id}`} onClick={stopPropagation}>
            <Add />اضافه کردن مرحله
        </Button>
    );
}
const stopPropagation = e => e.stopPropagation();

export default FormSteps;