import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import PublicRoute from "./routes/PublicRoute";

const Login = lazy(() => import('./components/screen/login/Login'));

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<>Loading....</>}>
          <PublicRoute exact={true} path="/login">
            <Login />
          </PublicRoute>
        </Suspense>
      </Switch>
    </Router>
  );
}

export default App;
