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
const CardBoard = lazy(() =>
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
const MembersList = lazy(() =>
  import('./components/screen/public/RegisterPharmacyWithUser')
);

const { transfer, cardboard, supplyList, transactions, membersList } = routes;

const App = (): JSX.Element => {
  const dashboard = 'dashboard';
  const exchangeBase = 'exchange';

  return (
    <>
      <Router>
        <Switch>
          <Suspense fallback={<CircleLoading />}>
            <CssBaseline />
            <PublicRoute exact path={['/', '/login']}>
              <Login />
            </PublicRoute>

            <PublicRoute exact path="/forget-password">
              <ForgetPassword />
            </PublicRoute>

            <PublicRoute exact path="/register-pharmacy-with-user">
              <RegisterPharmacyWithUser />
            </PublicRoute>

            <PrivateRoute exact path="/dashboard">
              <Dashboard component={<></>} />
            </PrivateRoute>

            <PrivateRoute path="/dashboard/drug-transfer">
              <ViewPharmacyInfo />
            </PrivateRoute>

            <PrivateRoute path={cardboard}>
              <Dashboard component={<CardBoard />} />
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

            <PrivateRoute path={membersList}>
              <Dashboard component={<MembersList />} />
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
