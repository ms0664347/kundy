import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsDailyWorkReport = Loadable(lazy(() => import('views/utilities/DailyWorkReport')));
const UtilsAllWorkReport = Loadable(lazy(() => import('views/utilities/AllWorkReport')));
const UtilsCompany = Loadable(lazy(() => import('views/utilities/Company')));
const UtilsTool = Loadable(lazy(() => import('views/utilities/Tool')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'dailyWorkReport',
      element: <UtilsDailyWorkReport />
    },
    {
      path: 'allWorkReport',
      element: <UtilsAllWorkReport />
    },
    {
      path: 'company',
      element: <UtilsCompany />
    },
    {
      path: 'tool',
      element: <UtilsTool />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
