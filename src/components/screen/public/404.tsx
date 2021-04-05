import React from 'react';
import { useTranslation } from 'react-i18next';
import 'assets/scss/404.scss';
import { Link } from 'react-router-dom';

const Error404: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="body-error">
      <div className="site">
        <div className="sketch">
          <div className="bee-sketch red"></div>
          <div className="bee-sketch blue"></div>
        </div>

        <h1>
          404:
        <small>{ t('error._404') }</small>
          <p>{ t('error._404_desc') }</p>
          <Link to="/">
            <button className="btn btn-green">{ t('general.home') }</button>
          </Link>
        </h1>
      </div>
    </div>
  )
}

export default Error404
