import React, { useEffect, useState } from 'react';
import { Divider, Grid, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Exchange } from '../../../../services/api';

const ExchangeWidget: React.FC = () => {
  const { t } = useTranslation();

  const [listData, setListData] = useState();

  useEffect(() => {
    async function getData() {
      const { urls } = new Exchange();
      const result = await 
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
            CONTENT<br />
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic dolores dignissimos harum saepe enim eveniet consequuntur, reiciendis accusantium sequi amet eos alias nobis laborum incidunt eaque laudantium maxime natus nesciunt.
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ExchangeWidget;
