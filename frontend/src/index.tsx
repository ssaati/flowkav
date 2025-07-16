/* eslint react/jsx-key: off */
import * as React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { createRoot } from 'react-dom/client';
import { Route } from 'react-router-dom';

import authProvider from './providers/authProvider';
import CustomRouteLayout from './customRouteLayout';
import CustomRouteNoLayout from './customRouteNoLayout';
import dataProvider from './providers/dataProvider';
import Layout from './layout/Layout';
import users from './users';
import forms from './forms';
import roles from './roles';
import cartable from './cartable';
import formstep from './formstep';
import { queryClient } from './queryClient';

import { ThemeProvider, StylesProvider } from '@mui/styles';
import { rtlTheme } from './themeFarsi';

import polyglotI18nProvider from 'ra-i18n-polyglot';
import farsiMessages from 'ra-language-farsi';

import { CssBaseline } from '@mui/material';

import FormRunner from './surveyjs/FormRunner'
import FormCreate from "./forms/FormCreate";
import FormEdit from "./forms/FormEdit";
import NoMenuLayout from './layout/NoMenuLayout'
import {Dashboard} from "./Dashboard";
import FormEdit2 from "./forms/FormEdit2";
import FormSteps from "./forms/FormSteps";
import DashboardPage from "./dashboard/DashboardPage";
import SurveyCreatorWidget from "./surveyjs/SurveyCreator"
import FormStarters from "./forms/FormStarters";
import FormViewer from "./surveyjs/FormViewer";
import CartableRunner from "./surveyjs/CartableRunner";

const i18nProvider = polyglotI18nProvider(() => farsiMessages, 'fa');

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
	  <StylesProvider >
		<ThemeProvider theme={rtlTheme}>
		<CssBaseline />
      <div dir="rtl" style={{ minHeight: '100vh' , fontFamily:'Yekan Bakh FaNum Regular'}}>
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            queryClient={queryClient}
            title="Jaryan"
            layout={Layout}
            // dashboard={()=><Dashboard/>}
        >
            <Resource name="users" {...users} options={{ label: 'کاربران'}}/>
            <Resource name="roles" {...roles}  options={{ label: 'گروه ها'}}/>
            <Resource name="forms" {...forms}  options={{ label: 'فرم ها'}} />
            <Resource name="cartable" {...cartable}  options={{ label: 'کارتابل'}}/>
            <Resource name="formsteps" {...formstep}  options={{ label: 'مراحل گردش فرم'}} />
            <CustomRoutes noLayout>
                <Route path="/" element={<NoMenuLayout><Dashboard /></NoMenuLayout>} />
                <Route path="form-runner/:id" element={<NoMenuLayout><FormRunner /></NoMenuLayout>} />
                <Route path="form-viewer/:id" element={<NoMenuLayout><FormViewer /></NoMenuLayout>} />
                <Route path="cartable/form-viewer/:id" element={<NoMenuLayout><FormViewer /></NoMenuLayout>} />
                <Route path="form-editor/:id" element={<NoMenuLayout><SurveyCreatorWidget /></NoMenuLayout>} />
                <Route path="form-editor" element={<NoMenuLayout><SurveyCreatorWidget /></NoMenuLayout>} />
                <Route path="cartable-runner/:id" element={<NoMenuLayout><CartableRunner /></NoMenuLayout>} />
                <Route
                    path="/custom"
                    element={<CustomRouteNoLayout title="Posts from /custom" />}
                />
                <Route
                    path="/custom1"
                    element={
                        <CustomRouteNoLayout title="Posts from /custom1" />
                    }
                />
            </CustomRoutes>
            <CustomRoutes>
                <Route path="form-steps-editor/:id" element={<FormSteps />} />
                <Route path="form-starters/:id" element={<FormStarters />} />
                <Route path="/dashboard/:id" element={<DashboardPage/>}></Route>
            </CustomRoutes>
            <CustomRoutes>
                <Route
                    path="/custom3"
                    element={<CustomRouteLayout title="Posts from /custom3" />}
                />
            </CustomRoutes>
        </Admin>
		</div>
		</ThemeProvider>
	  </StylesProvider>
    </React.StrictMode>
);
