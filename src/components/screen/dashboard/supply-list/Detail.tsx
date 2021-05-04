import { createStyles, Divider, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { memo } from 'react';
import { DetailSupplyInterface } from '../../../../interfaces';
import { useTranslation } from 'react-i18next';
import { Convertor } from '../../../../utils';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import Utils from 'components/public/utility/Utils';

import { ColorEnum } from 'enum';
import ShowOffer from 'components/public/offer-show/ShowOffer';

const useStyle = makeStyles((theme) =>
  createStyles({
    paper: {
      backgroundColor: '#fff',
    },
    container: {
      padding: 5,
      borderRadius: 15,
      '& .drug-name': {
        marginLeft: 10,
      },
      '& .drug-container': {
        padding: 6,
        borderLeft: `2px solid ${ColorEnum.Borders}`,
        backgroundColor: ColorEnum.LiteBack,
        paddingTop: '8px',
        marginBottom: theme.spacing(1),
        height: 70,
      },
    },
    smallText: {
      fontSize: 11,
      color: 'grey',
    },
  })
);

const Detail: React.FC<DetailSupplyInterface> = memo((props) => {
  const { drugName, count, offer1, offer2, expireDate, amount, enName } = props;
  const { paper, container, smallText } = useStyle();

  const { t } = useTranslation();
  const { thousandsSeperator } = Convertor;

  return (
    <Grid item xs={12}>
      <Paper className={paper} elevation={0}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className={container}>
              <Grid container spacing={0}>
                <Grid container xs={12} className="drug-container">
                  <Grid container item alignItems="center" xs={1}>
                    <img src="drug.png" style={{ height: '25px' }} />
                  </Grid>
                  <Grid container xs={11} style={{ alignItems: 'center', paddingRight: '8px' }}>
                    <span>{drugName}</span>
                    <div className={ `${smallText} no-farsi-number` }>{ ` ${enName}` ?? '' }</div>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item container spacing={1} style={{ padding: '8px' }}>
                  <Grid item xs={6}>
                    <TextWithTitle
                      title={t('general.price')}
                      body={thousandsSeperator(amount)}
                      suffix={t('general.defaultCurrency')}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextWithTitle
                      title={t('general.inventory')}
                      body={thousandsSeperator(count)}
                      suffix="عدد"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextWithTitle
                      title={t('general.expireDate')}
                      body={Utils.getExpireDate(expireDate)}
                      dateSuffix={Utils.getExpireDays(expireDate)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <ShowOffer offer1={offer1} offer2={offer2} />
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
});

export default Detail;
