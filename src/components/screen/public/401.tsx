import React from 'react';
import { useTranslation } from 'react-i18next';
import 'assets/scss/401.scss';
import { Link } from 'react-router-dom';
import { logoutUser } from 'utils';
import { Button } from '@material-ui/core';

const Error401: React.FC = () => {
  const { t } = useTranslation()
  const exitBtnClick = (e: any): void => {
    logoutUser();
  }

  return (
    <div className="body-error">
      <div className="error-logo">
        <img src='/images/401.jpg' alt="ERROR 401" />
      </div>
      <h1>
        { t('error._401') }
      </h1>
      <p>{ t('error._401_desc') }</p>
      <div>
        <Link to="/">
          <button className="btn btn-purple">{ t('general.home') }</button>
        </Link>
      </div>
      <div>
        <Button onClick={ exitBtnClick }>
          <button className="btn">{ t('login.exit') }</button>
        </Button>
      </div>
    </div>
  )
}

export default Error401
