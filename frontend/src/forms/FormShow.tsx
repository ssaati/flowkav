import * as React from 'react';
import {
    ArrayField,
    BooleanField,
    CloneButton,
    ChipField,
    DataTable,
    DateField,
    EditButton,
    InPlaceEditor,
    NumberField,
    ReferenceArrayField,
    ReferenceManyField,
    ReferenceManyCount,
    RichTextField,
    SelectField,
    ShowContextProvider,
    ShowView,
    SingleFieldList,
    TextField,
    UrlField,
    useShowController,
    useLocaleState,
    useRecordContext, SimpleShowLayout,
} from 'react-admin';

const FormShow = () => {
    const controllerProps = useShowController();
    const [locale] = useLocaleState();
    return (
        <ShowContextProvider value={controllerProps}>
            <ShowView >
                <SimpleShowLayout>
                        <TextField source="id" />
                        <TextField source="title" />
                        <DateField source="published_at" />
                </SimpleShowLayout>
            </ShowView>
        </ShowContextProvider>
    );
};

export default FormShow;
