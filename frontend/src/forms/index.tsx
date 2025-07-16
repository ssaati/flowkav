import BookIcon from '@mui/icons-material/Book';
import FormCreate from './FormCreate';
import FormEdit from './FormEdit';
import FormList from './FormList';
import FormShow from './FormShow';
import FormEditor from "../surveyjs/SurveyCreator";

export default {
    list: FormList,
    create: FormEditor,
    edit: FormEditor,
    show: FormShow,
    icon: BookIcon,
    recordRepresentation: 'title',
};
