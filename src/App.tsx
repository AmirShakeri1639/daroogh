import React, { lazy, Suspense, useEffect } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import CircleLoading from './components/public/loading/CircleLoading';
import PrivateRoute from './routes/PrivateRoute';
import { ReactQueryDevtools } from 'react-query-devtools';
import { CssBaseline } from '@material-ui/core';
import routes from './routes';
import DashboardContent from './components/screen/dashboard/DashboardContent';
import { isAdmin } from './utils';
import Appbar from './components/screen/dashboard/AppBar';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import Desktop1 from 'components/screen/dashboard/drug-transfer/desktop/Desktop1';

const Login = lazy(() => import('./components/screen/login/Login'));
const Dashboard = lazy(() => import('./components/screen/dashboard/Dashboard'));
const ForgetPassword = lazy(() => import('./components/screen/forget-password/ForgetPassword'));
const RegisterPharmacyWithUser = lazy(() =>
  import('./components/screen/public/RegisterPharmacyWithUser')
);

const DrugTransfer = lazy(() => import('./components/screen/dashboard/drug-transfer/Transfer'));
const Desktop = lazy(() => import('./components/screen/dashboard/drug-transfer/desktop/Desktop1'));
const Transfer = lazy(() => import('./components/screen/dashboard/drug-transfer/Transfer'));
const SupplyList = lazy(() => import('./components/screen/dashboard/supply-list/SupplyList'));

const Transactions = lazy(() => import('./components/screen/dashboard/accounting/accountingList'));

const AccountingInfo = lazy(() =>
  import('./components/screen/dashboard/accounting/AccountingInfo')
);

const MembershipRequests = lazy(() => import('./components/screen/dashboard/pharmacy/Membership'));
const MemberRole = lazy(() => import('./components/screen/dashboard/pharmacy/MemberRole'));

const DashboardActivePage = lazy(() => import('./components/screen/dashboard/DashboardActivePage'));

const CreateRole = lazy(() => import('./components/screen/dashboard/roles/CreateRole'));

const CreateUser = lazy(() => import('./components/screen/dashboard/user/CreateUser'));

const UsersList = lazy(() => import('./components/screen/dashboard/user/UsersList'));

const ChangeUserPassword = lazy(() => import('./components/screen/dashboard/user/ChangePassword'));

const CreateDrug = lazy(() => import('./components/screen/dashboard/drug/CreateDrug'));

const DrugsList = lazy(() => import('./components/screen/dashboard/drug/drugsList'));

const CategoryList = lazy(() => import('./components/screen/dashboard/category/CategoryList'));
const FavoriteList = lazy(() => import('./components/screen/dashboard/favorite-list/Drug'));
const Prescription = lazy(() =>
  import('./components/screen/dashboard/peopleSection/Prescription/Prescription')
);
const EmploymentApplication = lazy(() =>
  import('./components/screen/dashboard/peopleSection/EmploymentApplication/EmploymentApplication')
);

const CreatePharmacy = lazy(() => import('./components/screen/dashboard/pharmacy/createPharmacy'));

const PharmaciesList = lazy(() => import('./components/screen/dashboard/pharmacy/pharmaciesList'));

const CreateMessage = lazy(() => import('./components/screen/dashboard/message/CreateMessage'));

const MessagesList = lazy(() => import('./components/screen/dashboard/message/MessagesList'));

const DrugFavoriteCategory = lazy(() =>
  import('./components/screen/dashboard/favorite-list/category/Category')
);

const CreatePack = lazy(() => import('./components/screen/dashboard/pack/create/Create'));

const PackList = lazy(() => import('./components/screen/dashboard/pack/Pack'));

const ExchangeManagement = lazy(() =>
  import('./components/screen/dashboard/exchange-management/ExchangeManagement')
);

const PharmacyUsersList = lazy(() => import('./components/screen/dashboard/pharmacy/UsersList'));

