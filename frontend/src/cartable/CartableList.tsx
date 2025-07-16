import * as React from 'react';
import BookIcon from '@mui/icons-material/Book';
import {Button, Chip, useMediaQuery} from '@mui/material';
import { Theme } from '@mui/material/styles';
import lodashGet from 'lodash/get';
import jsonExport from 'jsonexport/dist';
import {
    BooleanField,
    BulkDeleteButton,
    BulkExportButton,
    ChipField,
    ColumnsButton,
    CreateButton,
    DataTable,
    DateField,
    downloadCSV,
    EditButton,
    ExportButton,
    FilterButton,
    List,
    InfiniteList,
    ReferenceArrayField,
    ReferenceManyCount,
    SearchInput,
    ShowButton,
    SimpleList,
    SingleFieldList,
    TextInput,
    TopToolbar,
    useRecordContext,
    useTranslate, Link, ReferenceInput, SelectInput, AutocompleteInput,
} from 'react-admin';
import {PlayArrow, Visibility} from "@mui/icons-material";

export const CartableIcon = BookIcon;

const QuickFilter = ({
    label,
}: {
    label: string;
    source?: string;
    defaultValue?: any;
}) => {
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const cartableFilter = [
    <SearchInput source="q" />,
    <ReferenceInput source="form" label="فرم" reference="forms" alwaysOn>
        <AutocompleteInput optionText="name" label={"انتخاب فرایند"}/>
    </ReferenceInput>,
    <ReferenceInput source="form" label="فرم" reference="forms" alwaysOn>
        <AutocompleteInput
            source="status"
            choices={[
                { key: 'pending', label: 'منتظر تایید' },
                { key: 'approved', label: 'تایید شده' },
                { key: 'rejected', label: 'رد شده' },
            ]}
            optionValue="key"
            optionText="label"
            label={"وضعیت"}
        />
    </ReferenceInput>,
    <TextInput source="title"  />,
];

const exporter = cartable => {
    const data = cartable.map(cartable => ({
        ...cartable,
        backlinks: lodashGet(cartable, 'backlinks', []).map(
            backlink => backlink.url
        ),
    }));
    return jsonExport(data, (err, csv) => downloadCSV(csv, 'forms'));
};

const mobileActions = (
    <TopToolbar>
        <FilterButton />
        {/*<ExportButton />*/}
    </TopToolbar>
);
const StatusField = () => {
    const record = useRecordContext();
    const statusMap = {
        pending: 'منتظر تایید',
        approved: 'تایید شده',
        rejected: 'رد شده'
    };
    return <span>{statusMap[record?.status] || record?.status}</span>;
};
const CartableListMobile = () => (
    <InfiniteList
        filters={cartableFilter}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={mobileActions}
    >
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
            tertiaryText={record =>
                new Date(record.published_at).toLocaleDateString()
            }
        />
    </InfiniteList>
);

const desktopActions = (
    <TopToolbar>
        <FilterButton />
        {/*<ColumnsButton />*/}
        {/*<CreateButton />*/}
        {/*<ExportButton />*/}
    </TopToolbar>
);

const rowClick = (_id, _resource, record) => {
    if (record.commentable) {
        return 'edit';
    }

    return `form-viewer/${_id}`;
};

const CartablePanel = () => {
    const record = useRecordContext();
    return <div dangerouslySetInnerHTML={{ __html: record?.body }} />;
};

const tagSort = { field: 'name.en', order: 'ASC' } as const;

const CartableListDesktop = () => (
    <List
        filters={cartableFilter}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={desktopActions}
    >
        <DataTable
            rowClick={rowClick}
            // expand={CartablePanel}
            sx={{
                '& .hiddenOnSmallScreens': {
                    display: {
                        xs: 'none',
                        lg: 'table-cell',
                    },
                },
            }}
        >
            <DataTable.Col
                source="title"
                sx={{
                    maxWidth: '16em',
                    '&.MuiTableCell-body': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }}
                label={"نام فرم"}
            />
            <DataTable.Col
                source="requestedBy.username"
                sx={{
                    maxWidth: '16em',
                    '&.MuiTableCell-body': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }}
                label={"درخواست دهنده"}
            />
            <DataTable.Col
                source="published_at"
                sortByOrder="DESC"
                sx={{ '&.MuiTableCell-body': { fontStyle: 'italic' } }}
                field={DateField}
                label={"تاریخ انتشار"}
            />
            <DataTable.Col
                source="status"
                sortByOrder="DESC"
                sx={{ '&.MuiTableCell-body': { fontStyle: 'italic' } }}
                field={StatusField}
                label={"وضعیت"}
            />

            <DataTable.Col sx={{ textAlign: 'center' }}>
                {/*<ShowButton />*/}
                <RunnerLink/>
            </DataTable.Col>
        </DataTable>
    </List>
);

const stopPropagation = e => e.stopPropagation();

const RunnerLink = () => {
    const record = useRecordContext(); // ✅ Gets the current record
    if(record?.status==='pending'){
        return(<Button component={Link} to={`/cartable-runner/${record?.id}`} onClick={stopPropagation}>
                <PlayArrow />اقدام
            </Button>
    // )}else{
    //     return(<Button component={Link} to={`/form-viewer/${record?.id}`} onClick={stopPropagation}>
    //             <Visibility />نمایش
    //         </Button>
        )};;
    return null;
}

const FormList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('md'),
        { noSsr: true }
    );
    return isSmall ? <CartableListMobile /> : <CartableListDesktop />;
};

export default FormList;
