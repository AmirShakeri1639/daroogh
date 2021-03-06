import React, { lazy, Suspense, useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
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
import { ToastContainer } from 'react-toastify';

const Login = lazy(() => import('./components/screen/login/Login'));
const Dashboard = lazy(() => import('./components/screen/dashboard/Dashboard'));
const ForgetPassword = lazy(() => import('./components/screen/forget-password/ForgetPassword'));
const Otp = lazy(() => import('./components/screen/otp/Otp'));

const OtpSecondStep = lazy(() => import('./components/screen/otp/SecondStep'));

const RegisterPharmacyWithUser = lazy(
  () => import('./components/screen/public/RegisterPharmacyWithUser')
);

const DrugTransfer = lazy(() => import('./components/screen/dashboard/drug-transfer/Transfer'));
const Desktop1 = lazy(() => import('./components/screen/dashboard/drug-transfer/desktop/Desktop1'));
const Transfer = lazy(() => import('./components/screen/dashboard/drug-transfer/Transfer'));
const Survey = lazy(() => import('./components/screen/dashboard/drug-transfer/Survey'));
const SupplyList = lazy(() => import('./components/screen/dashboard/supply-list/SupplyList'));

const Transactions = lazy(() => import('./components/screen/dashboard/accounting/accountingList'));

const AccountingInfo = lazy(
  () => import('./components/screen/dashboard/accounting/AccountingInfo')
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
const Prescription = lazy(
  () => import('./components/screen/dashboard/peopleSection/Prescription/Prescription')
);
const EmploymentApplication = lazy(
  () =>
    import(
      './components/screen/dashboard/peopleSection/EmploymentApplication/EmploymentApplication'
    )
);
const FindJob = lazy(
  () =>
    import(
      './components/screen/dashboard/peopleSection/FindJob/FindJob'
    )
);
const CreatePharmacy = lazy(() => import('./components/screen/dashboard/pharmacy/createPharmacy'));

const PharmaciesList = lazy(() => import('./components/screen/dashboard/pharmacy/pharmaciesList'));

const PharmacyDocs = lazy(() => import('./components/screen/dashboard/pharmacy/PharmacyDocs'));

const CreateMessage = lazy(() => import('./components/screen/dashboard/message/CreateMessage'));

const MessagesList = lazy(() => import('./components/screen/dashboard/message/MessagesList'));

const DrugFavoriteCategory = lazy(
  () => import('./components/screen/dashboard/favorite-list/category/Category')
);

const CreatePack = lazy(() => import('./components/screen/dashboard/pack/create/Create'));

const PackList = lazy(() => import('./components/screen/dashboard/pack/Pack'));

const ExchangeManagement = lazy(
  () => import('./components/screen/dashboard/exchange-management/ExchangeManagement')
);

const FDA_exchangeList = lazy(() => import('./components/screen/dashboard/fda/exchanges'));

const PharmacyUsersList = lazy(() => import('./components/screen/dashboard/pharmacy/UsersList'));

const JobSearchList = lazy(() => import('./components/screen/dashboard/job-search/jobSearchList'));

const PrescriptionList = lazy(
  () => import('./components/screen/dashboard/prescription/prescriptionList')
);

const ProfileLazy = lazy(() => import('./components/screen/dashboard/user/Profile'));

const SettingsForm = lazy(() => import('./components/screen/dashboard/settings/Settings'));
const SettingsAiForm = lazy(() => import('./components/screen/dashboard/settingsAi/SettingsAi'));
const FavoriteDrugsForm = lazy(() => import('./components/screen/dashboard/reports/FavoriteDrugs'));
const SelectedDrugsForm = lazy(() => import('./components/screen/dashboard/reports/SelectedDrugs'));
const SurplusDrugsForm = lazy(() => import('./components/screen/dashboard/reports/SurplusDrugs'));
const Top10PharmacyForm = lazy(() => import('./components/screen/dashboard/reports/Top10Pharmacy'));
const LoginCountReport = lazy(() => import('./components/screen/dashboard/reports/LoginCountReport'))
const AllPharmacyDrugReport = lazy(
  () => import('./components/screen/dashboard/reports/AllPharmacyDrugReport')
)
const AcceptedPrescriptionsReport = lazy(
  () => import('./components/screen/dashboard/reports/AcceptedPrescriptionsReport')
)
const AllEmploymentApplicationsReport = lazy(
  () => import('./components/screen/dashboard/reports/AllEmploymentApplicationsReport')
)

const About = lazy(() => import('./components/screen/dashboard/about/About'))

const Job = lazy(() => import('./components/screen/dashboard/job/Job'));

const PharmacyMessage = lazy(
  () => import('./components/screen/dashboard/pharmacy/message/Message')
);
const SurveyComponent = lazy(
  () => import('./components/screen/dashboard/pharmacy/survey/SurveyComponent')
);
const APharmacyDocs = lazy(() => import('./components/screen/dashboard/pharmacy/docs/docs'));
const CommisionsList = lazy(() => import('./components/screen/dashboard/settingsCommision/CommisionsList'));
const EmploymentApplicationForAdmin = lazy(() => import('./components/screen/dashboard/employment/admin/EmploymentApplication'));


const Error404 = lazy(() => import('./components/screen/public/404'));
const Error401 = lazy(() => import('./components/screen/public/401'));

const {
  login,
  drugFavoriteList,
  prescription,
  jobApplication,
  findJob,
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
  pharmacyDocs,
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
  otp,
  profile,
  settings,
  settingsAi,
  selectedDrugs,
  favoriteDrugs,
  surplusDrugs,
  Top10Pharmacy,
  jobsList,
  pharmacyMessage,
  surveyList,
  aPharmacyDocs,
  fda_exchangeList,
  survey,
  error401,
  loginCountReport,
  commisionSettingsList,
  employmentApplicationForAdmin,
  about,
  allPharmacyDrugReport,
  acceptedPrescriptionsReport,
  allEmploymentApplicationsReport,
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

  const setupCrisp = (): void => {
    (window as any).$crisp = [];

    (function (): void {
      const d = document;
      const s = d.createElement('script');

      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();
  };

  setupCrisp();
  return (
    <>
      <ToastContainer rtl={true} closeButton={false} position="bottom-right" />
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
            <PublicRoute exact path={otp}>
              <Otp />
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
            <PrivateRoute exact path={desktop}>
              <Dashboard component={<Desktop1 />} />
            </PrivateRoute>
            <PrivateRoute exact path={transfer}>
              <Dashboard component={<Transfer />} />
            </PrivateRoute>
            <PrivateRoute exact path={survey}>
              <Dashboard component={<Survey />} />
            </PrivateRoute>
            <PrivateRoute exact path={supplyList}>
              <Dashboard component={<SupplyList />} />
            </PrivateRoute>
            <PrivateRoute exact path={transactions}>
              <Dashboard component={<Transactions />} />
            </PrivateRoute>
            <PrivateRoute exact path={membershipRequests}>
              <Dashboard component={<MembershipRequests />} />
            </PrivateRoute>
            <PrivateRoute exact path={memberRole}>
              <Dashboard component={<MemberRole />} />
            </PrivateRoute>
            <PrivateRoute exact path={createRole}>
              <Dashboard component={<CreateRole />} />
            </PrivateRoute>
            <PrivateRoute exact path={createUser}>
              <Dashboard component={<CreateUser />} />
            </PrivateRoute>
            <PrivateRoute exact path={usersList}>
              <Dashboard component={<UsersList />} />
            </PrivateRoute>
            <PrivateRoute exact path={changeUserPassword}>
              <Dashboard component={<ChangeUserPassword />} />
            </PrivateRoute>
            <PrivateRoute exact path={createDrug}>
              <Dashboard component={<CreateDrug />} />
            </PrivateRoute>
            <PrivateRoute exact path={drugsList}>
              <Dashboard component={<DrugsList />} />
            </PrivateRoute>
            <PrivateRoute exact path={categoryList}>
              <Dashboard component={<CategoryList />} />
            </PrivateRoute>
            <PrivateRoute exact path={createPharmacy}>
              <Dashboard component={<CreatePharmacy />} />
            </PrivateRoute>
            <PrivateRoute exact path={pharmaciesList}>
              <Dashboard component={<PharmaciesList />} />
            </PrivateRoute>
            <PrivateRoute exact path={pharmacyDocs}>
              <Dashboard component={<PharmacyDocs />} />
            </PrivateRoute>
            <PrivateRoute exact path={createMessage}>
              <Dashboard component={<CreateMessage />} />
            </PrivateRoute>
            <PrivateRoute exact path={messagesList}>
              <Dashboard component={<MessagesList />} />
            </PrivateRoute>
            <PrivateRoute exact path={drugFavoriteList}>
              <Dashboard component={<FavoriteList />} />
            </PrivateRoute>
            <PrivateRoute exact path={drugCategoryfavoriteList}>
              <Dashboard component={<DrugFavoriteCategory />} />
            </PrivateRoute>
            <PrivateRoute exact path={accountingInfo}>
              <Dashboard component={<AccountingInfo />} />
            </PrivateRoute>
            <PrivateRoute exact path={packsList}>
              <Dashboard component={<PackList />} />
            </PrivateRoute>
            <PrivateRoute exact path={prescription}>
              <Dashboard component={<Prescription />} />
            </PrivateRoute>
            <PrivateRoute exact path={jobApplication}>
              <Dashboard component={<EmploymentApplication />} />
            </PrivateRoute>
            <PrivateRoute exact path={findJob}>
              <Dashboard component={<FindJob />} />
            </PrivateRoute>
            <PrivateRoute exact path={drugCategoryfavoriteList}>
              <Dashboard component={<DrugFavoriteCategory />} />
            </PrivateRoute>
            <PrivateRoute exact path={createPack}>
              <Dashboard component={<CreatePack />} />
            </PrivateRoute>
            <PrivateRoute exact path={`${createPack}/:packId`}>
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
            <PrivateRoute exact path={settingsAi}>
              <Dashboard component={<SettingsAiForm />} />
            </PrivateRoute>
            <PrivateRoute exact path={surplusDrugs}>
              <Dashboard component={<SurplusDrugsForm />} />
            </PrivateRoute>
            <PrivateRoute exact path={Top10Pharmacy}>
              <Dashboard component={<Top10PharmacyForm />} />
            </PrivateRoute>
            <PrivateRoute exact path={favoriteDrugs}>
              <Dashboard component={<FavoriteDrugsForm />} />
            </PrivateRoute>
            <PrivateRoute exact path={selectedDrugs}>
              <Dashboard component={<SelectedDrugsForm />} />
            </PrivateRoute>
            <PrivateRoute exact path={loginCountReport}>
              <Dashboard component={<LoginCountReport />} />
            </PrivateRoute>
            <PrivateRoute exact path={allPharmacyDrugReport}>
              <Dashboard component={<AllPharmacyDrugReport />} />
            </PrivateRoute>
            <PrivateRoute exact path={ acceptedPrescriptionsReport }>
              <Dashboard component={ <AcceptedPrescriptionsReport /> } />
            </PrivateRoute>
            <PrivateRoute exact path={ allEmploymentApplicationsReport }>
              <Dashboard component={ <AllEmploymentApplicationsReport /> } />
            </PrivateRoute>

            <PrivateRoute path={jobsList}>
              <Dashboard component={<Job />} />
            </PrivateRoute>
            <PrivateRoute exact path={pharmacyMessage}>
              <Dashboard component={<PharmacyMessage />} />
            </PrivateRoute>
            <PrivateRoute path={surveyList}>
              <Dashboard component={<SurveyComponent />} />
            </PrivateRoute>
            <PrivateRoute path={aPharmacyDocs}>
              <Dashboard component={<APharmacyDocs />} />
            </PrivateRoute>
            <PrivateRoute path={commisionSettingsList}>
              <Dashboard component={<CommisionsList />} />
            </PrivateRoute>
            <PrivateRoute exact path={fda_exchangeList}>
              <Dashboard component={<FDA_exchangeList />} />
            </PrivateRoute>
            <PrivateRoute exact path={employmentApplicationForAdmin}>
              <Dashboard component={<EmploymentApplicationForAdmin />} />
            </PrivateRoute>

            <PrivateRoute exact path={error401}>
              <Error401 />
            </PrivateRoute>

            <PrivateRoute exact path={ about }>
              <Dashboard component={ <About />} />
            </PrivateRoute>

            <Route
              render={(e): any => {
                if (e.location.pathname === '/') return;
                if (!Object.values(routes).some((i) => e.location.pathname.startsWith(i))) {
                  return <Error404 />;
                }
              }}
            />
          </Suspense>
        </Switch>
      </Router>
      <ReactQueryDevtools />
    </>
  );
};

export default App;
