import React from "react";
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { Validation } from '../utils';

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const { children, ...rest } = props;

  const { isValidUserToken } = new Validation();

  function isAuthorizedUser(): boolean {
    // const { token } = JSON.parse(localStorage.getItem('user') || '{}');
    // return token === undefined
    //   ? false
    //   : isValidUserToken(token);
    return true;
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
