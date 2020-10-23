import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const Login: React.FC = (): JSX.Element => {
  const location  = useLocation();
  const history = useHistory();
  const { from }: any = location.state || { from: { pathname: '/dashboard' } };

  return (
    <div>asdasd</div>
  );
};

export default Login;
