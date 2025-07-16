import * as React from 'react';
import AltRoute from '@mui/icons-material/AltRoute';
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
    useTranslate, Link,
} from 'react-admin';
import {useNavigate} from "react-router";

export const PostIcon = AltRoute;
const stopPropagation = e => e.stopPropagation();

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
            <Edit />طراحی
        </Button>
    );
}
const CreateButton2 = () => {
    return(<Button component={Link} to={`/form-editor`} onClick={stopPropagation}>
            <Create />تعریف فرم جدید
        </Button>
    );
}
const RunnerLink = () => {
    const record = useRecordContext(); // ✅ Gets the current record
    return(<Button component={Link} to={`/form-runner/${record?.id}`} onClick={stopPropagation}>
            <PlayArrow /> اجرای فرم
        </Button>
    );
}

const DashboardLink = () => {
    const record = useRecordContext(); // ✅ Gets the current record
    return(<Button component={Link} to={`/dashboard/${record?.id}`} onClick={stopPropagation}>
            <Dashboard />داشبورد
        </Button>
    );
}

const FormList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('md'),
        { noSsr: true }
    );
    return isSmall ? <PostListMobile /> : <PostListDesktop />;
};

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
        {/*<FilterButton />*/}
        <CreateButton2 />
        {/*<ExportButton />*/}
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
        {/*<FilterButton />*/}
        {/*<ColumnsButton />*/}
        <CreateButton2 />
        {/*<ExportButton />*/}
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
import AddTask from '@mui/icons-material/AddTask';
import {LowPriority, PlayArrow, Visibility, Edit, Create, Dashboard} from "@mui/icons-material";

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
            {/*<DataTable.Col*/}
            {/*    source="published_at"*/}
            {/*    sortByOrder="DESC"*/}
            {/*    sx={{ '&.MuiTableCell-body': { fontStyle: 'italic' } }}*/}
            {/*    field={DateField}*/}
            {/*    label={"تاریخ انتشار"}*/}
            {/*/>*/}
            <DataTable.Col sx={{ textAlign: 'center' }}>
                {/* used custom route because couldn't customize edit layout */}
                {/*<EditButton/>*/}
                <EditorButton/>
                {/*<FormStepsEditor/>*/}
                <FormStarter/>
                <FormStepsEditor/>
                <RunnerLink/>
                <DashboardLink/>
                {/*<ShowButton />*/}
            </DataTable.Col>
        </DataTable>
    </List>
);

export default FormList;
