import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import PublicRoute from "./routes/PublicRoute";
import CircleLoading from "./components/public/loading/CircleLoading";
import PrivateRoute from "./routes/PrivateRoute";
import { ReactQueryDevtools } from 'react-query-devtools';

const Login = lazy(() => import('./components/screen/login/Login'));
const Dashboard = lazy(() => import('./components/screen/dashboard/Dashboard'));

const App = (): JSX.Element => {
  return (
    <>
      <Router>
        <Switch>
          <Suspense fallback={<CircleLoading />}>
            <PublicRoute path="/login">
              <Login />
            </PublicRoute>
            <PrivateRoute path="/dashboard">
              <Dashboard />
            </PrivateRoute>
            <Route children={<>404 Not Found</>} />
          </Suspense>
        </Switch>
      </Router>
      <ReactQueryDevtools />
    </>
  );
}

export default App;
