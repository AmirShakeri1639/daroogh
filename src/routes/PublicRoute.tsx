import React from "react";
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { Validation } from '../utils';

const PublicRoute: React.FC<RouteProps> = (props) => {
  const { children, ...rest } = props;

  const { isValidUserToken } = new Validation();

  function isAuthorizedUser(): boolean {
    // TODO: json error
    // SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data
    const { token } = JSON.parse(localStorage.getItem('user') || '{}');
    return token === undefined
      ? false
      : isValidUserToken(token);
  }

  return (
    <Route
      {...rest}
      render={
        (): any => isAuthorizedUser()
          ? <Redirect to={{ pathname: '/dashboard' }} />
          : children
      }
    />
  );
}

export default PublicRoute;
