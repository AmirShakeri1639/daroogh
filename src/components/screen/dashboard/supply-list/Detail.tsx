import { createStyles, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { memo } from 'react';
import { DetailSupplyInterface } from '../../../../interfaces';
import { useTranslation } from 'react-i18next';
import { Convertor } from '../../../../utils';
import TextWithTitle from 'components/public/TextWithTitle/TextWithTitle';
import { ColorEnum } from 'enum';

const { convertISOTime } = Convertor;

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
        padding: '0 6px',
        borderLeft: `2px solid ${ColorEnum.Borders}`,
        height: '40px',
        backgroundColor: ColorEnum.LiteBack,
        paddingTop: '8px',
        marginBottom: theme.spacing(1),
      },
    },
    textLeft: {
      textAlign: 'right',
    },
    icon: {
      color: '#313235',
    },
  })
);

const Detail: React.FC<DetailSupplyInterface> = memo((props) => {
  const { drugName, count, offer1, offer2, expireDate, amount, enName } = props;
  const { paper, container, textLeft, icon } = useStyle();

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
                  <Grid container xs={1}>
                    <img src="drug.png" style={{ height: '25px' }} />
                  </Grid>
                  <Grid container xs={11} style={{ alignItems: 'center', paddingRight: '8px' }}>
                    <span>{drugName}</span>
                    <div className="text-muted txt-sm">{` ${enName}` ?? ''}</div>
                  </Grid>
                </Grid>

                <Grid container style={{ padding: '8px' }}>
                  <Grid item xs={6}>
                    <TextWithTitle
                      title={t('general.price')}
                      body={thousandsSeperator(amount)}
                      suffix={t('general.defaultCurrency')}
                    />

                    <TextWithTitle
                      title={t('general.expireDate')}
                      body={convertISOTime(expireDate)}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextWithTitle
                      title={t('general.inventory')}
                      body={thousandsSeperator(count)}
                      suffix="عدد"
                    />

                    <TextWithTitle
                      title={t('general.offer')}
                      body={`${offer1} ${t('general.to')} ${offer2}`}
                    />
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
