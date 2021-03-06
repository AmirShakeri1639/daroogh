import React, { useEffect, useState } from 'react';
import { Divider, Grid, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Exchange } from '../../../../services/api';
import { Link } from 'react-router-dom';
import routes from '../../../../routes';
import CircleLoading from '../../../public/loading/CircleLoading';

const ExchangeListWidget: React.FC = () => {
  const { t } = useTranslation();
  const { transfer } = routes;
  const [listData, setListData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const { getForWidget } = new Exchange();
      const result = await getForWidget();
      setListData(result.items);
      setIsLoading(false);
      return result.items;
    }

    getData();
  }, []);
  
  return (
    <Paper className="widget-container">
      <Grid container>
        <Grid item xs={ 12 } className="widget-header">
          <h3>{ t('exchange.waitingForYourConfirmation') }</h3>
        </Grid>
        <Divider />
        <Grid item xs={ 12 }>
            { isLoading && <CircleLoading /> }
            { listData && listData?.length > 0 &&
              listData?.map((i: any): any => {
                const transferUrl = `${transfer}?eid=${i.currentPharmacyIsA ? i.numberA : i.numberB}`;
                return (
                  <Link to={transferUrl}>
                    { i?.currentPharmacyIsA ? i?.numberA : i?.numberB }<br/>
                  </Link>
                )
              })
            }
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ExchangeListWidget;