const JobSearchList = lazy(() => import('./components/screen/dashboard/job-search/jobSearchList'));

const PrescriptionList = lazy(() =>
  import('./components/screen/dashboard/prescription/prescriptionList')
);

const ProfileLazy = lazy(() => import('./components/screen/dashboard/user/Profile'));

const SettingsForm = lazy(() => import('./components/screen/dashboard/settings/Settings'));

const JobsList = lazy(() => import('./components/screen/dashboard/job/jobsList'));

const {
  login,
  drugFavoriteList,
  prescription,
  jobApplication,
  dashboard,
  transfer,
  desktop,
  supplyList,
  transactions,
  membershipRequests,
  registerPharmacyWithUser,
  memberRole,
  createRole,
  createUser,
  usersList,
  changeUserPassword,
  createDrug,
  drugsList,
  categoryList,
  createPharmacy,
  pharmaciesList,
  createMessage,
  messagesList,
  drugCategoryfavoriteList,
  accountingInfo,
  packsList,
  createPack,
  exchangeManagementList,
  pharmacyUsersList,
  jobSearchList,
  prescriptionList,
  forgetPassword,
  profile,
  settings,
  jobsList
} = routes;

const LoadingComponent: React.FC = () => {
  return (
    <>
      <Appbar showButtons={false} />
      <div style={{ marginTop: 75 }}>
        <CircleLoading />
      </div>
    </>
  );
};

