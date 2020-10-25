import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import PublicRoute from "./routes/PublicRoute";
import CircleLoading from "./components/public/loading/CircleLoading";

const Login = lazy(() => import('./components/screen/login/Login'));

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<CircleLoading />}>
          <PublicRoute exact={true} path="/login">
            <Login />
          </PublicRoute>
        </Suspense>
      </Switch>
    </Router>
  );
}

export default App;
