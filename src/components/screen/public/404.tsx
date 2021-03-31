import React from 'react';
import { useTranslation } from 'react-i18next';
import 'assets/scss/404.scss';

const Error404: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="site">
      <div className="sketch">
        <div className="bee-sketch red"></div>
        <div className="bee-sketch blue"></div>
      </div>

      <h1>
        404:
        <small>{ t('error._404') }</small>
        <p>{ t('error._404_desc') }</p>
        <button className="btn">{ t('general.home') }</button>
      </h1>
    </div>
  )
}

export default Error404
