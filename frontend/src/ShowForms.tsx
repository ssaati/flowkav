import React from 'react';
import {List, DataTable, FunctionField, TopToolbar, FilterButton} from 'react-admin';
import { Typography, Box } from '@mui/material';

const actions = (
    <TopToolbar>
    </TopToolbar>
);

export const ShowForms = () => (
    <List resource={"forms"} actions={actions}>
        <DataTable bulkActionButtons={false}
                   rowClick={(id, basePath, record) => {
                       return `/form-runner/${record?.id}`;
                   }}>
            <DataTable.Col source="name" label={"فرایند"} sx={{ textAlign: 'right' }} >
                <FunctionField
                    label="Details"
                    render={record => (
                        <Box>
                            <Typography variant="body1">{record.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {record.name}
                            </Typography>
                        </Box>
                    )}
                />
            </DataTable.Col>
        </DataTable>
    </List>
);