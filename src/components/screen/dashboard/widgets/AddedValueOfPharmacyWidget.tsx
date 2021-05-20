import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Reports } from 'services/api';
import { StatsWidget } from '../../../public';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { ColorEnum } from 'enum';
import routes from 'routes';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import { icon } from 'leaflet';
import { title } from 'process';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { Convertor } from 'utils';
import zIndex from '@material-ui/core/styles/zIndex';

const { thousandsSeperator } = Convertor;

const useStyle = makeStyles((theme) =>
  createStyles({
    titleC: {
      color: 'white',
      fontSize: '12px',
      verticalAlign: 'middle',
      lineHeight: '20px',
    },
    suffixC: {
      color: 'white',
      fontSize: '10px',
      verticalAlign: 'middle',
      lineHeight: '20px',
    },
    textC: {
      color: 'white',
      fontSize: '12px',
      verticalAlign: 'middle',
      lineHeight: '20px',
    },
  })
);

const AddedValueOfPharmacyWidget: React.FC = () => {
  const { t } = useTranslation();
  const { titleC, textC, suffixC } = useStyle();
  const [result, setresult] = useState({
    sumOfExpired: 0,
    sumOfRemainSurplusDrugs: 0,
    sumOfExchanged: 0,
    sumOfCommissionAmount: 0,
  });
  const { transferWithFavorites } = routes;
  const toUrl = `${transferWithFavorites}`;

  useEffect(() => {
    // TODO: change API to just count exchanges with favorites
    const { getAddedValueOfPharmacy } = new Reports();
    async function getCount(): Promise<any> {
      const result = await getAddedValueOfPharmacy();
      setresult(result);
      return result;
    }

    getCount();
  }, []);

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <span
            className={titleC}
            style={{
              background: '#2196f3',
              marginRight: 2,
              borderRadius: '5px 5px 0px 0px',
              padding: 8,
            }}
          >
            { t('reports.yourPharmacyStats') }
          </span>
        </Grid>
        <Grid
          item
          container
          xs={12}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            borderRadius: 15,
            border: '1px solid white',
            zIndex: 2,
            minHeight: 116,
          }}
        >
          <Grid container style={{ padding: 16 }}>
            <Grid item xs={12}>
              <span className={titleC}>{'ارزش  داروهای منقضی شده'}</span>
              <span className={titleC}>:&nbsp;&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfExpired)}</span>
              <span>&nbsp;&nbsp;</span>
              <span className={suffixC}>{t('general.defaultCurrency')}</span>
            </Grid>
            <Grid item xs={12}>
              <span className={titleC}>{'ارزش داروهای مازاد باقیمانده'}</span>
              <span className={titleC}>:&nbsp;&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfRemainSurplusDrugs)}</span>
              <span>&nbsp;&nbsp;</span>
              <span className={suffixC}>{t('general.defaultCurrency')}</span>
            </Grid>
            <Grid item xs={12}>
              <span className={titleC}>{'ارزش داروهای تبادل شده'}</span>
              <span className={titleC}>:&nbsp;&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfExchanged)}</span>
              <span>&nbsp;&nbsp;</span>
              <span className={suffixC}>{t('general.defaultCurrency')}</span>
            </Grid>
            <Grid item xs={12}>
              <span className={titleC}>{'پورسانت پرداخت شده'}</span>
              <span className={titleC}>:&nbsp;&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfCommissionAmount)}</span>
              <span>&nbsp;&nbsp;</span>
              <span className={suffixC}>{t('general.defaultCurrency')}</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AddedValueOfPharmacyWidget;
