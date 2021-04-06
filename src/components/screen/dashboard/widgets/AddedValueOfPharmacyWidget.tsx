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
      fontSize: '1.2em',
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
      debugger;
      return result;
    }

    getCount();
  }, []);

  return (
    <div
      className="statswidget-container"
      style={{
        backgroundColor: 'green',
        color: 'white',
      }}
    >
      <Grid container>
        <Grid item container xs={12}>
          <Grid container style={{ padding: '8px' }}>
            <Grid item xs={12}>
              <span className={titleC}>{'مجموع ارزش (قیمت به ریال) داروهای منقضی شده'}</span>
              <span className={titleC}>:&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfExpired)}</span>
              <span>&nbsp;</span>
              <span className={suffixC}>{'ریال'}</span>
            </Grid>
            <Grid item xs={12}>
              <span className={titleC}>{'مجموع ارزش داروهای مازاد باقیمانده'}</span>
              <span className={titleC}>:&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfRemainSurplusDrugs)}</span>
              <span>&nbsp;</span>
              <span className={suffixC}>{'ریال'}</span>
            </Grid>
            <Grid item xs={12}>
              <span className={titleC}>{'مجموع ارزش داروهای تبادل شده'}</span>
              <span className={titleC}>:&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfExchanged)}</span>
              <span>&nbsp;</span>
              <span className={suffixC}>{'ریال'}</span>
            </Grid>
            <Grid item xs={12}>
              <span className={titleC}>{'مجموع پورسانت پرداخت شده'}</span>
              <span className={titleC}>:&nbsp;</span>
              <span className={textC}>{thousandsSeperator(result?.sumOfCommissionAmount)}</span>
              <span>&nbsp;</span>
              <span className={suffixC}>{'ریال'}</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddedValueOfPharmacyWidget;
