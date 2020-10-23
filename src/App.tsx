import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import Login from "./components/screen/login/Login";
import PublicRoute from "./routes/PublicRoute";

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <PublicRoute exact={true}>
          <Login />
        </PublicRoute>
      </Switch>
    </Router>
  );
}

export default App;
