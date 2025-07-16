import {
    useEditController,
    SimpleForm,
    TextInput,
    SaveButton,
    Toolbar, useGetOne
} from 'react-admin';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    Paper,
    Grid,
    TableCell,
    TableRow,
    TableHead,
    Table,
    TableBody, Box, Accordion, AccordionDetails, AccordionSummary
} from '@mui/material';
import { useState } from 'react';
import React from 'react';
import {ArrowDropDown} from "@mui/icons-material";

export function ShowFields(props: {form, checkedView, checkedEdit, onChecked}) {
    let name = props.form.name;
    let surveyJson = props.form.json;
    const [checkedView, setCheckedView] = useState([...props.checkedView]);
    const [checkedEdit, setCheckedEdit] = useState([...props.checkedEdit]);
    const handleToggle = (qName, column, checked) => {

        if(column === 'view'){
            let newCheckedView;
            if(checked)
                newCheckedView = [...checkedView, qName];
            else{
                newCheckedView = checkedView.filter(item => item !== qName);
            }
            setCheckedView([...newCheckedView]);
            props.onChecked(newCheckedView, checkedEdit);
        }
        if(column === 'edit'){
            let newCheckedEdit;
            if(checked)
                newCheckedEdit = [...checkedEdit, qName];
            else{
                newCheckedEdit = checkedEdit.filter(item => item !== qName);
            }
            setCheckedEdit([...newCheckedEdit]);
            props.onChecked(checkedView, newCheckedEdit);
        }
    };

    const handleSelectAll = (column, checked) => {
        const updater = column === 'view' ? setCheckedView : setCheckedEdit;
        const all: string[] = [];
        if(checked){
            surveyJson.pages?.forEach((page) => {
              page.elements?.forEach((q) => {
                all.push(q.name);
              });
            });
        }
        updater(all);
        if(column === 'view')
            props.onChecked(all, checkedEdit);
        if(column === 'edit')
            props.onChecked(checkedView, all);
    };
    const questionsCount= () => {
        let all = 0;
        surveyJson.pages?.map((page, pageIndex) => (
            page.elements?.map((q, qIndex) => (
                    all++))));
        return all;
    }
    return (
        <Box sx={{width:"100%", direction:"rtl"}}>
            <Typography variant="h6" gutterBottom>
                تنظیم دسترسی فیلدهای {name}
            </Typography>

            {surveyJson.pages?.map((page, pageIndex) => (
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDropDown />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        sx={{backgroundColor:'#f5f5f5'}}
                    >
                        <Typography component="span">{page.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell sx={{textAlign:"right"}}>
                                        <Checkbox
                                            checked={checkedView.length == questionsCount()}
                                            indeterminate={checkedView.length >0 && checkedView.length < questionsCount()}
                                            onChange={(e) => handleSelectAll('view', e.target.checked)}
                                        />
                                        نمایش
                                    </TableCell>
                                    <TableCell sx={{textAlign:"right"}}>
                                        <Checkbox
                                            checked={checkedEdit.length == questionsCount()}
                                            indeterminate={checkedEdit.length >0 && checkedEdit.length < questionsCount()}
                                            onChange={(e) => handleSelectAll('edit', e.target.checked)}
                                        />
                                        تغییر
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {page.elements?.map((q, qIndex) => (
                                    <TableRow key={qIndex}>
                                        <TableCell sx={{textAlign:"right"}}>{q.title || q.name}</TableCell>
                                        <TableCell sx={{textAlign:"right"}}>
                                            <Checkbox
                                                checked={!!checkedView?.includes(q.name)}
                                                onChange={(e) =>
                                                    handleToggle(q.name, 'view', e.target.checked)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell sx={{textAlign:"right"}}>
                                            <Checkbox
                                                checked={!!checkedEdit?.includes(q.name)}
                                                onChange={(e) =>
                                                    handleToggle(q.name, 'edit', e.target.checked)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};
const FormPermissionsDialog = ({id, open, onClose, formId}) => {
    if (!id)
        return null;
    const { data, isLoading, error } = useGetOne("forms", { id });
    console.log(data);
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{textAlign:"right"}}>دسترسی به هر قلم را انتخاب کنید</DialogTitle>
            <DialogContent>
                <SimpleForm
                    // save={controllerProps.save}
                    toolbar={<Toolbar><SaveButton/></Toolbar>}
                >
                    <ShowFields form = {data} checkedView={[]} checkedEdit={[]}  onChecked={()=>{}}/>
                </SimpleForm>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>انصراف</Button>
            </DialogActions>
        </Dialog>
    );
};
export default FormPermissionsDialog;