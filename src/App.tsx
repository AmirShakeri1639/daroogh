import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import CircleLoading from './components/public/loading/CircleLoading';
import PrivateRoute from './routes/PrivateRoute';
import { ReactQueryDevtools } from 'react-query-devtools';
import ToolBox from './components/screen/dashboard/drug-transfer/Toolbox';
import ProgressBar from './components/screen/dashboard/drug-transfer/ProgressBar';
import TransferDrug from './components/screen/dashboard/transfer/Transfer';
import { CssBaseline } from '@material-ui/core';

const Login = lazy(() => import('./components/screen/login/Login'));
const Dashboard = lazy(() => import('./components/screen/dashboard/Dashboard'));
const ForgetPassword = lazy(() => import('./components/screen/forget-password/ForgetPassword'));

const App = (): JSX.Element => {
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
            <PrivateRoute exact path="/dashboard">
              <Dashboard />
            </PrivateRoute>
            <PrivateRoute exact path="/s">
              <ProgressBar />
            </PrivateRoute>
            <PrivateRoute path="/dashboard/drug-transfer">
              <TransferDrug />
            </PrivateRoute>
            {/*<Route component={<>404 Not Found</>} />*/}
          </Suspense>
        </Switch>
      </Router>
      <ReactQueryDevtools />
    </>
  );
}

export default App;
