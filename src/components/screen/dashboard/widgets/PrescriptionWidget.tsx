import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Prescription } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import routes from 'routes';

function PrescriptionWidget() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const { prescriptionList } = routes;

  useEffect(() => {
    const { getPrescriptionsCount } = new Prescription();
    async function getCount(): Promise<any> {
      const result = await getPrescriptionsCount();
      setCount(result);
      return result;
    }

    getCount();
  }, []);

  return (
    <div>
      <StatsWidget
        title={ t('prescription.peoplePrescriptions') }
        value={ count }
        icon={ <FontAwesomeIcon icon={ faPills } size="4x" /> }
        backColor={ ColorEnum.Orange }
        color="white"
        to={ prescriptionList }
      />
    </div>
  )
}

export default PrescriptionWidget
