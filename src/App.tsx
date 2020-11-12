import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import CircleLoading from './components/public/loading/CircleLoading';
import PrivateRoute from './routes/PrivateRoute';
import { ReactQueryDevtools } from 'react-query-devtools';
import ForgetPassword from './components/screen/forget-password/ForgetPassword';
import CreateDrug from "./components/screen/drug/CreateDrug";

const Login = lazy(() => import('./components/screen/login/Login'));
const Dashboard = lazy(() => import('./components/screen/dashboard/Dashboard'));

const App = (): JSX.Element => {
  return (
    <>
      <Router>
        <Switch>
          <Suspense fallback={<CircleLoading />}>
            <PublicRoute path={['/', '/login']}>
              <Login />
            </PublicRoute>

            <PublicRoute path="/forget-password">
              <ForgetPassword />
            </PublicRoute>
            <PrivateRoute path="/dashboard">
              <Dashboard />
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
