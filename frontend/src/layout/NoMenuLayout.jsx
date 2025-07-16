import { Layout } from 'react-admin';
import CustomAppBar from './CustomAppBar';
import MyAppBar from "./MyAppBar.js";
import NoMenuHeader from "./MyHeader.js";

const EmptyMenu = () => null;
const SideBarNull = () => null;

// const NoMenuLayout = (props) => <Layout {...props} appBar={MyAppBar} sidebar={SideBarNull}/>;
const NoMenuLayout = (props) => {
    return (
        <>
            <NoMenuHeader/>
            <Layout {...props} appBar={EmptyMenu} sidebar={SideBarNull}/>;
        </>
    );
}
export default NoMenuLayout;
