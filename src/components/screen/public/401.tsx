import React from 'react';
import { useTranslation } from 'react-i18next';
import 'assets/scss/404.scss';
import { Link } from 'react-router-dom';

const Error401: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1>
        <small>{ t('error._401') }</small>
        <p>{ t('error._401_desc') }</p>
        <Link to="/">
          <button className="btn">{ t('general.home') }</button>
        </Link>
      </h1>
    </div>
    // <div className="body-404">
    //   <div className="site">
    //     <h1>
    //     <small>{ t('error._401') }</small>
    //       <p>{ t('error._401_desc') }</p>
    //       <Link to="/">
    //         <button className="btn">{ t('general.home') }</button>
    //       </Link>
    //     </h1>
    //   </div>
    // </div>
  )
}

export default Error401
