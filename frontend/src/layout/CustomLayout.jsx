import { Layout } from 'react-admin';
import CustomAppBar from './CustomAppBar';

const EmptyMenu = () => null;
const SideBarNull = () => null;

const CustomLayout = (props) => <Layout {...props} appBar={CustomAppBar} sidebar={SideBarNull}/>;

export default CustomLayout;