const App = (): JSX.Element => {
  const history = createBrowserHistory();
  ReactGA.initialize('G-TKSLN0VE57');
  // history.listen((e): any => {
  //   const userInStorage = localStorage.getItem('user');
  //   const gaOptions: any = {};
  //   if (userInStorage) {
  //     const user = JSON.parse(userInStorage);
  //     gaOptions.user_name = user.name;
  //     gaOptions.user_family = user.family;
  //     gaOptions.pharmacyName = user.pharmacyName;
  //   }
  //   ReactGA.set({
  //     ...gaOptions,
  //     page: `${e.location.pathname}${e.location.search}${e.location.hash}`,
  //   }); // Update the user's current page
  //   // Record a pageview for the given page
  //   ReactGA.pageview(`${e.location.pathname}${e.location.search}${e.location.hash}`);
  // })

  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-TKSLN0VE57';
  document.body.appendChild(gaScript);
  const gaScript2 = document.createElement('script');
  gaScript2.text =
    ' window.dataLayer = window.dataLayer || [];' +
    'function gtag(){dataLayer.push(arguments);}' +
    "gtag('js', new Date());" +
    "gtag('config', 'UA-31704707-1');";
  document.body.appendChild(gaScript2);

  return (
    <>
      <Router>
        <Switch>
          <Suspense fallback={<LoadingComponent />}>
            <CssBaseline />
            <PublicRoute exact path={['/', login]}>
              <Login />
            </PublicRoute>
            <PublicRoute exact path={forgetPassword}>
              <ForgetPassword />
            </PublicRoute>
            <PublicRoute exact path={registerPharmacyWithUser}>
              <RegisterPharmacyWithUser />
            </PublicRoute>
            <PrivateRoute exact path={dashboard}>
              <Dashboard component={<DashboardContent />} />
            </PrivateRoute>
            <PrivateRoute exact path="/dashboardActivePage">
              <Dashboard component={<DashboardActivePage />} />
            </PrivateRoute>
            <PrivateRoute path={desktop}>
              <Dashboard component={<Desktop1 />} />
            </PrivateRoute>
            <PrivateRoute path={transfer}>
              <Dashboard component={<Transfer />} />
            </PrivateRoute>
            <PrivateRoute path={supplyList}>
              <Dashboard component={<SupplyList />} />
            </PrivateRoute>
            <PrivateRoute path={transactions}>
              <Dashboard component={<Transactions />} />
            </PrivateRoute>
            <PrivateRoute path={membershipRequests}>
              <Dashboard component={<MembershipRequests />} />
            </PrivateRoute>
            <PrivateRoute path={memberRole}>
              <Dashboard component={<MemberRole />} />
            </PrivateRoute>
            <PrivateRoute path={createRole}>
              <Dashboard component={<CreateRole />} />
            </PrivateRoute>
            <PrivateRoute path={createUser}>
              <Dashboard component={<CreateUser />} />
            </PrivateRoute>
            <PrivateRoute path={usersList}>
              <Dashboard component={<UsersList />} />
            </PrivateRoute>
            <PrivateRoute path={changeUserPassword}>
              <Dashboard component={<ChangeUserPassword />} />
            </PrivateRoute>
            <PrivateRoute path={createDrug}>
              <Dashboard component={<CreateDrug />} />
            </PrivateRoute>
            <PrivateRoute path={drugsList}>
              <Dashboard component={<DrugsList />} />
            </PrivateRoute>
            <PrivateRoute path={categoryList}>
              <Dashboard component={<CategoryList />} />
            </PrivateRoute>
            <PrivateRoute path={createPharmacy}>
              <Dashboard component={<CreatePharmacy />} />
            </PrivateRoute>
            <PrivateRoute path={pharmaciesList}>
              <Dashboard component={<PharmaciesList />} />
            </PrivateRoute>
            <PrivateRoute path={createMessage}>
              <Dashboard component={<CreateMessage />} />
            </PrivateRoute>
            <PrivateRoute path={messagesList}>
              <Dashboard component={<MessagesList />} />
            </PrivateRoute>
            <PrivateRoute path={drugFavoriteList}>
              <Dashboard component={<FavoriteList />} />
            </PrivateRoute>
            <PrivateRoute path={drugCategoryfavoriteList}>
              <Dashboard component={<DrugFavoriteCategory />} />
            </PrivateRoute>
            <PrivateRoute path={accountingInfo}>
              <Dashboard component={<AccountingInfo />} />
            </PrivateRoute>
            <PrivateRoute path={packsList}>
              <Dashboard component={<PackList />} />
            </PrivateRoute>
            <PrivateRoute path={prescription}>
              <Dashboard component={<Prescription />} />
            </PrivateRoute>
            <PrivateRoute path={jobApplication}>
              <Dashboard component={<EmploymentApplication />} />
            </PrivateRoute>
            <PrivateRoute path={drugCategoryfavoriteList}>
              <Dashboard component={<DrugFavoriteCategory />} />
            </PrivateRoute>
            <PrivateRoute exact path={createPack}>
              <Dashboard component={<CreatePack />} />
            </PrivateRoute>
            <PrivateRoute path={`${createPack}/:packId`}>
              <Dashboard component={<CreatePack />} />
            </PrivateRoute>
            <PrivateRoute exact path={exchangeManagementList}>
              <Dashboard component={<ExchangeManagement />} />
            </PrivateRoute>
            <PrivateRoute exact path={pharmacyUsersList}>
              <Dashboard component={<PharmacyUsersList />} />
            </PrivateRoute>
            <PrivateRoute exact path={jobSearchList}>
              <Dashboard component={<JobSearchList full={isAdmin()} />} />
            </PrivateRoute>
            <PrivateRoute exact path={prescriptionList}>
              <Dashboard component={<PrescriptionList />} />
            </PrivateRoute>
            {/*<Route component={<>404 Not Found</>} />*/}
            <PrivateRoute exact path={profile}>
              <Dashboard component={<ProfileLazy />} />
            </PrivateRoute>
            <PrivateRoute exact path={settings}>
              <Dashboard component={<SettingsForm />} />
            </PrivateRoute>
            <PrivateRoute path={jobsList}>
              <Dashboard component={<JobsList />} />
            </PrivateRoute>
          </Suspense>
        </Switch>
      </Router>
      <ReactQueryDevtools />
    </>
  );
};

export default App;
