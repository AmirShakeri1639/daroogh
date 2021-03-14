import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Exchange } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum, NeedSurvey } from 'enum';
import routes from 'routes';

function SurveyWidget() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const { desktop } = routes;
  const toUrl = `${desktop}?state=${NeedSurvey}`

  useEffect(() => {
    const { needSurvey } = new Exchange();
    async function getCount(): Promise<any> {
      const result = await needSurvey();
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
        backColor={ ColorEnum.Blue }
        color="white"
        to={ toUrl }
      />
    </div>
  )
}

export default SurveyWidget
