import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import PublicRoute from "./routes/PublicRoute";
import CircleLoading from "./components/public/loading/CircleLoading";
import PrivateRoute from "./routes/PrivateRoute";

const Login = lazy(() => import('./components/screen/login/Login'));
const Dashboard = lazy(() => import('./components/screen/dashboard/Dashboard'));

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<CircleLoading />}>
          <PublicRoute path="/login">
            <Login />
          </PublicRoute>
          <PrivateRoute path="/dashboard">
            <Dashboard />
          </PrivateRoute>
        </Suspense>
      </Switch>
    </Router>
  );
}

export default App;
