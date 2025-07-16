import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserList from './UserList';
import UserShow from './UserShow';
import {Person} from "@mui/icons-material";

export default {
    list: UserList,
    create: UserCreate,
    edit: UserEdit,
    show: UserShow,
    icon: Person,
    recordRepresentation: record => `${record.name} (${record.role})`,
};
