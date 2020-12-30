import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import CircleLoading from './components/public/loading/CircleLoading';
import PrivateRoute from './routes/PrivateRoute';
import { ReactQueryDevtools } from 'react-query-devtools';
import { CssBaseline } from '@material-ui/core';
import ViewPharmacyInfo from './components/screen/dashboard/drug-transfer/ViewPharmacyInfo';
import routes from './routes';

const Login = lazy(() => import('./components/screen/login/Login'));
const Dashboard = lazy(() => import('./components/screen/dashboard/Dashboard'));
const ForgetPassword = lazy(() =>
  import('./components/screen/forget-password/ForgetPassword')
);
const RegisterPharmacyWithUser = lazy(() =>
  import('./components/screen/public/RegisterPharmacyWithUser')
);

const DrugTransfer = lazy(() =>
  import('./components/screen/dashboard/drug-transfer/Transfer')
);
const Desktop = lazy(() =>
  import('./components/screen/dashboard/drug-transfer/desktop/Desktop')
);
const Transfer = lazy(() =>
  import('./components/screen/dashboard/drug-transfer/Transfer')
);
const SupplyList = lazy(() =>
  import('./components/screen/dashboard/supply-list/SupplyList')
);

const Transactions = lazy(() =>
  import('./components/screen/dashboard/accounting/accountingList')
);

const MembershipRequests = lazy(() =>
  import('./components/screen/dashboard/pharmacy/Membership')
);
const MemberRole = lazy(() =>
  import('./components/screen/dashboard/pharmacy/MemberRole')
);

const DashboardActivePage = lazy(() =>
  import('./components/screen/dashboard/DashboardActivePage')
);

const CreateRole = lazy(() =>
  import('./components/screen/dashboard/roles/CreateRole')
);

const CreateUser = lazy(() =>
  import('./components/screen/dashboard/user/CreateUser')
);

const UsersList = lazy(() =>
  import('./components/screen/dashboard/user/UsersList')
);

const ChangeUserPassword = lazy(() =>
  import('./components/screen/dashboard/user/ChangePassword')
);

const CreateDrug = lazy(() =>
  import('./components/screen/dashboard/drug/CreateDrug')
);

const DrugsList = lazy(() =>
  import('./components/screen/dashboard/drug/drugsList')
);

const CategoryList = lazy(() =>
  import('./components/screen/dashboard/category/CategoryList')
);

const CreatePharmacy = lazy(() =>
  import('./components/screen/dashboard/pharmacy/createPharmacy')
);

const PharmaciesList = lazy(() =>
  import('./components/screen/dashboard/pharmacy/pharmaciesList')
);

const CreateMessage = lazy(() =>
  import('./components/screen/dashboard/message/CreateMessage')
);

const MessagesList = lazy(() =>
  import('./components/screen/dashboard/message/MessagesList')
);

const {
  login,
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
} = routes;

const App = (): JSX.Element => {
  const exchangeBase = 'exchange';

  return (
    <>
      <Router>
        <Switch>
          <Suspense fallback={<CircleLoading />}>
            <CssBaseline />
            <PublicRoute exact path={['/', login]}>
              <Login />
            </PublicRoute>

            <PublicRoute exact path="/forget-password">
              <ForgetPassword />
            </PublicRoute>

            <PublicRoute exact path={registerPharmacyWithUser}>
              <RegisterPharmacyWithUser />
            </PublicRoute>

            <PrivateRoute exact path={ dashboard }>
              <Dashboard component={<></>} />
            </PrivateRoute>

            <PrivateRoute exact path="/dashboardActivePage">
              <Dashboard component={<DashboardActivePage />} />
            </PrivateRoute>

            <PrivateRoute path="/dashboard/drug-transfer">
              <ViewPharmacyInfo />
            </PrivateRoute>

            <PrivateRoute path={desktop}>
              <Dashboard component={<Desktop />} />
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

            {/*<Route component={<>404 Not Found</>} />*/}
          </Suspense>
        </Switch>
      </Router>
      <ReactQueryDevtools />
    </>
  );
};

export default App;
