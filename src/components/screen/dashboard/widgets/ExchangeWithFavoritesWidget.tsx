import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Exchange } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import routes from 'routes';

function ExchangeWithFavoritesWidget() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const { desktop } = routes;
  const toUrl = `${desktop}`

  useEffect(() => {
    // TODO: change API to just count exchanges with favorites
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
        title={ t('exchange.exchangesWithFavorites') }
        value={ count }
        icon={ <FontAwesomeIcon icon={ faHandshake } size="4x" /> }
        backColor={ ColorEnum.Maroon }
        color="white"
        titleFontSize="1em"
        to={ toUrl }
      />
    </div>
  )
}

export default ExchangeWithFavoritesWidget
