import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Exchange } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import routes from 'routes';

function SurveyWidget() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const { desktop } = routes;

  useEffect(() => {
    const { getForWidget } = new Exchange();
    async function getCount(): Promise<any> {
      const result = await getForWidget();
      setCount(result.items.length);
      return result.items.length;
    }

    getCount();
  }, []);

  return (
    <div>
      <StatsWidget
        title={ t('survey.survey') }
        value={ count }
        icon={ <FontAwesomeIcon icon={ faPoll } size="4x" /> }
        backColor={ ColorEnum.Orange }
        color="white"
        to={ desktop }
      />
    </div>
  )
}

export default SurveyWidget
