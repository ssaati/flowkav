import * as React from 'react';
import BookIcon from '@mui/icons-material/Book';
import { Chip, useMediaQuery } from '@mui/material';
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
    useTranslate,
} from 'react-admin';

export const PostIcon = BookIcon;

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

const postFilter = [
    <SearchInput source="q" alwaysOn />,
    <TextInput source="title" defaultValue="Qui tempore rerum et voluptates" />,
    <QuickFilter
        label="resources.forms.fields.commentable"
        source="commentable"
        defaultValue
    />,
];

const exporter = forms => {
    const data = forms.map(post => ({
        ...post,
        backlinks: lodashGet(post, 'backlinks', []).map(
            backlink => backlink.url
        ),
    }));
    return jsonExport(data, (err, csv) => downloadCSV(csv, 'forms'));
};

const postListMobileActions = (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const PostListMobile = () => (
    <InfiniteList
        filters={postFilter}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={postListMobileActions}
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

const postListActions = (
    <TopToolbar>
        <FilterButton />
        <ColumnsButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const rowClick = (_id, _resource, record) => {
    if (record.commentable) {
        return 'edit';
    }

    return 'show';
};

const PostPanel = () => {
    const record = useRecordContext();
    return <div dangerouslySetInnerHTML={{ __html: record?.body }} />;
};

const tagSort = { field: 'name.en', order: 'ASC' } as const;

const PostListDesktop = () => (
    <List
        filters={postFilter}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={postListActions}
    >
        <DataTable
            rowClick={rowClick}
            // expand={PostPanel}
            hiddenColumns={['average_note']}
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
                source="name"
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
                source="published_at"
                sortByOrder="DESC"
                sx={{ '&.MuiTableCell-body': { fontStyle: 'italic' } }}
                field={DateField}
                label={"تاریخ انتشار"}
            />
            <DataTable.Col sx={{ textAlign: 'center' }}>
                <EditButton />
                <ShowButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

const FormStepList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('md'),
        { noSsr: true }
    );
    return isSmall ? <PostListMobile /> : <PostListDesktop />;
};

export default FormStepList;
