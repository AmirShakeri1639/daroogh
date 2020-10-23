import React from "react";
import { RouteProps, Route, Redirect } from 'react-router-dom';

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const { children, ...rest } = props;

  function isAuthorizedUser(): boolean {
    return true; //TODO: will complete
  }

  return (
    <Route
      {...rest}
      render={
        ({ location }): any => isAuthorizedUser()
          ? children
          : <Redirect to={{ pathname: '/login', state: { from: location } }} />
      }
    />
  );
}

export default PrivateRoute;
