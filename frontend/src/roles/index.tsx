import PeopleIcon from '@mui/icons-material/People';
import RoleCreate from './RoleCreate';
import RoleEdit from './RoleEdit';
import RoleList from './RoleList';
import RoleShow from './RoleShow';

export default {
    list: RoleList,
    create: RoleCreate,
    edit: RoleEdit,
    show: RoleShow,
    icon: PeopleIcon,
    recordRepresentation: record => `${record.name} (${record.role})`,
};
