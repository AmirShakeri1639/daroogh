import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Exchange } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import routes from 'routes';

function ExchangeWidget() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const { desktop } = routes;
  const toUrl = `${desktop}?state=waiting`

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
        title={ t('exchange.waitingForYourConfirmation') }
        value={ count }
        icon={ <FontAwesomeIcon icon={ faHandshake } size="4x" /> }
        backColor={ ColorEnum.Green }
        color="white"
        to={ toUrl }
      />
    </div>
  )
}

export default ExchangeWidget
