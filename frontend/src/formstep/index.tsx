import BookIcon from '@mui/icons-material/Book';
import FormStepCreate from './FormStepCreate';
import FormStepEdit from './FormStepEdit';
import FormStepList from './FormStepList';
import FormStepShow from './FormStepShow';

export default {
    list: FormStepList,
    create: FormStepCreate,
    edit: FormStepEdit,
    show: FormStepShow,
    icon: BookIcon,
    recordRepresentation: 'title',
};
