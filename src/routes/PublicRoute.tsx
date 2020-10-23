import React from "react";
import { RouteProps, Route, Redirect } from 'react-router-dom';

const PublicRoute: React.FC<RouteProps> = (props) => {
  const { children, ...rest } = props;

  function isAuthorizedUser(): boolean {
    return false; //TODO will complete
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
