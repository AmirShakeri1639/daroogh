import React from 'react';
import { useTranslation } from 'react-i18next';

const Error404: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      { t('error._404') }
    </div>
  )
}

export default Error404
