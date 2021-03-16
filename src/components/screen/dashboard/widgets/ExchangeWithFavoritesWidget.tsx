import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PharmacyDrug } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import routes from 'routes';

function ExchangeWithFavoritesWidget() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const { transferWithFavorites } = routes;
  const toUrl = `${transferWithFavorites}`

  useEffect(() => {
    // TODO: change API to just count exchanges with favorites
    const { getFavoritePharmacyDrugCount } = new PharmacyDrug();
    async function getCount(): Promise<any> {
      const result = await getFavoritePharmacyDrugCount();
      setCount(result);
      return result;
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
