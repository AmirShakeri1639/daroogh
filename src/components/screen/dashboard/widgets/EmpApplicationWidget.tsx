import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmploymentApplication } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import routes from 'routes';

function EmpApplicationWidget() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const { jobSearchList } = routes;

  useEffect(() => {
    const { notCanceledCount } = new EmploymentApplication();
    async function getCount(): Promise<any> {
      const result = await notCanceledCount();
      setCount(result);
      return result;
    }

    getCount();
  }, []);

  return (
    <div>
      <StatsWidget
        title={ t('employment.applications') }
        value={ count }
        icon={ <FontAwesomeIcon icon={ faPills } size="4x" /> }
        backColor={ ColorEnum.Purple }
        color="white"
        to={ jobSearchList }
      />
    </div>
  )
}

export default EmpApplicationWidget
