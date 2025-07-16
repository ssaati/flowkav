import * as React from 'react';
import {
    ArrayInput, AutocompleteArrayInput, AutocompleteInput,
    CloneButton,
    CreateButton, Datagrid, DateInput,
    Edit,
    EditActionsProps, EditButton, Identifier, ReferenceManyField, required, SelectArrayInput, SelectInput,
    ShowButton, SimpleForm,
    SimpleFormConfigurable, SimpleFormIterator, TextField,
    TextInput,
    TopToolbar,
    useCreateSuggestionContext, useRecordContext,
} from 'react-admin';
import {
    Box,
    BoxProps,
    Button, Card, CardContent, CardHeader,
    Dialog,
    DialogActions,
    DialogContent, Grid, Paper,
    Stack,
    TextField as MuiTextField, Typography,
} from '@mui/material';
import {formStepTypeChoices} from "../formstep/form-step-type.model";
import useRoles from "../roles/useRoles";
import useUsers from "../users/useUsers";
import {formStepActionChoices} from "../formstep/form-step-actions.model";
import FormStepDetail from "./FormStepDetail";
import FormPermissionsDialog from "./FormPermissionsDialog";
import {useState} from "react";
import { useWatch } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EditActions = ({ hasShow }: EditActionsProps) => (
    <TopToolbar>
        {/*<CreateButton />*/}
    </TopToolbar>
);

const SanitizedBox = ({
    fullWidth,
    ...props
}: BoxProps & { fullWidth?: boolean }) => <Box {...props} />;



const FormEdit2 = () => {
    const roles = useRoles();
    const users = useUsers();
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<Identifier | null | undefined>(null);
    const FormPermissions = () => {
        const id = useWatch({ name: 'id' });
        const record = useRecordContext(); // gives you the full form data
        if (!record)
            return null;
        return <Button
            sx={{marginTop: "15px"}}
            onClick={() => {
                setSelectedId(record?.id);
                setOpen(true);
            }}
        >
            تنظیم دسترسی ها
        </Button>;
    }

    return (<Edit title={"ویرایش گام های فرآیند"} resource={"forms"} actions={<EditActions/>}>
            <SimpleForm>
                <SanitizedBox
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    justifyContent="space-between"
                    fullWidth
                >
                    <TextField
                        autoFocus
                        source="name"
                        label={"عنوان"}
                        sx={{fontSize: "20px"}}
                    />

                    <Box sx={{ p: 2 }}>
                        <Card variant="outlined">
                            <CardHeader
                                title="کسانی که این فرم را میبینند"
                                // avatar={<ExpandMoreIcon />}
                                sx={{
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
                                        <FormPermissions/>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
<br/>
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
                            <FormPermissionsDialog
                                formId={selectedId}
                                id={selectedId}
                                open={open}
                                onClose={() => setOpen(false)}
                            />

                            <ReferenceManyField
                                label="Steps"
                                reference="formsteps"
                                target="formId"
                            >
                                <Grid container spacing={2} padding={2}>
                                    <Grid sm={12}>
                                        <AutocompleteInput source="category" choices={formStepTypeChoices}
                                                           label={"نوع تایید کننده"}/>
                                    </Grid>
                                    <Grid sm={12}>
                                        <AutocompleteArrayInput source="users" choices={users} label={"کاربران"}
                                                                noOptionsText={"کاربری یافت نشد"}/>
                                    </Grid>
                                    {/*<AutocompleteInput source="actions" choices={formStepActionChoices} label={"اقدامات"}/>*/}
                                    <Grid sm={12}>
                                        <FormPermissions/>
                                    </Grid>
                                    {/*<Grid sm={1}>*/}
                                    {/*    <EditButton sx={{marginTop: "15px"}}/>*/}
                                    {/*</Grid>*/}
                                </Grid>
                            </ReferenceManyField>
                            </CardContent>
                        </Card>
                    </Box>

                    {/*<FormStepDetail/>*/}


                </SanitizedBox>
            </SimpleForm>
        </Edit>
    );
}
export default FormEdit2;
